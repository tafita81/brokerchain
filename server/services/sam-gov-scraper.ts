import type { InsertBuyer, InsertRFQ } from "@shared/schema";

/**
 * SAM.gov Entity Management API Scraper
 * 
 * Automatically scrapes federal procurement opportunities from SAM.gov
 * and extracts buyer information to auto-initiate RFQs.
 * 
 * Official API: https://open.gsa.gov/api/entity-api/
 * Contract Opportunities API: https://open.gsa.gov/api/opportunities-api/
 */

interface SAMOpportunity {
  noticeId: string;
  title: string;
  solicitationNumber: string;
  department: string;
  subtier: string;
  office: string;
  postedDate: string;
  type: string;
  baseType: string;
  archiveType: string;
  archiveDate: string;
  typeOfSetAsideDescription: string;
  typeOfSetAside: string;
  responseDeadLine: string;
  naicsCode: string;
  classificationCode: string;
  active: string;
  award: {
    date: string;
    number: string;
    amount: string;
  } | null;
  pointOfContact: Array<{
    type: string;
    title: string;
    fullName: string;
    email: string;
    phone: string;
    fax: string;
  }>;
  description: string;
  organizationType: string;
  officeAddress: {
    zipcode: string;
    city: string;
    countryCode: string;
    state: string;
  };
  placeOfPerformance: {
    streetAddress: string;
    city: {
      code: string;
      name: string;
    };
    state: {
      code: string;
      name: string;
    };
    zip: string;
    country: {
      code: string;
      name: string;
    };
  };
  additionalInfoLink: string;
  uiLink: string;
  links: Array<{
    rel: string;
    href: string;
  }>;
  resourceLinks: string[];
}

interface SAMApiResponse {
  totalRecords: number;
  limit: number;
  offset: number;
  opportunitiesData: SAMOpportunity[];
}

/**
 * Detecta framework de compliance baseado em keywords do RFQ
 * RETORNA null se NÃO for uma das 3 frentes principais (PFAS, Buy America, EUDR)
 */
function detectFramework(title: string, description: string): 'pfas' | 'buyamerica' | 'eudr' | null {
  const text = `${title} ${description}`.toLowerCase();
  
  // PFAS/EPR keywords (FRENTE 1)
  if (
    text.includes('pfas') || 
    text.includes('packaging') || 
    text.includes('food service') ||
    text.includes('compostable') ||
    text.includes('biodegradable') ||
    text.includes('food contact') ||
    text.includes('container') ||
    text.includes('disposable')
  ) {
    return 'pfas';
  }
  
  // Buy America keywords (FRENTE 2) - mais restritivo
  if (
    text.includes('buy america') || 
    text.includes('baba') ||
    text.includes('steel') || 
    text.includes('iron') ||
    text.includes('metal') ||
    text.includes('rail') ||
    text.includes('bridge') ||
    text.includes('highway') ||
    text.includes('infrastructure') ||
    text.includes('transit') ||
    text.includes('dot ')
  ) {
    return 'buyamerica';
  }
  
  // EUDR keywords (FRENTE 3)
  if (
    text.includes('deforestation') || 
    text.includes('palm oil') || 
    text.includes('soy') ||
    text.includes('timber') ||
    text.includes('wood') ||
    text.includes('cocoa') ||
    text.includes('coffee') ||
    text.includes('rubber') ||
    text.includes('cattle') ||
    text.includes('forest')
  ) {
    return 'eudr';
  }
  
  // NÃO é uma das 3 frentes - REJEITAR
  return null;
}

/**
 * Extrai informações do buyer de um SAM.gov opportunity
 */
function extractBuyerInfo(opportunity: SAMOpportunity, framework: 'pfas' | 'buyamerica' | 'eudr'): Partial<InsertBuyer> {
  const primaryContact = opportunity.pointOfContact.find(c => c.type === 'primary') || opportunity.pointOfContact[0];
  
  return {
    name: opportunity.department || opportunity.subtier || 'Federal Agency',
    country: 'USA',
    industry: `Federal Procurement - ${opportunity.naicsCode}`,
    contactEmail: primaryContact?.email || `procurement@${opportunity.department.toLowerCase().replace(/\s+/g, '')}.gov`,
    framework,
  };
}

/**
 * Extrai informações do RFQ de um SAM.gov opportunity
 * NOTE: buyerId will be set later when buyer is created
 */
