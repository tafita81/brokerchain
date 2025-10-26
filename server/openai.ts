import OpenAI from "openai";

// Using your OpenAI API key with ChatGPT 4o mini
if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is required - please configure it in Replit Secrets");
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface RFQGenerationParams {
  framework: "pfas" | "buyamerica" | "eudr";
  buyerName: string;
  industry: string;
  productType: string;
  quantity?: string;
  requirements?: string;
}

export interface ContentGenerationParams {
  niche: string;
  country: string;
  language: string;
  keywords?: string[];
  productFocus?: string;
}

export async function generateRFQ(params: RFQGenerationParams): Promise<{ subject: string; content: string }> {
  const frameworkContext = {
    pfas: `PFAS/EPR Compliance: Focus on PFAS-free packaging solutions for US food service. Requirements must address:
- Full compliance with state-level PFAS bans (20+ states including CA, ME, NY)
- Sustainable Packaging Coalition (SPC) alignment
- Certifications: BPI, ASTM D6868, TÜV OK Compost
- Materials: Bio-based resins, molded fiber, bagasse, PLA alternatives
- Zero intentionally added PFAS substances`,

    buyamerica: `Buy America Act Compliance (41 U.S.C. § 8301–8305): Requirements must address:
- 100% melted and manufactured in USA
- End-to-end metallurgical traceability from foundry to finished product
- Certifications: IATF 16949, ISO 9001, Buy America compliance proof
- Zero offshore subcontracting or foreign materials
- SAM.gov registration verification`,

    eudr: `EU Deforestation Regulation (EUDR) Compliance: Requirements must address:
- Zero deforestation after December 31, 2020
- Polygon-level GPS coordinates and geospatial mapping
- Satellite verification using Sentinel-2 imagery
- Digital Product Passport (DPP) with embedded geocoordinates
- Certifications: FSC, PEFC, Rainforest Alliance
- Integration with EU TRACES NT system`,
  };

  const prompt = `You are a compliance procurement specialist generating a professional Request for Quote (RFQ) for a B2B compliance broker platform.

Framework: ${params.framework.toUpperCase()}
${frameworkContext[params.framework]}

Buyer Details:
- Company: ${params.buyerName}
- Industry: ${params.industry}
- Product/Material: ${params.productType}
${params.quantity ? `- Quantity: ${params.quantity}` : ''}
${params.requirements ? `- Special Requirements: ${params.requirements}` : ''}

Generate a professional RFQ with:
1. Subject line (max 10 words)
2. Full RFQ content including:
   - Professional greeting
   - Clear statement of need
   - Specific compliance requirements for ${params.framework}
   - Technical specifications based on product type
   - Quantity and delivery expectations
   - Certification requirements
   - Request for supplier credentials
   - Timeline for response
   - Professional closing

Format as JSON with keys: "subject" and "content"
Make it authoritative, precise, and technically competent. Use industry-specific terminology.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    response_format: { type: "json_object" },
  });

  const result = JSON.parse(completion.choices[0].message.content || "{}");
  return {
    subject: result.subject || "Compliance RFQ",
    content: result.content || "",
  };
}

export async function generateSEOContent(params: ContentGenerationParams): Promise<{
  title: string;
  content: string;
  keywords: string[];
  productLinks: string[];
}> {
  const prompt = `You are an expert SEO content writer creating Amazon affiliate marketing content.

Task: Generate a comprehensive SEO article for Amazon OneLink affiliate marketing.

Parameters:
- Niche: ${params.niche}
- Target Country: ${params.country}
- Language: ${params.language}
${params.keywords && params.keywords.length > 0 ? `- Target Keywords: ${params.keywords.join(', ')}` : ''}
${params.productFocus ? `- Product Focus: ${params.productFocus}` : ''}

Requirements:
1. Title: Engaging, SEO-optimized title (60-70 characters)
2. Content: 1,500-2,000 word article that:
   - Naturally incorporates keywords throughout
   - Provides genuine value to readers
   - Includes product recommendations with benefits
   - Uses persuasive but authentic tone
   - Optimized for search engines and conversions
   - Written in ${params.language === 'en' ? 'English' : params.language === 'pt' ? 'Portuguese' : params.language === 'es' ? 'Spanish' : params.language === 'fr' ? 'French' : params.language === 'de' ? 'German' : params.language === 'it' ? 'Italian' : params.language === 'ja' ? 'Japanese' : 'English'}
3. Keywords: Array of 5-10 relevant SEO keywords
4. Product Links: Array of 3-5 suggested Amazon product categories to link

Format as JSON with keys: "title", "content", "keywords", "productLinks"`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.8,
    max_tokens: 4000,
    response_format: { type: "json_object" },
  });

  const result = JSON.parse(completion.choices[0].message.content || "{}");
  return {
    title: result.title || "Product Review",
    content: result.content || "",
    keywords: result.keywords || [],
    productLinks: result.productLinks || [],
  };
}

export async function translateContent(text: string, targetLanguage: string): Promise<string> {
  const prompt = `Translate the following text to ${targetLanguage}. Maintain the professional tone and technical terminology.

Text to translate:
${text}

Provide only the translation, no explanations.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  return completion.choices[0].message.content || text;
}
