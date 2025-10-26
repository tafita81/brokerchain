/**
 * ═══════════════════════════════════════════════════════════════════
 * BROKERCHAIN PRICING LAW (LEI DE PRECIFICAÇÃO)
 * ═══════════════════════════════════════════════════════════════════
 * 
 * REGRA FUNDAMENTAL:
 * O comprador vê APENAS o preço final por unidade.
 * O comprador NUNCA vê o breakdown de custos.
 * 
 * FÓRMULA:
 * Preço Final = Preço Fornecedor + Frete + Impostos + Taxas + Tarifas + Comissão BrokerChain
 * 
 * CUSTOS OCULTOS DO COMPRADOR:
 * - supplierPricePerUnit: Quanto o fornecedor cobra
 * - shippingCostPerUnit: Custo de frete por unidade
 * - taxesPerUnit: Impostos por unidade
 * - feesPerUnit: Taxas (alfândega, handling, etc.)
 * - tariffsPerUnit: Tarifas de importação
 * - brokerMarginPercent: Comissão BrokerChain (5-15%)
 * 
 * O QUE O COMPRADOR VÊ:
 * - finalPriceToBuyer: Preço final total por unidade
 * 
 * NUNCA mostre o breakdown ao comprador!
 * ═══════════════════════════════════════════════════════════════════
 */

export interface PricingBreakdown {
  // ═══ CUSTOS BASE (OCULTOS DO COMPRADOR) ═══
  supplierPricePerUnit: number; // cents - preço do fornecedor
  shippingCostPerUnit: number; // cents - frete por unidade
  taxesPerUnit: number; // cents - impostos
  feesPerUnit: number; // cents - taxas (alfândega, handling)
  tariffsPerUnit: number; // cents - tarifas de importação
  
  // ═══ MARGEM BROKERCHAIN ═══
  brokerMarginPercent: number; // % - comissão (5-15%)
  
  // ═══ CÁLCULOS INTERMEDIÁRIOS ═══
  subtotalBeforeCommission: number; // cents - soma de todos custos
  brokerCommissionPerUnit: number; // cents - comissão calculada
  
  // ═══ PREÇO FINAL (MOSTRADO AO COMPRADOR) ═══
  finalPriceToBuyer: number; // cents - TOTAL que comprador paga
}

/**
 * ═══════════════════════════════════════════════════════════════════
 * CALCULAR PREÇO FINAL (FUNÇÃO PRINCIPAL)
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Esta função aplica a LEI DE PRECIFICAÇÃO do BrokerChain.
 * 
 * @param supplierPrice - Preço do fornecedor (cents/unidade)
 * @param shipping - Frete (cents/unidade)
 * @param taxes - Impostos (cents/unidade)
 * @param fees - Taxas diversas (cents/unidade)
 * @param tariffs - Tarifas de importação (cents/unidade)
 * @param brokerMargin - Margem BrokerChain em % (padrão: 10%)
 * @returns Breakdown completo com preço final
 */
export function calculateFinalPrice(
  supplierPrice: number,
  shipping: number = 0,
  taxes: number = 0,
  fees: number = 0,
  tariffs: number = 0,
  brokerMargin: number = 10
): PricingBreakdown {
  // Passo 1: Somar TODOS os custos
  const subtotal = supplierPrice + shipping + taxes + fees + tariffs;
  
  // Passo 2: Calcular comissão BrokerChain sobre o subtotal
  const commission = Math.round(subtotal * (brokerMargin / 100));
  
  // Passo 3: Preço final = subtotal + comissão
  const finalPrice = subtotal + commission;
  
  return {
    supplierPricePerUnit: supplierPrice,
    shippingCostPerUnit: shipping,
    taxesPerUnit: taxes,
    feesPerUnit: fees,
    tariffsPerUnit: tariffs,
    brokerMarginPercent: brokerMargin,
    subtotalBeforeCommission: subtotal,
    brokerCommissionPerUnit: commission,
    finalPriceToBuyer: finalPrice,
  };
}

/**
 * ═══════════════════════════════════════════════════════════════════
 * FORMATAR PREÇO PARA EXIBIÇÃO AO COMPRADOR
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Mostra APENAS o preço final, sem breakdown.
 * 
 * @param cents - Preço em centavos
 * @returns String formatada (ex: "$10.75")
 */
