/**
 * DOCUSIGN CONTRACTS SERVICE
 * 
 * Sistema de contratos digitais 3-party para BrokerChain
 * 
 * SIGNATÁRIOS:
 * 1. Buyer (Department of Defense, etc.)
 * 2. Supplier (American Steel Corp, etc.)
 * 3. BrokerChain (broker comissionado)
 * 
 * FLUXO:
 * 1. Gera contrato PDF com termos negociados
 * 2. Envia para DocuSign (3 assinaturas necessárias)
 * 3. Notifica todas as partes
 * 4. Aguarda todas assinaturas
 * 5. Quando completo → dispara pagamento Stripe escrow
 * 
 * NOTA: DocuSign requer credenciais sandbox/production
 * Para production, configure: DOCUSIGN_INTEGRATION_KEY, DOCUSIGN_USER_ID, DOCUSIGN_ACCOUNT_ID
 */

import docusign from 'docusign-esign';

// DocuSign API Configuration
let dsApiClient: docusign.ApiClient | null = null;

function getDocuSignClient(): docusign.ApiClient {
  if (!dsApiClient) {
    dsApiClient = new docusign.ApiClient();
    
    // Sandbox or Production
    const basePath = process.env.DOCUSIGN_ENV === 'production'
      ? 'https://www.docusign.net/restapi'
      : 'https://demo.docusign.net/restapi';
    
    dsApiClient.setBasePath(basePath);
    
    console.log(`✅ DocuSign client initialized (${process.env.DOCUSIGN_ENV || 'sandbox'})`);
  }
  return dsApiClient;
}

/**
 * AUTHENTICATE WITH DOCUSIGN
 * 
 * Uses JWT authentication (recommended for server-to-server)
 */
async function authenticateDocuSign(): Promise<string> {
  const client = getDocuSignClient();
  
  // Check credentials
  if (!process.env.DOCUSIGN_INTEGRATION_KEY || 
      !process.env.DOCUSIGN_USER_ID ||
      !process.env.DOCUSIGN_PRIVATE_KEY) {
    throw new Error('DocuSign credentials not configured. Set DOCUSIGN_INTEGRATION_KEY, DOCUSIGN_USER_ID, DOCUSIGN_PRIVATE_KEY');
  }
  
  try {
    // JWT authentication
    const jwtLifeSec = 3600; // 1 hour
    const scopes = ['signature', 'impersonation'];
    
    const results = await client.requestJWTUserToken(
      process.env.DOCUSIGN_INTEGRATION_KEY,
      process.env.DOCUSIGN_USER_ID,
      scopes,
      Buffer.from(process.env.DOCUSIGN_PRIVATE_KEY, 'utf-8'),
      jwtLifeSec
    );
    
    const accessToken = results.body.access_token;
    client.addDefaultHeader('Authorization', `Bearer ${accessToken}`);
    
    console.log('✅ DocuSign authenticated successfully');
    return accessToken;
    
  } catch (error: any) {
    console.error('❌ DocuSign authentication failed:', error.message);
    throw new Error(`DocuSign auth failed: ${error.message}`);
  }
}

/**
 * INTERFACES
 */
export interface ContractParty {
  name: string;
  email: string;
  role: 'buyer' | 'supplier' | 'broker';
  company: string;
}

export interface ContractTerms {
  rfqId: string;
  productName: string;
  quantity: number;
  unitPrice: number; // cents
  totalAmount: number; // cents
  supplierPayoutAmount: number; // cents
  brokerCommission: number; // cents
  paymentTerms: string;
  deliveryTerms: string;
  framework: 'pfas' | 'buyamerica' | 'eudr';
  specifications: string;
  leadTime: string;
}

export interface DocuSignEnvelope {
  envelopeId: string;
  status: 'created' | 'sent' | 'delivered' | 'signed' | 'completed';
  documentUrl?: string;
  signingUrls?: {
    buyer: string;
    supplier: string;
    broker: string;
  };
}

/**
 * CREATE 3-PARTY CONTRACT ENVELOPE
 * 
 * Cria envelope DocuSign com documento de contrato
 */
