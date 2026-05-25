import { AuditInput, ToolInput, ToolName } from '@/types';
import { TOOL_PRICING } from '@/lib/pricing';

// ─── Constants ────────────────────────────────────────────────────
const VALID_TOOL_NAMES = new Set<string>([
  'Cursor',
  'GitHub Copilot',
  'Claude',
  'ChatGPT',
  'Anthropic API direct',
  'OpenAI API direct',
  'Gemini',
  'Windsurf',
]);

const MAX_TEAM_SIZE = 10_000;
const MAX_TOOLS = 8;
const MAX_MONTHLY_SPEND = 1_000_000;

// ─── Types ────────────────────────────────────────────────────────
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// ─── Helpers ──────────────────────────────────────────────────────
function isFinitePositive(n: unknown): n is number {
  return typeof n === 'number' && Number.isFinite(n) && n >= 0;
}

function isPositiveInt(n: unknown): n is number {
  return typeof n === 'number' && Number.isInteger(n) && n > 0;
}

// ─── Tool Validator ───────────────────────────────────────────────
function validateToolInput(tool: ToolInput, idx: number): string[] {
  const errs: string[] = [];
  const prefix = `Tool[${idx}] (${tool.name ?? 'unknown'})`;

  if (!tool.name || !VALID_TOOL_NAMES.has(tool.name)) {
    errs.push(`${prefix}: invalid tool name "${tool.name}".`);
    return errs; // Can't validate further without a valid name
  }

  const validPlans = TOOL_PRICING[tool.name as ToolName].map((p) => p.name);
  if (!tool.plan || !validPlans.includes(tool.plan)) {
    errs.push(`${prefix}: invalid plan "${tool.plan}". Valid plans: ${validPlans.join(', ')}.`);
  }

  if (!isPositiveInt(tool.seats) || tool.seats > MAX_TEAM_SIZE) {
    errs.push(`${prefix}: seats must be an integer between 1 and ${MAX_TEAM_SIZE}.`);
  }

  if (!isFinitePositive(tool.monthlySpend) || tool.monthlySpend > MAX_MONTHLY_SPEND) {
    errs.push(
      `${prefix}: monthlySpend must be a number between 0 and ${MAX_MONTHLY_SPEND}.`
    );
  }

  return errs;
}

// ─── Main Validator ───────────────────────────────────────────────
export function validateAuditInput(body: unknown): ValidationResult {
  const errors: string[] = [];

  if (!body || typeof body !== 'object') {
    return { valid: false, errors: ['Request body must be a JSON object.'] };
  }

  const input = body as Record<string, unknown>;

  // teamSize
  if (!isPositiveInt(input.teamSize) || (input.teamSize as number) > MAX_TEAM_SIZE) {
    errors.push(`teamSize must be an integer between 1 and ${MAX_TEAM_SIZE}.`);
  }

  // useCase
  const validUseCases = ['development', 'copywriting', 'general', 'mixed'];
  if (typeof input.useCase !== 'string' || !validUseCases.includes(input.useCase)) {
    errors.push(`useCase must be one of: ${validUseCases.join(', ')}.`);
  }

  // tools array
  if (!Array.isArray(input.tools)) {
    errors.push('tools must be an array.');
    return { valid: errors.length === 0, errors };
  }

  if (input.tools.length === 0) {
    errors.push('tools array must contain at least one tool.');
  }

  if (input.tools.length > MAX_TOOLS) {
    errors.push(`tools array must contain at most ${MAX_TOOLS} tools.`);
  }

  // Check for duplicate tool names
  const toolNames = (input.tools as ToolInput[]).map((t) => t?.name);
  const uniqueNames = new Set(toolNames);
  if (uniqueNames.size !== toolNames.length) {
    errors.push('Duplicate tool names are not allowed.');
  }

  // Validate each tool
  (input.tools as ToolInput[]).forEach((tool, idx) => {
    errors.push(...validateToolInput(tool, idx));
  });

  return { valid: errors.length === 0, errors };
}

// ─── Lead Input Validator ─────────────────────────────────────────
export function validateLeadInput(body: unknown): ValidationResult {
  const errors: string[] = [];

  if (!body || typeof body !== 'object') {
    return { valid: false, errors: ['Request body must be a JSON object.'] };
  }

  const input = body as Record<string, unknown>;

  // email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (typeof input.email !== 'string' || !emailRegex.test(input.email)) {
    errors.push('email must be a valid email address.');
  }

  // auditId (UUID v4 format)
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (
    input.auditId !== null &&
    typeof input.auditId === 'string' &&
    input.auditId.length > 0 &&
    !uuidRegex.test(input.auditId)
  ) {
    errors.push('auditId must be a valid UUID v4.');
  }

  // optional fields length guards
  if (input.companyName && typeof input.companyName === 'string' && input.companyName.length > 200) {
    errors.push('companyName must be under 200 characters.');
  }

  if (input.role && typeof input.role === 'string' && input.role.length > 100) {
    errors.push('role must be under 100 characters.');
  }

  return { valid: errors.length === 0, errors };
}

// ─── Sanitize helper for audit input ─────────────────────────────
export function sanitizeAuditInput(body: AuditInput): AuditInput {
  return {
    teamSize: Math.min(Math.max(1, Math.floor(body.teamSize)), MAX_TEAM_SIZE),
    useCase: body.useCase?.trim() ?? 'general',
    tools: body.tools.slice(0, MAX_TOOLS).map((t) => ({
      name: t.name,
      plan: t.plan?.trim(),
      seats: Math.min(Math.max(1, Math.floor(t.seats)), MAX_TEAM_SIZE),
      monthlySpend: Math.min(Math.max(0, Number(t.monthlySpend) || 0), MAX_MONTHLY_SPEND),
    })),
  };
}
