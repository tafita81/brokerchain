import type { RFQ, Supplier } from "@shared/schema";

export interface SupplierMatch {
  supplier: Supplier;
  score: number;
  reasons: string[];
  priority: "urgent" | "high" | "medium" | "low";
}

/**
 * BROKERCHAIN MATCHING ENGINE
 * 
 * Algoritmo que analisa um RFQ e encontra os suppliers mais compatíveis
 * baseado em framework, produtos, certificações, país e urgência.
 */
export class MatchingEngine {
  /**
   * Match suppliers para um RFQ específico
   * @param rfq RFQ object do banco
   * @param allSuppliers Lista de todos suppliers disponíveis
   * @param timeline Timeline do RFQ (urgent, 1month, etc)
   * @returns Lista de suppliers ranqueados por score
   */
  matchSuppliers(
    rfq: RFQ,
    allSuppliers: Supplier[],
    timeline?: string
  ): SupplierMatch[] {
    const matches: SupplierMatch[] = [];

    const requirements = rfq.requirements as {
      productType?: string;
      quantity?: string;
      customRequirements?: string;
    };

    const productType = requirements.productType?.toLowerCase() || "";
    const quantity = requirements.quantity?.toLowerCase() || "";
    const customReqs = requirements.customRequirements?.toLowerCase() || "";

    for (const supplier of allSuppliers) {
      // SKIP se framework não bate
      if (supplier.framework !== rfq.framework) {
        continue;
      }

      let score = 0;
      const reasons: string[] = [];

      // 1. FRAMEWORK MATCH (base score: 40 points)
      score += 40;
      reasons.push(`✓ ${this.getFrameworkName(rfq.framework)} compliance certified`);

      // 2. PRODUCT MATCH (0-30 points)
      const productScore = this.calculateProductScore(supplier, productType);
      score += productScore;
      if (productScore > 20) {
        reasons.push(`✓ Exact product match: ${this.extractMatchedProducts(supplier, productType).join(", ")}`);
      } else if (productScore > 10) {
        reasons.push(`✓ Related products available`);
      }

      // 3. CERTIFICATION MATCH (0-20 points)
      const certScore = this.calculateCertificationScore(supplier, rfq.framework, customReqs);
      score += certScore;
      if (certScore > 15) {
        reasons.push(`✓ Premium certifications: ${(supplier.certifications as string[]).slice(0, 3).join(", ")}`);
      } else if (certScore > 5) {
        reasons.push(`✓ Standard certifications verified`);
      }

      // 4. COUNTRY/LOGISTICS (0-10 points)
      const countryScore = this.calculateCountryScore(supplier, rfq.framework);
      score += countryScore;
      if (countryScore >= 10) {
        reasons.push(`✓ Optimal logistics (${supplier.country})`);
      }

      // 5. PRIORITY BASED ON TIMELINE
      const priority = this.calculatePriority(timeline, score);

      matches.push({
        supplier,
        score: Math.min(score, 100), // Cap at 100
        reasons,
        priority,
      });
    }

    // Sort by score (highest first)
    matches.sort((a, b) => b.score - a.score);

    return matches;
  }

  /**
   * Calculate product compatibility score
   */
  private calculateProductScore(supplier: Supplier, productType: string): number {
    if (!productType) return 15; // Base score if no specific product

    const supplierProducts = (supplier.products as string[]).map(p => p.toLowerCase());
    let score = 0;

    // Exact match keywords
    const keywords = productType.split(/[\s,]+/);

    for (const keyword of keywords) {
      if (keyword.length < 3) continue; // Skip small words

      for (const product of supplierProducts) {
        if (product.includes(keyword)) {
          score += 10;
        }
      }
    }

    // Framework-specific product matching
    if (productType.includes("compostable") || productType.includes("packaging") || productType.includes("bowl")) {
      if (supplierProducts.some(p => p.includes("compostable") || p.includes("packaging") || p.includes("container"))) {
        score += 10;
      }
    }

    if (productType.includes("steel") || productType.includes("metal") || productType.includes("fastener")) {
      if (supplierProducts.some(p => p.includes("steel") || p.includes("metal") || p.includes("fastener") || p.includes("bolt"))) {
        score += 10;
      }
    }

    if (productType.includes("coffee") || productType.includes("cocoa") || productType.includes("wood")) {
      if (supplierProducts.some(p => p.includes("coffee") || p.includes("cocoa") || p.includes("wood") || p.includes("commodit"))) {
        score += 10;
      }
    }

    return Math.min(score, 30); // Cap at 30
  }

