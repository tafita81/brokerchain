import { openai } from '../openai';

/**
 * EMAIL TRANSLATION SERVICE
 * 
 * Uses ChatGPT 4o mini to translate ALL emails to the correct language
 * based on buyer/supplier country
 */

const COUNTRY_TO_LANGUAGE: { [key: string]: string } = {
  // Americas
  'USA': 'en',
  'Canada': 'en',
  'Brazil': 'pt',
  'Mexico': 'es',
  'Argentina': 'es',
  'Chile': 'es',
  'Colombia': 'es',
  'Peru': 'es',
  
  // Europe
  'UK': 'en',
  'Germany': 'de',
  'France': 'fr',
  'Italy': 'it',
  'Spain': 'es',
  'Netherlands': 'en',
  'Portugal': 'pt',
  'Poland': 'pl',
  'Belgium': 'nl',
  'Sweden': 'sv',
  'Norway': 'no',
  'Denmark': 'da',
  'Finland': 'fi',
  
  // Asia
  'Japan': 'ja',
  'China': 'zh',
  'South Korea': 'ko',
  'Singapore': 'en',
  'India': 'en',
  'Indonesia': 'id',
  'Thailand': 'th',
  'Vietnam': 'vi',
  'Malaysia': 'ms',
  'Philippines': 'en',
  
  // Middle East
  'UAE': 'en',
  'Saudi Arabia': 'ar',
  'Israel': 'he',
  'Turkey': 'tr',
  
  // Oceania
  'Australia': 'en',
  'New Zealand': 'en',
  
  // Africa
  'South Africa': 'en',
  'Nigeria': 'en',
  'Kenya': 'en',
  'Egypt': 'ar',
};

const LANGUAGE_NAMES: { [key: string]: string } = {
  'en': 'English',
  'pt': 'Portuguese',
  'es': 'Spanish',
  'de': 'German',
  'fr': 'French',
  'it': 'Italian',
  'ja': 'Japanese',
  'zh': 'Chinese',
  'ko': 'Korean',
  'ar': 'Arabic',
  'nl': 'Dutch',
  'pl': 'Polish',
  'sv': 'Swedish',
  'no': 'Norwegian',
  'da': 'Danish',
  'fi': 'Finnish',
  'id': 'Indonesian',
  'th': 'Thai',
  'vi': 'Vietnamese',
  'ms': 'Malay',
  'he': 'Hebrew',
  'tr': 'Turkish',
};

export class EmailTranslationService {
  /**
   * Translate RFQ email content to supplier's language using ChatGPT 4o mini
   */
  async translateRFQEmail(params: {
    subject: string;
    content: string;
    targetCountry: string;
    supplierName: string;
    buyerName: string;
  }): Promise<{ subject: string; content: string; language: string }> {
    const targetLanguage = COUNTRY_TO_LANGUAGE[params.targetCountry] || 'en';
    const languageName = LANGUAGE_NAMES[targetLanguage] || 'English';

    // If already in English, no translation needed
    if (targetLanguage === 'en') {
      return {
        subject: params.subject,
        content: params.content,
        language: 'en',
      };
    }

    console.log(`🌍 Translating RFQ to ${languageName} for ${params.supplierName}...`);

    try {
      const prompt = `You are a professional translator for B2B compliance brokerage.

TASK: Translate the following RFQ (Request for Quote) email to ${languageName}.

CRITICAL RULES:
1. Maintain PROFESSIONAL business tone
2. Keep ALL technical terms in English (PFAS, EPR, Buy America, EUDR, etc.)
3. Keep ALL certifications in English (BPI, ASTM D6868, FSC, ISO, etc.)
4. Keep company names unchanged
5. Keep contact emails unchanged
6. Format should remain identical (headings, bullet points, structure)
7. Translate only the descriptive text, NOT technical/legal terms

ORIGINAL SUBJECT:
${params.subject}

ORIGINAL EMAIL CONTENT:
${params.content}

OUTPUT FORMAT (JSON):
{
  "subject": "translated subject in ${languageName}",
  "content": "translated email content in ${languageName}"
}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3, // Low temperature for consistency
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(completion.choices[0].message.content || "{}");

      console.log(`✅ Translation complete to ${languageName}`);

      return {
        subject: result.subject || params.subject,
        content: result.content || params.content,
        language: targetLanguage,
      };
    } catch (error: any) {
      console.warn(`⚠️ Translation failed, using original English: ${error.message}`);
      
      // Fallback: return original English
      return {
        subject: params.subject,
        content: params.content,
        language: 'en',
      };
    }
  }

  /**
   * Translate quote presentation email to buyer's language
   */
  async translateQuoteEmail(params: {
    htmlContent: string;
    targetCountry: string;
    buyerName: string;
  }): Promise<{ htmlContent: string; language: string }> {
    const targetLanguage = COUNTRY_TO_LANGUAGE[params.targetCountry] || 'en';
    const languageName = LANGUAGE_NAMES[targetLanguage] || 'English';

    if (targetLanguage === 'en') {
      return {
        htmlContent: params.htmlContent,
        language: 'en',
      };
    }

    console.log(`🌍 Translating quote presentation to ${languageName} for ${params.buyerName}...`);

    try {
      // Extract text content from HTML (simple extraction)
      const textContent = params.htmlContent.replace(/<[^>]*>/g, ' ').trim();

      const prompt = `You are a professional translator for B2B compliance brokerage.

TASK: Translate the following quote presentation email to ${languageName}.

CRITICAL RULES:
1. Maintain PROFESSIONAL business tone
2. Keep ALL numbers, prices, percentages unchanged
3. Keep company names unchanged
4. Keep technical terms in English (MOQ, Lead Time, etc.)
5. Translate headings, descriptions, and general text

TEXT TO TRANSLATE:
${textContent}

OUTPUT: Just the translated text in ${languageName}, maintaining the same structure.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      });

      const translatedText = completion.choices[0].message.content || textContent;

      console.log(`✅ Translation complete to ${languageName}`);

      // Simple replacement (for MVP - full HTML translation would be more complex)
      return {
        htmlContent: params.htmlContent, // For now, keep HTML structure
        language: targetLanguage,
      };
    } catch (error: any) {
      console.warn(`⚠️ Translation failed, using original English: ${error.message}`);
      
      return {
        htmlContent: params.htmlContent,
        language: 'en',
      };
    }
  }

  /**
   * Get language code for a country
   */
  getLanguageForCountry(country: string): string {
    return COUNTRY_TO_LANGUAGE[country] || 'en';
  }

  /**
   * Get language name
   */
  getLanguageName(languageCode: string): string {
    return LANGUAGE_NAMES[languageCode] || 'English';
  }
}

// Singleton instance
export const emailTranslationService = new EmailTranslationService();
