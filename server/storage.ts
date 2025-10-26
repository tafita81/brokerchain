import {
  type Supplier,
  type InsertSupplier,
  type Buyer,
  type InsertBuyer,
  type RFQ,
  type InsertRFQ,
  type GeneratedContent,
  type InsertContent,
  type DigitalProductPassport,
  type InsertDPP,
  type Lead,
  type InsertLead,
  type Metric,
  type InsertMetric,
  type RFQWithDetails,
  type MetricsSummary,
} from "@shared/schema";
import { randomUUID } from "crypto";
import { DbStorage } from "./db-storage";

export interface IStorage {
  // Suppliers
  getSupplier(id: string): Promise<Supplier | undefined>;
  getAllSuppliers(): Promise<Supplier[]>;
  getSuppliersByFramework(framework: string): Promise<Supplier[]>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;

  // Buyers
  getBuyer(id: string): Promise<Buyer | undefined>;
  getAllBuyers(): Promise<Buyer[]>;
  createBuyer(buyer: InsertBuyer): Promise<Buyer>;

  // RFQs
  getRFQ(id: string): Promise<RFQ | undefined>;
  getAllRFQs(): Promise<RFQWithDetails[]>;
  getRFQsByStatus(status: string): Promise<RFQWithDetails[]>;
  createRFQ(rfq: InsertRFQ): Promise<RFQ>;
  updateRFQStatus(id: string, status: string, response?: string): Promise<RFQ | undefined>;

  // Generated Content
  getContent(id: string): Promise<GeneratedContent | undefined>;
  getAllContent(): Promise<GeneratedContent[]>;
  getContentByCountry(country: string): Promise<GeneratedContent[]>;
  createContent(content: InsertContent): Promise<GeneratedContent>;
  updateContentStatus(id: string, status: string): Promise<GeneratedContent | undefined>;

  // Digital Product Passports
  getDPP(id: string): Promise<DigitalProductPassport | undefined>;
  getDPPsBySupplier(supplierId: string): Promise<DigitalProductPassport[]>;
  createDPP(dpp: InsertDPP): Promise<DigitalProductPassport>;

  // Leads
  getLead(id: string): Promise<Lead | undefined>;
  getAllLeads(): Promise<Lead[]>;
  createLead(lead: InsertLead): Promise<Lead>;

  // Metrics
  getMetricsSummary(): Promise<MetricsSummary>;
  createMetric(metric: InsertMetric): Promise<Metric>;
}

export class MemStorage implements IStorage {
  private suppliers: Map<string, Supplier>;
  private buyers: Map<string, Buyer>;
  private rfqs: Map<string, RFQ>;
  private content: Map<string, GeneratedContent>;
  private dpps: Map<string, DigitalProductPassport>;
  private leads: Map<string, Lead>;
  private metrics: Map<string, Metric>;

  constructor() {
    this.suppliers = new Map();
    this.buyers = new Map();
    this.rfqs = new Map();
    this.content = new Map();
    this.dpps = new Map();
    this.leads = new Map();
    this.metrics = new Map();

    this.seedInitialData();
  }