function extractRFQInfo(opportunity: SAMOpportunity, framework: 'pfas' | 'buyamerica' | 'eudr'): Omit<Partial<InsertRFQ>, 'buyerId'> {
  return {
    framework,
    status: 'draft',
    subject: `${opportunity.title} - Solicitation ${opportunity.solicitationNumber}`,
    content: opportunity.description || `Federal procurement opportunity: ${opportunity.title}`,
    requirements: {
      solicitationNumber: opportunity.solicitationNumber,
      naicsCode: opportunity.naicsCode,
      classificationCode: opportunity.classificationCode,
      department: opportunity.department,
      subtier: opportunity.subtier,
      office: opportunity.office,
      typeOfSetAside: opportunity.typeOfSetAsideDescription || 'None',
      responseDeadline: opportunity.responseDeadLine,
      placeOfPerformance: {
        city: opportunity.placeOfPerformance?.city?.name || 'N/A',
        state: opportunity.placeOfPerformance?.state?.code || 'N/A',
        zip: opportunity.placeOfPerformance?.zip || 'N/A',
      },
      contact: {
        name: opportunity.pointOfContact[0]?.fullName || 'N/A',
        email: opportunity.pointOfContact[0]?.email || 'N/A',
        phone: opportunity.pointOfContact[0]?.phone || 'N/A',
        title: opportunity.pointOfContact[0]?.title || 'N/A',
      },
      uiLink: opportunity.uiLink,
      additionalInfoLink: opportunity.additionalInfoLink,
      aiGenerated: true,
      source: 'SAM.gov',
    },
    templateVersion: 1,
  };
}

/**
 * Scrape federal procurement opportunities from SAM.gov API
 * 
 * SAM.gov API LIMIT: Maximum 10 records per request
 * This function handles pagination automatically to fetch the desired total
 * 
 * @param totalLimit - Total number of opportunities to fetch (will be fetched in batches of 10)
 * @param naicsCode - Filter by NAICS code (optional)
 * @returns Array of SAM.gov opportunities
 */
export async function scrapeSAMGovOpportunities(
  totalLimit: number = 10,
  naicsCode?: string
): Promise<SAMOpportunity[]> {
  // SAM.gov Contract Opportunities API endpoint
  const baseUrl = 'https://api.sam.gov/opportunities/v2/search';
  
  // Build date range for last 3 days
  // SAM.gov API expects date format: MM/DD/YYYY
  const today = new Date();
  const threeDaysAgo = new Date(today);
  threeDaysAgo.setDate(today.getDate() - 3);
  
  // Format today's date
  const todayMonth = String(today.getMonth() + 1).padStart(2, '0');
  const todayDay = String(today.getDate()).padStart(2, '0');
  const todayYear = today.getFullYear();
  const formattedToday = `${todayMonth}/${todayDay}/${todayYear}`;
  
  // Format 3 days ago date
  const fromMonth = String(threeDaysAgo.getMonth() + 1).padStart(2, '0');
  const fromDay = String(threeDaysAgo.getDate()).padStart(2, '0');
  const fromYear = threeDaysAgo.getFullYear();
  const formattedFrom = `${fromMonth}/${fromDay}/${fromYear}`;
  
  try {
    // STEP 1: Pre-query metadata to get total count
    console.log(`🔍 SAM.gov scraping: querying metadata for period ${formattedFrom} to ${formattedToday}...`);
    
    const metadataParams = new URLSearchParams({
      limit: '1',  // Only need 1 result to get totalRecords
      offset: '0',
      postedFrom: formattedFrom,
      postedTo: formattedToday,
    });
    
    if (naicsCode) {
      metadataParams.set('naicsCode', naicsCode);
    }
    
    const metadataUrl = `${baseUrl}?${metadataParams.toString()}`;
    
    const metadataResponse = await fetch(metadataUrl, {
      headers: {
        'User-Agent': 'BrokerChain/1.0 (contact@brokerchain.business)',
        'Accept': 'application/json',
        ...(process.env.SAM_GOV_API_KEY ? { 'X-Api-Key': process.env.SAM_GOV_API_KEY } : {}),
      },
    });
    
    if (!metadataResponse.ok) {
      throw new Error(`SAM.gov API error: ${metadataResponse.status} ${metadataResponse.statusText}`);
    }
    
    const metadataResult: SAMApiResponse = await metadataResponse.json();
    const totalAvailable = metadataResult.totalRecords;
    
    console.log(`   📊 Metadata retrieved: ${totalAvailable} total RFQs available in period`);
    
    // STEP 2: Calculate number of pages needed
    const recordsToFetch = Math.min(totalLimit, totalAvailable);
    const numBatches = Math.ceil(recordsToFetch / 10); // SAM.gov API limit is 10 per request
    
    console.log(`   📄 Will fetch ${recordsToFetch} RFQs in ${numBatches} batches (10 per batch, 10s delay between batches)`);
    
    if (totalAvailable === 0) {
      console.log(`   ⚠️  No opportunities available for this period`);
      return [];
    }
    
    // Wait 10 seconds before starting pagination requests
    console.log(`   ⏳ Waiting 10 seconds before starting pagination...`);
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // STEP 3: Fetch all pages with deduplication
    const allOpportunities: SAMOpportunity[] = [];
    const seenIds = new Set<string>(); // Track IDs to avoid duplicates
    
    for (let i = 0; i < numBatches; i++) {
      const offset = i * 10;
      
      const params = new URLSearchParams({
        limit: '10',
        offset: offset.toString(),
        postedFrom: formattedFrom,
        postedTo: formattedToday,
      });
      
      if (naicsCode) {
        params.set('naicsCode', naicsCode);
      }
      
      const url = `${baseUrl}?${params.toString()}`;
      
      console.log(`   📦 Batch ${i + 1}/${numBatches}: offset=${offset}, limit=10`);
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'BrokerChain/1.0 (contact@brokerchain.business)',
          'Accept': 'application/json',
          ...(process.env.SAM_GOV_API_KEY ? { 'X-Api-Key': process.env.SAM_GOV_API_KEY } : {}),
        },
      });
      
      if (!response.ok) {
        throw new Error(`SAM.gov API error: ${response.status} ${response.statusText}`);
      }
      
      const data: SAMApiResponse = await response.json();
      
      // Deduplicate by noticeId
      let newCount = 0;
      for (const opp of data.opportunitiesData) {
        if (!seenIds.has(opp.noticeId)) {
          seenIds.add(opp.noticeId);
          allOpportunities.push(opp);
          newCount++;
        }
      }
      
      console.log(`   ✅ Batch ${i + 1}: fetched ${data.opportunitiesData.length} opportunities (${newCount} new, ${data.opportunitiesData.length - newCount} duplicates skipped)`);
      
      // Stop if we got fewer results than requested (no more data available)
      if (data.opportunitiesData.length < 10) {
        console.log(`   ⚠️  Received fewer results than requested - reached end of available data`);
        break;
      }
      
      // Rate limiting: wait 10 seconds between requests to avoid 429 errors from SAM.gov API
      if (i < numBatches - 1) {
        console.log(`   ⏳ Waiting 10 seconds before next batch...`);
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
    }
    
    console.log(`✅ SAM.gov scraping complete: ${allOpportunities.length} unique opportunities fetched (${seenIds.size} total unique IDs)`);
    
    return allOpportunities;
  } catch (error: any) {
    console.error(`❌ Error scraping SAM.gov:`, error.message);
    return [];
  }
}

