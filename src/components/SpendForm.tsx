'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowRight, Sparkles, Calculator, Layers, Info } from 'lucide-react';
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
      <div className="w-full max-w-3xl mx-auto bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl shadow-black/40 animate-pulse">
        <div className="mb-8">
          <div className="h-8 bg-zinc-800 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-zinc-800/60 rounded w-2/3"></div>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-zinc-950 border border-zinc-800/50 rounded-2xl">
            <div className="h-10 bg-zinc-800/60 rounded"></div>
            <div className="h-10 bg-zinc-800/60 rounded"></div>
          </div>
          <div className="h-6 bg-zinc-800 rounded w-1/4 mb-4"></div>
          <div className="h-24 bg-zinc-900 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto bg-zinc-900 border border-zinc-800/80 p-8 sm:p-10 rounded-3xl shadow-2xl shadow-black/60 relative overflow-hidden">
      {/* Subtle Ambient Decorative Glow inside the card */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="mb-8">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
            <Sparkles className="w-4.5 h-4.5 text-violet-400" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Configure Your AI Tech Stack</h2>
        </div>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Enter the tools, active seats, and monthly subscription costs your startup pays for. Our engine will calculate standard baseline and potential savings.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Team Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-zinc-950 border border-zinc-800/70 rounded-2xl relative">
          <div>
            <label htmlFor="teamSize" className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Team Size (Active Seats)
            </label>
            <div className="relative rounded-xl shadow-sm">
              <input
                id="teamSize"
                type="number"
                min="1"
                value={teamSize}
                onChange={(e) => handleGlobalTeamSizeChange(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl py-3 px-4 text-white focus:outline-none transition font-medium"
                required
              />
            </div>
            <p className="text-[11px] text-zinc-500 mt-1.5 leading-relaxed">
              Modifying team size auto-updates seats for your standard subscriptions.
            </p>
          </div>

          <div>
            <label htmlFor="useCase" className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Primary Use Case
            </label>
            <select
              id="useCase"
              value={useCase}
              onChange={(e) => setUseCase(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl py-3 px-4 text-zinc-200 focus:outline-none transition cursor-pointer"
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
              <Layers className="w-4.5 h-4.5 text-violet-400" />
              <h3 className="text-lg font-bold text-white tracking-tight">Active AI Tools & Subscriptions</h3>
            </div>
            <button
              type="button"
              onClick={addTool}
              disabled={tools.length >= AVAILABLE_TOOLS.length}
              className="flex items-center gap-1.5 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 hover:border-zinc-600 px-3.5 py-2 rounded-xl transition disabled:opacity-40 disabled:hover:bg-zinc-800 disabled:cursor-not-allowed shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Add Another Tool
            </button>
          </div>

          {/* Subscriptions Grid */}
          <div className="space-y-4">
            {tools.map((tool, idx) => {
              const plans = TOOL_PRICING[tool.name] || [];
              const currentPlanDetails = plans.find(p => p.name === tool.plan) || plans[0];

              return (
                <div
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 p-5 bg-zinc-950 border border-zinc-800 rounded-2xl items-end relative group hover:border-zinc-800 transition duration-200"
                >
                  {/* Tool Name */}
                  <div className="md:col-span-3">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">Tool Name</label>
                    <select
                      value={tool.name}
                      onChange={(e) => handleToolNameChange(idx, e.target.value as ToolName)}
                      className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl py-2 px-3 text-sm text-white focus:outline-none transition cursor-pointer"
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
                  <div className="md:col-span-3">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">Plan Level</label>
                    <select
                      value={tool.plan}
                      onChange={(e) => handlePlanChange(idx, e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl py-2 px-3 text-sm text-white focus:outline-none transition cursor-pointer"
                    >
                      {plans.map((p) => (
                        <option key={p.name} value={p.name}>
                          {p.name} {p.costPerSeat > 0 ? `($${p.costPerSeat}/mo)` : p.isApiOrCustom ? '(Pay/Custom)' : '($0/mo)'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Seats & Cost Sub-Grid */}
                  <div className="md:col-span-5 grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500">Seats</label>
                        {currentPlanDetails.isApiOrCustom && (
                          <span className="text-[9px] text-zinc-500 font-mono">N/A</span>
                        )}
                      </div>
                      <input
                        type="number"
                        min="1"
                        value={tool.seats}
                        disabled={currentPlanDetails.isApiOrCustom}
                        onChange={(e) => handleSeatsChange(idx, Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl py-2 px-3 text-sm text-white focus:outline-none transition disabled:opacity-40 disabled:cursor-not-allowed font-medium"
                        required
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500">Cost/mo ($)</label>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-medium ${
                          isSpendAutoCalculated(tool) 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' 
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/25'
                        }`}>
                          {isSpendAutoCalculated(tool) ? 'Auto' : 'Custom'}
                        </span>
                      </div>
                      <input
                        type="number"
                        min="0"
                        value={tool.monthlySpend}
                        onChange={(e) => updateTool(idx, { monthlySpend: Math.max(0, parseFloat(e.target.value) || 0) })}
                        className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl py-2 px-3 text-sm text-white focus:outline-none transition font-mono font-medium"
                        required
                      />
                    </div>
                  </div>

                  {/* Remove Button */}
                  <div className="md:col-span-1 flex justify-end md:pb-0.5">
                    <button
                      type="button"
                      onClick={() => removeTool(idx)}
                      disabled={tools.length <= 1}
                      className="p-2.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition disabled:opacity-20 disabled:hover:bg-transparent"
                      title="Remove subscription"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-time Summary Card */}
        <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20 shadow-sm">
              <Calculator className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 font-bold tracking-wider uppercase">Total Estimated Spend</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white font-mono">${totalMonthlySpend.toLocaleString()}</span>
                <span className="text-zinc-500 text-xs font-semibold">/ month</span>
              </div>
            </div>
          </div>
          
          <div className="text-left sm:text-right border-l sm:border-l-0 sm:border-r border-zinc-800 pl-5 sm:pl-0 sm:pr-5">
            <p className="text-[10px] text-zinc-500 font-bold tracking-wider uppercase">Estimated Annual Outflow</p>
            <p className="text-xl font-bold text-zinc-300 font-mono">${totalAnnualSpend.toLocaleString()}<span className="text-xs text-zinc-500 font-normal">/yr</span></p>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6 border-t border-zinc-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Info className="w-4 h-4 text-zinc-400" />
            <span>Form values are saved locally automatically.</span>
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold py-3.5 px-7 rounded-xl shadow-lg shadow-violet-950/40 hover:shadow-violet-500/30 transition-all duration-200"
          >
            Run AI Spend Audit <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

