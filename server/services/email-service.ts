import nodemailer from 'nodemailer';
import Imap from 'imap';
import { simpleParser } from 'mailparser';
import type { InsertEmailLog, InsertSupplierQuote } from '@shared/schema';
import { emailTranslationService } from './email-translation';

/**
 * EMAIL SERVICE - SMTP + IMAP Integration
 * 
 * Handles:
 * 1. SMTP: Send RFQs to suppliers automatically
 * 2. IMAP: Receive supplier quotes via email
 * 3. Email tracking: sent, delivered, opened
 * 4. Quote parsing: extract price, MOQ, lead time
 */

// SMTP Configuration (Hostinger)
const SMTP_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
};

// IMAP Configuration (Hostinger)
const IMAP_CONFIG = {
  user: process.env.SMTP_USER || '',
  password: process.env.SMTP_PASSWORD || '',
  host: process.env.SMTP_HOST?.replace('smtp', 'imap') || 'imap.hostinger.com',
  port: 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false },
};

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport(SMTP_CONFIG);
  }

  /**
   * Send RFQ to supplier via email (AUTO-TRANSLATED to supplier's language via ChatGPT 4o mini)
   */
  async sendRFQToSupplier(params: {
    supplierEmail: string;
    supplierName: string;
    supplierCountry: string;
    buyerName: string;
    rfqId: string;
    subject: string;
    content: string;
    buyerEmail: string;
  }): Promise<{ success: boolean; messageId?: string; error?: string; language?: string }> {
    try {
      // 🌍 AUTO-TRANSLATE using ChatGPT 4o mini
      const translated = await emailTranslationService.translateRFQEmail({
        subject: params.subject,
        content: params.content,
        targetCountry: params.supplierCountry,
        supplierName: params.supplierName,
        buyerName: params.buyerName,
      });

      console.log(`📧 Sending RFQ in ${emailTranslationService.getLanguageName(translated.language)}`);

      const info = await this.transporter.sendMail({
        from: `"BrokerChain - RFQ System" <${SMTP_CONFIG.auth.user}>`,
        to: params.supplierEmail,
        replyTo: params.buyerEmail, // Replies go to buyer
        subject: translated.subject,
        text: translated.content,
        html: this.generateRFQEmailHTML({
          supplierName: params.supplierName,
          subject: translated.subject,
          content: translated.content,
          rfqId: params.rfqId,
        }),
        headers: {
          'X-RFQ-ID': params.rfqId,
          'X-BrokerChain-Type': 'rfq',
          'X-Language': translated.language,
        },
      });

      console.log(`✅ RFQ sent to ${params.supplierName} (${params.supplierEmail})`);
      console.log(`   Language: ${emailTranslationService.getLanguageName(translated.language)}`);
      console.log(`   Message ID: ${info.messageId}`);

      return {
        success: true,
        messageId: info.messageId,
        language: translated.language,
      };
    } catch (error: any) {
      console.error(`❌ Failed to send RFQ to ${params.supplierEmail}:`, error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Send 6 quotes presentation to buyer
   */
  async sendQuotesToBuyer(params: {
    buyerEmail: string;
    buyerName: string;
    rfqId: string;
    quotes: Array<{
      supplierName: string;
      supplierType: 'new' | 'surplus';
      pricePerUnit: number;
      moq: number;
      leadTime: number;
      discountPercent?: number;
    }>;
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const info = await this.transporter.sendMail({
        from: `"BrokerChain - Quote Results" <${SMTP_CONFIG.auth.user}>`,
        to: params.buyerEmail,
        subject: `✅ 6 Quotes Ready for Your RFQ #${params.rfqId.slice(0, 8)}`,
        html: this.generateQuotesEmailHTML(params),
        headers: {
          'X-RFQ-ID': params.rfqId,
          'X-BrokerChain-Type': 'quotes',
        },
      });

      console.log(`✅ Quotes sent to ${params.buyerName} (${params.buyerEmail})`);

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error: any) {
      console.error(`❌ Failed to send quotes to ${params.buyerEmail}:`, error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Start IMAP listener for incoming supplier responses
   */
  startEmailListener(onNewEmail: (email: ParsedEmail) => Promise<void>): void {
    console.log('\n📬 Starting IMAP email listener...');
    console.log(`   Host: ${IMAP_CONFIG.host}`);
    console.log(`   User: ${IMAP_CONFIG.user}`);

    const imap = new Imap(IMAP_CONFIG);

    imap.once('ready', () => {
      console.log('✅ IMAP connection established');
      
      imap.openBox('INBOX', false, (err, box) => {
        if (err) {
          console.error('❌ Failed to open INBOX:', err);
          return;
        }

        console.log(`✅ Monitoring INBOX (${box.messages.total} messages)`);

        // Listen for new emails
        imap.on('mail', (numNewMsgs: number) => {
          console.log(`📧 ${numNewMsgs} new email(s) received!`);
          
          // Fetch unseen messages
          const fetch = imap.seq.fetch(`${box.messages.total - numNewMsgs + 1}:*`, {
            bodies: '',
            markSeen: true,
          });

          fetch.on('message', (msg, seqno) => {
            msg.on('body', (stream) => {
              simpleParser(stream as any, async (err: any, parsed: any) => {
                if (err) {
                  console.error('Failed to parse email:', err);
                  return;
                }

                const parsedEmail: ParsedEmail = {
                  from: parsed.from?.text || '',
                  to: parsed.to?.text || '',
                  subject: parsed.subject || '',
                  text: parsed.text || '',
                  html: parsed.html || '',
                  date: parsed.date || new Date(),
                  messageId: parsed.messageId || '',
                  headers: parsed.headers,
                };

                // Check if it's a supplier quote response
                if (this.isSupplierQuoteEmail(parsedEmail)) {
                  console.log(`📨 Supplier quote detected from: ${parsedEmail.from}`);
                  await onNewEmail(parsedEmail);
                }
              });
            });
          });

          fetch.once('error', (err) => {
            console.error('Fetch error:', err);
          });
        });
      });
    });

    imap.once('error', (err: Error) => {
      console.error('❌ IMAP connection error:', err);
    });

    imap.once('end', () => {
      console.log('IMAP connection ended. Reconnecting...');
      setTimeout(() => this.startEmailListener(onNewEmail), 5000);
    });

    imap.connect();
  }

  /**
   * Parse supplier quote from email text
   */
  parseSupplierQuote(emailText: string, emailHtml: string): ParsedQuote | null {
    const text = emailText.toLowerCase();
    
    // Extract price (various formats: $10.50, USD 10.50, 10.50 USD, R$ 10,50)
    const priceMatch = text.match(/(?:price|cost|valor|preço)[:\s]*(?:usd?|r\$|€)?\s*([\d,\.]+)/i);
    const pricePerUnit = priceMatch ? parseFloat(priceMatch[1].replace(',', '.')) : null;

    // Extract MOQ (minimum order quantity)
    const moqMatch = text.match(/(?:moq|minimum|mínimo|qtd)[:\s]*(\d+)/i);
    const minimumOrderQuantity = moqMatch ? parseInt(moqMatch[1]) : null;

    // Extract lead time (days)
    const leadTimeMatch = text.match(/(?:lead time|prazo|delivery|entrega)[:\s]*(\d+)\s*(?:days|dias|weeks|semanas)/i);
    let leadTimeDays = leadTimeMatch ? parseInt(leadTimeMatch[1]) : null;
    if (leadTimeMatch && text.includes('week')) {
      leadTimeDays = leadTimeDays! * 7;
    }

    // Only return if we found at least price
    if (pricePerUnit) {
      return {
        pricePerUnit: Math.round(pricePerUnit * 100), // Convert to cents
        minimumOrderQuantity,
        leadTimeDays,
        rawText: emailText,
      };
    }

    return null;
  }

  /**
   * Check if email is a supplier quote response
   */
  private isSupplierQuoteEmail(email: ParsedEmail): boolean {
    const subject = email.subject.toLowerCase();
    const text = email.text.toLowerCase();

    // Check for quote keywords
    const quoteKeywords = ['quote', 'quotation', 'cotação', 'orçamento', 'proposta', 'price', 'pricing'];
    const hasQuoteKeyword = quoteKeywords.some(keyword => 
      subject.includes(keyword) || text.includes(keyword)
    );

    // Check if it's a reply (Re:)
    const isReply = subject.startsWith('re:');

    return hasQuoteKeyword || isReply;
  }

  /**
   * Generate RFQ email HTML template
   */
  private generateRFQEmailHTML(params: {
    supplierName: string;
    subject: string;
    content: string;
    rfqId: string;
  }): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 700px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
    .footer { background: #1f2937; color: #9ca3af; padding: 20px; border-radius: 0 0 8px 8px; font-size: 12px; }
    .cta-button { background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
    .info-box { background: white; border-left: 4px solid #10b981; padding: 15px; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">🌍 BrokerChain</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">Global Compliance Broker Platform</p>
    </div>
    
    <div class="content">
      <h2>Dear ${params.supplierName},</h2>
      
      <div class="info-box">
        <strong>📋 Request for Quote (RFQ) #${params.rfqId.slice(0, 8)}</strong>
      </div>
      
      <div style="white-space: pre-wrap; line-height: 1.8;">${params.content}</div>
      
      <div style="margin-top: 30px; padding: 20px; background: #fff; border-radius: 8px;">
        <h3 style="color: #10b981; margin-top: 0;">📝 How to Respond:</h3>
        <ol style="line-height: 2;">
          <li><strong>Reply to this email</strong> with your quote</li>
          <li>Include: <strong>Price per unit</strong>, <strong>MOQ</strong>, <strong>Lead time</strong></li>
          <li>Attach certifications if applicable</li>
          <li>Response deadline: <strong>7 days</strong></li>
        </ol>
      </div>
    </div>
    
    <div class="footer">
      <p><strong>BrokerChain - Pure Broker Model</strong></p>
      <p>📧 contact@brokerchain.business | 🌐 SAM.gov ID: N394AKZSR349</p>
      <p>Florida-Based | SPC Member (Sustainable Packaging Coalition)</p>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  /**
   * Generate quotes presentation email HTML
   */
  private generateQuotesEmailHTML(params: {
    buyerName: string;
    rfqId: string;
    quotes: Array<{
      supplierName: string;
      supplierType: 'new' | 'surplus';
      pricePerUnit: number;
      moq: number;
      leadTime: number;
      discountPercent?: number;
    }>;
  }): string {
    const newQuotes = params.quotes.filter(q => q.supplierType === 'new');
    const surplusQuotes = params.quotes.filter(q => q.supplierType === 'surplus');

    const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

    const renderQuote = (quote: typeof params.quotes[0], index: number) => `
      <div style="background: white; border: 2px solid ${quote.supplierType === 'surplus' ? '#f59e0b' : '#10b981'}; border-radius: 8px; padding: 20px; margin-bottom: 15px;">
        <div style="display: flex; justify-content: space-between; align-items: start;">
          <div>
            <h3 style="margin: 0 0 10px 0; color: #1f2937;">
              ${index + 1}. ${quote.supplierName}
              ${quote.supplierType === 'surplus' ? '<span style="background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 12px; font-size: 12px; margin-left: 10px;">♻️ SURPLUS</span>' : '<span style="background: #d1fae5; color: #065f46; padding: 4px 12px; border-radius: 12px; font-size: 12px; margin-left: 10px;">NEW</span>'}
            </h3>
            <p style="margin: 5px 0; color: #6b7280;">
              <strong>Price:</strong> ${formatPrice(quote.pricePerUnit)}/unit
              ${quote.discountPercent ? `<span style="color: #f59e0b; font-weight: bold;"> (${quote.discountPercent}% OFF)</span>` : ''}
            </p>
            <p style="margin: 5px 0; color: #6b7280;"><strong>MOQ:</strong> ${quote.moq.toLocaleString()} units</p>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Lead Time:</strong> ${quote.leadTime} days</p>
          </div>
        </div>
      </div>
    `;

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f3f4f6; }
    .container { max-width: 800px; margin: 0 auto; padding: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 40px; border-radius: 8px 8px 0 0; text-align: center;">
      <h1 style="margin: 0;">✅ Your RFQ Quotes Are Ready!</h1>
      <p style="margin: 10px 0 0 0; font-size: 18px;">RFQ #${params.rfqId.slice(0, 8)}</p>
    </div>
    
    <div style="background: #f9fafb; padding: 40px;">
      <h2 style="color: #1f2937;">Dear ${params.buyerName},</h2>
      <p style="font-size: 16px; color: #4b5563;">
        We've received <strong>${params.quotes.length} quotes</strong> from verified suppliers. Below are your options:
      </p>

      ${newQuotes.length > 0 ? `
      <h3 style="color: #10b981; margin-top: 30px;">🆕 New Product Quotes (${newQuotes.length})</h3>
      ${newQuotes.map((q, i) => renderQuote(q, i)).join('')}
      ` : ''}

      ${surplusQuotes.length > 0 ? `
      <h3 style="color: #f59e0b; margin-top: 30px;">♻️ Surplus/Overstock Quotes (${surplusQuotes.length})</h3>
      <p style="color: #92400e; background: #fef3c7; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
        <strong>30-50% below market price!</strong> Same quality, same certifications, surplus inventory.
      </p>
      ${surplusQuotes.map((q, i) => renderQuote(q, i + newQuotes.length)).join('')}
      ` : ''}

      <div style="margin-top: 40px; padding: 30px; background: white; border-radius: 8px; border: 2px solid #10b981;">
        <h3 style="margin-top: 0; color: #10b981;">📞 Next Steps</h3>
        <p>Reply to this email with your selected supplier(s) and we'll proceed with:</p>
        <ol style="line-height: 2;">
          <li>Contract generation (DocuSign 3-party signing)</li>
          <li>Escrow payment setup (buyer protection)</li>
          <li>Order fulfillment tracking</li>
          <li>Automated commission (5-15% on transaction)</li>
        </ol>
      </div>
    </div>
    
    <div style="background: #1f2937; color: #9ca3af; padding: 30px; border-radius: 0 0 8px 8px; text-align: center;">
      <p><strong style="color: white;">BrokerChain</strong> - Pure Broker Model | Zero Inventory Risk</p>
      <p>📧 contact@brokerchain.business | SAM.gov: N394AKZSR349</p>
    </div>
  </div>
</body>
</html>
    `.trim();
  }
}

// Types
export interface ParsedEmail {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
  date: Date;
  messageId: string;
  headers: any;
}

export interface ParsedQuote {
  pricePerUnit: number; // in cents
  minimumOrderQuantity: number | null;
  leadTimeDays: number | null;
  rawText: string;
}

// Singleton instance
export const emailService = new EmailService();
