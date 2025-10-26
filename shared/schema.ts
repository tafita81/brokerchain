import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Regulatory framework types
export type RegulatoryFramework = "pfas" | "buyamerica" | "eudr" | "secondary";
export type RFQStatus = "draft" | "sent" | "responded" | "negotiating" | "awaiting_buyer" | "buyer_selected" | "contract_pending" | "contract_signed" | "payment_pending" | "payment_received" | "in_fulfillment" | "delivered" | "completed" | "closed" | "rejected";
export type SupplierCertification = "BPI" | "TUV_OK_COMPOST" | "ASTM_D6868" | "IATF_16949" | "ISO_9001" | "FSC" | "PEFC" | "RAINFOREST_ALLIANCE";
export type ContentStatus = "generating" | "generated" | "published" | "error";
export type SupplierType = "new" | "surplus";
export type QuoteStatus = "pending" | "received" | "selected" | "rejected";
export type NegotiationStatus = "active" | "completed" | "failed";
export type ContractStatus = "draft" | "sent" | "signed_buyer" | "signed_supplier" | "signed_broker" | "fully_signed" | "cancelled";
export type PaymentStatus = "pending" | "escrowed" | "released" | "refunded" | "cancelled";
export type CommissionStatus = "pending" | "paid" | "failed";

// Countries supported by Amazon OneLink + China
export const COUNTRIES = [
  "USA", "Canada", "UK", "Germany", "France", "Italy", "Spain", 
  "Japan", "Australia", "Brazil", "Mexico", "Netherlands", "Singapore", "UAE", "China"
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
  "UAE": "en",
  "China": "zh"
} as const;

