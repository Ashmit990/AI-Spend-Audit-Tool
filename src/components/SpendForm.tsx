'use client';

import React, { useState } from 'react';
import { Plus, Trash2, ArrowRight } from 'lucide-react';
import { AuditInput, ToolInput, ToolName } from '@/types';

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
  // Skeleton form state
  const [teamSize, setTeamSize] = useState<number>(1);
  const [useCase, setUseCase] = useState<string>('development');
  const [tools, setTools] = useState<ToolInput[]>([
    { name: 'Cursor', plan: 'Pro', seats: 1, monthlySpend: 20 }
  ]);

  const addTool = () => {
    const remainingTools = AVAILABLE_TOOLS.filter(
      (t) => !tools.some((existing) => existing.name === t)
    );
    if (remainingTools.length === 0) return;

    setTools([
      ...tools,
      { name: remainingTools[0], plan: 'Pro', seats: 1, monthlySpend: 20 }
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ teamSize, useCase, tools });
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Configure Your AI Tech Stack</h2>
        <p className="text-slate-400 text-sm">
          Enter the tools, seat counts, and subscriptions your startup currently pays for to get an instant cost optimization audit.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Team Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-white/[0.02] border border-white/5 rounded-xl">
          <div>
            <label htmlFor="teamSize" className="block text-sm font-semibold text-slate-300 mb-2">
              Team Size (Active Seats)
            </label>
            <input
              id="teamSize"
              type="number"
              min="1"
              value={teamSize}
              onChange={(e) => setTeamSize(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full bg-slate-950 border border-white/10 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
              required
            />
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
            <h3 className="text-lg font-semibold text-white">Active AI Tools & Subscriptions</h3>
            <button
              type="button"
              onClick={addTool}
              disabled={tools.length >= AVAILABLE_TOOLS.length}
              className="flex items-center gap-1.5 text-xs font-semibold bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/20 hover:border-violet-500/30 px-3 py-1.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-3.5 h-3.5" /> Add Another Tool
            </button>
          </div>

          <div className="space-y-4">
            {tools.map((tool, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-950/40 border border-white/5 rounded-xl items-end relative group hover:border-white/10 transition"
              >
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Tool Name</label>
                  <select
                    value={tool.name}
                    onChange={(e) => updateTool(idx, { name: e.target.value as ToolName })}
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

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Plan Level</label>
                  <select
                    value={tool.plan}
                    onChange={(e) => updateTool(idx, { plan: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-md py-1.5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
                  >
                    <option value="Pro">Pro ($20/mo)</option>
                    <option value="Team">Team ($30/mo)</option>
                    <option value="Enterprise">Enterprise (Custom)</option>
                    <option value="Free">Free ($0/mo)</option>
                    <option value="API direct">API Direct (Pay As You Go)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Seats</label>
                    <input
                      type="number"
                      min="1"
                      value={tool.seats}
                      onChange={(e) => updateTool(idx, { seats: Math.max(1, parseInt(e.target.value) || 1) })}
                      className="w-full bg-slate-950 border border-white/10 rounded-md py-1.5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Cost/mo ($)</label>
                    <input
                      type="number"
                      min="0"
                      value={tool.monthlySpend}
                      onChange={(e) => updateTool(idx, { monthlySpend: Math.max(0, parseFloat(e.target.value) || 0) })}
                      className="w-full bg-slate-950 border border-white/10 rounded-md py-1.5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end md:pb-1">
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
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-white/5 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 duration-200"
          >
            Run AI Spend Audit <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
