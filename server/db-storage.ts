import { eq, sql } from 'drizzle-orm';
import { db } from './db';
import {
  suppliers,
  buyers,
  rfqs,
  generatedContent,
  digitalProductPassports,
  leads,
  metrics,
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
} from '@shared/schema';
import type { IStorage } from './storage';

export class DbStorage implements IStorage {
  // Suppliers
  async getSupplier(id: string): Promise<Supplier | undefined> {
    const result = await db.select().from(suppliers).where(eq(suppliers.id, id));
    return result[0];
  }

  async getAllSuppliers(): Promise<Supplier[]> {
    return await db.select().from(suppliers);
  }

  async getSuppliersByFramework(framework: string): Promise<Supplier[]> {
    return await db.select().from(suppliers).where(eq(suppliers.framework, framework));
  }

  async createSupplier(supplier: InsertSupplier): Promise<Supplier> {
    const result = await db.insert(suppliers).values(supplier).returning();
    return result[0];
  }

  // Buyers
  async getBuyer(id: string): Promise<Buyer | undefined> {
    const result = await db.select().from(buyers).where(eq(buyers.id, id));
    return result[0];
  }

  async getAllBuyers(): Promise<Buyer[]> {
    return await db.select().from(buyers);
  }

  async createBuyer(buyer: InsertBuyer): Promise<Buyer> {
    const result = await db.insert(buyers).values(buyer).returning();
    return result[0];
  }

  // RFQs
  async getRFQ(id: string): Promise<RFQ | undefined> {
    const result = await db.select().from(rfqs).where(eq(rfqs.id, id));
    return result[0];
  }

  async getAllRFQs(): Promise<RFQWithDetails[]> {
    const result = await db.select().from(rfqs);
    return result as RFQWithDetails[];
  }

  async getRFQsByStatus(status: string): Promise<RFQWithDetails[]> {
    const result = await db.select().from(rfqs).where(eq(rfqs.status, status));
    return result as RFQWithDetails[];
  }

  async createRFQ(rfq: InsertRFQ): Promise<RFQ> {
    const result = await db.insert(rfqs).values(rfq).returning();
    return result[0];
  }

  async updateRFQStatus(id: string, status: string, response?: string): Promise<RFQ | undefined> {
    const updates: any = { status };
    if (response) updates.response = response;
    if (status === 'sent') updates.sentAt = new Date();
    if (status === 'responded') updates.respondedAt = new Date();

    const result = await db.update(rfqs)
      .set(updates)
      .where(eq(rfqs.id, id))
      .returning();
    return result[0];
  }

  // Generated Content
  async getContent(id: string): Promise<GeneratedContent | undefined> {
    const result = await db.select().from(generatedContent).where(eq(generatedContent.id, id));
    return result[0];
  }

  async getAllContent(): Promise<GeneratedContent[]> {
    return await db.select().from(generatedContent);
  }

  async getContentByCountry(country: string): Promise<GeneratedContent[]> {
    return await db.select().from(generatedContent).where(eq(generatedContent.country, country));
  }

  async createContent(content: InsertContent): Promise<GeneratedContent> {
    const result = await db.insert(generatedContent).values(content).returning();
    return result[0];
  }

  async updateContentStatus(id: string, status: string): Promise<GeneratedContent | undefined> {
    const updates: any = { status };
    if (status === 'published') updates.publishedAt = new Date();

    const result = await db.update(generatedContent)
      .set(updates)
      .where(eq(generatedContent.id, id))
      .returning();
    return result[0];
  }

  // Digital Product Passports
  async getDPP(id: string): Promise<DigitalProductPassport | undefined> {
    const result = await db.select().from(digitalProductPassports).where(eq(digitalProductPassports.id, id));
    return result[0];
  }

  async getDPPsBySupplier(supplierId: string): Promise<DigitalProductPassport[]> {
    return await db.select().from(digitalProductPassports).where(eq(digitalProductPassports.supplierId, supplierId));
  }

  async createDPP(dpp: InsertDPP): Promise<DigitalProductPassport> {
    const result = await db.insert(digitalProductPassports).values(dpp).returning();
    return result[0];
  }

  // Leads
  async getLead(id: string): Promise<Lead | undefined> {
    const result = await db.select().from(leads).where(eq(leads.id, id));
    return result[0];
  }

  async getAllLeads(): Promise<Lead[]> {
    return await db.select().from(leads);
  }

  async createLead(lead: InsertLead): Promise<Lead> {
    const result = await db.insert(leads).values(lead).returning();
    return result[0];
  }

  // Metrics
  async getMetricsSummary(): Promise<MetricsSummary> {
    const allRFQs = await db.select().from(rfqs);
    const allMetrics = await db.select().from(metrics);

    const totalRFQsSent = allRFQs.filter(r => r.status !== 'draft').length;
    const totalResponses = allRFQs.filter(r => r.status === 'responded' || r.status === 'closed').length;
    const totalClosed = allRFQs.filter(r => r.status === 'closed').length;

    const responseTimes = allRFQs
      .filter(r => r.sentAt && r.respondedAt)
      .map(r => (r.respondedAt!.getTime() - r.sentAt!.getTime()) / (1000 * 60 * 60));
    const averageResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      : 0;

    const successRate = totalRFQsSent > 0 ? (totalResponses / totalRFQsSent) * 100 : 0;

    const byFramework = {
      pfas: allRFQs.filter(r => r.framework === 'pfas').length,
      buyamerica: allRFQs.filter(r => r.framework === 'buyamerica').length,
      eudr: allRFQs.filter(r => r.framework === 'eudr').length,
    };

    const byCountry: Record<string, number> = {};
    allMetrics.forEach(m => {
      if (m.country) {
        byCountry[m.country] = (byCountry[m.country] || 0) + m.value;
      }
    });

    return {
      totalRFQsSent,
      totalResponses,
      totalClosed,
      averageResponseTime,
      successRate,
      byFramework,
      byCountry,
    };
  }

  async createMetric(metric: InsertMetric): Promise<Metric> {
    const result = await db.insert(metrics).values(metric).returning();
    return result[0];
  }
}