// Suppliers table
export const suppliers = pgTable("suppliers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  country: text("country").notNull(),
  framework: text("framework").notNull(), // pfas, buyamerica, eudr, secondary
  supplierType: text("supplier_type").notNull().default("new"), // new or surplus
  products: jsonb("products").notNull().default([]), // array of product types
  certifications: jsonb("certifications").notNull().default([]), // array of certification types
  contactEmail: text("contact_email"),
  description: text("description"),
  discountPercentage: integer("discount_percentage"), // for surplus suppliers (30-50%)
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

// Digital Product Passports (DPP) for EUDR compliance + GS1 + QR tracking
export const digitalProductPassports = pgTable("digital_product_passports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  supplierId: text("supplier_id").notNull(),
  productName: text("product_name").notNull(),
  productType: text("product_type").notNull(), // coffee, soy, palm oil, wood, packaging, steel, etc.
  framework: text("framework").notNull(), // pfas, buyamerica, eudr
  gs1Barcode: text("gs1_barcode").unique(), // GS1 Global Trade Item Number (GTIN)
  qrCodeData: text("qr_code_data"), // QR code content (link to this DPP)
  geospatialData: jsonb("geospatial_data"), // polygon coordinates (EUDR)
  harvestDate: timestamp("harvest_date"),
  certifications: jsonb("certifications").notNull().default([]),
  chainOfCustody: jsonb("chain_of_custody").notNull().default([]),
  complianceProof: jsonb("compliance_proof").notNull().default({}), // framework-specific proofs
  deforestationFree: boolean("deforestation_free"),
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

// Conversation Threads - ChatGPT 4o mini powered negotiations
export const conversationThreads = pgTable("conversation_threads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: text("company_id").notNull(), // supplier or buyer ID
  companyType: text("company_type").notNull(), // 'supplier' or 'buyer'
  companyName: text("company_name").notNull(),
  language: text("language").notNull(), // en, pt, es, fr, de, it, ja
  framework: text("framework").notNull(), // pfas, buyamerica, eudr
  status: text("status").notNull().default("active"), // active, closed, on_hold
  summary: text("summary"), // AI-generated summary of conversation
  lastMessageAt: timestamp("last_message_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Conversation Messages - Complete history stored forever
export const conversationMessages = pgTable("conversation_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  threadId: text("thread_id").notNull(),
  role: text("role").notNull(), // 'assistant' (us) or 'user' (them)
  content: text("content").notNull(),
  language: text("language").notNull(),
  metadata: jsonb("metadata").notNull().default({}), // context data used for this message
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Real-time Company Context - Always up-to-date data for conversations
export const companyContext = pgTable("company_context", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: text("company_id").notNull().unique(),
  companyType: text("company_type").notNull(), // 'supplier' or 'buyer'
  currentInventory: jsonb("current_inventory").notNull().default({}),
  activePricing: jsonb("active_pricing").notNull().default({}),
  capabilities: jsonb("capabilities").notNull().default({}),
  constraints: jsonb("constraints").notNull().default({}), // what we CAN'T promise
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

// Supplier Quotes - Cotações recebidas de suppliers via email ou web form
// PRICING LAW: Final price = supplier price + shipping + taxes + fees + tariffs + broker commission
export const supplierQuotes = pgTable("supplier_quotes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  rfqId: text("rfq_id").notNull(),
  supplierId: text("supplier_id").notNull(),
  status: text("status").notNull().default("pending"), // pending, received, selected, rejected
  
  // BASE COSTS (hidden from buyer)
  supplierPricePerUnit: integer("supplier_price_per_unit"), // cents - what supplier charges
  shippingCostPerUnit: integer("shipping_cost_per_unit"), // cents - freight cost per unit
  taxesPerUnit: integer("taxes_per_unit"), // cents - taxes per unit
  feesPerUnit: integer("fees_per_unit"), // cents - customs, handling, etc.
  tariffsPerUnit: integer("tariffs_per_unit"), // cents - import tariffs
  brokerMarginPercent: integer("broker_margin_percent"), // 5-15% - BrokerChain commission
  
  // CALCULATED FINAL PRICE (shown to buyer - NO BREAKDOWN)
  finalPriceToBuyer: integer("final_price_to_buyer"), // cents - TOTAL (all costs included)
  
  // OTHER DETAILS
  minimumOrderQuantity: integer("minimum_order_quantity"),
  leadTimeDays: integer("lead_time_days"),
  validUntil: timestamp("valid_until"),
  rawQuoteText: text("raw_quote_text"), // original email/form content
  parsedData: jsonb("parsed_data").notNull().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Negotiations - AI-powered negotiation rounds
export const negotiations = pgTable("negotiations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  rfqId: text("rfq_id").notNull(),
  quoteId: text("quote_id").notNull(),
  status: text("status").notNull().default("active"), // active, completed, failed
  targetMargin: integer("target_margin"), // minimum margin % we need (5-15%)
  currentMargin: integer("current_margin"),
  negotiationRounds: integer("negotiation_rounds").notNull().default(0),
  aiStrategy: text("ai_strategy"), // description of AI negotiation approach
  conversationLog: jsonb("conversation_log").notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

// Contracts - DocuSign contracts (3-party: buyer + supplier + broker)
export const contracts = pgTable("contracts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  rfqId: text("rfq_id").notNull(),
  quoteId: text("quote_id").notNull(),
  buyerId: text("buyer_id").notNull(),
  supplierId: text("supplier_id").notNull(),
  status: text("status").notNull().default("draft"), // draft, sent, signed_buyer, signed_supplier, signed_broker, fully_signed, cancelled
  docusignEnvelopeId: text("docusign_envelope_id").unique(),
  docusignPdfUrl: text("docusign_pdf_url"),
  totalAmount: integer("total_amount"), // cents
  brokerCommission: integer("broker_commission"), // cents
  contractTerms: jsonb("contract_terms").notNull().default({}),
  signedByBuyerAt: timestamp("signed_by_buyer_at"),
  signedBySupplierAt: timestamp("signed_by_supplier_at"),
  signedByBrokerAt: timestamp("signed_by_broker_at"),
  fullySignedAt: timestamp("fully_signed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Payments - Escrow payments and releases
export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contractId: text("contract_id").notNull(),
  status: text("status").notNull().default("pending"), // pending, escrowed, released, refunded, cancelled
  totalAmount: integer("total_amount").notNull(), // cents
  brokerCommission: integer("broker_commission").notNull(), // cents
  supplierPayout: integer("supplier_payout").notNull(), // cents
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  stripeEscrowId: text("stripe_escrow_id"),
  trackingNumber: text("tracking_number"), // shipment tracking
  buyerPaidAt: timestamp("buyer_paid_at"),
  escrowedAt: timestamp("escrowed_at"),
  releasedAt: timestamp("released_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Commissions - BrokerChain commission tracking
export const commissions = pgTable("commissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  paymentId: text("payment_id").notNull(),
  contractId: text("contract_id").notNull(),
  status: text("status").notNull().default("pending"), // pending, paid, failed
  amount: integer("amount").notNull(), // cents
  percentage: integer("percentage").notNull(), // 5-15%
  payoneerBatchId: text("payoneer_batch_id"),
  payoneerPaymentId: text("payoneer_payment_id"),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Email Logs - Tracking all automated emails
export const emailLogs = pgTable("email_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  rfqId: text("rfq_id"),
  recipientEmail: text("recipient_email").notNull(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  emailType: text("email_type").notNull(), // rfq_to_supplier, quote_to_buyer, reminder, confirmation, etc.
  sendgridMessageId: text("sendgrid_message_id"),
  status: text("status").notNull().default("pending"), // pending, sent, delivered, opened, clicked, bounced, failed
  sentAt: timestamp("sent_at"),
  deliveredAt: timestamp("delivered_at"),
  openedAt: timestamp("opened_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert Schemas (for validation)
export const insertSupplierSchema = createInsertSchema(suppliers).omit({ id: true, createdAt: true });
export const insertBuyerSchema = createInsertSchema(buyers).omit({ id: true, createdAt: true });
export const insertRFQSchema = createInsertSchema(rfqs).omit({ id: true, createdAt: true, sentAt: true, respondedAt: true });
export const insertContentSchema = createInsertSchema(generatedContent).omit({ id: true, createdAt: true, publishedAt: true });
export const insertDPPSchema = createInsertSchema(digitalProductPassports).omit({ id: true, createdAt: true });
export const insertLeadSchema = createInsertSchema(leads).omit({ id: true, createdAt: true });
export const insertMetricSchema = createInsertSchema(metrics).omit({ id: true, date: true });
export const insertConversationThreadSchema = createInsertSchema(conversationThreads).omit({ id: true, createdAt: true, lastMessageAt: true });
export const insertConversationMessageSchema = createInsertSchema(conversationMessages).omit({ id: true, createdAt: true });
export const insertCompanyContextSchema = createInsertSchema(companyContext).omit({ id: true, lastUpdated: true });
export const insertSupplierQuoteSchema = createInsertSchema(supplierQuotes).omit({ id: true, createdAt: true });
export const insertNegotiationSchema = createInsertSchema(negotiations).omit({ id: true, createdAt: true, completedAt: true });
export const insertContractSchema = createInsertSchema(contracts).omit({ id: true, createdAt: true, signedByBuyerAt: true, signedBySupplierAt: true, signedByBrokerAt: true, fullySignedAt: true });
export const insertPaymentSchema = createInsertSchema(payments).omit({ id: true, createdAt: true, buyerPaidAt: true, escrowedAt: true, releasedAt: true });
export const insertCommissionSchema = createInsertSchema(commissions).omit({ id: true, createdAt: true, paidAt: true });
export const insertEmailLogSchema = createInsertSchema(emailLogs).omit({ id: true, createdAt: true, sentAt: true, deliveredAt: true, openedAt: true });

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

export type InsertConversationThread = z.infer<typeof insertConversationThreadSchema>;
export type ConversationThread = typeof conversationThreads.$inferSelect;

export type InsertConversationMessage = z.infer<typeof insertConversationMessageSchema>;
export type ConversationMessage = typeof conversationMessages.$inferSelect;

export type InsertCompanyContext = z.infer<typeof insertCompanyContextSchema>;
export type CompanyContext = typeof companyContext.$inferSelect;

export type InsertSupplierQuote = z.infer<typeof insertSupplierQuoteSchema>;
export type SupplierQuote = typeof supplierQuotes.$inferSelect;

export type InsertNegotiation = z.infer<typeof insertNegotiationSchema>;
export type Negotiation = typeof negotiations.$inferSelect;

export type InsertContract = z.infer<typeof insertContractSchema>;
export type Contract = typeof contracts.$inferSelect;

export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;

export type InsertCommission = z.infer<typeof insertCommissionSchema>;
export type Commission = typeof commissions.$inferSelect;

export type InsertEmailLog = z.infer<typeof insertEmailLogSchema>;
export type EmailLog = typeof emailLogs.$inferSelect;

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
