# 💰 REGRAS OFICIAIS DE PRICING - BROKERCHAIN

## 🎯 PRINCÍPIO FUNDAMENTAL

**ZERO PREJUÍZO - SÓ FECHAMOS NEGÓCIOS LUCRATIVOS**

---

## 📊 ESTRUTURA DE RESPOSTA AO COMPRADOR

Cada resposta automática por email inclui **6 OPÇÕES**:

### **PRODUTOS NOVOS (3 opções)**
1. Fornecedor A - Novo
2. Fornecedor B - Novo  
3. Fornecedor C - Novo

### **SURPLUS/OVERSTOCK (3 opções - 30-50% mais barato)**
4. Fornecedor A - Surplus
5. Fornecedor B - Overstock
6. Fornecedor C - Grade B

---

## 💵 BREAKDOWN OBRIGATÓRIO DE PREÇOS

**CADA OPÇÃO DEVE INCLUIR:**

```
OPÇÃO 1: Vegware - Compostable Bowls (NOVO)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Quantidade: 100,000 unidades

DETALHAMENTO DE CUSTOS:
├─ Preço Unitário: $0.25
├─ Subtotal Produto: $25,000.00
├─ Frete (FOB California): $1,200.00
├─ Impostos (IPI + ICMS): $3,500.00
├─ Taxas Alfandegárias: $800.00
├─ Seguro Transporte: $450.00
├─ Certificação/Inspeção: $250.00
├─ Handling Fee: $300.00
└─ TOTAL CUSTOS: $31,500.00

COMISSÃO BROKERCHAIN: 8% = $2,520.00
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 PREÇO FINAL PARA COMPRADOR: $34,020.00

✅ MARGEM LÍQUIDA: $2,520.00 (viável)
📦 Prazo de Entrega: 7 dias
🏆 Certificações: BPI, ASTM D6868, PFAS-Free
```

---

## 🚨 VALIDAÇÃO AUTOMÁTICA DE VIABILIDADE

### **ANTES DE ENVIAR OPÇÃO AO COMPRADOR:**

```typescript
function validateDealViability(quote) {
  // 1. Calcular todos custos
  const productCost = quote.unitPrice * quote.quantity;
  const shipping = quote.shipping;
  const taxes = quote.taxes;
  const fees = quote.fees;
  const totalCost = productCost + shipping + taxes + fees;

  // 2. Calcular comissão desejada (configurável 5-15%)
  const commissionRate = quote.commissionRate || 0.08; // Default 8%
  const commissionAmount = totalCost * commissionRate;

  // 3. Preço final para comprador
  const finalPrice = totalCost + commissionAmount;

  // 4. VALIDAÇÃO: Tem margem mínima?
  const minimumMargin = totalCost * 0.05; // Mínimo 5%
  
  if (commissionAmount < minimumMargin) {
    return {
      viable: false,
      reason: "Margem insuficiente - descartado",
      commission: commissionAmount,
      minimum: minimumMargin
    };
  }

  return {
    viable: true,
    totalCost,
    commissionAmount,
    finalPrice,
    marginPercent: commissionRate * 100
  };
}
```

### **REGRAS DE DESCARTE:**

❌ **DESCARTA FORNECEDOR SE:**
1. Margem < 5% do total
2. Comissão < $500 (mínimo absoluto)
3. Custos ocultos descobertos depois
4. Fornecedor não detalha todos custos

✅ **ACEITA FORNECEDOR SE:**
1. Margem ≥ 5% garantida
2. Todos custos transparentes
3. Comissão clara no breakdown
4. Prazo de pagamento viável

---

## 📧 FORMATO DO EMAIL AUTOMÁTICO AO COMPRADOR

```
Subject: 6 Opções Certificadas para [Produto] - Preços Completos Detalhados

Olá [Comprador],

Encontramos 6 fornecedores certificados para seu RFQ:
- 3 opções de produtos NOVOS
- 3 opções SURPLUS/OVERSTOCK (30-50% economia)

Todos os preços abaixo incluem:
✓ Frete completo
✓ Impostos
✓ Taxas
✓ Seguro
✓ Comissão BrokerChain (transparente)

═══════════════════════════════════════
OPÇÃO 1: [Fornecedor] - NOVO
═══════════════════════════════════════
[Breakdown completo conforme acima]

═══════════════════════════════════════
OPÇÃO 2: [Fornecedor] - NOVO
═══════════════════════════════════════
[Breakdown completo]

... (repetir para todas 6 opções)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 RECOMENDAÇÃO: Opção 4 (Surplus) oferece melhor custo-benefício
Economia de $12,000 vs. opção nova, mesma certificação

Para fechar negócio, responda este email com:
- Opção escolhida (1-6)
- PO Number (se aplicável)

Prazo: Esta cotação é válida por 7 dias.

Atenciosamente,
BrokerChain AI
contact@brokerchain.business
```

