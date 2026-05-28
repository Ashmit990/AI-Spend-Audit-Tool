import { AuditInput, AuditResult, ToolRecommendation, ToolName } from '@/types';
import { TOOL_PRICING } from '@/lib/pricing';

// ---------------------------------------------------------------------------
// Overlap detection: mark tools that are functionally redundant with each other
// ---------------------------------------------------------------------------
const OVERLAP_GROUPS: ToolName[][] = [
  ['Cursor', 'Windsurf'],                           // Both are AI coding IDEs
  ['Claude', 'Anthropic API direct'],               // Claude chat vs raw API
  ['ChatGPT', 'OpenAI API direct'],                 // ChatGPT vs raw API
  ['Claude', 'ChatGPT', 'Gemini'],                  // Competing chat assistants
  ['GitHub Copilot', 'Cursor', 'Windsurf'],         // Coding assistant overlap
];

function detectOverlapReason(toolName: ToolName, allToolNames: ToolName[]): string | null {
  for (const group of OVERLAP_GROUPS) {
    if (group.includes(toolName)) {
      const overlap = group.filter((t) => t !== toolName && allToolNames.includes(t));
      if (overlap.length > 0) {
        return `Overlaps with ${overlap.join(', ')} — consider consolidating to a single solution.`;
      }
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Per-tool optimisation logic
// ---------------------------------------------------------------------------
function analyseToolSpend(
  tool: { name: ToolName; plan: string; seats: number; monthlySpend: number },
  teamSize: number,
  allToolNames: ToolName[]
): ToolRecommendation {
  const plans = TOOL_PRICING[tool.name];
  const currentPlanDetails = plans.find((p) => p.name === tool.plan) || plans[0];
  const overlapReason = detectOverlapReason(tool.name, allToolNames);

  let recommendedPlan = tool.plan;
  let recommendedSpend = tool.monthlySpend;
  let reason = overlapReason ?? 'Spend appears well-optimized for current usage.';

  // --- Seat-based tools: check for over-provisioning ---
  if (!currentPlanDetails.isApiOrCustom) {
    // If seats are more than 20% above team size, recommend trimming
    if (tool.seats > Math.ceil(teamSize * 1.2)) {
      recommendedPlan = tool.plan;
      const optimisedSeats = teamSize;
      recommendedSpend = optimisedSeats * currentPlanDetails.costPerSeat;
      reason = overlapReason ?? `${tool.seats - teamSize} excess seats detected. Trim to ${teamSize} active seats to save $${(tool.monthlySpend - recommendedSpend).toFixed(2)}/mo.`;
    }

    // Check if a lower plan fits for small teams (≤3 seats)
    if (teamSize <= 3 && plans.length > 1) {
      const cheaperPlans = plans.filter(
        (p) => !p.isApiOrCustom && p.costPerSeat < currentPlanDetails.costPerSeat
      );
      if (cheaperPlans.length > 0) {
        const cheapest = cheaperPlans[cheaperPlans.length - 1];
        const altSpend = teamSize * cheapest.costPerSeat;
        if (altSpend < recommendedSpend) {
          recommendedPlan = cheapest.name;
          recommendedSpend = altSpend;
          reason =
            overlapReason ??
            `Small team of ${teamSize} — downgrade to "${cheapest.name}" plan to save $${(tool.monthlySpend - altSpend).toFixed(2)}/mo.`;
        }
      }
    }

    // Check if moving to a higher plan is cheaper per-seat for large teams
    if (teamSize >= 10 && plans.length > 1) {
      const higherPlans = plans.filter(
        (p) => !p.isApiOrCustom && p.costPerSeat > currentPlanDetails.costPerSeat
      );
      // Sometimes higher plans include more features — we flag only if they're < 20% more expensive total
      const betterPlan = higherPlans.find(
        (p) => p.costPerSeat <= currentPlanDetails.costPerSeat * 1.1
      );
      if (betterPlan) {
        const altSpend = teamSize * betterPlan.costPerSeat;
        if (altSpend < recommendedSpend) {
          recommendedPlan = betterPlan.name;
          recommendedSpend = altSpend;
          reason =
            overlapReason ??
            `For ${teamSize} seats, the "${betterPlan.name}" plan offers better value. Estimated saving: $${(tool.monthlySpend - altSpend).toFixed(2)}/mo.`;
        }
      }
    }
  }

  // --- API / Custom billing tools ---
  if (currentPlanDetails.isApiOrCustom) {
    // If they're paying raw API rates AND they have a matching subscription tool already, recommend consolidating
    if (tool.name === 'Anthropic API direct' && allToolNames.includes('Claude')) {
      recommendedPlan = 'Consider Claude Team plan';
      recommendedSpend = Math.min(tool.monthlySpend, 30 * teamSize);
      reason =
        'You are paying both direct Anthropic API bills and Claude subscription. Consolidate to Claude Team plan to avoid double-billing.';
    } else if (tool.name === 'OpenAI API direct' && allToolNames.includes('ChatGPT')) {
      recommendedPlan = 'Consider ChatGPT Team plan';
      recommendedSpend = Math.min(tool.monthlySpend, 30 * teamSize);
      reason =
        'You are paying both direct OpenAI API bills and ChatGPT subscription. Consolidate to ChatGPT Team plan to avoid double-billing.';
    } else {
      // Generic: apply 15% Credex bulk credit savings estimate
      recommendedPlan = 'Credex Bulk API Credits';
      recommendedSpend = Math.round(tool.monthlySpend * 0.85);
      reason =
        overlapReason ??
        'API direct billing is subject to retail token pricing. Credex pre-purchased bulk credits can cut this cost by 15–20%.';
    }
  }

  // Ensure recommended spend is never negative or higher than current
  recommendedSpend = Math.max(0, Math.min(recommendedSpend, tool.monthlySpend));

  const savings = tool.monthlySpend - recommendedSpend;

  return {
    name: tool.name,
    currentPlan: tool.plan,
    currentSpend: tool.monthlySpend,
    recommendedPlan,
    recommendedSpend,
    savings,
    reason,
  };
}

// ---------------------------------------------------------------------------
// Public: run full audit
// ---------------------------------------------------------------------------
export function runAudit(input: AuditInput): AuditResult {
  const { teamSize, tools } = input;
  const allToolNames = tools.map((t) => t.name);

  const recommendations: ToolRecommendation[] = tools.map((tool) =>
    analyseToolSpend(tool, teamSize, allToolNames)
  );

  const totalCurrentSpend = recommendations.reduce((s, r) => s + r.currentSpend, 0);
  const totalRecommendedSpend = recommendations.reduce((s, r) => s + r.recommendedSpend, 0);
  const totalMonthlySavings = totalCurrentSpend - totalRecommendedSpend;
  const totalAnnualSavings = totalMonthlySavings * 12;

  // Calculate efficiency score (0-100)
  const efficiencyScore = totalCurrentSpend > 0 
    ? Math.round((totalRecommendedSpend / totalCurrentSpend) * 100) 
    : 100;

  // Redundant tools = tools where reason mentions "overlap"
  const redundantToolsCount = recommendations.filter(r => 
    r.reason.toLowerCase().includes('overlap') || 
    r.reason.toLowerCase().includes('redundant')
  ).length;

  // Show Credex upsell if potential savings ≥ $50/mo or if API direct tools are present
  const hasApiTools = tools.some(
    (t) => t.name === 'Anthropic API direct' || t.name === 'OpenAI API direct'
  );
  const showCredexUpsell = totalMonthlySavings >= 50 || hasApiTools;

  const isAlreadyOptimal = totalMonthlySavings < 5;

  return {
    tools: recommendations,
    totalCurrentSpend,
    totalRecommendedSpend,
    totalMonthlySavings,
    totalAnnualSavings,
    efficiencyScore,
    redundantToolsCount,
    showCredexUpsell,
    isAlreadyOptimal,
  };
}

// ---------------------------------------------------------------------------
// Serialise audit data into a text block for the Anthropic prompt
// ---------------------------------------------------------------------------
export function buildAuditPromptText(input: AuditInput, result: AuditResult): string {
  const toolLines = result.tools
    .map(
      (r) =>
        `- ${r.name}: ${r.currentPlan} @ $${r.currentSpend}/mo → recommended "${r.recommendedPlan}" @ $${r.recommendedSpend}/mo (saving $${r.savings}/mo). Reason: ${r.reason}`
    )
    .join('\n');

  return `
Team size: ${input.teamSize} people
Primary use case: ${input.useCase}
Tools audited:
${toolLines}

Current total monthly spend: $${result.totalCurrentSpend}
Recommended monthly spend:   $${result.totalRecommendedSpend}
Estimated monthly savings:   $${result.totalMonthlySavings}
Estimated annual savings:    $${result.totalAnnualSavings}
`.trim();
}
