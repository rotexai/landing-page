import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { differentiators } from '../../dataset/differentiators';
import SectionIcon from '../SectionIcon';

const comparisonRows = [
    {
        criteria: 'Resources managed',
        agent: 'Primarily employees and contractors',
        workflow: 'Primarily AI agents',
        rotexai: 'People, AI agents, service providers, and hybrid teams',
    },
    {
        criteria: 'Task assignment',
        agent: 'Manually assigned by managers',
        workflow: 'Triggered through prompts or automations',
        rotexai: 'Recommends the right person, agent, or Human-Agent team',
    },
    {
        criteria: 'Matching method',
        agent: 'Job titles, resumes, and keywords',
        workflow: 'Feature lists',
        rotexai: 'Capabilities, task requirements, and expected outcomes',
    },
    {
        criteria: 'Governance',
        agent: 'HR policies',
        workflow: 'Separate agent permissions',
        rotexai: 'Unified permissions, approvals, and human oversight',
    },
    {
        criteria: 'Measurement',
        agent: 'Human productivity metrics',
        workflow: 'Technical or usage metrics',
        rotexai: 'Cost, speed, quality, reliability, and outcomes',
    },
];

const DifferentiatorCard = ({ title, description, icon, color, className = '', style }) => {
    const Icon = icon;
    return (
        <article data-reveal style={style} className={`differentiator-card group relative overflow-hidden rounded-2xl border border-white/95 bg-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_-1px_0_rgba(255,255,255,0.34),0_26px_82px_rgba(24,24,27,0.13)] ring-1 ring-white/80 backdrop-blur-[28px] backdrop-saturate-150 transition-all duration-300 hover:-translate-y-1 hover:border-amber-200/90 hover:bg-amber-300/10 hover:shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_-1px_0_rgba(255,255,255,0.42),0_0_38px_rgba(245,158,11,0.2),0_32px_92px_rgba(24,24,27,0.15)] hover:ring-amber-200/70 ${className}`}>
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.44),rgba(255,255,255,0.08)_38%,rgba(255,255,255,0.01)_74%)] opacity-70 transition-opacity duration-300 group-hover:opacity-35"></div>
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(251,191,36,0.22),rgba(251,191,36,0.08)_42%,rgba(255,255,255,0.01)_76%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <div className="absolute inset-px rounded-[15px] border border-white/85 transition-colors duration-300 group-hover:border-amber-100/90"></div>

            <div className="relative z-10 flex items-start gap-4 p-5">
                <div className={`inline-flex shrink-0 p-3 rounded-xl border border-white/95 bg-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.98),0_14px_34px_rgba(24,24,27,0.08)] ring-1 ring-white/70 backdrop-blur-2xl transition-all duration-300 group-hover:border-amber-200/90 group-hover:bg-amber-300/15 group-hover:text-amber-500 group-hover:ring-amber-200/70 group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.98),0_0_28px_rgba(245,158,11,0.2),0_14px_34px_rgba(24,24,27,0.08)] ${color}`}>
                    <Icon size={24} className="transition-colors duration-300" />
                </div>

                <div>
                    <h3 className="text-lg font-bold text-zinc-900 mb-2 transition-colors duration-300 group-hover:text-amber-500">
                        {title}
                    </h3>

                    <p className="text-sm text-zinc-600 leading-relaxed">
                        {description}
                    </p>
                </div>
            </div>
        </article>
    );
};

