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
 */
function detectFramework(title: string, description: string): 'pfas' | 'buyamerica' | 'eudr' | 'secondary' {
  const text = `${title} ${description}`.toLowerCase();
  
  // PFAS/EPR keywords
  if (
    text.includes('pfas') || 
    text.includes('packaging') || 
    text.includes('food service') ||
    text.includes('compostable') ||
    text.includes('biodegradable')
  ) {
    return 'pfas';
  }
  
  // Buy America keywords
  if (
    text.includes('buy america') || 
    text.includes('steel') || 
    text.includes('iron') ||
    text.includes('metal') ||
    text.includes('manufacturing') ||
    text.includes('domestic') ||
    text.includes('infrastructure')
  ) {
    return 'buyamerica';
  }
  
  // EUDR keywords
  if (
    text.includes('deforestation') || 
    text.includes('palm oil') || 
    text.includes('soy') ||
    text.includes('timber') ||
    text.includes('cocoa') ||
    text.includes('coffee') ||
    text.includes('rubber')
  ) {
    return 'eudr';
  }
  
  // Secondary materials keywords
  if (
    text.includes('secondary') || 
    text.includes('surplus') || 
    text.includes('overstock') ||
    text.includes('recycled')
  ) {
    return 'secondary';
  }
  
  // Default to buyamerica for federal procurement
  return 'buyamerica';
}

/**
 * Extrai informações do buyer de um SAM.gov opportunity
 */
function extractBuyerInfo(opportunity: SAMOpportunity): Partial<InsertBuyer> {
  const primaryContact = opportunity.pointOfContact.find(c => c.type === 'primary') || opportunity.pointOfContact[0];
  
  return {
    name: opportunity.department || opportunity.subtier || 'Federal Agency',
    country: 'USA',
    industry: `Federal Procurement - ${opportunity.naicsCode}`,
    contactEmail: primaryContact?.email || `procurement@${opportunity.department.toLowerCase().replace(/\s+/g, '')}.gov`,
    framework: detectFramework(opportunity.title, opportunity.description),
  };
}

/**
 * Extrai informações do RFQ de um SAM.gov opportunity
 */
function extractRFQInfo(opportunity: SAMOpportunity, buyerId: string): Partial<InsertRFQ> {
  const framework = detectFramework(opportunity.title, opportunity.description);
  
  return {
    buyerId,
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
 * @param limit - Number of opportunities to fetch (default: 10)
 * @param offset - Pagination offset (default: 0)
 * @param naicsCode - Filter by NAICS code (optional)
 * @returns Array of SAM.gov opportunities
 */
export async function scrapeSAMGovOpportunities(
  limit: number = 10,
  offset: number = 0,
  naicsCode?: string
): Promise<SAMOpportunity[]> {
  try {
    // SAM.gov Contract Opportunities API endpoint
    const baseUrl = 'https://api.sam.gov/opportunities/v2/search';
    
    // Build query parameters
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
      postedFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Last 30 days
      postedTo: new Date().toISOString().split('T')[0],
      // API key is required for SAM.gov API
      // NOTE: You'll need to register at https://open.gsa.gov/api/opportunities-api/
      // and set SAM_GOV_API_KEY environment variable
    });
    
    if (naicsCode) {
      params.set('naicsCode', naicsCode);
    }
    
    const url = `${baseUrl}?${params.toString()}`;
    
    console.log(`🔍 Scraping SAM.gov opportunities: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'BrokerChain/1.0 (contact@brokerchain.business)',
        'Accept': 'application/json',
        // If SAM_GOV_API_KEY is set, use it
        ...(process.env.SAM_GOV_API_KEY ? { 'X-Api-Key': process.env.SAM_GOV_API_KEY } : {}),
      },
    });
    
    if (!response.ok) {
      throw new Error(`SAM.gov API error: ${response.status} ${response.statusText}`);
    }
    
    const data: SAMApiResponse = await response.json();
    
    console.log(`✅ Found ${data.totalRecords} total opportunities, fetched ${data.opportunitiesData.length}`);
    
    return data.opportunitiesData;
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
  rfqs: Partial<InsertRFQ>[];
  opportunities: SAMOpportunity[];
}> {
  const opportunities = await scrapeSAMGovOpportunities(limit);
  
  const buyers: Partial<InsertBuyer>[] = [];
  const rfqs: Partial<InsertRFQ>[] = [];
  
  for (const opportunity of opportunities) {
    // Extract buyer info
    const buyerInfo = extractBuyerInfo(opportunity);
    buyers.push(buyerInfo);
    
    // Extract RFQ info (buyerId will be set after buyer is inserted)
    const rfqInfo = extractRFQInfo(opportunity, ''); // Temporary buyerId
    rfqs.push(rfqInfo);
  }
  
  console.log(`📊 Processed ${buyers.length} buyers and ${rfqs.length} RFQs from SAM.gov`);
  
  return {
    buyers,
    rfqs,
    opportunities,
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
        for (let i = 0; i < result.buyers.length; i++) {
          const buyerInfo = result.buyers[i];
          const rfqInfo = result.rfqs[i];
          
          const buyer = await storageInstance.createBuyer(buyerInfo);
          await storageInstance.createRFQ({ ...rfqInfo, buyerId: buyer.id });
        }
        console.log(`✅ Initial scrape auto-inserted: ${result.buyers.length} buyers, ${result.rfqs.length} RFQs`);
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
        for (let i = 0; i < result.buyers.length; i++) {
          const buyerInfo = result.buyers[i];
          const rfqInfo = result.rfqs[i];
          
          const buyer = await storageInstance.createBuyer(buyerInfo);
          await storageInstance.createRFQ({ ...rfqInfo, buyerId: buyer.id });
        }
        console.log(`✅ Auto-inserted: ${result.buyers.length} buyers, ${result.rfqs.length} RFQs`);
      }
    } catch (error: any) {
      console.error('❌ Scheduled SAM.gov scrape failed:', error.message);
    }
  }, intervalMs);
}
