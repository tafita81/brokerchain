/**
 * STRIPE ESCROW SERVICE
 * 
 * Sistema de pagamento em garantia (escrow) para BrokerChain:
 * 1. Buyer paga → fundos ficam em escrow
 * 2. Supplier envia produto → tracking confirmado
 * 3. Buyer confirma recebimento → fundos liberados
 * 4. BrokerChain recebe comissão automaticamente
 * 
 * Usa Stripe Connect + PaymentIntents para escrow flow
 */

import Stripe from 'stripe';

// Initialize Stripe (will use STRIPE_SECRET_KEY from env)
let stripe: Stripe | null = null;

function getStripeClient(): Stripe {
  if (!stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY environment variable not set');
    }
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia',
    });
  }
  return stripe;
}

export interface EscrowPaymentParams {
  contractId: string;
  buyerEmail: string;
  totalAmount: number; // cents
  supplierPayoutAmount: number; // cents
  brokerCommission: number; // cents
  description: string;
}

export interface EscrowPaymentResult {
  paymentIntentId: string;
  clientSecret: string; // For frontend to complete payment
  escrowId: string; // Internal tracking ID
  status: 'requires_payment' | 'escrowed' | 'released' | 'failed';
}

/**
 * CREATE ESCROW PAYMENT
 * 
 * Buyer initiates payment → funds held in escrow
 */
export async function createEscrowPayment(
  params: EscrowPaymentParams
): Promise<EscrowPaymentResult> {
  const stripeClient = getStripeClient();
  
  try {
    // Create Payment Intent with metadata for escrow tracking
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: params.totalAmount,
      currency: 'usd',
      description: params.description,
      receipt_email: params.buyerEmail,
      
      // Escrow metadata (used for release logic)
      metadata: {
        type: 'escrow',
        contractId: params.contractId,
        supplierPayoutAmount: params.supplierPayoutAmount.toString(),
        brokerCommission: params.brokerCommission.toString(),
        escrowStatus: 'pending',
      },
      
      // Capture method: manual (funds held until we capture)
      capture_method: 'manual',
      
      // Require confirmation
      confirm: false,
    });
    
    console.log(`✅ Escrow payment created: ${paymentIntent.id} ($${params.totalAmount / 100})`);
    
    return {
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret!,
      escrowId: `esc_${paymentIntent.id}`,
      status: 'requires_payment',
    };
  } catch (error: any) {
    console.error('❌ Failed to create escrow payment:', error.message);
    throw new Error(`Stripe escrow creation failed: ${error.message}`);
  }
}

/**
 * CAPTURE ESCROW (Move funds from pending to escrow)
 * 
 * Called when buyer completes payment
 */