export function formatPriceForBuyer(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/**
 * ═══════════════════════════════════════════════════════════════════
 * CALCULAR VALOR TOTAL DO CONTRATO
 * ═══════════════════════════════════════════════════════════════════
 * 
 * @param pricePerUnit - Preço final por unidade (cents)
 * @param quantity - Quantidade de unidades
 * @returns Valor total em cents
 */
export function calculateContractTotal(pricePerUnit: number, quantity: number): number {
  return pricePerUnit * quantity;
}

/**
 * ═══════════════════════════════════════════════════════════════════
 * APLICAR DESCONTO DE SURPLUS
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Fornecedores SURPLUS oferecem 30-50% de desconto no preço base.
 * 
 * @param originalPrice - Preço original (cents)
 * @param discountPercent - Desconto % (30-50)
 * @returns Preço com desconto (cents)
 */
export function applySurplusDiscount(originalPrice: number, discountPercent: number): number {
  return Math.round(originalPrice * (1 - discountPercent / 100));
}

/**
 * ═══════════════════════════════════════════════════════════════════
 * CALCULAR BREAKDOWN PARA FORNECEDOR SURPLUS
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Surplus tem desconto aplicado no preço base antes dos outros custos.
 * 
 * @param newSupplierPrice - Preço de fornecedor NEW (cents/unidade)
 * @param surplusDiscountPercent - Desconto surplus (30-50%)
 * @param shipping - Frete (cents/unidade)
 * @param taxes - Impostos (cents/unidade)
 * @param fees - Taxas (cents/unidade)
 * @param tariffs - Tarifas (cents/unidade)
 * @param brokerMargin - Margem % (padrão: 15% para surplus)
 * @returns Breakdown completo
 */
export function calculateSurplusFinalPrice(
  newSupplierPrice: number,
  surplusDiscountPercent: number,
  shipping: number = 0,
  taxes: number = 0,
  fees: number = 0,
  tariffs: number = 0,
  brokerMargin: number = 15 // Margem maior para surplus
): PricingBreakdown {
  // Aplicar desconto surplus no preço base
  const discountedSupplierPrice = applySurplusDiscount(newSupplierPrice, surplusDiscountPercent);
  
  // Calcular preço final com o preço com desconto
  return calculateFinalPrice(
    discountedSupplierPrice,
    shipping,
    taxes,
    fees,
    tariffs,
    brokerMargin
  );
}

/**
 * ═══════════════════════════════════════════════════════════════════
 * EXEMPLO DE USO
 * ═══════════════════════════════════════════════════════════════════
 * 
 * // Cotação NEW:
 * const newQuote = calculateFinalPrice(
 *   850,  // $8.50/lb supplier price
 *   50,   // $0.50/lb shipping
 *   35,   // $0.35/lb taxes
 *   25,   // $0.25/lb fees (customs + handling)
 *   15,   // $0.15/lb tariffs
 *   12    // 12% broker commission
 * );
 * 
 * console.log(formatPriceForBuyer(newQuote.finalPriceToBuyer));
 * // Output: "$10.89" (ISSO É O QUE O COMPRADOR VÊ)
 * 
 * // Breakdown completo (INTERNO - NUNCA MOSTRAR AO COMPRADOR):
 * // {
 * //   supplierPricePerUnit: 850,        // $8.50
 * //   shippingCostPerUnit: 50,          // $0.50
 * //   taxesPerUnit: 35,                 // $0.35
 * //   feesPerUnit: 25,                  // $0.25
 * //   tariffsPerUnit: 15,               // $0.15
 * //   subtotalBeforeCommission: 975,    // $9.75
 * //   brokerMarginPercent: 12,
 * //   brokerCommissionPerUnit: 117,     // $1.17 (12% de $9.75)
 * //   finalPriceToBuyer: 1092           // $10.92
 * // }
 * 
 * // Cotação SURPLUS (50% desconto):
 * const surplusQuote = calculateSurplusFinalPrice(
 *   850,  // $8.50/lb base (antes do desconto)
 *   50,   // 50% discount
 *   50,   // $0.50/lb shipping
 *   35,   // $0.35/lb taxes
 *   25,   // $0.25/lb fees
 *   15,   // $0.15/lb tariffs
 *   15    // 15% broker margin (maior para surplus)
 * );
 * 
 * console.log(formatPriceForBuyer(surplusQuote.finalPriceToBuyer));
 * // Output: "$6.09" (50% mais barato!)
 * ═══════════════════════════════════════════════════════════════════
 */