---

## 💼 CONFIGURAÇÕES DE MARGEM

### **MARGENS POR FRAMEWORK:**

```typescript
const commissionConfig = {
  pfas: {
    minimum: 0.05,  // 5% mínimo
    target: 0.08,   // 8% ideal
    maximum: 0.15   // 15% máximo
  },
  buyamerica: {
    minimum: 0.07,  // 7% mínimo (mais compliance)
    target: 0.10,   // 10% ideal
    maximum: 0.15   // 15% máximo
  },
  eudr: {
    minimum: 0.08,  // 8% mínimo (mais complexo)
    target: 0.12,   // 12% ideal
    maximum: 0.15   // 15% máximo
  }
};
```

### **MARGENS POR URGÊNCIA:**

```typescript
const urgencyMultiplier = {
  urgent: 1.5,      // 50% a mais em casos urgentes
  "1month": 1.2,    // 20% a mais
  "3months": 1.0,   // Normal
  "6months": 0.9,   // 10% desconto (pode esperar)
  planning: 0.8     // 20% desconto (sem pressa)
};
```

---

## 🔒 PROTEÇÃO CONTRA PREJUÍZO

### **CHECKLIST PRÉ-ENVIO:**

Antes de enviar qualquer opção ao comprador:

- [ ] Todos custos detalhados pelo fornecedor?
- [ ] Frete calculado e confirmado?
- [ ] Impostos verificados?
- [ ] Taxas alfandegárias incluídas?
- [ ] Margem mínima garantida (≥5%)?
- [ ] Comissão BrokerChain clara?
- [ ] Prazo de validade definido?
- [ ] Termos de pagamento viáveis?

**SE ALGUM ITEM = NÃO → DESCARTA FORNECEDOR**

---

## 📈 EXEMPLO REAL - CASO DE USO

### **RFQ RECEBIDO:**
- Produto: 50,000 bowls PFAS-free
- Timeline: 1 month
- Framework: PFAS

### **FORNECEDOR A (NOVO) - ACEITO ✅**
```
Produto: $12,500 ($0.25/un)
Frete: $800
Impostos: $1,750
Taxas: $400
Seguro: $200
━━━━━━━━━━━━━━━━
Subtotal: $15,650
Comissão 8%: $1,252
━━━━━━━━━━━━━━━━
TOTAL: $16,902
Margem: $1,252 (8% ✅ > 5% mínimo)
```

### **FORNECEDOR B (SURPLUS) - ACEITO ✅**
```
Produto: $7,500 ($0.15/un - 40% off)
Frete: $900 (mais longe)
Impostos: $1,050
Taxas: $300
Seguro: $150
━━━━━━━━━━━━━━━━
Subtotal: $9,900
Comissão 10%: $990
━━━━━━━━━━━━━━━━
TOTAL: $10,890
Margem: $990 (10% ✅ > 5% mínimo)
ECONOMIA vs. Novo: $6,012
```

### **FORNECEDOR C - REJEITADO ❌**
```
Produto: $10,000
Frete: $1,500
Impostos: $1,400
Taxas: $600
Seguro: $300
━━━━━━━━━━━━━━━━
Subtotal: $13,800
Comissão 4%: $552
━━━━━━━━━━━━━━━━
Margem: $552 (4% ❌ < 5% mínimo)

❌ DESCARTADO: Margem insuficiente
```

---

## 🎯 RESULTADO FINAL

**EMAIL ENVIADO COM 5 OPÇÕES** (Fornecedor C descartado automaticamente)
- 3 novas
- 2 surplus

**COMPRADOR ESCOLHE:** Opção Surplus do Fornecedor B
**ECONOMIA:** $6,012
**COMISSÃO BROKERCHAIN:** $990 (10%)

**✅ NEGÓCIO FECHADO SEM RISCO DE PREJUÍZO**

---

## 📊 DASHBOARD METRICS

Rastrear sempre:
- Taxa de descarte (% fornecedores rejeitados por margem baixa)
- Margem média por framework
- Conversão: Novo vs. Surplus
- Tempo médio de resposta

---

**ÚLTIMA ATUALIZAÇÃO:** October 26, 2025
**DESENVOLVEDOR:** Replit Agent
