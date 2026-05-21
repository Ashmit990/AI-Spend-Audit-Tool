import { TOOL_PRICING } from '../pricing';
import { ToolName } from '@/types';

describe('AI Spend Audit - Pricing Constants & Calculations', () => {
  const allTools: ToolName[] = [
    'Cursor',
    'GitHub Copilot',
    'Claude',
    'ChatGPT',
    'Anthropic API direct',
    'OpenAI API direct',
    'Gemini',
    'Windsurf'
  ];

  test('should have pricing mappings defined for all 8 target tools', () => {
    allTools.forEach((tool) => {
      expect(TOOL_PRICING[tool]).toBeDefined();
      expect(Array.isArray(TOOL_PRICING[tool])).toBe(true);
      expect(TOOL_PRICING[tool].length).toBeGreaterThan(0);
    });
  });

  test('should map Cursor plans and pricing correctly', () => {
    const cursorPlans = TOOL_PRICING['Cursor'];
    
    const hobby = cursorPlans.find(p => p.name === 'Hobby');
    expect(hobby).toBeDefined();
    expect(hobby?.costPerSeat).toBe(0);
    expect(hobby?.isApiOrCustom).toBe(false);

    const pro = cursorPlans.find(p => p.name === 'Pro');
    expect(pro).toBeDefined();
    expect(pro?.costPerSeat).toBe(20);
    expect(pro?.isApiOrCustom).toBe(false);

    const business = cursorPlans.find(p => p.name === 'Business');
    expect(business).toBeDefined();
    expect(business?.costPerSeat).toBe(40);
    expect(business?.isApiOrCustom).toBe(false);
  });

  test('should map GitHub Copilot plans and pricing correctly', () => {
    const copilotPlans = TOOL_PRICING['GitHub Copilot'];

    const individual = copilotPlans.find(p => p.name === 'Individual');
    expect(individual).toBeDefined();
    expect(individual?.costPerSeat).toBe(10);

    const business = copilotPlans.find(p => p.name === 'Business');
    expect(business).toBeDefined();
    expect(business?.costPerSeat).toBe(19);

    const enterprise = copilotPlans.find(p => p.name === 'Enterprise');
    expect(enterprise).toBeDefined();
    expect(enterprise?.costPerSeat).toBe(39);
  });

  test('should map API Direct pay-as-you-go tools correctly', () => {
    const anthropicApi = TOOL_PRICING['Anthropic API direct'];
    expect(anthropicApi[0].name).toBe('API direct');
    expect(anthropicApi[0].isApiOrCustom).toBe(true);
    expect(anthropicApi[0].defaultSpend).toBe(100);

    const openaiApi = TOOL_PRICING['OpenAI API direct'];
    expect(openaiApi[0].name).toBe('API direct');
    expect(openaiApi[0].isApiOrCustom).toBe(true);
    expect(openaiApi[0].defaultSpend).toBe(100);
  });

  test('should map Windsurf pricing correctly', () => {
    const windsurfPlans = TOOL_PRICING['Windsurf'];
    
    const free = windsurfPlans.find(p => p.name === 'Free');
    expect(free?.costPerSeat).toBe(0);

    const pro = windsurfPlans.find(p => p.name === 'Pro');
    expect(pro?.costPerSeat).toBe(15);

    const teams = windsurfPlans.find(p => p.name === 'Teams');
    expect(teams?.costPerSeat).toBe(35);
  });

  test('should map Gemini pricing correctly', () => {
    const geminiPlans = TOOL_PRICING['Gemini'];

    const pro = geminiPlans.find(p => p.name === 'Pro');
    expect(pro?.costPerSeat).toBe(20);

    const ultra = geminiPlans.find(p => p.name === 'Ultra');
    expect(ultra?.costPerSeat).toBe(30);
  });
});
