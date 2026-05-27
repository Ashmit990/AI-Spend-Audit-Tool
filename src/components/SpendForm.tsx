'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowRight, Calculator, Layers, Info } from 'lucide-react';
import { AuditInput, ToolInput, ToolName } from '@/types';
import { TOOL_PRICING } from '@/lib/pricing';

// Standard tools list for selection
const AVAILABLE_TOOLS: ToolName[] = [
  'Cursor',
  'GitHub Copilot',
  'Claude',
  'ChatGPT',
  'Anthropic API direct',
  'OpenAI API direct',
  'Gemini',
  'Windsurf'
];

interface SpendFormProps {
  onSubmit: (data: AuditInput) => void;
}

export default function SpendForm({ onSubmit }: SpendFormProps) {
  // Hydration state
  const [mounted, setMounted] = useState<boolean>(false);

  // Form states
  const [teamSize, setTeamSize] = useState<number>(5);
  const [useCase, setUseCase] = useState<string>('development');
  const [tools, setTools] = useState<ToolInput[]>([]);

  // 1. Initial State Hydration (Safe from SSR Mismatches)
  useEffect(() => {
    const savedData = localStorage.getItem('credex-spend-audit-form');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.teamSize) setTeamSize(parsed.teamSize);
        if (parsed.useCase) setUseCase(parsed.useCase);
        if (parsed.tools && Array.isArray(parsed.tools)) {
          setTools(parsed.tools);
        } else {
          // Default initial tools
          setTools([
            { name: 'Cursor', plan: 'Pro', seats: 5, monthlySpend: 100 },
            { name: 'ChatGPT', plan: 'Plus', seats: 5, monthlySpend: 100 }
          ]);
        }
      } catch (e) {
        console.error('Error loading saved form data from localStorage:', e);
        // Default on fallback
        setTools([
          { name: 'Cursor', plan: 'Pro', seats: 5, monthlySpend: 100 }
        ]);
      }
    } else {
      // Default initial tools when local storage is empty
      setTools([
        { name: 'Cursor', plan: 'Pro', seats: 5, monthlySpend: 100 },
        { name: 'ChatGPT', plan: 'Plus', seats: 5, monthlySpend: 100 }
      ]);
    }
    setMounted(true);
  }, []);

  // 2. Persist state to LocalStorage on changes (only after client mount)
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(
        'credex-spend-audit-form',
        JSON.stringify({ teamSize, useCase, tools })
      );
    }
  }, [teamSize, useCase, tools, mounted]);

  // 3. React to global teamSize change
  // If teamSize changes, optionally update the seats of standard seat-based tools to match
  const handleGlobalTeamSizeChange = (newSize: number) => {
    setTeamSize(newSize);
    
    // Auto-update seats for tools that currently match the old team size to maintain convenient defaults
    setTools(prevTools =>
      prevTools.map(tool => {
        const plans = TOOL_PRICING[tool.name];
        const planDetails = plans.find(p => p.name === tool.plan) || plans[0];
        
        // Only auto-update seats if it isn't an API or custom plan, and we want to keep it simple
        if (!planDetails.isApiOrCustom) {
          const updatedSpend = newSize * planDetails.costPerSeat;
          return {
            ...tool,
            seats: newSize,
            monthlySpend: updatedSpend
          };
        }
        return tool;
      })
    );
  };

  const addTool = () => {
    const remainingTools = AVAILABLE_TOOLS.filter(
      (t) => !tools.some((existing) => existing.name === t)
    );
    if (remainingTools.length === 0) return;

    const nextTool = remainingTools[0];
    const plans = TOOL_PRICING[nextTool];
    // Default to common plan: Pro/Plus/Individual or API
    const defaultPlan = plans.find(p => p.name === 'Pro' || p.name === 'Plus' || p.name === 'Individual' || p.name === 'API direct') || plans[0];
    const initialSeats = defaultPlan.isApiOrCustom ? 1 : teamSize;
    const initialSpend = defaultPlan.isApiOrCustom ? defaultPlan.defaultSpend : initialSeats * defaultPlan.costPerSeat;

    setTools([
      ...tools,
      { name: nextTool, plan: defaultPlan.name, seats: initialSeats, monthlySpend: initialSpend }
    ]);
  };

  const removeTool = (index: number) => {
    if (tools.length <= 1) return;
    setTools(tools.filter((_, i) => i !== index));
  };

  const updateTool = (index: number, updates: Partial<ToolInput>) => {
    const updated = tools.map((tool, i) => {
      if (i === index) {
        return { ...tool, ...updates } as ToolInput;
      }
      return tool;
    });
    setTools(updated);
  };

  // 4. Dynamic Select Handlers
  const handleToolNameChange = (idx: number, name: ToolName) => {
    const plans = TOOL_PRICING[name];
    const defaultPlan = plans.find(p => p.name === 'Pro' || p.name === 'Plus' || p.name === 'Individual' || p.name === 'API direct') || plans[0];
    const currentSeats = tools[idx]?.seats || teamSize;
    const newSeats = defaultPlan.isApiOrCustom ? 1 : currentSeats;
    const newSpend = defaultPlan.isApiOrCustom ? defaultPlan.defaultSpend : newSeats * defaultPlan.costPerSeat;

    updateTool(idx, {
      name,
      plan: defaultPlan.name,
      seats: newSeats,
      monthlySpend: newSpend
    });
  };

  const handlePlanChange = (idx: number, planName: string) => {
    const tool = tools[idx];
    const plans = TOOL_PRICING[tool.name];
    const planDetails = plans.find(p => p.name === planName) || plans[0];
    const currentSeats = tool.seats;
    const newSpend = planDetails.isApiOrCustom ? planDetails.defaultSpend : currentSeats * planDetails.costPerSeat;

    updateTool(idx, {
      plan: planName,
      monthlySpend: newSpend
    });
  };

  const handleSeatsChange = (idx: number, seatsVal: number) => {
    const tool = tools[idx];
    const plans = TOOL_PRICING[tool.name];
    const planDetails = plans.find(p => p.name === tool.plan) || plans[0];
    const newSpend = planDetails.isApiOrCustom ? tool.monthlySpend : seatsVal * planDetails.costPerSeat;

    updateTool(idx, {
      seats: seatsVal,
      monthlySpend: newSpend
    });
  };

  // Helper to check if user has manually changed the calculated spend
  const isSpendAutoCalculated = (tool: ToolInput) => {
    const plans = TOOL_PRICING[tool.name];
    const planDetails = plans.find(p => p.name === tool.plan);
    if (!planDetails) return false;
    if (planDetails.isApiOrCustom) {
      return tool.monthlySpend === planDetails.defaultSpend;
    }
    return tool.monthlySpend === tool.seats * planDetails.costPerSeat;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ teamSize, useCase, tools });
  };

  // Real-time totals
  const totalMonthlySpend = tools.reduce((sum, t) => sum + t.monthlySpend, 0);
  const totalAnnualSpend = totalMonthlySpend * 12;

  // Render solid loading shell until hydration matches perfectly
  if (!mounted) {
    return (
      <div className="w-full max-w-3xl mx-auto bg-card border border-border p-8 rounded-md shadow-xl animate-pulse">
        <div className="mb-8">
          <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-slate-100/60 dark:bg-slate-800/60 rounded w-2/3"></div>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-slate-50/50 dark:bg-slate-900 border border-border rounded-md">
            <div className="h-10 bg-slate-100/60 dark:bg-slate-800/60 rounded"></div>
            <div className="h-10 bg-slate-100/60 dark:bg-slate-800/60 rounded"></div>
          </div>
          <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded w-1/4 mb-4"></div>
          <div className="h-24 bg-slate-100/30 dark:bg-slate-800/30 rounded-md"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      <form onSubmit={handleSubmit} className="form-content space-y-8">
        {/* Team Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 border border-slate-200 rounded-md relative">
          <div>
            <label htmlFor="teamSize" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
              Team Size (Active Seats)
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                id="teamSize"
                type="number"
                min="1"
                value={teamSize}
                onChange={(e) => handleGlobalTeamSizeChange(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-white border border-slate-200 hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary rounded-md py-3 px-4 text-slate-900 focus:outline-none transition font-bold"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="useCase" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
              Primary Use Case
            </label>
            <select
              id="useCase"
              value={useCase}
              onChange={(e) => setUseCase(e.target.value)}
              className="w-full bg-white border border-slate-200 hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary rounded-md py-3 px-4 text-slate-900 focus:outline-none transition cursor-pointer font-bold"
            >
              <option value="development">Software Engineering & Development</option>
              <option value="copywriting">Copywriting, Marketing & Design</option>
              <option value="general">General Business Operations</option>
              <option value="mixed">Mixed Multipurpose AI Usage</option>
            </select>
          </div>
        </div>

        {/* Tools Config Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              <h3 className="text-md font-bold text-foreground tracking-tight">Active AI Subscriptions</h3>
            </div>
            <button
              type="button"
              onClick={addTool}
              disabled={tools.length >= AVAILABLE_TOOLS.length}
              className="flex items-center gap-1.5 text-xs font-bold bg-primary/10 hover:bg-primary/20 text-primary border border-primary/10 px-4 py-2 rounded-md transition disabled:opacity-40 disabled:hover:bg-primary/10 disabled:cursor-not-allowed"
            >
              <Plus className="w-3.5 h-3.5" /> Add Tool
            </button>
          </div>

          {/* Subscriptions Grid */}
          <div className="space-y-3">
            {tools.map((tool, idx) => {
              const plans = TOOL_PRICING[tool.name] || [];
              const currentPlanDetails = plans.find(p => p.name === tool.plan) || plans[0];

              return (
                <div
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 p-5 bg-white border border-slate-200 rounded-md items-start relative group hover:shadow-md transition duration-200"
                >
                  {/* Tool Name */}
                  <div className="md:col-span-3">
                    <div className="h-5 mb-2 flex items-center">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Tool</label>
                    </div>
                    <select
                      value={tool.name}
                      onChange={(e) => handleToolNameChange(idx, e.target.value as ToolName)}
                      className="w-full bg-slate-50 border border-slate-200 hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary rounded-md py-2 px-3 text-sm text-slate-900 focus:outline-none transition cursor-pointer h-10 font-bold"
                    >
                      {AVAILABLE_TOOLS.map((t) => (
                        <option
                          key={t}
                          value={t}
                          disabled={tools.some((ext, eIdx) => ext.name === t && eIdx !== idx)}
                        >
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Plan Level */}
                  <div className="md:col-span-4">
                    <div className="h-5 mb-2 flex items-center">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Plan</label>
                    </div>
                    <select
                      value={tool.plan}
                      onChange={(e) => handlePlanChange(idx, e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary rounded-md py-2 px-3 text-sm text-slate-900 focus:outline-none transition cursor-pointer h-10 font-bold"
                    >
                      {plans.map((p) => (
                        <option key={p.name} value={p.name}>
                          {p.name} {p.costPerSeat > 0 ? `($${p.costPerSeat}/mo)` : p.isApiOrCustom ? '(Usage)' : '($0)'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Seats & Cost Sub-Grid */}
                  <div className="md:col-span-4 grid grid-cols-2 gap-3">
                    <div>
                      <div className="h-5 mb-2 flex items-center">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Seats</label>
                      </div>
                      <input
                        type="number"
                        min="1"
                        value={tool.seats}
                        disabled={currentPlanDetails.isApiOrCustom}
                        onChange={(e) => handleSeatsChange(idx, Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full bg-slate-50 border border-slate-200 hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary rounded-md py-2 px-3 text-sm text-slate-900 focus:outline-none transition disabled:opacity-40 disabled:cursor-not-allowed font-bold h-10"
                        required
                      />
                    </div>

                    <div>
                      <div className="h-5 mb-2 flex items-center justify-between">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Cost/mo ($)</label>
                        <span className={`text-[8px] px-1.5 py-0.5 rounded-sm font-black uppercase tracking-tighter ${
                          isSpendAutoCalculated(tool) 
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                            : 'bg-amber-50 text-amber-600 border border-amber-100'
                        }`}>
                          {isSpendAutoCalculated(tool) ? 'Auto' : 'Custom'}
                        </span>
                      </div>
                      <input
                        type="number"
                        min="0"
                        value={tool.monthlySpend}
                        onChange={(e) => updateTool(idx, { monthlySpend: Math.max(0, parseFloat(e.target.value) || 0) })}
                        className="w-full bg-slate-50 border border-slate-200 hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary rounded-md py-2 px-3 text-sm text-slate-900 focus:outline-none transition font-mono font-bold h-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Remove Button */}
                  <div className="md:col-span-1">
                    <div className="h-5 mb-2" aria-hidden="true" /> {/* Spacer to align with labels */}
                    <div className="flex justify-end pr-1">
                      <button
                        type="button"
                        onClick={() => removeTool(idx)}
                        disabled={tools.length <= 1}
                        className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-md transition disabled:opacity-10"
                        title="Remove subscription"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-time Summary Card */}
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center border border-primary/20 shadow-sm">
              <Calculator className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">Monthly Carry</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 font-mono">${totalMonthlySpend.toLocaleString()}</span>
                <span className="text-slate-400 text-xs font-semibold">/ month</span>
              </div>
            </div>
          </div>
          
          <div className="text-left sm:text-right border-l sm:border-l-0 sm:border-r border-slate-200 pl-5 sm:pl-0 sm:pr-5">
            <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">Annualized OpEx</p>
            <p className="text-xl font-bold text-slate-700 font-mono">${totalAnnualSpend.toLocaleString()}<span className="text-xs text-slate-400 font-normal ml-1">/yr</span></p>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row gap-6 items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Info className="w-4 h-4" />
            <span>Projected savings calculated instantly.</span>
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white text-sm font-bold py-4 px-8 rounded-md shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all duration-200"
          >
            Generate Detailed Audit <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