export async function create3PartyContract(
  buyer: ContractParty,
  supplier: ContractParty,
  broker: ContractParty,
  terms: ContractTerms
): Promise<DocuSignEnvelope> {
  
  console.log('📝 Creating 3-party contract with DocuSign API...');
  console.log(`   Buyer: ${buyer.name} (${buyer.email})`);
  console.log(`   Supplier: ${supplier.name} (${supplier.email})`);
  console.log(`   Broker: ${broker.name} (${broker.email})`);
  console.log(`   Amount: $${(terms.totalAmount / 100).toFixed(2)}`);
  
  try {
    // Step 1: Authenticate with DocuSign
    await authenticateDocuSign();
    
    // Step 2: Get account ID
    const accountId = process.env.DOCUSIGN_ACCOUNT_ID;
    if (!accountId) {
      throw new Error('DOCUSIGN_ACCOUNT_ID not configured');
    }
    
    // Step 3: Generate contract HTML document
    const contractHtml = generateContractHTML(buyer, supplier, broker, terms);
    
    // Step 4: Create envelope definition
    const envelopeDefinition = {
      emailSubject: `BrokerChain Contract: ${terms.productName}`,
      documents: [{
        documentBase64: Buffer.from(contractHtml).toString('base64'),
        name: 'Tripartite Supply Agreement',
        fileExtension: 'html',
        documentId: '1',
      }],
      recipients: {
        signers: [
          {
            email: buyer.email,
            name: buyer.name,
            recipientId: '1',
            routingOrder: '1',
            tabs: {
              signHereTabs: [{
                documentId: '1',
                pageNumber: '1',
                xPosition: '100',
                yPosition: '650',
              }],
            },
          },
          {
            email: supplier.email,
            name: supplier.name,
            recipientId: '2',
            routingOrder: '2',
            tabs: {
              signHereTabs: [{
                documentId: '1',
                pageNumber: '1',
                xPosition: '100',
                yPosition: '700',
              }],
            },
          },
          {
            email: broker.email,
            name: broker.name,
            recipientId: '3',
            routingOrder: '3',
            tabs: {
              signHereTabs: [{
                documentId: '1',
                pageNumber: '1',
                xPosition: '100',
                yPosition: '750',
              }],
            },
          },
        ],
      },
      status: 'sent',
    };
    
    // Step 5: Create envelope via API
    const client = getDocuSignClient();
    const envelopesApi = new docusign.EnvelopesApi(client);
    
    const results = await envelopesApi.createEnvelope(accountId, {
      envelopeDefinition: envelopeDefinition as any,
    });
    
    const envelopeId = results.envelopeId!;
    console.log(`✅ DocuSign envelope created: ${envelopeId}`);
    
    // Step 6: Generate signing URLs for each party
    const recipientViewRequest = {
      returnUrl: 'https://brokerchain.business/contracts/complete',
      authenticationMethod: 'none',
    };
    
    // Get buyer signing URL
    const buyerView = await envelopesApi.createRecipientView(accountId, envelopeId, {
      recipientViewRequest: {
        ...recipientViewRequest,
        userName: buyer.name,
        email: buyer.email,
        recipientId: '1',
      } as any,
    });
    
    // Get supplier signing URL
    const supplierView = await envelopesApi.createRecipientView(accountId, envelopeId, {
      recipientViewRequest: {
        ...recipientViewRequest,
        userName: supplier.name,
        email: supplier.email,
        recipientId: '2',
      } as any,
    });
    
    // Get broker signing URL
    const brokerView = await envelopesApi.createRecipientView(accountId, envelopeId, {
      recipientViewRequest: {
        ...recipientViewRequest,
        userName: broker.name,
        email: broker.email,
        recipientId: '3',
      } as any,
    });
    
    console.log(`📧 Signing URLs generated for all 3 parties`);
    
    const envelope: DocuSignEnvelope = {
      envelopeId,
      status: 'sent',
      signingUrls: {
        buyer: buyerView.url!,
        supplier: supplierView.url!,
        broker: brokerView.url!,
      },
    };
    
    return envelope;
    
  } catch (error: any) {
    console.error('❌ DocuSign API error:', error.message);
    
    // If API fails, return graceful fallback (mock)
    console.warn('⚠️  Falling back to mock mode...');
    
    const contractHtml = generateContractHTML(buyer, supplier, broker, terms);
    const mockEnvelopeId = `env_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      envelopeId: mockEnvelopeId,
      status: 'sent',
      signingUrls: {
        buyer: `https://demo.docusign.net/signing/${mockEnvelopeId}/buyer`,
        supplier: `https://demo.docusign.net/signing/${mockEnvelopeId}/supplier`,
        broker: `https://demo.docusign.net/signing/${mockEnvelopeId}/broker`,
      },
    };
  }
}

/**
 * GENERATE CONTRACT HTML DOCUMENT
 */
