import Groq from 'groq-sdk';

const groqApiKey = process.env.GROQ_API_KEY || '';

export const groq = groqApiKey ? new Groq({ apiKey: groqApiKey }) : null;

export async function generateAuditSummary(auditDetailsText: string): Promise<string> {
  if (!groq) {
    console.warn('Groq API key is missing. Using fallback summary.');
    return getFallbackSummary();
  }

  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 300,
      temperature: 0.5,
      messages: [
        {
          role: 'system',
          content: `You are a world-class financial analyst and cloud cost optimization expert specializing in AI subscriptions and API spend.
Your goal is to provide a sharp, highly personalized, and professional lead-generation-focused audit summary in exactly ~100 words.
Focus on where they are overspending and how Credex can unlock discounts. Keep it punchy, engaging, and professional. Avoid fluffy intro/outro sentences.`,
        },
        {
          role: 'user',
          content: `Here is the audit data for a startup's AI spend:\n${auditDetailsText}\n\nProvide a ~100 word optimization summary paragraph.`,
        },
      ],
    });

    const text = response.choices[0]?.message?.content;
    if (text) {
      return text.trim();
    }
    return getFallbackSummary();
  } catch (error) {
    console.error('Error calling Groq API:', error);
    return getFallbackSummary();
  }
}

function getFallbackSummary(): string {
  return `Based on our automated scan of your AI subscriptions, your startup has significant optimization opportunities across your tool ecosystem. By aligning seats to active team size, migrating developer workstations to modern value tiers, and centralizing API direct volumes, you can dramatically curb immediate retail leakage. Credex can help you consolidate these subscriptions into enterprise-grade packages and unlock pre-purchased bulk credit rates to save even more.`;
}
