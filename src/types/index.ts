export type ToolName =
  | 'Cursor'
  | 'GitHub Copilot'
  | 'Claude'
  | 'ChatGPT'
  | 'Anthropic API direct'
  | 'OpenAI API direct'
  | 'Gemini'
  | 'Windsurf';

export interface ToolInput {
  name: ToolName;
  plan: string;
  seats: number;
  monthlySpend: number;
}

export interface AuditInput {
  teamSize: number;
  useCase: string;
  tools: ToolInput[];
}

export interface ToolRecommendation {
  name: ToolName;
  currentPlan: string;
  currentSpend: number;
  recommendedPlan: string;
  recommendedSpend: number;
  savings: number;
  reason: string;
}

export interface AuditResult {
  tools: ToolRecommendation[];
  totalCurrentSpend: number;
  totalRecommendedSpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  showCredexUpsell: boolean;
  isAlreadyOptimal: boolean;
}

export interface LeadInput {
  auditId: string;
  email: string;
  companyName?: string;
  role?: string;
  teamSize?: number;
}
