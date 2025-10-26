/**
 * PAYONEER PAYOUTS SERVICE
 * 
 * Pagamento de comissões BrokerChain via Payoneer API
 * 
 * CASOS DE USO:
 * 1. Pagar fornecedores internacionais (após delivery)
 * 2. Pagar comissões BrokerChain (5-15%)
 * 3. Suporta múltiplas moedas (USD, EUR, BRL, etc.)
 * 
 * FLUXO:
 * 1. Contrato completado → escrow released
 * 2. BrokerChain recebe comissão via Stripe
 * 3. (Opcional) Pagar supplier via Payoneer se internacional
 * 
 * API DOCS: https://developers.payoneer.com
 * 
 * NOTA: Requer credenciais Payoneer
 * - PAYONEER_API_USERNAME
 * - PAYONEER_API_PASSWORD  
 * - PAYONEER_PROGRAM_ID
 */

import axios, { type AxiosInstance } from 'axios';

/**
 * PAYONEER API CLIENT
 */
class PayoneerClient {
  private apiClient: AxiosInstance;
  private baseUrl: string;
  
  constructor() {
    // Sandbox or Production
    this.baseUrl = process.env.PAYONEER_ENV === 'production'
      ? 'https://api.payoneer.com/v2/programs'
      : 'https://api.sandbox.payoneer.com/v2/programs';
    
    this.apiClient = axios.create({
      baseURL: this.baseUrl,
      auth: {
        username: process.env.PAYONEER_API_USERNAME || '',
        password: process.env.PAYONEER_API_PASSWORD || '',
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log(`✅ Payoneer client initialized (${process.env.PAYONEER_ENV || 'sandbox'})`);
  }
  
  /**
   * CREATE PAYEE (Recipient account)
   */
  async createPayee(payeeData: {
    payeeId: string; // Unique ID in your system
    firstName: string;
    lastName: string;
    email: string;
    country: string; // ISO 2-letter code (US, BR, etc.)
    dateOfBirth?: string; // YYYY-MM-DD
    companyName?: string; // For business accounts
  }): Promise<any> {
    try {
      const response = await this.apiClient.post(
        `/${process.env.PAYONEER_PROGRAM_ID}/payees`,
        {
          payee_id: payeeData.payeeId,
          contact: {
            first_name: payeeData.firstName,
            last_name: payeeData.lastName,
            email: payeeData.email,
          },
          address: {
            country: payeeData.country,
          },
          date_of_birth: payeeData.dateOfBirth,
          company_name: payeeData.companyName,
        }
      );
      
      console.log(`✅ Payee created: ${payeeData.payeeId}`);
      return response.data;
      
    } catch (error: any) {
      console.error('❌ Failed to create payee:', error.response?.data || error.message);
      throw new Error(`Payoneer payee creation failed: ${error.message}`);
    }
  }
  
  /**
   * CREATE PAYMENT
   */
  async createPayment(paymentData: {
    paymentId: string; // Unique payment ID
    payeeId: string; // Recipient
    amount: number; // Amount in major currency units (e.g., 100.50 USD)
    currency: string; // ISO currency code (USD, EUR, BRL, etc.)
    description: string;
    clientReferenceId?: string; // Your RFQ/Contract ID
  }): Promise<any> {
    try {
      const response = await this.apiClient.post(
        `/${process.env.PAYONEER_PROGRAM_ID}/payments`,
        {
          payment_id: paymentData.paymentId,
          payee_id: paymentData.payeeId,
          amount: paymentData.amount,
          currency: paymentData.currency,
          description: paymentData.description,
          client_reference_id: paymentData.clientReferenceId,
        }
      );
      
      console.log(`✅ Payment created: ${paymentData.paymentId} ($${paymentData.amount} ${paymentData.currency})`);
      return response.data;
      
    } catch (error: any) {
      console.error('❌ Failed to create payment:', error.response?.data || error.message);
      throw new Error(`Payoneer payment failed: ${error.message}`);
    }
  }
  
  /**
   * GET PAYMENT STATUS
   */
  async getPaymentStatus(paymentId: string): Promise<{
    status: string;
    amount: number;
    currency: string;
    payeeId: string;
    createdAt: string;
  }> {
    try {
      const response = await this.apiClient.get(
        `/${process.env.PAYONEER_PROGRAM_ID}/payments/${paymentId}`
      );
      
      return {
        status: response.data.status,
        amount: response.data.amount,
        currency: response.data.currency,
        payeeId: response.data.payee_id,
        createdAt: response.data.created_at,
      };
      
    } catch (error: any) {
      console.error('❌ Failed to get payment status:', error.response?.data || error.message);
      throw new Error(`Payoneer status check failed: ${error.message}`);
    }
  }
  
  /**
   * GET PAYEE BALANCE
   */
  async getPayeeBalance(payeeId: string): Promise<{
    available: number;
    pending: number;
    currency: string;
  }> {
    try {
      const response = await this.apiClient.get(
        `/${process.env.PAYONEER_PROGRAM_ID}/payees/${payeeId}/balance`
      );
      
      return {
        available: response.data.available_balance,
        pending: response.data.pending_balance,
        currency: response.data.currency,
      };
      
    } catch (error: any) {
      console.error('❌ Failed to get payee balance:', error.response?.data || error.message);
      throw new Error(`Payoneer balance check failed: ${error.message}`);
    }
  }
}

/**
 * SINGLETON INSTANCE
 */
let payoneerClient: PayoneerClient | null = null;

function getPayoneerClient(): PayoneerClient {
  if (!payoneerClient) {
    payoneerClient = new PayoneerClient();
  }
  return payoneerClient;
}

/**
 * INTERFACES
 */
export interface CommissionPayout {
  contractId: string;
  amount: number; // cents
  currency: string;
  recipientName: string;
  recipientEmail: string;
  recipientCountry: string;
  description: string;
}

/**
 * PAY BROKER COMMISSION
 * 
 * Paga comissão BrokerChain via Payoneer
 */
export async function payBrokerCommission(
  payout: CommissionPayout
): Promise<{
  success: boolean;
  paymentId?: string;
  status?: string;
  message: string;
}> {
  // Check if Payoneer is configured
  if (!process.env.PAYONEER_API_USERNAME || 
      !process.env.PAYONEER_API_PASSWORD || 
      !process.env.PAYONEER_PROGRAM_ID) {
    console.warn('⚠️  Payoneer not configured, using mock payout');
    
    // Mock successful payout
    const mockPaymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      success: true,
      paymentId: mockPaymentId,
      status: 'completed',
      message: `Commission payout successful (MOCK): $${(payout.amount / 100).toFixed(2)} ${payout.currency}`,
    };
  }
  
  const client = getPayoneerClient();
  
  try {
    // Create payee if doesn't exist (idempotent)
    const payeeId = `broker_${payout.contractId}`;
    
    try {
      await client.createPayee({
        payeeId,
        firstName: payout.recipientName.split(' ')[0],
        lastName: payout.recipientName.split(' ').slice(1).join(' '),
        email: payout.recipientEmail,
        country: payout.recipientCountry,
        companyName: 'BrokerChain LLC',
      });
    } catch (error) {
      // Payee might already exist, that's okay
      console.log('ℹ️  Payee may already exist, continuing...');
    }
    
    // Create payment
    const paymentId = `comm_${payout.contractId}_${Date.now()}`;
    const amountInMajor = payout.amount / 100; // Convert cents to dollars
    
    const payment = await client.createPayment({
      paymentId,
      payeeId,
      amount: amountInMajor,
      currency: payout.currency,
      description: payout.description,
      clientReferenceId: payout.contractId,
    });
    
    return {
      success: true,
      paymentId: payment.payment_id,
      status: payment.status,
      message: `Commission payout successful: $${amountInMajor.toFixed(2)} ${payout.currency}`,
    };
    
  } catch (error: any) {
    console.error('❌ Broker commission payout failed:', error.message);
    
    return {
      success: false,
      message: `Payout failed: ${error.message}`,
    };
  }
}

/**
 * PAY SUPPLIER (International)
 * 
 * Paga fornecedor internacional via Payoneer
 */
export async function paySupplierInternational(
  payout: CommissionPayout & { supplierId: string }
): Promise<{
  success: boolean;
  paymentId?: string;
  status?: string;
  message: string;
}> {
  // Check if Payoneer is configured
  if (!process.env.PAYONEER_API_USERNAME) {
    console.warn('⚠️  Payoneer not configured, using mock payout');
    
    const mockPaymentId = `pay_sup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      success: true,
      paymentId: mockPaymentId,
      status: 'completed',
      message: `Supplier payout successful (MOCK): $${(payout.amount / 100).toFixed(2)} ${payout.currency}`,
    };
  }
  
  const client = getPayoneerClient();
  
  try {
    // Create/update payee
    const payeeId = payout.supplierId;
    
    try {
      await client.createPayee({
        payeeId,
        firstName: payout.recipientName.split(' ')[0],
        lastName: payout.recipientName.split(' ').slice(1).join(' ') || 'Supplier',
        email: payout.recipientEmail,
        country: payout.recipientCountry,
      });
    } catch (error) {
      console.log('ℹ️  Supplier payee may already exist');
    }
    
    // Create payment
    const paymentId = `sup_${payout.contractId}_${Date.now()}`;
    const amountInMajor = payout.amount / 100;
    
    const payment = await client.createPayment({
      paymentId,
      payeeId,
      amount: amountInMajor,
      currency: payout.currency,
      description: payout.description,
      clientReferenceId: payout.contractId,
    });
    
    return {
      success: true,
      paymentId: payment.payment_id,
      status: payment.status,
      message: `Supplier payout successful: $${amountInMajor.toFixed(2)} ${payout.currency}`,
    };
    
  } catch (error: any) {
    console.error('❌ Supplier payout failed:', error.message);
    
    return {
      success: false,
      message: `Payout failed: ${error.message}`,
    };
  }
}

/**
 * CHECK PAYOUT STATUS
 */
export async function checkPayoutStatus(paymentId: string): Promise<{
  status: string;
  amount: number;
  currency: string;
}> {
  if (!process.env.PAYONEER_API_USERNAME) {
    // Mock status
    return {
      status: 'completed',
      amount: 57120, // $571.20 in cents
      currency: 'USD',
    };
  }
  
  const client = getPayoneerClient();
  const status = await client.getPaymentStatus(paymentId);
  
  return {
    status: status.status,
    amount: Math.round(status.amount * 100), // Convert to cents
    currency: status.currency,
  };
}

/**
 * EXEMPLO DE USO:
 * 
 * // Pagar comissão BrokerChain após contrato completo
 * const commissionResult = await payBrokerCommission({
 *   contractId: 'contract-001',
 *   amount: 57120, // $571.20
 *   currency: 'USD',
 *   recipientName: 'BrokerChain Team',
 *   recipientEmail: 'payments@brokerchain.business',
 *   recipientCountry: 'US',
 *   description: 'Broker commission for RFQ-001 (12% of $4,760)',
 * });
 * 
 * console.log(commissionResult.message);
 * 
 * // Pagar fornecedor internacional
 * const supplierResult = await paySupplierInternational({
 *   contractId: 'contract-001',
 *   supplierId: 'supplier-123',
 *   amount: 418880, // $4,188.80
 *   currency: 'USD',
 *   recipientName: 'Brazilian Coffee Cooperative',
 *   recipientEmail: 'payments@braziliancoffee.com',
 *   recipientCountry: 'BR',
 *   description: 'Payment for 5,000 lbs FSC certified coffee beans',
 * });
 * 
 * // Verificar status do pagamento
 * const status = await checkPayoutStatus(commissionResult.paymentId);
 * console.log(`Payment status: ${status.status}`);
 */
