import { ToolName } from '@/types';

export interface PlanDetails {
  name: string;
  costPerSeat: number;
  isApiOrCustom: boolean;
  defaultSeats: number;
  defaultSpend: number;
}

export const TOOL_PRICING: Record<ToolName, PlanDetails[]> = {
  Cursor: [
    { name: 'Hobby', costPerSeat: 0, isApiOrCustom: false, defaultSeats: 1, defaultSpend: 0 },
    { name: 'Pro', costPerSeat: 20, isApiOrCustom: false, defaultSeats: 1, defaultSpend: 20 },
    { name: 'Business', costPerSeat: 40, isApiOrCustom: false, defaultSeats: 1, defaultSpend: 40 }
  ],
  'GitHub Copilot': [
    { name: 'Individual', costPerSeat: 10, isApiOrCustom: false, defaultSeats: 1, defaultSpend: 10 },
    { name: 'Business', costPerSeat: 19, isApiOrCustom: false, defaultSeats: 1, defaultSpend: 19 },
    { name: 'Enterprise', costPerSeat: 39, isApiOrCustom: false, defaultSeats: 1, defaultSpend: 39 }
  ],
  Claude: [
    { name: 'Free', costPerSeat: 0, isApiOrCustom: false, defaultSeats: 1, defaultSpend: 0 },
    { name: 'Pro', costPerSeat: 20, isApiOrCustom: false, defaultSeats: 1, defaultSpend: 20 },
    { name: 'Team', costPerSeat: 30, isApiOrCustom: false, defaultSeats: 1, defaultSpend: 30 },
    { name: 'Enterprise', costPerSeat: 95, isApiOrCustom: true, defaultSeats: 10, defaultSpend: 950 }
  ],
  ChatGPT: [
    { name: 'Plus', costPerSeat: 20, isApiOrCustom: false, defaultSeats: 1, defaultSpend: 20 },
    { name: 'Team', costPerSeat: 30, isApiOrCustom: false, defaultSeats: 1, defaultSpend: 30 },
    { name: 'Enterprise', costPerSeat: 60, isApiOrCustom: true, defaultSeats: 20, defaultSpend: 1200 }
  ],
  'Anthropic API direct': [
    { name: 'API direct', costPerSeat: 0, isApiOrCustom: true, defaultSeats: 1, defaultSpend: 100 }
  ],
  'OpenAI API direct': [
    { name: 'API direct', costPerSeat: 0, isApiOrCustom: true, defaultSeats: 1, defaultSpend: 100 }
  ],
  Gemini: [
    { name: 'Pro', costPerSeat: 20, isApiOrCustom: false, defaultSeats: 1, defaultSpend: 20 },
    { name: 'Ultra', costPerSeat: 30, isApiOrCustom: false, defaultSeats: 1, defaultSpend: 30 }
  ],
  Windsurf: [
    { name: 'Free', costPerSeat: 0, isApiOrCustom: false, defaultSeats: 1, defaultSpend: 0 },
    { name: 'Pro', costPerSeat: 15, isApiOrCustom: false, defaultSeats: 1, defaultSpend: 15 },
    { name: 'Teams', costPerSeat: 35, isApiOrCustom: false, defaultSeats: 1, defaultSpend: 35 }
  ]
};