export async function captureEscrow(paymentIntentId: string): Promise<void> {
  const stripeClient = getStripeClient();
  
  try {
    const paymentIntent = await stripeClient.paymentIntents.capture(paymentIntentId);
    
    console.log(`✅ Escrow captured: ${paymentIntentId} (funds in escrow)`);
    
    // Update metadata
    await stripeClient.paymentIntents.update(paymentIntentId, {
      metadata: {
        ...(paymentIntent.metadata || {}),
        escrowStatus: 'escrowed',
        escrowedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('❌ Failed to capture escrow:', error.message);
    throw new Error(`Stripe escrow capture failed: ${error.message}`);
  }
}

/**
 * RELEASE ESCROW TO SUPPLIER
 * 
 * Called when:
 * - Tracking shows delivery confirmed
 * - Buyer manually approves delivery
 * 
 * Splits payment:
 * - Supplier gets their payout
 * - BrokerChain gets commission
 */
export async function releaseEscrowToSupplier(
  paymentIntentId: string,
  supplierStripeAccountId: string // Supplier's Stripe Connect account
): Promise<void> {
  const stripeClient = getStripeClient();
  
  try {
    // Get payment intent to read metadata
    const paymentIntent = await stripeClient.paymentIntents.retrieve(paymentIntentId);
    
    if (!paymentIntent.metadata) {
      throw new Error('Payment Intent missing escrow metadata');
    }
    
    const supplierAmount = parseInt(paymentIntent.metadata.supplierPayoutAmount);
    const brokerCommission = parseInt(paymentIntent.metadata.brokerCommission);
    
    // Create transfer to supplier
    const transfer = await stripeClient.transfers.create({
      amount: supplierAmount,
      currency: 'usd',
      destination: supplierStripeAccountId,
      description: `Payment for contract ${paymentIntent.metadata.contractId}`,
      metadata: {
        contractId: paymentIntent.metadata.contractId,
        paymentIntentId: paymentIntentId,
      },
    });
    
    console.log(`✅ Escrow released to supplier: $${supplierAmount / 100}`);
    console.log(`💰 BrokerChain commission retained: $${brokerCommission / 100}`);
    
    // Update metadata
    await stripeClient.paymentIntents.update(paymentIntentId, {
      metadata: {
        ...paymentIntent.metadata,
        escrowStatus: 'released',
        releasedAt: new Date().toISOString(),
        transferId: transfer.id,
      },
    });
  } catch (error: any) {
    console.error('❌ Failed to release escrow:', error.message);
    throw new Error(`Stripe escrow release failed: ${error.message}`);
  }
}

/**
 * REFUND ESCROW
 * 
 * Called if:
 * - Supplier can't fulfill order
 * - Product damaged/not as described
 * - Buyer cancels before delivery
 */
export async function refundEscrow(
  paymentIntentId: string,
  reason: string
): Promise<void> {
  const stripeClient = getStripeClient();
  
  try {
    const refund = await stripeClient.refunds.create({
      payment_intent: paymentIntentId,
      reason: 'requested_by_customer',
      metadata: {
        refundReason: reason,
      },
    });
    
    console.log(`✅ Escrow refunded: ${refund.id}`);
    
    // Update metadata
    const paymentIntent = await stripeClient.paymentIntents.retrieve(paymentIntentId);
    await stripeClient.paymentIntents.update(paymentIntentId, {
      metadata: {
        ...(paymentIntent.metadata || {}),
        escrowStatus: 'refunded',
        refundedAt: new Date().toISOString(),
        refundReason: reason,
      },
    });
  } catch (error: any) {
    console.error('❌ Failed to refund escrow:', error.message);
    throw new Error(`Stripe escrow refund failed: ${error.message}`);
  }
}

/**
 * GET ESCROW STATUS
 * 
 * Check current status of escrow payment
 */
export async function getEscrowStatus(paymentIntentId: string): Promise<{
  status: string;
  amount: number;
  escrowStatus: string;
  metadata: any;
}> {
  const stripeClient = getStripeClient();
  
  try {
    const paymentIntent = await stripeClient.paymentIntents.retrieve(paymentIntentId);
    
    return {
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      escrowStatus: paymentIntent.metadata?.escrowStatus || 'unknown',
      metadata: paymentIntent.metadata,
    };
  } catch (error: any) {
    console.error('❌ Failed to get escrow status:', error.message);
    throw new Error(`Stripe escrow status check failed: ${error.message}`);
  }
}

/**
 * WEBHOOK HANDLER
 * 
 * Handle Stripe webhooks for escrow events
 */
export async function handleStripeWebhook(
  rawBody: string,
  signature: string
): Promise<void> {
  const stripeClient = getStripeClient();
  
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error('STRIPE_WEBHOOK_SECRET not configured');
  }
  
  try {
    const event = stripeClient.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('✅ Payment succeeded:', event.data.object.id);
        // Automatically capture escrow when payment succeeds
        await captureEscrow(event.data.object.id);
        break;
        
      case 'payment_intent.payment_failed':
        console.log('❌ Payment failed:', event.data.object.id);
        break;
        
      case 'transfer.created':
        console.log('✅ Transfer created (escrow released):', event.data.object.id);
        break;
        
      default:
        console.log(`ℹ️  Unhandled event type: ${event.type}`);
    }
  } catch (error: any) {
    console.error('❌ Webhook error:', error.message);
    throw new Error(`Webhook processing failed: ${error.message}`);
  }
}

/**
 * EXEMPLO DE USO:
 * 
 * // 1. Criar escrow quando contrato for assinado
 * const escrow = await createEscrowPayment({
 *   contractId: 'contract-001',
 *   buyerEmail: 'buyer@example.com',
 *   totalAmount: 476000, // $4,760.00
 *   supplierPayoutAmount: 418880, // $4,188.80
 *   brokerCommission: 57120, // $571.20 (12%)
 *   description: '50,000 lbs American Steel - Buy America Act Compliant'
 * });
 * 
 * // 2. Buyer completa pagamento no frontend usando clientSecret
 * // (Stripe Elements handle this)
 * 
 * // 3. Webhook captura escrow automaticamente
 * 
 * // 4. Supplier envia produto com tracking
 * // (Tracking confirmado via API ou manual approval)
 * 
 * // 5. Liberar fundos para supplier
 * await releaseEscrowToSupplier(
 *   escrow.paymentIntentId,
 *   'acct_supplier_stripe_id'
 * );
 * 
 * // BrokerChain commission ($571.20) fica automaticamente na conta
 */
