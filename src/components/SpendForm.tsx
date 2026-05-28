'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowRight, Calculator, Layers, Info, Sparkles, Loader2 } from 'lucide-react';
import { AuditInput, ToolInput, ToolName } from '@/types';
import { TOOL_PRICING } from '@/lib/pricing';
import { motion, AnimatePresence } from 'framer-motion';

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
  const handleGlobalTeamSizeChange = (newSize: number) => {
    const val = isNaN(newSize) ? 0 : Math.max(1, newSize);
    setTeamSize(val);
    
    setTools(prevTools =>
      prevTools.map(tool => {
        const plans = TOOL_PRICING[tool.name];
        const planDetails = plans.find(p => p.name === tool.plan) || plans[0];
        
        if (!planDetails.isApiOrCustom) {
          const updatedSpend = val * planDetails.costPerSeat;
          return {
            ...tool,
            seats: val,
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
    
    const newSeats = planDetails.isApiOrCustom ? 1 : tool.seats;
    const newSpend = planDetails.isApiOrCustom ? planDetails.defaultSpend : newSeats * planDetails.costPerSeat;

    updateTool(idx, {
      plan: planName,
      seats: newSeats,
      monthlySpend: newSpend
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      teamSize,
      useCase,
      tools,
      email: '' // Handled by API
    });
  };

  if (!mounted) return <div className="min-h-[400px] flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-slate-300" /></div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6 sm:p-10"
    >
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Global Settings */}
        <div className="grid sm:grid-cols-2 gap-8 pb-8 border-b border-slate-100">
          <div className="space-y-3">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5" />
              Company Size
            </label>
            <div className="relative">
              <input
                type="number"
                value={teamSize}
                onChange={(e) => handleGlobalTeamSizeChange(parseInt(e.target.value))}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-4 text-lg font-bold focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400 transition-all outline-none"
                placeholder="5"
                min="1"
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">Employees</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Info className="w-3.5 h-3.5" />
              Primary Stack
            </label>
            <select
              value={useCase}
              onChange={(e) => setUseCase(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-4 text-lg font-bold focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400 transition-all appearance-none cursor-pointer outline-none"
            >
              <option value="development">Software Engineering</option>
              <option value="content">Marketing & Content</option>
              <option value="operations">Operations & Support</option>
              <option value="enterprise">Multi-disciplinary</option>
            </select>
          </div>
        </div>

        {/* Tools List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-2">
              Current AI Stack
              <span className="bg-slate-100 text-slate-500 text-[10px] py-1 px-2 rounded-full">{tools.length}</span>
            </h3>
            <button
              type="button"
              onClick={addTool}
              disabled={tools.length >= AVAILABLE_TOOLS.length}
              className="group flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors disabled:opacity-30"
            >
              <div className="w-6 h-6 rounded-full border-2 border-slate-200 flex items-center justify-center group-hover:border-slate-400 transition-colors">
                <Plus className="w-3.5 h-3.5" />
              </div>
              Add Tool
            </button>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {tools.map((tool, idx) => (
                <motion.div
                  key={`${tool.name}-${idx}`}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="premium-card p-5 group relative"
                >
                  <button
                    type="button"
                    onClick={() => removeTool(idx)}
                    className="absolute -right-2 -top-2 w-8 h-8 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 hover:border-red-100 shadow-sm opacity-0 group-hover:opacity-100 transition-all z-10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tool</label>
                      <select
                        value={tool.name}
                        onChange={(e) => handleToolNameChange(idx, e.target.value as ToolName)}
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-slate-900/5 transition-all outline-none cursor-pointer"
                      >
                        {AVAILABLE_TOOLS.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex-1 space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Plan</label>
                      <select
                        value={tool.plan}
                        onChange={(e) => handlePlanChange(idx, e.target.value)}
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-slate-900/5 transition-all outline-none cursor-pointer"
                      >
                        {TOOL_PRICING[tool.name].map((p) => (
                          <option key={p.name} value={p.name}>{p.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="w-full lg:w-24 space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {TOOL_PRICING[tool.name].find(p => p.name === tool.plan)?.isApiOrCustom ? 'Usage' : 'Seats'}
                      </label>
                      <input
                        type="number"
                        value={tool.seats}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          const plan = TOOL_PRICING[tool.name].find(p => p.name === tool.plan)!;
                          updateTool(idx, { 
                            seats: val,
                            monthlySpend: plan.isApiOrCustom ? tool.monthlySpend : val * plan.costPerSeat
                          });
                        }}
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-slate-900/5 transition-all outline-none"
                      />
                    </div>

                    <div className="w-full lg:w-32 space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Monthly Spend</label>
                      <div className="flex items-center gap-1 bg-slate-50 border-2 border-slate-200 rounded-lg px-3 py-2">
                        <span className="text-slate-400 font-bold text-sm">$</span>
                        <input
                          type="number"
                          value={tool.monthlySpend}
                          onChange={(e) => updateTool(idx, { monthlySpend: parseInt(e.target.value) })}
                          readOnly={!TOOL_PRICING[tool.name].find(p => p.name === tool.plan)?.isApiOrCustom}
                          className={`w-full bg-transparent border-none p-0 text-sm font-bold focus:ring-0 outline-none ${
                            !TOOL_PRICING[tool.name].find(p => p.name === tool.plan)?.isApiOrCustom ? 'text-slate-500' : ''
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <button
          type="submit"
          className="w-full btn-primary h-16 text-lg flex items-center justify-center gap-3 shadow-xl shadow-slate-200 hover:shadow-2xl hover:shadow-slate-300 transform transition-all group"
        >
          <Sparkles className="w-5 h-5 fill-white group-hover:rotate-12 transition-transform" />
          Generate Savings Audit
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </form>
    </motion.div>
  );
}