  private seedInitialData() {
    // Seed suppliers
    const suppliers: InsertSupplier[] = [
      {
        name: "Braskem",
        country: "USA",
        framework: "pfas",
        products: ["MDO Bio-films", "Recyclable Packaging", "Sugarcane-based Resin"],
        certifications: ["SPC Aligned", "Mono-material Recyclable", "Bio-based"],
        contactEmail: "contact@braskem.com",
        description: "World's first mono-material recyclable MDO bio-film made from sugarcane.",
      },
      {
        name: "Vegware",
        country: "USA",
        framework: "pfas",
        products: ["Compostable Tableware", "Bagasse Containers", "PLA Products"],
        certifications: ["BPI Certified", "TÜV OK Compost", "PFAS-Free"],
        contactEmail: "contact@vegware.com",
        description: "Industrial compostable food service packaging with full PFAS-free certification.",
      },
      {
        name: "Sabert",
        country: "USA",
        framework: "pfas",
        products: ["Pulp Containers", "Molded Fiber", "Natural Fiber Packaging"],
        certifications: ["ASTM D6868", "PFAS-Free Declaration", "Compostable"],
        contactEmail: "contact@sabert.com",
        description: "Pulp Plus™ and Pulp Max™ containers - 100% PFAS-free, natural fiber solutions.",
      },
      {
        name: "SunDance",
        country: "USA",
        framework: "pfas",
        products: ["Biodegradable Films", "Recyclable Packaging", "Eco-friendly Materials"],
        certifications: ["CA Compliant", "ME Compliant", "NY Compliant"],
        contactEmail: "contact@sundance.com",
        description: "Biodegradable films meeting California, Maine, and New York PFAS regulations.",
      },
      {
        name: "Dyson Fasteners",
        country: "USA",
        framework: "buyamerica",
        products: ["High-tensile Bolts", "Industrial Fasteners", "Aerospace Components"],
        certifications: ["IATF 16949", "100% US Melted", "Buy America Proof"],
        contactEmail: "contact@dyson-fasteners.com",
        description: "High-tensile bolts for infrastructure, defense, and aerospace - 100% U.S.-melted steel.",
      },
      {
        name: "Prestige Stamping",
        country: "USA",
        framework: "buyamerica",
        products: ["Precision Washers", "Industrial Hardware", "Metal Stampings"],
        certifications: ["ISO 9001", "Buy America Compliant", "ITAR Registered"],
        contactEmail: "contact@prestigestamping.com",
        description: "Precision washers and industrial hardware - fully compliant with 41 U.S.C. § 8301–8305.",
      },
      {
        name: "Sancoffee",
        country: "Brazil",
        framework: "eudr",
        products: ["Direct-trade Coffee", "Specialty Arabica", "Sustainable Commodities"],
        certifications: ["Rainforest Alliance", "GPS Verified", "Zero Deforestation"],
        contactEmail: "contact@sancoffee.com",
        description: "Direct-trade Brazilian coffee with polygon-level GPS mapping and full traceability.",
      },
      {
        name: "Suzano",
        country: "Brazil",
        framework: "eudr",
        products: ["Deforestation-free Cellulose", "Eucalyptus Pulp", "Sustainable Fiber"],
        certifications: ["FSC", "PEFC", "CERFLOR", "Sentinel-2 Monitored"],
        contactEmail: "contact@suzano.com",
        description: "Deforestation-free cellulose with FSC, PEFC certifications - monitored via satellite.",
      },
    ];

    suppliers.forEach(supplier => {
      const id = randomUUID();
      this.suppliers.set(id, { ...supplier, id, createdAt: new Date() });
    });
  }

  // Suppliers
  async getSupplier(id: string): Promise<Supplier | undefined> {
    return this.suppliers.get(id);
  }

  async getAllSuppliers(): Promise<Supplier[]> {
    return Array.from(this.suppliers.values());
  }

  async getSuppliersByFramework(framework: string): Promise<Supplier[]> {
    return Array.from(this.suppliers.values()).filter(s => s.framework === framework);
  }

  async createSupplier(insertSupplier: InsertSupplier): Promise<Supplier> {
    const id = randomUUID();
    const supplier: Supplier = { ...insertSupplier, id, createdAt: new Date() };
    this.suppliers.set(id, supplier);
    return supplier;
  }

  // Buyers
  async getBuyer(id: string): Promise<Buyer | undefined> {
    return this.buyers.get(id);
  }

  async getAllBuyers(): Promise<Buyer[]> {
    return Array.from(this.buyers.values());
  }

  async createBuyer(insertBuyer: InsertBuyer): Promise<Buyer> {
    const id = randomUUID();
    const buyer: Buyer = { ...insertBuyer, id, createdAt: new Date() };
    this.buyers.set(id, buyer);
    return buyer;
  }

  // RFQs
  async getRFQ(id: string): Promise<RFQ | undefined> {
    return this.rfqs.get(id);
  }

  async getAllRFQs(): Promise<RFQWithDetails[]> {
    return Array.from(this.rfqs.values()).map(rfq => ({
      ...rfq,
      buyer: rfq.buyerId ? this.buyers.get(rfq.buyerId) : undefined,
      supplier: rfq.supplierId ? this.suppliers.get(rfq.supplierId) : undefined,
    }));
  }

