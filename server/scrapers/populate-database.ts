import { scrapeAllSources } from './intelligent-scraper';
import type { IStorage } from '../storage';
import type { InsertSupplier, InsertBuyer } from '@shared/schema';

export async function populateDatabaseWithRealData(storage: IStorage): Promise<{
  success: boolean;
  suppliersAdded: number;
  buyersAdded: number;
  total: number;
  error?: string;
}> {
  try {
    console.log('📡 Starting automated scraping of 600+ real companies...');
    console.log('📍 Sources: SPC Directory, SAM.gov, EU TRACES NT, NMSDC');
    
    const { suppliers, buyers, total } = await scrapeAllSources();
    
    console.log(`\n📥 Populating database with real data...`);
    
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
        // Skip duplicates
        if (!error.message.includes('unique')) {
          console.warn(`⚠️  Skipped supplier ${company.name}:`, error.message);
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
        // Skip duplicates
        if (!error.message.includes('unique')) {
          console.warn(`⚠️  Skipped buyer ${company.name}:`, error.message);
        }
      }
    }
    
    console.log(`\n✅ Database populated successfully!`);
    console.log(`   📦 Suppliers added: ${suppliersAdded}`);
    console.log(`   🏢 Buyers added: ${buyersAdded}`);
    console.log(`   📊 Total companies: ${total}`);
    
    return {
      success: true,
      suppliersAdded,
      buyersAdded,
      total,
    };
    
  } catch (error: any) {
    console.error('❌ Database population failed:', error.message);
    return {
      success: false,
      suppliersAdded: 0,
      buyersAdded: 0,
      total: 0,
      error: error.message,
    };
  }
}
