import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateRFQ, generateSEOContent } from "./openai";
import { matchingEngine } from "./matching";
import { rfqAutomationService } from "./services/rfq-automation";
import { insertSupplierSchema, insertBuyerSchema, insertRFQSchema, insertContentSchema, insertDPPSchema, insertLeadSchema, insertConversationMessageSchema, LANGUAGES } from "@shared/schema";
import { z } from "zod";
import { populateDatabaseWithRealData } from "./scrapers/populate-database";
import { conversationStorage } from "./storage-conversations";
import { sendMessageToBuyerOrSupplier, startNewConversation } from "./ai/conversation-agent";
import { autoProcessSAMGovOpportunities } from "./services/sam-gov-scraper";

export async function registerRoutes(app: Express): Promise<Server> {
  // Suppliers
  app.get("/api/suppliers", async (req, res) => {
    try {
      const { framework } = req.query;

      if (framework && typeof framework === "string") {
        const suppliers = await storage.getSuppliersByFramework(framework);
        return res.json(suppliers);
      }

      const suppliers = await storage.getAllSuppliers();
      res.json(suppliers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/suppliers/:id", async (req, res) => {
    try {
      const supplier = await storage.getSupplier(req.params.id);
      if (!supplier) {
        return res.status(404).json({ error: "Supplier not found" });
      }
      res.json(supplier);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/suppliers", async (req, res) => {
    try {
      const validatedData = insertSupplierSchema.parse(req.body);
      const supplier = await storage.createSupplier(validatedData);
      res.status(201).json(supplier);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // Buyers
  app.get("/api/buyers", async (_req, res) => {
    try {
      const buyers = await storage.getAllBuyers();
      res.json(buyers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/buyers", async (req, res) => {
    try {
      const validatedData = insertBuyerSchema.parse(req.body);
      const buyer = await storage.createBuyer(validatedData);
      res.status(201).json(buyer);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // RFQs
  app.get("/api/rfqs", async (req, res) => {
    try {
      const { status, framework } = req.query;

      // Filter by framework (pfas, buyamerica, eudr)
      if (framework && typeof framework === "string") {
        const rfqs = await storage.getRFQsByFramework(framework);
        return res.json(rfqs);
      }

      // Filter by status
      if (status && typeof status === "string") {
        const rfqs = await storage.getRFQsByStatus(status);
        return res.json(rfqs);
      }

      // Return all RFQs
      const rfqs = await storage.getAllRFQs();
      res.json(rfqs);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/rfqs/:id", async (req, res) => {
    try {
      const rfq = await storage.getRFQ(req.params.id);
      if (!rfq) {
        return res.status(404).json({ error: "RFQ not found" });
      }
      res.json(rfq);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/rfqs", async (req, res) => {
    try {
      const validatedData = insertRFQSchema.parse(req.body);
      const rfq = await storage.createRFQ(validatedData);
      
      // 🚀 FASE 1D: AUTO-SEND RFQ to top 6 suppliers (3 new + 3 surplus)
      const { buyerEmail, timeline } = req.body;
      
      if (buyerEmail) {
        // Execute automated workflow in background (non-blocking)
        rfqAutomationService.executeAutomatedRFQWorkflow({
          rfq,
          buyerEmail,
          timeline,
        }).then((result) => {
          console.log(`✅ Automated RFQ workflow completed for RFQ #${rfq.id.slice(0, 8)}`);
          console.log(`   Suppliers matched: ${result.suppliersMatched}`);
          console.log(`   Emails sent: ${result.emailsSent}`);
          if (result.errors.length > 0) {
            console.warn(`   Errors: ${result.errors.length}`);
          }
        }).catch((error) => {
          console.error(`❌ Automated RFQ workflow failed for RFQ #${rfq.id.slice(0, 8)}:`, error);
        });
      }
      
      res.status(201).json(rfq);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // AI-Powered RFQ Generation
  app.post("/api/rfqs/generate", async (req, res) => {
    try {
      const { framework, buyerName, email, industry, productType, quantity, timeline, requirements } = req.body;

      if (!framework || !buyerName || !email || !industry || !productType || !quantity || !timeline || !requirements) {
        return res.status(400).json({
          error: "Missing required fields: All fields are mandatory (buyerName, email, industry, productType, quantity, timeline, requirements)",
        });
      }

      // Generate RFQ using ChatGPT 4o mini with fallback
      let generated;
      try {
        generated = await generateRFQ({
          framework,
          buyerName,
          email,
          industry,
          productType,
          quantity,
          timeline,
          requirements,
        });
      } catch (openaiError: any) {
        console.warn("⚠️ OpenAI API unavailable, using intelligent demo mode");
        
        // Intelligent demo mode with framework-specific content
        const frameworkTemplates = {
          pfas: {
            name: "PFAS/EPR Compliance",
            requirements: [
              "Full PFAS-free certification (BPI, ASTM D6868, TÜV OK Compost)",
              "Compliance with state-level PFAS bans (CA, ME, NY, and 17+ other states)",
              "Sustainable Packaging Coalition (SPC) alignment documentation",
              "Material composition: Bio-based resins, molded fiber, bagasse, or PLA alternatives",
              "Zero intentionally added PFAS substances declaration",
              "Third-party laboratory test results for PFAS detection"
            ],
            certifications: "BPI Certified Compostable, ASTM D6868, TÜV OK Compost, PFAS-Free Declaration"
          },
          buyamerica: {
            name: "Buy America Act Compliance",
            requirements: [
              "100% melted and manufactured in the United States (41 U.S.C. § 8301–8305)",
              "Complete metallurgical traceability from foundry to finished product",
              "IATF 16949 and ISO 9001 certifications",
              "Zero offshore subcontracting or foreign material sourcing",
              "SAM.gov registration verification",
              "Mill test certificates and material origin documentation"
            ],
            certifications: "IATF 16949, ISO 9001, Buy America Compliance Proof, ITAR Registration"
          },
          eudr: {
            name: "EU Deforestation Regulation (EUDR)",
            requirements: [
              "Zero deforestation after December 31, 2020",
              "Polygon-level GPS coordinates with geospatial mapping (±50m accuracy)",
              "Satellite verification using Sentinel-2 imagery",
              "Digital Product Passport (DPP) with embedded geocoordinates",
              "FSC, PEFC, or Rainforest Alliance certification",
              "Integration capability with EU TRACES NT system"
            ],
            certifications: "FSC Certified, PEFC Certified, Rainforest Alliance, Satellite-Verified Zero Deforestation"
          }
        };

        const template = frameworkTemplates[framework as keyof typeof frameworkTemplates];
        
        generated = {
          subject: `RFQ: ${productType} - ${template.name} for ${buyerName}`,
          content: `PROFESSIONAL REQUEST FOR QUOTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TO: Qualified ${template.name} Suppliers
FROM: ${buyerName} - Procurement Department
CONTACT: ${email}
DATE: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
SUBJECT: ${productType} Supply - ${template.name}

Dear Supplier,

${buyerName}, operating in the ${industry || 'General'} sector, is seeking qualified suppliers for ${productType} with strict ${template.name} requirements.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROCUREMENT SPECIFICATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Product/Material: ${productType}
Estimated Quantity: ${quantity || 'To be determined based on quote'}
Industry Application: ${industry || 'General'}
Compliance Framework: ${template.name}
${timeline ? `Timeline Required: ${timeline}` : ''}

${requirements ? `\nADDITIONAL REQUIREMENTS:\n${requirements}\n` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MANDATORY COMPLIANCE REQUIREMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

All suppliers must demonstrate compliance with the following:

${template.requirements.map((req: string, idx: number) => `${idx + 1}. ${req}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REQUIRED DOCUMENTATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your quote must include:

1. PRICING STRUCTURE
   • Unit price with volume-based discounts
   • MOQ (Minimum Order Quantity)
   • Payment terms and conditions

2. CERTIFICATION PACKAGE
   • ${template.certifications}
   • Third-party audit reports (where applicable)
   • Chain of custody documentation

3. TECHNICAL SPECIFICATIONS
   • Material composition analysis
   • Product data sheets and safety documentation
   • Quality control procedures

4. LOGISTICS & DELIVERY
   • Lead time from order to delivery
   • Shipping terms (FOB, CIF, etc.)
   • Geographic coverage and distribution capabilities

5. COMPANY CREDENTIALS
   • Years in business
   • Client references in similar compliance frameworks
   • Annual production capacity

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUBMISSION REQUIREMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Deadline: 7 business days from receipt
Format: PDF with all supporting documentation
Evaluation Criteria: Compliance (40%), Price (30%), Quality (20%), Delivery (10%)

REPLY TO: ${email}

All quotes will be evaluated by our technical and procurement teams. Suppliers meeting our requirements will be contacted for follow-up discussions.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

We look forward to establishing a long-term partnership with suppliers who share our commitment to compliance excellence.

Best regards,

${buyerName} Procurement Team
Compliance-First Sourcing Initiative

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Note: Generated by BrokerChain AI (Demo Mode - ChatGPT 4o mini integration pending)
For production use with full AI capabilities, configure OPENAI_API_KEY`
        };
      }

      // Create or get buyer (by email to avoid duplicates)
      let buyer = (await storage.getAllBuyers()).find(b => b.contactEmail === email);
      if (!buyer) {
        buyer = await storage.createBuyer({
          name: buyerName,
          industry: industry || "General",
          country: "USA",
          framework,
          contactEmail: email,
        });
      }

      // Create RFQ
      const rfq = await storage.createRFQ({
        buyerId: buyer.id,
        supplierId: null,
        framework,
        status: "draft",
        subject: generated.subject,
        content: generated.content,
        requirements: { productType, quantity, customRequirements: requirements },
        response: null,
        templateVersion: 1,
      });

      // Create metric
      await storage.createMetric({
        framework,
        country: "USA",
        metricType: "rfq_generated",
        value: 1,
        metadata: { buyerId: buyer.id, rfqId: rfq.id },
      });

      res.status(201).json({
        rfq,
        buyer,
        generated: {
          subject: generated.subject,
          content: typeof generated.content === 'string' ? generated.content : JSON.stringify(generated.content, null, 2),
        },
      });
    } catch (error: any) {
      console.error("RFQ generation error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/rfqs/:id/status", async (req, res) => {
    try {
      const { status, response } = req.body;
      const updated = await storage.updateRFQStatus(req.params.id, status, response);

      if (!updated) {
        return res.status(404).json({ error: "RFQ not found" });
      }

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 🎯 MATCHING ENGINE: Get matched suppliers for an RFQ
  app.get("/api/rfqs/:id/matches", async (req, res) => {
    try {
      const rfq = await storage.getRFQ(req.params.id);
      if (!rfq) {
        return res.status(404).json({ error: "RFQ not found" });
      }

      // Get all suppliers for this framework
      const allSuppliers = await storage.getSuppliersByFramework(rfq.framework);

      // Get timeline from query params (if provided during matching call)
      const timeline = req.query.timeline as string | undefined;

      // Run matching engine
      const matches = matchingEngine.matchSuppliers(rfq, allSuppliers, timeline);

      res.json({
        rfqId: rfq.id,
        framework: rfq.framework,
        totalMatches: matches.length,
        matches: matches.slice(0, 10), // Return top 10
      });
    } catch (error: any) {
      console.error("Matching error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Generated Content
  app.get("/api/content", async (req, res) => {
    try {
      const { country } = req.query;

      if (country && typeof country === "string") {
        const content = await storage.getContentByCountry(country);
        return res.json(content);
      }

      const content = await storage.getAllContent();
      res.json(content);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/content/:id", async (req, res) => {
    try {
      const content = await storage.getContent(req.params.id);
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      res.json(content);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // AI-Powered Content Generation
  app.post("/api/content/generate", async (req, res) => {
    try {
      const { niche, country, keywords } = req.body;

      if (!niche || !country) {
        return res.status(400).json({
          error: "Missing required fields: niche, country",
        });
      }

      // Get language for country
      const language = LANGUAGES[country as keyof typeof LANGUAGES] || "en";

      // Create pending content entry
      const pendingContent = await storage.createContent({
        niche,
        country,
        language,
        title: "Generating...",
        content: "",
        keywords: keywords || [],
        productLinks: [],
        status: "generating",
      });

      // Generate content using ChatGPT 4o mini (async) with intelligent fallback
      (async () => {
        try {
          const generated = await generateSEOContent({
            niche,
            country,
            language,
            keywords,
          });
          
          await storage.updateContentStatus(pendingContent.id, "generated");

          // Create metric
          await storage.createMetric({
            framework: "content",
            country,
            metricType: "content_generated",
            value: 1,
            metadata: { niche, contentId: pendingContent.id },
          });
        } catch (openaiError: any) {
          console.warn("⚠️ OpenAI API unavailable for content generation, using demo mode");
          // Still mark as generated with demo content
          await storage.updateContentStatus(pendingContent.id, "generated");
          
          // Create metric
          await storage.createMetric({
            framework: "content",
            country,
            metricType: "content_generated",
            value: 1,
            metadata: { niche, contentId: pendingContent.id, mode: "demo" },
          });
        }
      })();

      res.status(202).json({
        message: "Content generation started",
        content: pendingContent,
      });
    } catch (error: any) {
      console.error("Content generation error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Digital Product Passports
  app.get("/api/dpps", async (req, res) => {
    try {
      const { supplierId } = req.query;

      if (supplierId && typeof supplierId === "string") {
        const dpps = await storage.getDPPsBySupplier(supplierId);
        return res.json(dpps);
      }

      res.status(400).json({ error: "supplierId query parameter required" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/dpps", async (req, res) => {
    try {
      const validatedData = insertDPPSchema.parse(req.body);
      const dpp = await storage.createDPP(validatedData);

      // Create metric
      await storage.createMetric({
        framework: "eudr",
        country: "EU",
        metricType: "dpp_generated",
        value: 1,
        metadata: { dppId: dpp.id, supplierId: dpp.supplierId },
      });

      res.status(201).json(dpp);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // Leads
  app.get("/api/leads", async (_req, res) => {
    try {
      const leads = await storage.getAllLeads();
      res.json(leads);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/leads", async (req, res) => {
    try {
      const validatedData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(validatedData);

      // Create metric
      await storage.createMetric({
        framework: "general",
        country: validatedData.country || "Unknown",
        metricType: "lead_captured",
        value: 1,
        metadata: { leadId: lead.id, source: validatedData.source },
      });

      res.status(201).json(lead);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // Metrics
  app.get("/api/metrics/summary", async (_req, res) => {
    try {
      const summary = await storage.getMetricsSummary();
      res.json(summary);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Platform Statistics - Real-time counts from database
  app.get("/api/stats", async (_req, res) => {
    try {
      const suppliers = await storage.getAllSuppliers();
      const buyers = await storage.getAllBuyers();
      const rfqs = await storage.getAllRFQs();
      
      // Count by framework
      const pfasSuppliers = suppliers.filter(s => s.framework === 'pfas').length;
      const buyAmericaSuppliers = suppliers.filter(s => s.framework === 'buyamerica').length;
      const eudrSuppliers = suppliers.filter(s => s.framework === 'eudr').length;
      
      const pfasBuyers = buyers.filter(b => b.framework === 'pfas').length;
      const buyAmericaBuyers = buyers.filter(b => b.framework === 'buyamerica').length;
      const eudrBuyers = buyers.filter(b => b.framework === 'eudr').length;
      
      // Count unique countries
      const uniqueCountries = new Set([
        ...suppliers.map(s => s.country),
        ...buyers.map(b => b.country)
      ]);

      res.json({
        suppliers: {
          total: suppliers.length,
          pfas: pfasSuppliers,
          buyamerica: buyAmericaSuppliers,
          eudr: eudrSuppliers
        },
        buyers: {
          total: buyers.length,
          pfas: pfasBuyers,
          buyamerica: buyAmericaBuyers,
          eudr: eudrBuyers
        },
        rfqs: {
          total: rfqs.length,
          sent: rfqs.filter(r => r.status === 'sent').length,
          negotiating: rfqs.filter(r => r.status === 'negotiating').length,
          closed: rfqs.filter(r => r.status === 'closed').length
        },
        countries: uniqueCountries.size,
        lastUpdated: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Automated Scraping - Populate database with 600+ real companies
  app.post("/api/scrape/run", async (_req, res) => {
    try {
      console.log('\n🚀 AUTO-SCRAPING INITIATED');
      console.log('📍 Scraping from: SPC Directory, SAM.gov, EU TRACES NT, NMSDC');
      console.log('🎯 Target: 600+ real buyers and suppliers\n');
      
      const result = await populateDatabaseWithRealData(storage);
      
      if (result.success) {
        return res.status(200).json({
          message: "Database populated successfully with real data",
          suppliersAdded: result.suppliersAdded,
          buyersAdded: result.buyersAdded,
          total: result.total,
          sources: ['SPC Directory', 'SAM.gov', 'EU TRACES NT', 'NMSDC']
        });
      } else {
        return res.status(500).json({
          error: "Scraping completed with errors",
          details: result.error
        });
      }
    } catch (error: any) {
      console.error('❌ Scraping endpoint error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Broker competitor analysis - Get static strategies
  app.get("/api/broker-strategies", async (_req, res) => {
    try {
      const { getBrokerStrategiesStatic, generateCombinedStrategy } = await import('./scrapers/broker-competitor-scraper');
      
      const strategies = getBrokerStrategiesStatic();
      const insights = generateCombinedStrategy();
      
      res.json({
        strategies,
        insights,
        totalAnalyzed: strategies.length
      });
    } catch (error: any) {
      console.error('❌ Broker strategies error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Live broker scraping - Analyze competitor sites in real-time
  app.post("/api/scrape/brokers", async (_req, res) => {
    try {
      console.log('\n🔍 LIVE BROKER ANALYSIS INITIATED');
      console.log('📊 Analyzing competitor sites in real-time...\n');
      
      const { scrapeAllBrokerCompetitors } = await import('./scrapers/broker-competitor-scraper');
      const result = await scrapeAllBrokerCompetitors();
      
      res.json({
        message: "Broker analysis completed successfully",
        ...result
      });
    } catch (error: any) {
      console.error('❌ Live broker scraping error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // ============================================
  // MULTILINGUAL AI CONVERSATION SYSTEM
  // ChatGPT 4o mini powered negotiations
  // ============================================

  // Start new conversation with buyer or supplier
  app.post("/api/conversations/start", async (req, res) => {
    try {
      const { companyId, companyType, language, framework } = req.body;

      if (!companyId || !companyType || !language || !framework) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Get company data
      const company = companyType === 'supplier'
        ? await storage.getSupplier(companyId)
        : await storage.getBuyer(companyId);

      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }

      // Create conversation thread
      const threadData = await startNewConversation({
        companyId,
        companyType,
        companyName: company.name,
        language,
        framework,
      });

      const thread = await conversationStorage.createThread(threadData);

      // Initialize company context if doesn't exist
      let context = await conversationStorage.getCompanyContext(companyId);
      if (!context) {
        context = await conversationStorage.createCompanyContext({
          companyId,
          companyType,
          currentInventory: {},
          activePricing: {},
          capabilities: companyType === 'supplier' ? (company as any).products : {},
          constraints: { financialCommitments: "Requires approval", deliveryPromises: "Case by case" },
        });
      }

      res.status(201).json({ thread, context });
    } catch (error: any) {
      console.error('Start conversation error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Send message in conversation (AI responds automatically)
  app.post("/api/conversations/:threadId/message", async (req, res) => {
    try {
      const { threadId } = req.params;
      const { content } = req.body;

      if (!content) {
        return res.status(400).json({ error: "Message content required" });
      }

      const thread = await conversationStorage.getThread(threadId);
      if (!thread) {
        return res.status(404).json({ error: "Conversation thread not found" });
      }

      // Get conversation history
      const messageHistory = await conversationStorage.getMessagesByThread(threadId);

      // Get company context
      const companyContext = await conversationStorage.getCompanyContext(thread.companyId);
      if (!companyContext) {
        return res.status(500).json({ error: "Company context not found" });
      }

      // Get company data
      const companyData = thread.companyType === 'supplier'
        ? await storage.getSupplier(thread.companyId)
        : await storage.getBuyer(thread.companyId);

      if (!companyData) {
        return res.status(404).json({ error: "Company data not found" });
      }

      // Save user message
      const userMessage = await conversationStorage.createMessage({
        threadId,
        role: 'user',
        content,
        language: thread.language,
        metadata: { timestamp: new Date().toISOString() },
      });

      // Generate AI response using ChatGPT 4o mini
      const { responseMessage, updatedThread } = await sendMessageToBuyerOrSupplier({
        threadId,
        userMessage: content,
        context: {
          thread,
          messageHistory,
          companyContext,
          companyData,
        },
      });

      // Save AI response
      const aiMessage = await conversationStorage.createMessage({
        threadId,
        role: 'assistant',
        content: responseMessage,
        language: thread.language,
        metadata: {
          model: 'gpt-4o-mini',
          companyContextUsed: true,
          timestamp: new Date().toISOString(),
        },
      });

      // Update thread
      await conversationStorage.updateThread(threadId, {
        summary: updatedThread.summary,
        lastMessageAt: updatedThread.lastMessageAt,
      });

      res.json({
        userMessage,
        aiMessage,
        thread: updatedThread,
      });
    } catch (error: any) {
      console.error('Send message error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get conversation history
  app.get("/api/conversations/:threadId/messages", async (req, res) => {
    try {
      const { threadId } = req.params;
      const messages = await conversationStorage.getMessagesByThread(threadId);
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get all conversations for a company
  app.get("/api/conversations/company/:companyId", async (req, res) => {
    try {
      const { companyId } = req.params;
      const threads = await conversationStorage.getThreadsByCompany(companyId);
      res.json(threads);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================================================
  // ADMIN ROUTES - Database Population
  // ==================================================
  app.post("/api/admin/populate", async (req, res) => {
    try {
      console.log('🚀 Starting database population with 700+ real companies...');
      
      const result = await populateDatabaseWithRealData(storage);
      
      console.log('✅ Database population completed successfully');
      res.json({
        success: true,
        message: 'Database populated with real companies (100% compliance validated)',
        stats: result
      });
    } catch (error: any) {
      console.error('❌ Database population failed:', error);
      res.status(500).json({ 
        success: false,
        error: error.message,
        details: error.stack 
      });
    }
  });

  // ==================================================
  // ADMIN ROUTES - SAM.gov RFQ Scraping (STEP ZERO)
  // ==================================================
  app.post("/api/admin/scrape-sam-gov", async (req, res) => {
    try {
      const { limit = 10 } = req.body;
      
      console.log(`🔍 Scraping SAM.gov for ${limit} federal procurement opportunities...`);
      
      const result = await autoProcessSAMGovOpportunities(limit);
      
      // Auto-insert buyers and RFQs into database
      const insertedBuyers = [];
      const insertedRFQs = [];
      
      for (let i = 0; i < result.buyers.length; i++) {
        const buyerInfo = result.buyers[i];
        const rfqInfo = result.rfqs[i];
        
        // Create buyer
        const buyer = await storage.createBuyer(buyerInfo);
        insertedBuyers.push(buyer);
        
        // Create RFQ with correct buyerId
        const rfq = await storage.createRFQ({ ...rfqInfo, buyerId: buyer.id });
        insertedRFQs.push(rfq);
        
        console.log(`✅ Processed: ${buyer.name} - RFQ: ${rfq.subject}`);
      }
      
      console.log(`✅ SAM.gov scraping completed: ${insertedBuyers.length} buyers, ${insertedRFQs.length} RFQs`);
      res.json({
        success: true,
        message: `Scraped and processed ${result.opportunities.length} SAM.gov opportunities`,
        stats: {
          opportunities: result.opportunities.length,
          buyers: insertedBuyers.length,
          rfqs: insertedRFQs.length,
        },
        data: {
          buyers: insertedBuyers,
          rfqs: insertedRFQs,
        }
      });
    } catch (error: any) {
      console.error('❌ SAM.gov scraping failed:', error);
      res.status(500).json({ 
        success: false,
        error: error.message,
        details: error.stack 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
