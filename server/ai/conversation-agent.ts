import { openai } from '../openai';
import type {
  ConversationThread,
  ConversationMessage,
  InsertConversationThread,
  InsertConversationMessage,
  CompanyContext,
  Supplier,
  Buyer,
} from '@shared/schema';

interface ConversationContext {
  thread: ConversationThread;
  messageHistory: ConversationMessage[];
  companyContext: CompanyContext;
  companyData: Supplier | Buyer;
}

interface SendMessageParams {
  threadId: string;
  userMessage: string;
  context: ConversationContext;
}

/**
 * REGRAS CRÍTICAS DO SISTEMA DE CONVERSAÇÃO:
 * 1. NUNCA inventar números, preços ou dados - sempre usar company_context real
 * 2. NUNCA prometer algo que possa gerar prejuízo financeiro
 * 3. SEMPRE usar idioma nativo da empresa (thread.language)
 * 4. SEMPRE consultar histórico completo antes de responder
 * 5. SEMPRE atualizar company_context com dados mais recentes
 */

export async function sendMessageToBuyerOrSupplier(
  params: SendMessageParams
): Promise<{ responseMessage: string; updatedThread: ConversationThread }> {
  const { threadId, userMessage, context } = params;
  const { thread, messageHistory, companyContext, companyData } = context;

  // Build system prompt with CRITICAL RULES
  const systemPrompt = `You are BrokerChain's AI negotiation agent for B2B compliance brokerage.

CRITICAL RULES (NEVER BREAK THESE):
1. NEVER invent numbers, prices, inventory, or any data - ONLY use real-time data from company_context
2. NEVER promise delivery dates, prices, or commitments that could cause financial loss
3. ALWAYS speak in ${getLanguageName(thread.language)} language
4. ALWAYS check conversation history before responding
5. If you don't have data, say "I need to check internally and will get back to you"
6. Be professional, clear, and compliance-focused

COMPANY TYPE: ${thread.companyType}
COMPANY NAME: ${context.companyData.name}
FRAMEWORK: ${thread.framework.toUpperCase()}
LANGUAGE: ${thread.language}

REAL-TIME COMPANY DATA (USE THIS, DON'T INVENT):
- Current Inventory: ${JSON.stringify(companyContext.currentInventory)}
- Active Pricing: ${JSON.stringify(companyContext.activePricing)}
- Capabilities: ${JSON.stringify(companyContext.capabilities)}
- Constraints (what we CAN'T do): ${JSON.stringify(companyContext.constraints)}

CONVERSATION SUMMARY: ${thread.summary || 'New conversation'}

Your response must be:
- In ${getLanguageName(thread.language)} language
- Based ONLY on real company_context data
- Professional and compliance-focused
- Never promising what we can't deliver`;

  // Build conversation history for ChatGPT
  const messages: any[] = [
    { role: 'system', content: systemPrompt },
  ];

  // Add conversation history (last 20 messages for context)
  const recentHistory = messageHistory.slice(-20);
  for (const msg of recentHistory) {
    messages.push({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    });
  }

  // Add current user message
  messages.push({
    role: 'user',
    content: userMessage,
  });

  try {
    // Call ChatGPT 4o mini with conversation context
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiResponse = response.choices[0].message.content || 'I apologize, but I need to consult with my team before responding.';

    // Generate conversation summary if this is a significant exchange
    let updatedSummary = thread.summary;
    if (messageHistory.length % 10 === 0) {
      updatedSummary = await generateConversationSummary(messageHistory, userMessage, aiResponse);
    }

    return {
      responseMessage: aiResponse,
      updatedThread: {
        ...thread,
        summary: updatedSummary,
        lastMessageAt: new Date(),
      },
    };

  } catch (error: any) {
    console.error('❌ Conversation AI error:', error.message);
    
    // Fallback response in appropriate language
    const fallbackResponses: Record<string, string> = {
      en: 'I apologize for the delay. Let me consult with my team and get back to you with accurate information.',
      pt: 'Peço desculpas pela demora. Deixe-me consultar minha equipe e retornarei com informações precisas.',
      es: 'Disculpe la demora. Permítame consultar con mi equipo y le responderé con información precisa.',
      fr: 'Je vous prie de m\'excuser pour le retard. Laissez-moi consulter mon équipe et je reviendrai vers vous avec des informations précises.',
      de: 'Entschuldigen Sie die Verzögerung. Lassen Sie mich mein Team konsultieren und ich komme mit genauen Informationen zurück.',
      it: 'Mi scuso per il ritardo. Lasciami consultare il mio team e ti risponderò con informazioni precise.',
      ja: '遅れて申し訳ございません。チームに相談して正確な情報を返信いたします。',
      zh: '抱歉延迟。让我咨询我的团队，然后会给您提供准确的信息。',
    };

    return {
      responseMessage: fallbackResponses[thread.language] || fallbackResponses.en,
      updatedThread: {
        ...thread,
        lastMessageAt: new Date(),
      },
    };
  }
}

async function generateConversationSummary(
  history: ConversationMessage[],
  latestUserMsg: string,
  latestAiMsg: string
): Promise<string> {
  try {
    const summaryPrompt = `Summarize this B2B compliance negotiation conversation in 2-3 sentences. Focus on: what was discussed, any commitments made, and next steps.

Recent messages:
${history.slice(-10).map(m => `${m.role}: ${m.content}`).join('\n')}
Latest user: ${latestUserMsg}
Latest response: ${latestAiMsg}

Summary:`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: summaryPrompt }],
      temperature: 0.5,
      max_tokens: 150,
    });

    return response.choices[0].message.content || 'Ongoing compliance discussion';
  } catch (error) {
    return 'Ongoing compliance discussion';
  }
}

function getLanguageName(code: string): string {
  const names: Record<string, string> = {
    en: 'English',
    pt: 'Portuguese',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    it: 'Italian',
    ja: 'Japanese',
    zh: 'Chinese (Simplified)',
  };
  return names[code] || 'English';
}

export async function startNewConversation(params: {
  companyId: string;
  companyType: 'supplier' | 'buyer';
  companyName: string;
  language: string;
  framework: string;
}): Promise<InsertConversationThread> {
  return {
    companyId: params.companyId,
    companyType: params.companyType,
    companyName: params.companyName,
    language: params.language,
    framework: params.framework,
    status: 'active',
    summary: `New ${params.framework.toUpperCase()} compliance discussion with ${params.companyName}`,
  };
}