const Differentiators = () => {
    return (
        <section id="differentiators" className="relative overflow-hidden bg-zinc-50 px-6 py-24">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_18%_8%,rgba(255,255,255,0.86),transparent_25rem),radial-gradient(circle_at_84%_12%,rgba(228,228,231,0.42),transparent_26rem)]"></div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <div data-reveal className="mb-14 text-center">
                    <SectionIcon icon={ShieldCheck} />
                    <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-purple-400">
                        Why RotexAI
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4 font-['Poppins']">
                        Understand Who Is Doing The Work, And <span className="text-purple-400">Why</span>
                    </h2>
                    <p className="text-zinc-600 max-w-xl mx-auto">
                        RotexAI manages people and AI agents as one unified workforce, with accountability across the lifecycle of work.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[0.72fr_1.28fr] gap-8 lg:gap-12 items-start">
                    <div data-reveal className="group relative overflow-hidden rounded-3xl border border-white/95 bg-white/[0.06] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_-1px_0_rgba(255,255,255,0.34),0_30px_90px_rgba(24,24,27,0.14)] ring-1 ring-white/80 backdrop-blur-[28px] backdrop-saturate-150 transition-all duration-300 hover:-translate-y-1 hover:border-amber-200/90 hover:bg-amber-300/10 hover:shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_-1px_0_rgba(255,255,255,0.42),0_0_42px_rgba(245,158,11,0.18),0_36px_100px_rgba(24,24,27,0.15)] hover:ring-amber-200/70">
                        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.44),rgba(255,255,255,0.08)_38%,rgba(255,255,255,0.01)_74%)] transition-opacity duration-300 group-hover:opacity-35"></div>
                        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(251,191,36,0.22),rgba(251,191,36,0.08)_42%,rgba(255,255,255,0.01)_76%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                        <div className="absolute inset-px rounded-[23px] border border-white/85 transition-colors duration-300 group-hover:border-amber-100/90"></div>
                        <div className="relative z-10">
                            <h3 className="text-2xl md:text-3xl font-bold text-zinc-900 font-['Poppins'] leading-tight transition-colors duration-300 group-hover:text-amber-500">
                                RotexAI does more than deploy people or agents.
                            </h3>
                            <div className="mt-5 space-y-4 text-zinc-600 leading-relaxed">
                                <p>
                                    It provides visibility across the full lifecycle of work: selection, assignment, execution, governance, and performance.
                                </p>
                                <p>
                                    Teams can expand their use of AI while keeping accountability, oversight, and control in one operating system.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {differentiators.map((item, index) => (
                            <DifferentiatorCard
                                key={item.id}
                                {...item}
                                className={index === 4 ? 'md:col-span-2' : ''}
                                style={{ '--reveal-delay': `${index * 90}ms` }}
                            />
                        ))}
                    </div>
                </div>

                <div className="mt-16">
                    <div data-reveal className="mb-8 text-center">
                        <h3 className="text-2xl md:text-3xl font-bold text-zinc-900 font-['Poppins']">
                            How RotexAI Differs From Existing Tools
                        </h3>
                        <p className="text-zinc-600 max-w-2xl mx-auto mt-3">
                            Traditional workforce tools primarily manage people. AI platforms typically manage agents. RotexAI manages both.
                        </p>
                    </div>

                    <div data-reveal className="relative overflow-hidden rounded-3xl border border-white bg-white/[0.045] shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_-1px_0_rgba(255,255,255,0.34),0_34px_110px_rgba(24,24,27,0.16)] ring-1 ring-white/90 backdrop-blur-[32px] backdrop-saturate-150 before:absolute before:inset-0 before:pointer-events-none before:bg-[linear-gradient(135deg,rgba(255,255,255,0.34),rgba(255,255,255,0.06)_38%,rgba(255,255,255,0.01)_74%)] before:opacity-75 after:absolute after:inset-px after:pointer-events-none after:rounded-[23px] after:border after:border-white/90">
                        <div className="relative z-10 overflow-x-auto">
                            <div className="min-w-[860px]">
                                <div className="grid grid-cols-[0.85fr_1fr_1fr_1.08fr] border-b border-white/55 bg-white/[0.04]">
                                    <div className="p-5 text-sm font-bold uppercase tracking-[0.12em] text-zinc-500">Criteria</div>
                                    <div className="p-5 text-sm font-bold uppercase tracking-[0.12em] text-zinc-500">Workforce tools</div>
                                    <div className="p-5 text-sm font-bold uppercase tracking-[0.12em] text-zinc-500">AI agent platforms</div>
                                    <div className="m-3 mb-0 rounded-t-2xl border-x border-t border-amber-200/90 bg-amber-300/15 p-5 text-sm font-extrabold uppercase tracking-[0.14em] text-amber-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_0_36px_rgba(245,158,11,0.24)] backdrop-blur-2xl">RotexAI</div>
                                </div>

                                {comparisonRows.map((row, index) => (
                                    <div className="grid grid-cols-[0.85fr_1fr_1fr_1.08fr] border-b border-white/45 last:border-b-0" key={row.criteria}>
                                        <div className="p-5 font-bold text-zinc-900">{row.criteria}</div>
                                        <div className="p-5 text-zinc-600">{row.agent}</div>
                                        <div className="p-5 text-zinc-600">{row.workflow}</div>
                                        <div className={`mx-3 border-x border-amber-200/90 bg-amber-300/10 p-5 font-bold text-zinc-900 shadow-[inset_1px_0_0_rgba(255,255,255,0.55),inset_-1px_0_0_rgba(255,255,255,0.35),0_0_36px_rgba(245,158,11,0.16)] backdrop-blur-2xl ${index === comparisonRows.length - 1 ? 'mb-3 rounded-b-2xl border-b' : ''}`}>
                                            {row.rotexai}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Differentiators;