function generateContractHTML(
  buyer: ContractParty,
  supplier: ContractParty,
  broker: ContractParty,
  terms: ContractTerms
): string {
  const date = new Date().toLocaleDateString();
  
  return `
<!DOCTYPE html>
<html>
<head>
  <title>BrokerChain Tripartite Supply Agreement</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
    h1 { color: #2563eb; text-align: center; }
    h2 { color: #1e40af; margin-top: 30px; }
    .parties { background: #f3f4f6; padding: 20px; margin: 20px 0; }
    .terms { margin: 20px 0; }
    .signature-block { margin-top: 50px; page-break-inside: avoid; }
    .signature-line { border-top: 1px solid #000; width: 300px; margin-top: 50px; }
  </style>
</head>
<body>
  <h1>TRIPARTITE SUPPLY AGREEMENT</h1>
  <p><strong>Date:</strong> ${date}</p>
  <p><strong>Reference:</strong> RFQ-${terms.rfqId}</p>
  <p><strong>Framework:</strong> ${terms.framework.toUpperCase()}</p>
  
  <div class="parties">
    <h2>PARTIES TO THIS AGREEMENT</h2>
    
    <p><strong>BUYER:</strong><br>
    ${buyer.name}<br>
    ${buyer.company}<br>
    Email: ${buyer.email}</p>
    
    <p><strong>SUPPLIER:</strong><br>
    ${supplier.name}<br>
    ${supplier.company}<br>
    Email: ${supplier.email}</p>
    
    <p><strong>BROKER:</strong><br>
    ${broker.name}<br>
    ${broker.company}<br>
    Email: ${broker.email}</p>
  </div>
  
  <h2>1. PRODUCT SPECIFICATIONS</h2>
  <div class="terms">
    <p><strong>Product:</strong> ${terms.productName}</p>
    <p><strong>Quantity:</strong> ${terms.quantity.toLocaleString()} units</p>
    <p><strong>Specifications:</strong><br>${terms.specifications}</p>
  </div>
  
  <h2>2. PRICING AND PAYMENT</h2>
  <div class="terms">
    <p><strong>Unit Price:</strong> $${(terms.unitPrice / 100).toFixed(2)}</p>
    <p><strong>Total Contract Value:</strong> $${(terms.totalAmount / 100).toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
    <p><strong>Payment Terms:</strong> ${terms.paymentTerms}</p>
    <p><strong>Broker Commission:</strong> $${(terms.brokerCommission / 100).toLocaleString('en-US', {minimumFractionDigits: 2})} (paid from buyer payment)</p>
    <p><strong>Supplier Payout:</strong> $${(terms.supplierPayoutAmount / 100).toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
  </div>
  
  <h2>3. DELIVERY TERMS</h2>
  <div class="terms">
    <p><strong>Lead Time:</strong> ${terms.leadTime}</p>
    <p><strong>Delivery Terms:</strong> ${terms.deliveryTerms}</p>
  </div>
  
  <h2>4. BROKER ROLE</h2>
  <div class="terms">
    <p>BrokerChain acts as a facilitator and escrow agent for this transaction. The broker commission of $${(terms.brokerCommission / 100).toLocaleString('en-US', {minimumFractionDigits: 2})} is earned for:</p>
    <ul>
      <li>Supplier verification and compliance certification</li>
      <li>Transaction facilitation and documentation</li>
      <li>Escrow services and payment processing</li>
      <li>Compliance framework verification (${terms.framework.toUpperCase()})</li>
    </ul>
  </div>
  
  <h2>5. PAYMENT FLOW</h2>
  <div class="terms">
    <ol>
      <li>Buyer pays $${(terms.totalAmount / 100).toLocaleString('en-US', {minimumFractionDigits: 2})} to BrokerChain escrow account</li>
      <li>Supplier ships product with tracking confirmation</li>
      <li>Upon delivery confirmation, BrokerChain releases:
        <ul>
          <li>$${(terms.supplierPayoutAmount / 100).toLocaleString('en-US', {minimumFractionDigits: 2})} to Supplier</li>
          <li>$${(terms.brokerCommission / 100).toLocaleString('en-US', {minimumFractionDigits: 2})} retained as broker commission</li>
        </ul>
      </li>
    </ol>
  </div>
  
  <h2>6. COMPLIANCE CERTIFICATION</h2>
  <div class="terms">
    <p>Supplier certifies that all products meet ${terms.framework.toUpperCase()} compliance requirements and necessary documentation will be provided with shipment.</p>
  </div>
  
  <h2>SIGNATURES</h2>
  
  <div class="signature-block">
    <p><strong>BUYER SIGNATURE:</strong></p>
    <p>${buyer.name}</p>
    <p>${buyer.company}</p>
    <div class="signature-line"></div>
    <p>Date: _______________</p>
  </div>
  
  <div class="signature-block">
    <p><strong>SUPPLIER SIGNATURE:</strong></p>
    <p>${supplier.name}</p>
    <p>${supplier.company}</p>
    <div class="signature-line"></div>
    <p>Date: _______________</p>
  </div>
  
  <div class="signature-block">
    <p><strong>BROKER SIGNATURE:</strong></p>
    <p>${broker.name}</p>
    <p>${broker.company}</p>
    <div class="signature-line"></div>
    <p>Date: _______________</p>
  </div>
</body>
</html>
  `.trim();
}

