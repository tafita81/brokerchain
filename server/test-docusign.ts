/**
 * TESTE DOCUSIGN - CONTRATOS DIGITAIS
 * 
 * Testa criação de contrato 3-party:
 * - Buyer (DoD)
 * - Supplier (American Steel Corp)
 * - Broker (BrokerChain)
 * 
 * Execute: npx tsx server/test-docusign.ts
 */

import { create3PartyContract, getContractStatus, type ContractParty, type ContractTerms } from './services/docusign-contracts';

async function testDocuSign() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║     TESTE DOCUSIGN - CONTRATOS DIGITAIS                  ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');
  
  try {
    // STEP 1: Criar contrato 3-party
    console.log('📝 STEP 1: Criando contrato digital 3-party...\n');
    
    const buyer: ContractParty = {
      name: 'John Smith',
      email: 'tafita1981novo@gmail.com',
      role: 'buyer',
      company: 'Department of Defense',
    };
    
    const supplier: ContractParty = {
      name: 'Michael Johnson',
      email: 'tafita81@gmail.com',
      role: 'supplier',
      company: 'American Steel Corporation',
    };
    
    const broker: ContractParty = {
      name: 'BrokerChain Team',
      email: 'contact@brokerchain.business',
      role: 'broker',
      company: 'BrokerChain LLC',
    };
    
    const terms: ContractTerms = {
      rfqId: 'rfq-test-001',
      productName: '50,000 lbs American Steel Plates - Buy America Act Compliant',
      framework: 'buyamerica',
      quantity: 50000,
      unitPrice: 800, // $8.00 per lb (in cents)
      totalAmount: 400000, // $4,000.00
      supplierPayoutAmount: 352000, // $3,520.00
      brokerCommission: 48000, // $480.00 (12%)
      paymentTerms: 'Escrow via Stripe - Release upon delivery confirmation',
      deliveryTerms: 'FOB Pittsburgh, PA - 30 days from contract signing',
      specifications: '100% USA manufactured, IATF 16949 certified, metallurgical traceability required',
      leadTime: '30 days',
    };
    
    const contract = await create3PartyContract(buyer, supplier, broker, terms);
    
    console.log('✅ Contrato criado com sucesso!\n');
    console.log(`   Envelope ID: ${contract.envelopeId}`);
    console.log(`   Status: ${contract.status}\n`);
    
    if (contract.signingUrls) {
      console.log('📧 URLs de Assinatura:\n');
      console.log(`   👤 Buyer (DoD): ${contract.signingUrls.buyer}`);
      console.log(`   🏭 Supplier (American Steel): ${contract.signingUrls.supplier}`);
      console.log(`   🤝 Broker (BrokerChain): ${contract.signingUrls.broker}\n`);
    }
    
    // STEP 2: Verificar status
    console.log('🔍 STEP 2: Verificando status do contrato...\n');
    
    const status = await getContractStatus(contract.envelopeId);
    
    console.log('✅ Status verificado:');
    console.log(`   Status: ${status.status}`);
    console.log(`   Buyer assinado: ${status.signed.buyer ? '✅' : '❌'}`);
    console.log(`   Supplier assinado: ${status.signed.supplier ? '✅' : '❌'}`);
    console.log(`   Broker assinado: ${status.signed.broker ? '✅' : '❌'}\n`);
    
    if (status.completedAt) {
      console.log(`   Concluído em: ${status.completedAt.toLocaleString()}\n`);
    }
    
    // SUMMARY
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║              ✅ TESTE COMPLETO!                          ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');
    
    console.log('📊 RESUMO DO CONTRATO:\n');
    console.log(`   Produto: 50,000 lbs American Steel Plates`);
    console.log(`   Framework: Buy America Act`);
    console.log(`   Valor Total: $4,000.00`);
    console.log(`   Supplier Payout: $3,520.00`);
    console.log(`   Comissão BrokerChain: $480.00 (12%)`);
    console.log(`   Prazo de Entrega: 30 dias\n`);
    
    console.log('🎯 PRÓXIMOS PASSOS:\n');
    console.log('   1. Cada parte acessa seu link de assinatura');
    console.log('   2. Assinam digitalmente (ordem: Buyer → Supplier → Broker)');
    console.log('   3. DocuSign envia cópia assinada para todos');
    console.log('   4. Contrato fica armazenado na nuvem DocuSign\n');
    
    if (contract.signingUrls) {
      console.log('📎 LINKS IMPORTANTES:\n');
      console.log(`   Buyer: ${contract.signingUrls.buyer}`);
      console.log(`   Supplier: ${contract.signingUrls.supplier}`);
      console.log(`   Broker: ${contract.signingUrls.broker}\n`);
    }
    
  } catch (error: any) {
    console.error('\n❌ ERRO NO TESTE:', error.message);
    
    if (error.message.includes('DOCUSIGN')) {
      console.error('\n⚠️  Credenciais DocuSign não configuradas corretamente!');
      console.error('   Verifique:\n');
      console.error('   - DOCUSIGN_INTEGRATION_KEY');
      console.error('   - DOCUSIGN_USER_ID');
      console.error('   - DOCUSIGN_ACCOUNT_ID\n');
    }
    
    throw error;
  }
}

// Execute test
testDocuSign()
  .then(() => {
    console.log('✅ Teste finalizado com sucesso!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Teste falhou:', error.message);
    process.exit(1);
  });
