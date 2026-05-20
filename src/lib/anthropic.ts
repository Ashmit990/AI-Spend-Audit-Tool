import Anthropic from '@anthropic-ai/sdk';

const anthropicApiKey = process.env.ANTHROPIC_API_KEY || '';

export const anthropic = anthropicApiKey ? new Anthropic({ apiKey: anthropicApiKey }) : null;

export async function generateAuditSummary(auditDetailsText: string): Promise<string> {
  if (!anthropic) {
    console.warn('Anthropic API key is missing. Using fallback summary.');
    return getFallbackSummary();
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 300,
      temperature: 0.5,
      system: `You are a world-class financial analyst and cloud cost optimization expert specializing in AI subscriptions and API spend.
Your goal is to provide a sharp, highly personalized, and professional lead-generation-focused audit summary in exactly ~100 words.
Focus on where they are overspending and how Credex can unlock discounts. Keep it punchy, engaging, and professional. Avoid fluffy intro/outro sentences.`,
      messages: [
        {
          role: 'user',
          content: `Here is the audit data for a startup's AI spend:\n${auditDetailsText}\n\nProvide a ~100 word optimization summary paragraph.`,
        },
      ],
    });

    const contentBlock = response.content[0];
    if (contentBlock && contentBlock.type === 'text') {
      return contentBlock.text.trim();
    }
    return getFallbackSummary();
  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    return getFallbackSummary();
  }
}

function getFallbackSummary(): string {
  return `Based on our automated scan of your AI subscriptions, your startup has significant optimization opportunities across your tool ecosystem. By aligning seats to active team size, migrating developer workstations to modern value tiers, and centralizing API direct volumes, you can dramatically curb immediate retail leakage. Credex can help you consolidate these subscriptions into enterprise-grade packages and unlock pre-purchased bulk credit rates to save even more.`;
}
