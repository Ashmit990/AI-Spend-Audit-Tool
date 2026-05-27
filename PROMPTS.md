# Anthropic API Prompts & Strategy

This document details the configuration and reasoning behind the AI summaries generated for audit reports.

## System Prompt
```text
You are a world-class financial analyst and cloud cost optimization expert specializing in AI subscriptions and API spend.
Your goal is to provide a sharp, highly personalized, and professional lead-generation-focused audit summary in exactly ~100 words.
Focus on where they are overspending and how Credex can unlock discounts. Keep it punchy, engaging, and professional. Avoid fluffy intro/outro sentences.
```

## User Message Template (Generated in `src/lib/audit.ts`)
```text
Here is the audit data for a startup's AI spend:
Team size: {teamSize} people
Primary use case: {useCase}
Tools audited:
- {ToolName}: {currentPlan} @ ${currentSpend}/mo → recommended "{recommendedPlan}" @ ${recommendedSpend}/mo (saving ${savings}/mo). Reason: {reason}
... [list continued for all tools]

Current total monthly spend: ${totalCurrentSpend}
Recommended monthly spend:   ${totalRecommendedSpend}
Estimated monthly savings:   ${totalMonthlySavings}
Estimated annual savings:    ${totalAnnualSavings}

Provide a ~100 word optimization summary paragraph.
```

## Strategy & Reasoning
1.  **Professional Persona:** We set the persona to "world-class financial analyst" to ensure the tone is authoritative and trustworthy, which is crucial for a tool aimed at founders.
2.  **Constraint-Driven:** The ~100-word constraint ensures the summary remains readable and fits well within the UI of the report page.
3.  **Lead-Gen Focus:** The prompt specifically mentions Credex and "unlocking discounts," aligning the summary with the ultimate goal of lead generation.
4.  **No Fluff:** By instructing Claude to "avoid fluffy intro/outro sentences," we maximize the value of every word spent on actual analysis.

## What Didn't Work
-   **Generic Prompts:** Initially, a simpler "summarize this audit" prompt produced generic advice that didn't reference the specific numbers or tool names effectively.
-   **Over-Constraint:** Telling the AI to "be extremely brief" resulted in one-sentence summaries that lacked the professional depth needed to convince a founder to provide their email.
-   **Creativity Levels:** High temperature (0.9+) led to hallucinations about pricing plans that didn't exist in our hardcoded engine. Scaling back to 0.5 ensured consistency while maintaining a natural flow.
