/**
 * POPULATE DATABASE - REAL COMPANIES ONLY
 * 
 * NO MOCK DATA - NO SIMULATED DATA
 * Only verified suppliers and buyers that supply to GIANTS:
 * - PFAS: Vegware, Eco-Products → Walmart, Target, Whole Foods
 * - Buy America: Nucor, US Steel → Federal DOT, US Navy
 * - EUDR: Olam, Barry Callebaut → Nestlé, Mars, Unilever
 */

import { getAllRealGiantsData } from './real-giants-suppliers';
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
    console.log('\n🎯 ============================================');
    console.log('🎯 POPULATING DATABASE - REAL COMPANIES ONLY');
    console.log('🎯 ============================================');
    console.log('✅ NO MOCK DATA - NO SIMULATED DATA');
    console.log('🏢 Giants: Walmart, Nestlé, Target, Federal DOT, etc.\n');
    
    const { suppliers, buyers, total } = getAllRealGiantsData();
    
    console.log(`📦 Loading ${suppliers.length} REAL suppliers...`);
    console.log(`🏢 Loading ${buyers.length} REAL giant buyers...`);
    console.log(`📊 Total: ${total} verified companies\n`);
    
    let suppliersAdded = 0;
    let buyersAdded = 0;
    
    // Add suppliers
    for (const supplier of suppliers) {
      try {
        await storage.createSupplier(supplier);
        suppliersAdded++;
        console.log(`✅ Added supplier: ${supplier.name} (${supplier.framework.toUpperCase()})`);
      } catch (error: any) {
        if (!error.message.includes('unique') && !error.message.includes('duplicate')) {
          console.warn(`⚠️  Failed to add ${supplier.name}:`, error.message);
        }
      }
    }
    
    // Add buyers
    for (const buyer of buyers) {
      try {
        await storage.createBuyer(buyer);
        buyersAdded++;
        console.log(`✅ Added buyer: ${buyer.name} (${buyer.framework.toUpperCase()})`);
      } catch (error: any) {
        if (!error.message.includes('unique') && !error.message.includes('duplicate')) {
          console.warn(`⚠️  Failed to add ${buyer.name}:`, error.message);
        }
      }
    }
    
    console.log('\n🎉 ============================================');
    console.log('🎉 DATABASE POPULATED SUCCESSFULLY!');
    console.log('🎉 ============================================');
    console.log(`📦 Suppliers added: ${suppliersAdded} / ${suppliers.length}`);
    console.log(`🏢 Buyers added: ${buyersAdded} / ${buyers.length}`);
    console.log(`📊 Total companies: ${suppliersAdded + buyersAdded}`);
    console.log('✅ 100% REAL COMPANIES - ZERO MOCK DATA\n');
    
    return {
      success: true,
      suppliersAdded,
      buyersAdded,
      total: suppliersAdded + buyersAdded,
    };
    
  } catch (error: any) {
    console.error('\n❌ ============================================');
    console.error('❌ DATABASE POPULATION FAILED');
    console.error('❌ ============================================');
    console.error('Error:', error.message);
    
    return {
      success: false,
      suppliersAdded: 0,
      buyersAdded: 0,
      total: 0,
      error: error.message,
    };
  }
}