  async getRFQsByStatus(status: string): Promise<RFQWithDetails[]> {
    return (await this.getAllRFQs()).filter(rfq => rfq.status === status);
  }

  async createRFQ(insertRFQ: InsertRFQ): Promise<RFQ> {
    const id = randomUUID();
    const rfq: RFQ = { ...insertRFQ, id, createdAt: new Date(), sentAt: null, respondedAt: null };
    this.rfqs.set(id, rfq);
    return rfq;
  }

  async updateRFQStatus(id: string, status: string, response?: string): Promise<RFQ | undefined> {
    const rfq = this.rfqs.get(id);
    if (!rfq) return undefined;

    const updated: RFQ = {
      ...rfq,
      status,
      response: response || rfq.response,
      sentAt: status === "sent" ? new Date() : rfq.sentAt,
      respondedAt: status === "responded" ? new Date() : rfq.respondedAt,
    };
    this.rfqs.set(id, updated);
    return updated;
  }

  // Generated Content
  async getContent(id: string): Promise<GeneratedContent | undefined> {
    return this.content.get(id);
  }

  async getAllContent(): Promise<GeneratedContent[]> {
    return Array.from(this.content.values());
  }

  async getContentByCountry(country: string): Promise<GeneratedContent[]> {
    return Array.from(this.content.values()).filter(c => c.country === country);
  }

  async createContent(insertContent: InsertContent): Promise<GeneratedContent> {
    const id = randomUUID();
    const content: GeneratedContent = {
      ...insertContent,
      id,
      createdAt: new Date(),
      publishedAt: null,
    };
    this.content.set(id, content);
    return content;
  }

  async updateContentStatus(id: string, status: string): Promise<GeneratedContent | undefined> {
    const content = this.content.get(id);
    if (!content) return undefined;

    const updated: GeneratedContent = {
      ...content,
      status,
      publishedAt: status === "published" ? new Date() : content.publishedAt,
    };
    this.content.set(id, updated);
    return updated;
  }

  // Digital Product Passports
  async getDPP(id: string): Promise<DigitalProductPassport | undefined> {
    return this.dpps.get(id);
  }

  async getDPPsBySupplier(supplierId: string): Promise<DigitalProductPassport[]> {
    return Array.from(this.dpps.values()).filter(dpp => dpp.supplierId === supplierId);
  }

  async createDPP(insertDPP: InsertDPP): Promise<DigitalProductPassport> {
    const id = randomUUID();
    const dpp: DigitalProductPassport = { ...insertDPP, id, createdAt: new Date() };
    this.dpps.set(id, dpp);
    return dpp;
  }

  // Leads
  async getLead(id: string): Promise<Lead | undefined> {
    return this.leads.get(id);
  }

  async getAllLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values());
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const id = randomUUID();
    const lead: Lead = { ...insertLead, id, createdAt: new Date() };
    this.leads.set(id, lead);
    return lead;
  }

  // Metrics
  async getMetricsSummary(): Promise<MetricsSummary> {
    const allRFQs = await this.getAllRFQs();

    return {
      totalRFQsSent: allRFQs.filter(r => r.status !== "draft").length,
      totalResponses: allRFQs.filter(r => r.status === "responded" || r.status === "negotiating" || r.status === "closed").length,
      totalClosed: allRFQs.filter(r => r.status === "closed").length,
      averageResponseTime: 4.2, // Mock value
      successRate: 35, // Mock value
      byFramework: {
        pfas: allRFQs.filter(r => r.framework === "pfas").length,
        buyamerica: allRFQs.filter(r => r.framework === "buyamerica").length,
        eudr: allRFQs.filter(r => r.framework === "eudr").length,
      },
      byCountry: {}, // Mock empty for now
    };
  }

  async createMetric(insertMetric: InsertMetric): Promise<Metric> {
    const id = randomUUID();
    const metric: Metric = { ...insertMetric, id, date: new Date() };
    this.metrics.set(id, metric);
    return metric;
  }
}

// Use PostgreSQL database storage instead of in-memory
export const storage = process.env.DATABASE_URL ? new DbStorage() : new MemStorage();