  /**
   * Calculate certification score
   */
  private calculateCertificationScore(
    supplier: Supplier,
    framework: string,
    customReqs: string
  ): number {
    const certs = (supplier.certifications as string[]).map(c => c.toLowerCase());
    let score = 0;

    // Framework-specific high-value certifications
    if (framework === "pfas") {
      if (certs.some(c => c.includes("bpi") || c.includes("certified"))) score += 8;
      if (certs.some(c => c.includes("tuv") || c.includes("ok compost"))) score += 7;
      if (certs.some(c => c.includes("astm") || c.includes("d6868"))) score += 5;
    } else if (framework === "buyamerica") {
      if (certs.some(c => c.includes("iatf") || c.includes("16949"))) score += 8;
      if (certs.some(c => c.includes("iso") || c.includes("9001"))) score += 7;
      if (certs.some(c => c.includes("buy america") || c.includes("melted"))) score += 5;
    } else if (framework === "eudr") {
      if (certs.some(c => c.includes("fsc"))) score += 8;
      if (certs.some(c => c.includes("pefc") || c.includes("rainforest"))) score += 7;
      if (certs.some(c => c.includes("gps") || c.includes("verified") || c.includes("satellite"))) score += 5;
    }

    // Custom requirements matching
    if (customReqs) {
      for (const cert of certs) {
        if (customReqs.includes(cert.substring(0, 4))) {
          score += 3;
        }
      }
    }

    return Math.min(score, 20); // Cap at 20
  }

  /**
   * Calculate country/logistics score
   */
  private calculateCountryScore(supplier: Supplier, framework: string): number {
    let score = 0;

    // Buy America MUST be USA
    if (framework === "buyamerica") {
      return supplier.country === "USA" ? 10 : 0;
    }

    // PFAS prefers USA (but allows others)
    if (framework === "pfas") {
      if (supplier.country === "USA") score = 10;
      else if (supplier.country === "Canada") score = 7;
      else score = 5;
    }

    // EUDR prefers EU/Brazil/certified origins
    if (framework === "eudr") {
      if (["Brazil", "Germany", "Netherlands"].includes(supplier.country)) score = 10;
      else score = 6;
    }

    return score;
  }

  /**
   * Calculate priority based on timeline and score
   */
  private calculatePriority(timeline?: string, score?: number): "urgent" | "high" | "medium" | "low" {
    if (timeline === "urgent") return "urgent";
    if (timeline === "1month" && score && score >= 70) return "urgent";
    if (timeline === "1month") return "high";
    if (score && score >= 80) return "high";
    if (timeline === "3months") return "medium";
    return "low";
  }

  /**
   * Extract matched product names
   */
  private extractMatchedProducts(supplier: Supplier, productType: string): string[] {
    const supplierProducts = supplier.products as string[];
    const keywords = productType.toLowerCase().split(/[\s,]+/).filter(k => k.length >= 3);

    const matched: string[] = [];
    for (const product of supplierProducts) {
      for (const keyword of keywords) {
        if (product.toLowerCase().includes(keyword) && !matched.includes(product)) {
          matched.push(product);
        }
      }
    }

    return matched.slice(0, 3); // Return max 3
  }

  /**
   * Get human-readable framework name
   */
  private getFrameworkName(framework: string): string {
    const names: { [key: string]: string } = {
      pfas: "PFAS/EPR",
      buyamerica: "Buy America Act",
      eudr: "EU Deforestation Regulation",
    };
    return names[framework] || framework;
  }
}

// Singleton instance
export const matchingEngine = new MatchingEngine();
