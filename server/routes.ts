import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateRFQ, generateSEOContent } from "./openai";
import { insertSupplierSchema, insertBuyerSchema, insertRFQSchema, insertContentSchema, insertDPPSchema, insertLeadSchema, LANGUAGES } from "@shared/schema";
import { z } from "zod";

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
      const { status } = req.query;

      if (status && typeof status === "string") {
        const rfqs = await storage.getRFQsByStatus(status);
        return res.json(rfqs);
      }

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
      const { framework, buyerName, industry, productType, quantity, requirements } = req.body;

      if (!framework || !buyerName || !productType) {
        return res.status(400).json({
          error: "Missing required fields: framework, buyerName, productType",
        });
      }

      // Generate RFQ using ChatGPT 4o mini
      const generated = await generateRFQ({
        framework,
        buyerName,
        industry: industry || "General",
        productType,
        quantity,
        requirements,
      });

      // Create or get buyer
      let buyer = (await storage.getAllBuyers()).find(b => b.name === buyerName);
      if (!buyer) {
        buyer = await storage.createBuyer({
          name: buyerName,
          industry: industry || "General",
          country: "USA",
          framework,
          contactEmail: "",
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
          content: generated.content,
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

      // Generate content using ChatGPT 4o mini (async)
      generateSEOContent({
        niche,
        country,
        language,
        keywords,
      })
        .then(async (generated) => {
          await storage.updateContentStatus(pendingContent.id, "generated");
          // Update with generated content (in real app, would patch the content)
          const updatedContent = await storage.getContent(pendingContent.id);
          if (updatedContent) {
            // In a real app, we'd update the content fields here
            // For now, we just update the status
          }

          // Create metric
          await storage.createMetric({
            framework: "content",
            country,
            metricType: "content_generated",
            value: 1,
            metadata: { niche, contentId: pendingContent.id },
          });
        })
        .catch(async (error) => {
          console.error("Content generation error:", error);
          await storage.updateContentStatus(pendingContent.id, "error");
        });

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

  const httpServer = createServer(app);

  return httpServer;
}
