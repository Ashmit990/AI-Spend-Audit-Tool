import { runAudit, buildAuditPromptText } from '../lib/auditEngine';
import { AuditInput } from '@/types';

describe('Audit Engine — runAudit()', () => {
  // ---------------------------------------------------------------
  // 1. Basic sanity: single tool, no overlap
  // ---------------------------------------------------------------
  test('produces correct result for a single optimized tool', () => {
    const input: AuditInput = {
      teamSize: 5,
      useCase: 'development',
      tools: [{ name: 'Cursor', plan: 'Pro', seats: 5, monthlySpend: 100 }],
    };

    const result = runAudit(input);

    expect(result.totalCurrentSpend).toBe(100);
    expect(result.totalRecommendedSpend).toBeLessThanOrEqual(100);
    expect(result.totalMonthlySavings).toBeGreaterThanOrEqual(0);
    expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12);
    expect(result.tools).toHaveLength(1);
    expect(result.tools[0].name).toBe('Cursor');
  });

  // ---------------------------------------------------------------
  // 2. Seat over-provisioning detection
  // ---------------------------------------------------------------
  test('detects excess seats when seats > 120% of team size', () => {
    const input: AuditInput = {
      teamSize: 5,
      useCase: 'development',
      tools: [{ name: 'GitHub Copilot', plan: 'Business', seats: 10, monthlySpend: 190 }],
    };

    const result = runAudit(input);
    const rec = result.tools[0];

    // Should recommend trimming to 5 seats at $19/seat = $95
    expect(rec.recommendedSpend).toBeLessThan(rec.currentSpend);
    expect(rec.savings).toBeGreaterThan(0);
    expect(rec.reason).toContain('excess seats');
  });

  // ---------------------------------------------------------------
  // 3. Overlap detection: Cursor + Windsurf
  // ---------------------------------------------------------------
  test('detects overlap between Cursor and Windsurf', () => {
    const input: AuditInput = {
      teamSize: 3,
      useCase: 'development',
      tools: [
        { name: 'Cursor', plan: 'Pro', seats: 3, monthlySpend: 60 },
        { name: 'Windsurf', plan: 'Pro', seats: 3, monthlySpend: 45 },
      ],
    };

    const result = runAudit(input);

    // At least one of them should flag overlap
    const hasOverlapWarning = result.tools.some((t) =>
      t.reason.toLowerCase().includes('overlaps with')
    );
    expect(hasOverlapWarning).toBe(true);
  });

  // ---------------------------------------------------------------
  // 4. API double-billing: Anthropic API direct + Claude
  // ---------------------------------------------------------------
  test('flags double-billing when Anthropic API and Claude both present', () => {
    const input: AuditInput = {
      teamSize: 5,
      useCase: 'development',
      tools: [
        { name: 'Claude', plan: 'Team', seats: 5, monthlySpend: 150 },
        { name: 'Anthropic API direct', plan: 'API direct', seats: 1, monthlySpend: 200 },
      ],
    };

    const result = runAudit(input);
    const apiRec = result.tools.find((t) => t.name === 'Anthropic API direct');

    expect(apiRec).toBeDefined();
    expect(apiRec!.reason).toContain('double-billing');
    expect(apiRec!.recommendedPlan).toContain('Claude Team');
  });

  // ---------------------------------------------------------------
  // 5. API double-billing: OpenAI API direct + ChatGPT
  // ---------------------------------------------------------------
  test('flags double-billing when OpenAI API and ChatGPT both present', () => {
    const input: AuditInput = {
      teamSize: 5,
      useCase: 'development',
      tools: [
        { name: 'ChatGPT', plan: 'Team', seats: 5, monthlySpend: 150 },
        { name: 'OpenAI API direct', plan: 'API direct', seats: 1, monthlySpend: 300 },
      ],
    };

    const result = runAudit(input);
    const apiRec = result.tools.find((t) => t.name === 'OpenAI API direct');

    expect(apiRec).toBeDefined();
    expect(apiRec!.reason).toContain('double-billing');
    expect(apiRec!.recommendedPlan).toContain('ChatGPT Team');
  });

  // ---------------------------------------------------------------
  // 6. Credex bulk credit savings for standalone API
  // ---------------------------------------------------------------
  test('recommends Credex bulk credits for standalone API direct tool', () => {
    const input: AuditInput = {
      teamSize: 5,
      useCase: 'development',
      tools: [{ name: 'Anthropic API direct', plan: 'API direct', seats: 1, monthlySpend: 500 }],
    };

    const result = runAudit(input);
    const rec = result.tools[0];

    expect(rec.recommendedPlan).toBe('Credex Bulk API Credits');
    expect(rec.recommendedSpend).toBe(Math.round(500 * 0.85)); // 15% discount
    expect(rec.savings).toBe(500 - Math.round(500 * 0.85));
  });

  // ---------------------------------------------------------------
  // 7. Credex upsell flag
  // ---------------------------------------------------------------
  test('shows Credex upsell when savings >= $50 or API tools present', () => {
    const input: AuditInput = {
      teamSize: 5,
      useCase: 'development',
      tools: [{ name: 'Anthropic API direct', plan: 'API direct', seats: 1, monthlySpend: 100 }],
    };

    const result = runAudit(input);
    expect(result.showCredexUpsell).toBe(true);
  });

  // ---------------------------------------------------------------
  // 8. isAlreadyOptimal flag
  // ---------------------------------------------------------------
  test('marks stack as optimal when savings < $5', () => {
    const input: AuditInput = {
      teamSize: 1,
      useCase: 'general',
      tools: [{ name: 'Cursor', plan: 'Hobby', seats: 1, monthlySpend: 0 }],
    };

    const result = runAudit(input);
    expect(result.isAlreadyOptimal).toBe(true);
    expect(result.totalMonthlySavings).toBeLessThan(5);
  });

  // ---------------------------------------------------------------
  // 9. Small team plan downgrade
  // ---------------------------------------------------------------
  test('recommends cheaper plan for small teams (≤3 seats)', () => {
    const input: AuditInput = {
      teamSize: 2,
      useCase: 'development',
      tools: [{ name: 'Cursor', plan: 'Business', seats: 2, monthlySpend: 80 }],
    };

    const result = runAudit(input);
    const rec = result.tools[0];

    // Business is $40/seat, Pro is $20/seat — should recommend Pro
    expect(rec.recommendedSpend).toBeLessThan(rec.currentSpend);
    expect(rec.savings).toBeGreaterThan(0);
  });

  // ---------------------------------------------------------------
  // 10. recommended spend never exceeds current spend
  // ---------------------------------------------------------------
  test('recommended spend is never greater than current spend', () => {
    const input: AuditInput = {
      teamSize: 10,
      useCase: 'mixed',
      tools: [
        { name: 'Cursor', plan: 'Pro', seats: 10, monthlySpend: 200 },
        { name: 'GitHub Copilot', plan: 'Business', seats: 10, monthlySpend: 190 },
        { name: 'Claude', plan: 'Team', seats: 10, monthlySpend: 300 },
        { name: 'ChatGPT', plan: 'Team', seats: 10, monthlySpend: 300 },
        { name: 'Anthropic API direct', plan: 'API direct', seats: 1, monthlySpend: 400 },
        { name: 'OpenAI API direct', plan: 'API direct', seats: 1, monthlySpend: 500 },
      ],
    };

    const result = runAudit(input);

    result.tools.forEach((rec) => {
      expect(rec.recommendedSpend).toBeLessThanOrEqual(rec.currentSpend);
      expect(rec.savings).toBeGreaterThanOrEqual(0);
    });

    expect(result.totalRecommendedSpend).toBeLessThanOrEqual(result.totalCurrentSpend);
  });
});

describe('Audit Engine — buildAuditPromptText()', () => {
  test('generates a formatted text block with all key data points', () => {
    const input: AuditInput = {
      teamSize: 5,
      useCase: 'development',
      tools: [{ name: 'Cursor', plan: 'Pro', seats: 5, monthlySpend: 100 }],
    };

    const result = runAudit(input);
    const text = buildAuditPromptText(input, result);

    expect(text).toContain('Team size: 5');
    expect(text).toContain('development');
    expect(text).toContain('Cursor');
    expect(text).toContain('Current total monthly spend');
    expect(text).toContain('Estimated monthly savings');
  });
});
