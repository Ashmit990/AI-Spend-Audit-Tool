import { validateAuditInput, validateLeadInput, sanitizeAuditInput } from '../validate';
import { AuditInput } from '@/types';

describe('validateAuditInput()', () => {
  const validBase: AuditInput = {
    teamSize: 5,
    useCase: 'development',
    tools: [{ name: 'Cursor', plan: 'Pro', seats: 5, monthlySpend: 100 }],
  };

  test('accepts a fully valid input', () => {
    const result = validateAuditInput(validBase);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('rejects non-object body', () => {
    expect(validateAuditInput(null).valid).toBe(false);
    expect(validateAuditInput('string').valid).toBe(false);
    expect(validateAuditInput(42).valid).toBe(false);
  });

  test('rejects missing teamSize', () => {
    const r = validateAuditInput({ ...validBase, teamSize: undefined });
    expect(r.valid).toBe(false);
    expect(r.errors.some((e) => e.includes('teamSize'))).toBe(true);
  });

  test('rejects non-integer teamSize', () => {
    const r = validateAuditInput({ ...validBase, teamSize: 3.5 });
    expect(r.valid).toBe(false);
  });

  test('rejects zero teamSize', () => {
    const r = validateAuditInput({ ...validBase, teamSize: 0 });
    expect(r.valid).toBe(false);
  });

  test('rejects invalid useCase', () => {
    const r = validateAuditInput({ ...validBase, useCase: 'hacking' });
    expect(r.valid).toBe(false);
    expect(r.errors.some((e) => e.includes('useCase'))).toBe(true);
  });

  test('rejects empty tools array', () => {
    const r = validateAuditInput({ ...validBase, tools: [] });
    expect(r.valid).toBe(false);
    expect(r.errors.some((e) => e.includes('at least one'))).toBe(true);
  });

  test('rejects more than 8 tools', () => {
    const manyTools = Array(9).fill({ name: 'Cursor', plan: 'Pro', seats: 1, monthlySpend: 20 });
    const r = validateAuditInput({ ...validBase, tools: manyTools });
    expect(r.valid).toBe(false);
    expect(r.errors.some((e) => e.includes('at most 8'))).toBe(true);
  });

  test('rejects duplicate tool names', () => {
    const r = validateAuditInput({
      ...validBase,
      tools: [
        { name: 'Cursor', plan: 'Pro', seats: 3, monthlySpend: 60 },
        { name: 'Cursor', plan: 'Business', seats: 2, monthlySpend: 80 },
      ],
    });
    expect(r.valid).toBe(false);
    expect(r.errors.some((e) => e.toLowerCase().includes('duplicate'))).toBe(true);
  });

  test('rejects invalid tool name', () => {
    const r = validateAuditInput({
      ...validBase,
      tools: [{ name: 'FakeAI' as never, plan: 'Pro', seats: 1, monthlySpend: 10 }],
    });
    expect(r.valid).toBe(false);
    expect(r.errors.some((e) => e.includes('invalid tool name'))).toBe(true);
  });

  test('rejects invalid plan for a valid tool', () => {
    const r = validateAuditInput({
      ...validBase,
      tools: [{ name: 'Cursor', plan: 'Ultimate', seats: 1, monthlySpend: 50 }],
    });
    expect(r.valid).toBe(false);
    expect(r.errors.some((e) => e.includes('invalid plan'))).toBe(true);
  });

  test('rejects negative monthlySpend', () => {
    const r = validateAuditInput({
      ...validBase,
      tools: [{ name: 'Cursor', plan: 'Pro', seats: 1, monthlySpend: -10 }],
    });
    expect(r.valid).toBe(false);
  });

  test('rejects zero seats', () => {
    const r = validateAuditInput({
      ...validBase,
      tools: [{ name: 'Cursor', plan: 'Pro', seats: 0, monthlySpend: 0 }],
    });
    expect(r.valid).toBe(false);
    expect(r.errors.some((e) => e.includes('seats'))).toBe(true);
  });

  test('accepts all 4 valid use cases', () => {
    for (const useCase of ['development', 'copywriting', 'general', 'mixed']) {
      const r = validateAuditInput({ ...validBase, useCase });
      expect(r.valid).toBe(true);
    }
  });
});

describe('validateLeadInput()', () => {
  test('accepts valid lead', () => {
    const r = validateLeadInput({
      email: 'test@example.com',
      auditId: '550e8400-e29b-41d4-a716-446655440000',
    });
    expect(r.valid).toBe(true);
  });

  test('rejects missing email', () => {
    const r = validateLeadInput({ auditId: '550e8400-e29b-41d4-a716-446655440000' });
    expect(r.valid).toBe(false);
    expect(r.errors.some((e) => e.includes('email'))).toBe(true);
  });

  test('rejects malformed email', () => {
    const r = validateLeadInput({ email: 'notanemail', auditId: null });
    expect(r.valid).toBe(false);
  });

  test('rejects malformed auditId', () => {
    const r = validateLeadInput({ email: 'a@b.com', auditId: 'not-a-uuid' });
    expect(r.valid).toBe(false);
    expect(r.errors.some((e) => e.includes('UUID'))).toBe(true);
  });

  test('accepts null auditId (preview mode)', () => {
    const r = validateLeadInput({ email: 'a@b.com', auditId: null });
    expect(r.valid).toBe(true);
  });
});

describe('sanitizeAuditInput()', () => {
  test('clamps teamSize to bounds', () => {
    const input: AuditInput = {
      teamSize: -5,
      useCase: 'general',
      tools: [{ name: 'Cursor', plan: 'Pro', seats: 1, monthlySpend: 20 }],
    };
    const out = sanitizeAuditInput(input);
    expect(out.teamSize).toBe(1);
  });

  test('trims useCase whitespace', () => {
    const input: AuditInput = {
      teamSize: 5,
      useCase: '  development  ',
      tools: [{ name: 'Cursor', plan: 'Pro', seats: 1, monthlySpend: 20 }],
    };
    const out = sanitizeAuditInput(input);
    expect(out.useCase).toBe('development');
  });

  test('clamps monthlySpend to 0 minimum', () => {
    const input: AuditInput = {
      teamSize: 5,
      useCase: 'general',
      tools: [{ name: 'Cursor', plan: 'Pro', seats: 1, monthlySpend: -999 }],
    };
    const out = sanitizeAuditInput(input);
    expect(out.tools[0].monthlySpend).toBe(0);
  });

  test('truncates tools array to 8 max', () => {
    const tools = Array(12).fill({ name: 'Cursor', plan: 'Pro', seats: 1, monthlySpend: 20 });
    const input: AuditInput = { teamSize: 5, useCase: 'general', tools: tools as never };
    const out = sanitizeAuditInput(input);
    expect(out.tools.length).toBe(8);
  });
});
