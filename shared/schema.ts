import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Regulatory framework types
export type RegulatoryFramework = "pfas" | "buyamerica" | "eudr";
export type RFQStatus = "draft" | "sent" | "responded" | "negotiating" | "closed" | "rejected";
export type SupplierCertification = "BPI" | "TUV_OK_COMPOST" | "ASTM_D6868" | "IATF_16949" | "ISO_9001" | "FSC" | "PEFC" | "RAINFOREST_ALLIANCE";
export type ContentStatus = "generating" | "generated" | "published" | "error";

// Countries supported by Amazon OneLink
export const COUNTRIES = [
  "USA", "Canada", "UK", "Germany", "France", "Italy", "Spain", 
  "Japan", "Australia", "Brazil", "Mexico", "Netherlands", "Singapore", "UAE"
] as const;

export const LANGUAGES = {
  "USA": "en",
  "Canada": "en",
  "UK": "en",
  "Germany": "de",
  "France": "fr",
  "Italy": "it",
  "Spain": "es",
  "Japan": "ja",
  "Australia": "en",
  "Brazil": "pt",
  "Mexico": "es",
  "Netherlands": "en",
  "Singapore": "en",
  "UAE": "en"
} as const;

// Suppliers table
export const suppliers = pgTable("suppliers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  country: text("country").notNull(),
  framework: text("framework").notNull(), // pfas, buyamerica, eudr
  products: jsonb("products").notNull().default([]), // array of product types
  certifications: jsonb("certifications").notNull().default([]), // array of certification types
  contactEmail: text("contact_email"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Buyers table
export const buyers = pgTable("buyers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  industry: text("industry").notNull(),
  country: text("country").notNull(),
  framework: text("framework").notNull(), // pfas, buyamerica, eudr
  contactEmail: text("contact_email"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// RFQs (Request for Quote) table
export const rfqs = pgTable("rfqs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  buyerId: text("buyer_id").notNull(),
  supplierId: text("supplier_id"),
  framework: text("framework").notNull(),
  status: text("status").notNull().default("draft"),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  requirements: jsonb("requirements").notNull().default({}),
  response: text("response"),
  templateVersion: integer("template_version").notNull().default(1),
  sentAt: timestamp("sent_at"),
  respondedAt: timestamp("responded_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Generated Content table (SEO articles, product descriptions)
export const generatedContent = pgTable("generated_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  niche: text("niche").notNull(), // supplements, skincare, fitness, wellness
  country: text("country").notNull(),
  language: text("language").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  keywords: jsonb("keywords").notNull().default([]),
  productLinks: jsonb("product_links").notNull().default([]),
  status: text("status").notNull().default("generating"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Digital Product Passports (DPP) for EUDR compliance
export const digitalProductPassports = pgTable("digital_product_passports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  supplierId: text("supplier_id").notNull(),
  productName: text("product_name").notNull(),
  productType: text("product_type").notNull(), // coffee, soy, palm oil, wood, etc.
  geospatialData: jsonb("geospatial_data").notNull(), // polygon coordinates
  harvestDate: timestamp("harvest_date").notNull(),
  certifications: jsonb("certifications").notNull().default([]),
  chainOfCustody: jsonb("chain_of_custody").notNull().default([]),
  deforestationFree: boolean("deforestation_free").notNull().default(true),
  pdfUrl: text("pdf_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Leads table (email captures)
export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  source: text("source"), // which page/campaign
  country: text("country"),
  interests: jsonb("interests").notNull().default([]), // frameworks they're interested in
  subscribed: boolean("subscribed").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Analytics/Metrics table
export const metrics = pgTable("metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  framework: text("framework").notNull(),
  country: text("country"),
  metricType: text("metric_type").notNull(), // rfq_sent, rfq_responded, content_generated, etc.
  value: integer("value").notNull().default(0),
  metadata: jsonb("metadata").notNull().default({}),
  date: timestamp("date").defaultNow().notNull(),
});

// Insert Schemas (for validation)
export const insertSupplierSchema = createInsertSchema(suppliers).omit({ id: true, createdAt: true });
export const insertBuyerSchema = createInsertSchema(buyers).omit({ id: true, createdAt: true });
export const insertRFQSchema = createInsertSchema(rfqs).omit({ id: true, createdAt: true, sentAt: true, respondedAt: true });
export const insertContentSchema = createInsertSchema(generatedContent).omit({ id: true, createdAt: true, publishedAt: true });
export const insertDPPSchema = createInsertSchema(digitalProductPassports).omit({ id: true, createdAt: true });
export const insertLeadSchema = createInsertSchema(leads).omit({ id: true, createdAt: true });
export const insertMetricSchema = createInsertSchema(metrics).omit({ id: true, date: true });

// TypeScript types
export type InsertSupplier = z.infer<typeof insertSupplierSchema>;
export type Supplier = typeof suppliers.$inferSelect;

export type InsertBuyer = z.infer<typeof insertBuyerSchema>;
export type Buyer = typeof buyers.$inferSelect;

export type InsertRFQ = z.infer<typeof insertRFQSchema>;
export type RFQ = typeof rfqs.$inferSelect;

export type InsertContent = z.infer<typeof insertContentSchema>;
export type GeneratedContent = typeof generatedContent.$inferSelect;

export type InsertDPP = z.infer<typeof insertDPPSchema>;
export type DigitalProductPassport = typeof digitalProductPassports.$inferSelect;

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;

export type InsertMetric = z.infer<typeof insertMetricSchema>;
export type Metric = typeof metrics.$inferSelect;

// Extended types for frontend use
export interface RFQWithDetails extends RFQ {
  buyer?: Buyer;
  supplier?: Supplier;
}

export interface MetricsSummary {
  totalRFQsSent: number;
  totalResponses: number;
  totalClosed: number;
  averageResponseTime: number;
  successRate: number;
  byFramework: {
    pfas: number;
    buyamerica: number;
    eudr: number;
  };
  byCountry: Record<string, number>;
}

export interface ContentGenerationRequest {
  niche: string;
  country: string;
  keywords?: string[];
  productFocus?: string;
}

export interface DPPGenerationRequest {
  supplierId: string;
  productName: string;
  productType: string;
  geospatialData: {
    type: "Polygon";
    coordinates: number[][][];
  };
  harvestDate: string;
  certifications: string[];
}
