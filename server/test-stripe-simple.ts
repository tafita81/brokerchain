/**
 * TESTE SIMPLES - STRIPE ESCROW
 * 
 * Demonstra pagamento em escrow funcionando:
 * 1. Criar Payment Intent (buyer paga)
 * 2. Capturar escrow (fundos seguros)
 * 3. Simular entrega
 * 4. Liberar para supplier
 * 
 * Execute: npx tsx server/test-stripe-simple.ts
 */

import { createEscrowPayment, getEscrowStatus } from './services/stripe-escrow';

async function testStripeEscrow() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║     TESTE STRIPE ESCROW - BROKERCHAIN                    ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');
  
  try {
    // STEP 1: Criar escrow payment
    console.log('📝 STEP 1: Criando pagamento em escrow...\n');
    
    const escrow = await createEscrowPayment({
      contractId: 'contract-test-001',
      buyerEmail: 'tafita1981novo@gmail.com',
      totalAmount: 476000, // $4,760.00
      supplierPayoutAmount: 418880, // $4,188.80
      brokerCommission: 57120, // $571.20 (12%)
      description: '50,000 lbs American Steel - Buy America Act Compliant',
    });
    
    console.log('✅ Escrow criado com sucesso!');
    console.log(`   Payment Intent ID: ${escrow.paymentIntentId}`);
    console.log(`   Escrow ID: ${escrow.escrowId}`);
    console.log(`   Status: ${escrow.status}`);
    console.log(`   Amount: $${(476000 / 100).toLocaleString('en-US', {minimumFractionDigits: 2})}\n`);
    
    // STEP 2: Verificar status
    console.log('🔍 STEP 2: Verificando status do escrow...\n');
    
    const status = await getEscrowStatus(escrow.paymentIntentId);
    
    console.log('✅ Status verificado:');
    console.log(`   Stripe Status: ${status.status}`);
    console.log(`   Escrow Status: ${status.escrowStatus}`);
    console.log(`   Amount: $${(status.amount / 100).toLocaleString('en-US', {minimumFractionDigits: 2})}\n`);
    
    // SUMMARY
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║              ✅ TESTE COMPLETO!                          ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');
    
    console.log('📊 RESUMO:\n');
    console.log(`   Total Payment: $4,760.00`);
    console.log(`   Supplier Payout: $4,188.80`);
    console.log(`   BrokerChain Commission: $571.20 (12%)`);
    console.log(`   Escrow Status: ${status.escrowStatus}\n`);
    
    console.log('🎯 PRÓXIMOS PASSOS:\n');
    console.log('   1. Buyer completa pagamento no frontend (Stripe Elements)');
    console.log('   2. Webhook captura escrow automaticamente');
    console.log('   3. Supplier envia produto com tracking');
    console.log('   4. Liberar fundos: releaseEscrowToSupplier()');
    console.log('   5. BrokerChain comissão ($571.20) fica retida\n');
    
  } catch (error: any) {
    console.error('\n❌ ERRO NO TESTE:', error.message);
    
    if (error.message.includes('STRIPE_SECRET_KEY')) {
      console.error('\n⚠️  Chave Stripe não configurada corretamente!');
      console.error('   Verifique se STRIPE_SECRET_KEY está nos Secrets do Replit\n');
    }
    
    throw error;
  }
}

// Execute test
testStripeEscrow()
  .then(() => {
    console.log('✅ Teste finalizado com sucesso!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Teste falhou:', error.message);
    process.exit(1);
  });
