import { scrapeAllSources } from '../scrapers/intelligent-scraper';
import { PgStorage } from '../storage';
import type { InsertSupplier, InsertBuyer } from '@shared/schema';

async function populate() {
  console.log('🚀 POPULATING DATABASE WITH 600+ REAL COMPANIES...');
  console.log('📍 Sources: SPC Directory, SAM.gov, EU TRACES NT, NMSDC\n');
  
  const storage = new PgStorage();
  
  try {
    const { suppliers, buyers, total } = await scrapeAllSources();
    
    console.log(`\n📥 Adding to database...`);
    
    // Add suppliers
    let suppliersAdded = 0;
    for (const company of suppliers) {
      try {
        const supplierData: InsertSupplier = {
          name: company.name,
          country: company.country,
          framework: company.framework,
          products: company.products,
          certifications: company.certifications,
          contactEmail: company.contactEmail,
          description: company.description,
        };
        
        await storage.createSupplier(supplierData);
        suppliersAdded++;
      } catch (error: any) {
        if (!error.message.includes('unique')) {
          console.warn(`⚠️  Skipped supplier ${company.name}`);
        }
      }
    }
    
    // Add buyers
    let buyersAdded = 0;
    for (const company of buyers) {
      try {
        const buyerData: InsertBuyer = {
          name: company.name,
          industry: company.industry,
          country: company.country,
          framework: company.framework,
          contactEmail: company.contactEmail,
        };
        
        await storage.createBuyer(buyerData);
        buyersAdded++;
      } catch (error: any) {
        if (!error.message.includes('unique')) {
          console.warn(`⚠️  Skipped buyer ${company.name}`);
        }
      }
    }
    
    console.log(`\n✅ DATABASE POPULATED!`);
    console.log(`   📦 Suppliers: ${suppliersAdded}`);
    console.log(`   🏢 Buyers: ${buyersAdded}`);
    console.log(`   📊 Total: ${suppliersAdded + buyersAdded} / ${total} companies`);
    
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

populate();