/**
 * Auto-process SAM.gov opportunities into buyers and RFQs
 * 
 * This function:
 * 1. Scrapes SAM.gov opportunities
 * 2. Extracts buyer information
 * 3. Creates RFQs automatically
 * 4. Returns data ready for database insertion
 * 
 * @param limit - Number of opportunities to process
 * @returns Object with buyers and RFQs ready for insertion
 */
export async function autoProcessSAMGovOpportunities(limit: number = 10): Promise<{
  buyers: Partial<InsertBuyer>[];
  rfqs: Array<Omit<Partial<InsertRFQ>, 'buyerId'>>;
  opportunities: SAMOpportunity[];
  stats: {
    total: number;
    pfas: number;
    buyamerica: number;
    eudr: number;
    rejected: number;
  };
}> {
  const opportunities = await scrapeSAMGovOpportunities(limit);
  
  const buyers: Partial<InsertBuyer>[] = [];
  const rfqs: Array<Omit<Partial<InsertRFQ>, 'buyerId'>> = [];
  const stats = {
    total: opportunities.length,
    pfas: 0,
    buyamerica: 0,
    eudr: 0,
    rejected: 0,
  };
  
  for (const opportunity of opportunities) {
    // Detectar framework ANTES de processar
    const framework = detectFramework(opportunity.title, opportunity.description);
    
    // REJEITAR se não for uma das 3 frentes principais
    if (!framework) {
      stats.rejected++;
      console.log(`   ⏭️  Skipped: "${opportunity.title.substring(0, 60)}..." (not PFAS/Buy America/EUDR)`);
      continue;
    }
    
    // Type guard: framework is guaranteed to be 'pfas' | 'buyamerica' | 'eudr' here
    const validFramework = framework as 'pfas' | 'buyamerica' | 'eudr';
    
    // Contar por framework
    stats[validFramework]++;
    
    // Extract buyer info (pass validated framework)
    const buyerInfo = extractBuyerInfo(opportunity, validFramework);
    buyers.push(buyerInfo);
    
    // Extract RFQ info (buyerId will be set when buyer is created)
    const rfqInfo = extractRFQInfo(opportunity, validFramework);
    rfqs.push(rfqInfo);
    
    console.log(`   ✅ Accepted: "${opportunity.title.substring(0, 60)}..." → ${validFramework.toUpperCase()}`);
  }
  
  console.log(`📊 Processed ${opportunities.length} total → ${buyers.length} accepted (${stats.pfas} PFAS, ${stats.buyamerica} Buy America, ${stats.eudr} EUDR) | ${stats.rejected} rejected`);
  
  return {
    buyers,
    rfqs,
    opportunities,
    stats,
  };
}

