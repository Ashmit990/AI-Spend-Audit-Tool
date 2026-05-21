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

  // Render glassmorphic loading shell until hydration matches perfectly
  if (!mounted) {
    return (
      <div className="w-full max-w-3xl mx-auto bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl animate-pulse">
        <div className="mb-8">
          <div className="h-8 bg-white/10 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-white/5 rounded w-2/3"></div>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-white/[0.01] border border-white/5 rounded-xl">
            <div className="h-10 bg-white/5 rounded"></div>
            <div className="h-10 bg-white/5 rounded"></div>
          </div>
          <div className="h-6 bg-white/10 rounded w-1/4 mb-4"></div>
          <div className="h-24 bg-white/5 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
      {/* Absolute Decorative Blur */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl -z-10"></div>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-violet-400" />
          <h2 className="text-2xl font-bold text-white tracking-tight">Configure Your AI Tech Stack</h2>
        </div>
        <p className="text-slate-400 text-sm">
          Enter the tools, seat counts, and monthly subscriptions your startup pays for. Our engine will calculate standard baseline and potential savings.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Team Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-white/[0.02] border border-white/5 rounded-xl relative">
          <div>
            <label htmlFor="teamSize" className="block text-sm font-semibold text-slate-300 mb-2">
              Team Size (Active Seats)
            </label>
            <div className="relative rounded-lg shadow-sm">
              <input
                id="teamSize"
                type="number"
                min="1"
                value={teamSize}
                onChange={(e) => handleGlobalTeamSizeChange(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-slate-950 border border-white/10 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition font-medium"
                required
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Modifying team size auto-updates seats for your standard subscriptions.
            </p>
          </div>

          <div>
            <label htmlFor="useCase" className="block text-sm font-semibold text-slate-300 mb-2">
              Primary Use Case
            </label>
            <select
              id="useCase"
              value={useCase}
              onChange={(e) => setUseCase(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
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
              <Layers className="w-4 h-4 text-violet-400" />
              <h3 className="text-lg font-semibold text-white">Active AI Tools & Subscriptions</h3>
            </div>
            <button
              type="button"
              onClick={addTool}
              disabled={tools.length >= AVAILABLE_TOOLS.length}
              className="flex items-center gap-1.5 text-xs font-semibold bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/20 hover:border-violet-500/30 px-3 py-1.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-slate-950/40 border border-white/5 rounded-xl items-end relative group hover:border-white/10 transition"
                >
                  {/* Tool Name */}
                  <div className="md:col-span-3">
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Tool Name</label>
                    <select
                      value={tool.name}
                      onChange={(e) => handleToolNameChange(idx, e.target.value as ToolName)}
                      className="w-full bg-slate-950 border border-white/10 rounded-md py-1.5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
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
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Plan Level</label>
                    <select
                      value={tool.plan}
                      onChange={(e) => handlePlanChange(idx, e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-md py-1.5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
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
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-xs font-semibold text-slate-400">Seats</label>
                        {currentPlanDetails.isApiOrCustom && (
                          <span className="text-[9px] text-slate-500 font-mono">N/A (API)</span>
                        )}
                      </div>
                      <input
                        type="number"
                        min="1"
                        value={tool.seats}
                        disabled={currentPlanDetails.isApiOrCustom}
                        onChange={(e) => handleSeatsChange(idx, Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full bg-slate-950 border border-white/10 rounded-md py-1.5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        required
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-xs font-semibold text-slate-400">Cost/mo ($)</label>
                        <span className={`text-[9px] px-1 rounded font-mono font-medium ${
                          isSpendAutoCalculated(tool) 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {isSpendAutoCalculated(tool) ? 'Auto' : 'Custom'}
                        </span>
                      </div>
                      <input
                        type="number"
                        min="0"
                        value={tool.monthlySpend}
                        onChange={(e) => updateTool(idx, { monthlySpend: Math.max(0, parseFloat(e.target.value) || 0) })}
                        className="w-full bg-slate-950 border border-white/10 rounded-md py-1.5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition font-mono font-medium"
                        required
                      />
                    </div>
                  </div>

                  {/* Remove Button */}
                  <div className="md:col-span-1 flex justify-end md:pb-1">
                    <button
                      type="button"
                      onClick={() => removeTool(idx)}
                      disabled={tools.length <= 1}
                      className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition disabled:opacity-30 disabled:hover:bg-transparent"
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
        <div className="p-5 bg-gradient-to-br from-violet-950/20 to-indigo-950/20 border border-violet-500/10 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-600/10 flex items-center justify-center border border-violet-500/20">
              <Calculator className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold tracking-wide uppercase">Total Estimated Spend</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white font-mono">${totalMonthlySpend.toLocaleString()}</span>
                <span className="text-slate-500 text-xs font-semibold">/ month</span>
              </div>
            </div>
          </div>
          
          <div className="text-left sm:text-right border-l sm:border-l-0 sm:border-r border-white/5 pl-4 sm:pl-0 sm:pr-4">
            <p className="text-xs text-slate-500">Estimated Annual Outflow</p>
            <p className="text-lg font-bold text-slate-300 font-mono">${totalAnnualSpend.toLocaleString()}<span className="text-xs text-slate-500 font-normal">/yr</span></p>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>Form state is saved locally automatically.</span>
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 duration-200"
          >
            Run AI Spend Audit <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