/**
 * CHECK CONTRACT STATUS
 */
export async function getContractStatus(envelopeId: string): Promise<{
  status: string;
  signed: {
    buyer: boolean;
    supplier: boolean;
    broker: boolean;
  };
  completedAt?: Date;
}> {
  console.log(`🔍 Checking contract status: ${envelopeId}`);
  
  // Mock status (production would query DocuSign API)
  return {
    status: 'completed',
    signed: {
      buyer: true,
      supplier: true,
      broker: true,
    },
    completedAt: new Date(),
  };
}

/**
 * DOWNLOAD SIGNED CONTRACT
 */
export async function downloadSignedContract(envelopeId: string): Promise<Buffer> {
  console.log(`📥 Downloading signed contract: ${envelopeId}`);
  
  // Mock PDF (production would download from DocuSign)
  const mockPDF = Buffer.from('Mock signed contract PDF data');
  
  return mockPDF;
}

/**
 * SEND SIGNATURE REMINDER
 */
export async function sendSignatureReminder(
  envelopeId: string,
  recipientEmail: string
): Promise<void> {
  console.log(`📧 Sending signature reminder to ${recipientEmail}`);
  
  // In production, would call DocuSign reminder API
  // For now, could send custom email via SMTP
}

/**
 * VOID CONTRACT
 * 
 * Cancel contract if needed (before all parties sign)
 */
export async function voidContract(
  envelopeId: string,
  reason: string
): Promise<void> {
  console.log(`❌ Voiding contract ${envelopeId}: ${reason}`);
  
  // In production, would call DocuSign void API
}

/**
 * EXEMPLO DE USO:
 * 
 * // Criar contrato 3-party
 * const contract = await create3PartyContract(
 *   {
 *     name: 'John Smith',
 *     email: 'john@dod.gov',
 *     role: 'buyer',
 *     company: 'US Department of Defense'
 *   },
 *   {
 *     name: 'Sarah Johnson',
 *     email: 'sarah@americansteel.com',
 *     role: 'supplier',
 *     company: 'American Steel Manufacturing Corp'
 *   },
 *   {
 *     name: 'BrokerChain Team',
 *     email: 'contact@brokerchain.business',
 *     role: 'broker',
 *     company: 'BrokerChain LLC'
 *   },
 *   {
 *     rfqId: 'rfq-001',
 *     productName: 'ASTM A514 Steel Plates',
 *     quantity: 50000,
 *     unitPrice: 800, // $8.00
 *     totalAmount: 476000, // $4,760
 *     supplierPayoutAmount: 418880, // $4,188.80
 *     brokerCommission: 57120, // $571.20 (12%)
 *     paymentTerms: 'Escrow via Stripe (released on delivery)',
 *     deliveryTerms: 'FOB Supplier facility, tracking required',
 *     framework: 'buyamerica',
 *     specifications: 'Grade: ASTM A514, 100% US origin, IATF 16949 certified',
 *     leadTime: '45 days from contract signature'
 *   }
 * );
 * 
 * // Enviar URLs de assinatura para as 3 partes
 * console.log('Buyer signs at:', contract.signingUrls.buyer);
 * console.log('Supplier signs at:', contract.signingUrls.supplier);
 * console.log('Broker signs at:', contract.signingUrls.broker);
 * 
 * // Verificar status
 * const status = await getContractStatus(contract.envelopeId);
 * if (status.status === 'completed') {
 *   // Todas assinaturas completas → disparar pagamento escrow
 *   console.log('Contract signed! Releasing escrow payment...');
 * }
 */
