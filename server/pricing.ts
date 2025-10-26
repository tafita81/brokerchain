/**
 * BROKERCHAIN PRICING ENGINE
 * 
 * Calcula preços totais com transparência completa e valida viabilidade
 * de margem antes de apresentar opção ao comprador.
 */

export interface SupplierQuote {
  supplierId: string;
  supplierName: string;
  productType: "new" | "surplus" | "overstock" | "gradeB";
  
  // Breakdown de custos
  unitPrice: number;
  quantity: number;
  shipping: number;
  taxes: number;
  customsFees: number;
  insurance: number;
  certificationFees: number;
  handlingFees: number;
  
  // Metadata
  leadTime: string; // "7 days", "2 weeks", etc
  certifications: string[];
  framework: "pfas" | "buyamerica" | "eudr";
  
  // Configuração de margem
  commissionRate?: number; // 0.05 to 0.15 (5% to 15%)
}

export interface PricingBreakdown {
  // Custos
  productCost: number;
  shippingCost: number;
  taxesCost: number;
  feesCost: number;
  totalCost: number;
  
  // Comissão
  commissionRate: number;
  commissionAmount: number;
  
  // Final
  finalPrice: number;
  
  // Validação
  viable: boolean;
  marginPercent: number;
  reason?: string;
}

export class PricingEngine {
  private readonly MINIMUM_COMMISSION_RATE = 0.05; // 5%
  private readonly MINIMUM_ABSOLUTE_COMMISSION = 500; // $500
  
  private readonly FRAMEWORK_RATES = {
    pfas: { min: 0.05, target: 0.08, max: 0.15 },
    buyamerica: { min: 0.07, target: 0.10, max: 0.15 },
    eudr: { min: 0.08, target: 0.12, max: 0.15 },
  };
  
  private readonly URGENCY_MULTIPLIERS = {
    urgent: 1.5,
    "1month": 1.2,
    "3months": 1.0,
    "6months": 0.9,
    planning: 0.8,
  };

  /**
   * Calcula breakdown completo de pricing e valida viabilidade
   */
  calculatePricing(quote: SupplierQuote, urgency?: string): PricingBreakdown {
    // 1. Calcular todos os custos
    const productCost = quote.unitPrice * quote.quantity;
    const shippingCost = quote.shipping;
    const taxesCost = quote.taxes;
    const feesCost = 
      quote.customsFees + 
      quote.insurance + 
      quote.certificationFees + 
      quote.handlingFees;
    
    const totalCost = productCost + shippingCost + taxesCost + feesCost;

    // 2. Determinar commission rate
    let commissionRate = quote.commissionRate || this.FRAMEWORK_RATES[quote.framework].target;
    
    // Ajustar por urgência
    if (urgency && this.URGENCY_MULTIPLIERS[urgency as keyof typeof this.URGENCY_MULTIPLIERS]) {
      const multiplier = this.URGENCY_MULTIPLIERS[urgency as keyof typeof this.URGENCY_MULTIPLIERS];
      commissionRate = Math.min(
        commissionRate * multiplier,
        this.FRAMEWORK_RATES[quote.framework].max
      );
    }

    // 3. Calcular comissão
    const commissionAmount = totalCost * commissionRate;

    // 4. Preço final para comprador
    const finalPrice = totalCost + commissionAmount;

    // 5. VALIDAR VIABILIDADE
    const minimumMargin = totalCost * this.MINIMUM_COMMISSION_RATE;
    const marginPercent = (commissionAmount / totalCost) * 100;

    // Verificações de viabilidade
    if (commissionAmount < minimumMargin) {
      return {
        productCost,
        shippingCost,
        taxesCost,
        feesCost,
        totalCost,
        commissionRate,
        commissionAmount,
        finalPrice,
        viable: false,
        marginPercent,
        reason: `Margem insuficiente: ${marginPercent.toFixed(1)}% < ${this.MINIMUM_COMMISSION_RATE * 100}% mínimo`,
      };
    }

    if (commissionAmount < this.MINIMUM_ABSOLUTE_COMMISSION) {
      return {
        productCost,
        shippingCost,
        taxesCost,
        feesCost,
        totalCost,
        commissionRate,
        commissionAmount,
        finalPrice,
        viable: false,
        marginPercent,
        reason: `Comissão muito baixa: $${commissionAmount.toFixed(2)} < $${this.MINIMUM_ABSOLUTE_COMMISSION} mínimo`,
      };
    }

    // ✅ VIÁVEL
    return {
      productCost,
      shippingCost,
      taxesCost,
      feesCost,
      totalCost,
      commissionRate,
      commissionAmount,
      finalPrice,
      viable: true,
      marginPercent,
    };
  }

  /**
   * Formata breakdown para exibição em email
   */
  formatBreakdownForEmail(
    supplierName: string,
    productType: string,
    quote: SupplierQuote,
    breakdown: PricingBreakdown
  ): string {
    const typeLabel = productType === "new" ? "NOVO" : "SURPLUS/OVERSTOCK";
    
    return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OPÇÃO: ${supplierName} - ${typeLabel}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Quantidade: ${quote.quantity.toLocaleString()} unidades

DETALHAMENTO DE CUSTOS:
├─ Preço Unitário: $${quote.unitPrice.toFixed(2)}
├─ Subtotal Produto: $${breakdown.productCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
├─ Frete: $${breakdown.shippingCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
├─ Impostos: $${breakdown.taxesCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
├─ Taxas (Alfândega + Seguro + Handling): $${breakdown.feesCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
└─ TOTAL CUSTOS: $${breakdown.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}

COMISSÃO BROKERCHAIN: ${(breakdown.commissionRate * 100).toFixed(1)}% = $${breakdown.commissionAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 PREÇO FINAL PARA COMPRADOR: $${breakdown.finalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}

✅ MARGEM LÍQUIDA: $${breakdown.commissionAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} (${breakdown.marginPercent.toFixed(1)}%)
📦 Prazo de Entrega: ${quote.leadTime}
🏆 Certificações: ${quote.certifications.join(", ")}
`;
  }

  /**
   * Filtra e ranqueia quotes por viabilidade e valor
   */
  filterViableQuotes(
    quotes: Array<{ quote: SupplierQuote; breakdown: PricingBreakdown }>
  ): Array<{ quote: SupplierQuote; breakdown: PricingBreakdown }> {
    return quotes
      .filter(q => q.breakdown.viable)
      .sort((a, b) => {
        // Priorizar por margem absoluta (mais lucro para BrokerChain)
        return b.breakdown.commissionAmount - a.breakdown.commissionAmount;
      });
  }

  /**
   * Separa quotes em NEW vs SURPLUS
   */
  categorizeQuotes(
    quotes: Array<{ quote: SupplierQuote; breakdown: PricingBreakdown }>
  ): {
    new: Array<{ quote: SupplierQuote; breakdown: PricingBreakdown }>;
    surplus: Array<{ quote: SupplierQuote; breakdown: PricingBreakdown }>;
  } {
    const newQuotes: Array<{ quote: SupplierQuote; breakdown: PricingBreakdown }> = [];
    const surplusQuotes: Array<{ quote: SupplierQuote; breakdown: PricingBreakdown }> = [];

    for (const q of quotes) {
      if (q.quote.productType === "new") {
        newQuotes.push(q);
      } else {
        surplusQuotes.push(q);
      }
    }

    return { new: newQuotes, surplus: surplusQuotes };
  }
}

// Singleton instance
export const pricingEngine = new PricingEngine();