/**
 * Schedule automatic SAM.gov scraping (cron job)
 * 
 * This should be called from server startup to schedule recurring scrapes.
 * Recommended: Run every 6 hours to catch new federal opportunities.
 * 
 * @param intervalHours - Hours between scrapes
 * @param storageInstance - Storage instance for database persistence
 */
export function scheduleSAMGovScraping(intervalHours: number = 6, storageInstance?: any) {
  const intervalMs = intervalHours * 60 * 60 * 1000;
  
  console.log(`⏰ Scheduling SAM.gov scraping every ${intervalHours} hours`);
  
  // Initial scrape on startup
  autoProcessSAMGovOpportunities(50).then(async (result) => {
    if (storageInstance && result.buyers.length > 0) {
      try {
        let inserted = 0;
        let duplicates = 0;
        
        for (let i = 0; i < result.buyers.length; i++) {
          const buyerInfo = result.buyers[i];
          const rfqInfo = result.rfqs[i];
          
          // ANTI-DUPLICAÇÃO: Verificar se buyer já existe (por email)
          const existingBuyers = await storageInstance.getAllBuyers();
          let buyer = existingBuyers.find((b: any) => b.contactEmail === buyerInfo.contactEmail);
          
          if (!buyer) {
            buyer = await storageInstance.createBuyer(buyerInfo);
          }
          
          // ANTI-DUPLICAÇÃO: Verificar se RFQ já existe (por subject)
          const existingRFQs = await storageInstance.getAllRFQs();
          const rfqExists = existingRFQs.some((r: any) => r.subject === rfqInfo.subject);
          
          if (!rfqExists) {
            await storageInstance.createRFQ({ ...rfqInfo, buyerId: buyer.id });
            inserted++;
          } else {
            duplicates++;
          }
        }
        
        console.log(`✅ Initial scrape: ${inserted} new RFQs inserted, ${duplicates} duplicates skipped`);
        console.log(`📊 Breakdown: ${result.stats.pfas} PFAS | ${result.stats.buyamerica} Buy America | ${result.stats.eudr} EUDR | ${result.stats.rejected} rejected`);
      } catch (error: any) {
        console.error('❌ Initial scrape insertion failed:', error.message);
      }
    }
  }).catch(error => {
    console.error('❌ Initial SAM.gov scrape failed:', error);
  });
  
  // Schedule recurring scrapes
  setInterval(async () => {
    console.log('⏰ Running scheduled SAM.gov scrape...');
    try {
      const result = await autoProcessSAMGovOpportunities(50);
      console.log(`✅ Scheduled scrape completed: ${result.buyers.length} buyers, ${result.rfqs.length} RFQs`);
      
      // Auto-insert into database if storage instance provided
      if (storageInstance && result.buyers.length > 0) {
        let inserted = 0;
        let duplicates = 0;
        
        for (let i = 0; i < result.buyers.length; i++) {
          const buyerInfo = result.buyers[i];
          const rfqInfo = result.rfqs[i];
          
          // ANTI-DUPLICAÇÃO: Verificar se buyer já existe
          const existingBuyers = await storageInstance.getAllBuyers();
          let buyer = existingBuyers.find((b: any) => b.contactEmail === buyerInfo.contactEmail);
          
          if (!buyer) {
            buyer = await storageInstance.createBuyer(buyerInfo);
          }
          
          // ANTI-DUPLICAÇÃO: Verificar se RFQ já existe
          const existingRFQs = await storageInstance.getAllRFQs();
          const rfqExists = existingRFQs.some((r: any) => r.subject === rfqInfo.subject);
          
          if (!rfqExists) {
            await storageInstance.createRFQ({ ...rfqInfo, buyerId: buyer.id });
            inserted++;
          } else {
            duplicates++;
          }
        }
        
        console.log(`✅ Auto-inserted: ${inserted} new RFQs, ${duplicates} duplicates skipped`);
        console.log(`📊 Breakdown: ${result.stats.pfas} PFAS | ${result.stats.buyamerica} Buy America | ${result.stats.eudr} EUDR | ${result.stats.rejected} rejected`);
      }
    } catch (error: any) {
      console.error('❌ Scheduled SAM.gov scrape failed:', error.message);
    }
  }, intervalMs);
}
