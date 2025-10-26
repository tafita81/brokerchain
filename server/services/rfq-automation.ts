import { emailService } from './email-service';
import { matchingEngine } from '../matching';
import type { IStorage } from '../storage';
import type { RFQ, Supplier } from '@shared/schema';

/**
 * RFQ AUTOMATION SERVICE
 * 
 * Handles the complete automated RFQ workflow:
 * 1. Match 6 suppliers (3 new + 3 surplus)
 * 2. Send RFQ emails automatically
 * 3. Log all email activity
 * 4. Update RFQ status
 */

export class RFQAutomationService {
  constructor(private storage: IStorage) {}

  /**
   * Execute complete automated RFQ workflow
   */
  async executeAutomatedRFQWorkflow(params: {
    rfq: RFQ;
    buyerEmail: string;
    timeline?: string;
  }): Promise<{
    success: boolean;
    suppliersMatched: number;
    emailsSent: number;
    errors: string[];
  }> {
    const { rfq, buyerEmail, timeline } = params;
    const errors: string[] = [];
    let emailsSent = 0;

    try {
      console.log(`\n🤖 Starting automated RFQ workflow for RFQ #${rfq.id.slice(0, 8)}...\n`);

      // STEP 1: Match suppliers (3 new + 3 surplus)
      const allSuppliers = await this.storage.getAllSuppliers();
      const matches = matchingEngine.matchSuppliers(rfq, allSuppliers, timeline);

      console.log(`✅ Matched ${matches.length} suppliers`);
      console.log(`   - New suppliers: ${matches.filter(m => m.supplierType === 'new').length}`);
      console.log(`   - Surplus suppliers: ${matches.filter(m => m.supplierType === 'surplus').length}\n`);

      if (matches.length === 0) {
        console.warn('⚠️  No suppliers matched for this RFQ');
        return {
          success: false,
          suppliersMatched: 0,
          emailsSent: 0,
          errors: ['No suppliers found matching the RFQ criteria'],
        };
      }

      // STEP 2: Send emails to all matched suppliers
      console.log('📧 Sending RFQs to suppliers...\n');

      for (const match of matches) {
        const supplier = match.supplier;

        // Skip if no email
        if (!supplier.contactEmail) {
          console.warn(`⚠️  ${supplier.name}: No email address, skipping`);
          errors.push(`${supplier.name}: No contact email`);
          continue;
        }

        try {
          // Send RFQ email (AUTO-TRANSLATED via ChatGPT 4o mini)
          const result = await emailService.sendRFQToSupplier({
            supplierEmail: supplier.contactEmail,
            supplierName: supplier.name,
            supplierCountry: supplier.country,
            buyerName: buyerEmail.split('@')[0], // Extract buyer name from email
            rfqId: rfq.id,
            subject: rfq.subject,
            content: rfq.content,
            buyerEmail,
          });

          if (result.success) {
            emailsSent++;

            // TODO: Log email sent to database (email_logs table)
            // await this.storage.createEmailLog({ ... });

            console.log(`   ✅ ${supplier.name} (${match.score}% match)`);
          } else {
            errors.push(`${supplier.name}: ${result.error}`);
            console.error(`   ❌ ${supplier.name}: ${result.error}`);
          }
        } catch (error: any) {
          errors.push(`${supplier.name}: ${error.message}`);
          console.error(`   ❌ ${supplier.name}: ${error.message}`);
        }
      }

      // STEP 3: Update RFQ status to "sent"
      if (emailsSent > 0) {
        await this.storage.updateRFQStatus(rfq.id, 'sent', undefined);
        console.log(`\n✅ RFQ status updated to 'sent'\n`);
      }

      // STEP 4: Create metrics
      await this.storage.createMetric({
        framework: rfq.framework,
        country: 'USA',
        metricType: 'rfq_sent',
        value: emailsSent,
        metadata: {
          rfqId: rfq.id,
          suppliersMatched: matches.length,
          emailsSent,
        },
      });

      console.log(`🎉 Automated workflow complete!`);
      console.log(`   - Suppliers matched: ${matches.length}`);
      console.log(`   - Emails sent: ${emailsSent}`);
      console.log(`   - Errors: ${errors.length}\n`);

      return {
        success: emailsSent > 0,
        suppliersMatched: matches.length,
        emailsSent,
        errors,
      };
    } catch (error: any) {
      console.error('❌ Automated workflow failed:', error);
      errors.push(`Workflow error: ${error.message}`);

      return {
        success: false,
        suppliersMatched: 0,
        emailsSent: 0,
        errors,
      };
    }
  }
}
