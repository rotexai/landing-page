import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { differentiators } from '../../dataset/differentiators';
import SectionIcon from '../SectionIcon';

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

const Differentiators = ({ copy }) => {
    const [criteriaHeader, workforceHeader, agentHeader, rotexHeader] = copy.tableHeaders;

    return (
        <section id="differentiators" className="relative overflow-hidden bg-zinc-50 px-6 py-24">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_18%_8%,rgba(255,255,255,0.86),transparent_25rem),radial-gradient(circle_at_84%_12%,rgba(228,228,231,0.42),transparent_26rem)]"></div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <div data-reveal className="mb-14 text-center">
                    <SectionIcon icon={ShieldCheck} />
                    <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-purple-400">
                        {copy.label}
                    </p>
                    <h2 className="font-['Be_Vietnam_Pro'] text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
                        <span className="language-copy inline-block">{copy.title}</span> <span className="language-copy inline-block text-purple-400">{copy.accent}</span>
                    </h2>
                    <p className="text-zinc-600 max-w-xl mx-auto">
                        {copy.description}
                    </p>
                </div>

                <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-12">
                    <div data-reveal className="group relative h-full overflow-hidden rounded-3xl border border-white/95 bg-white/[0.06] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_-1px_0_rgba(255,255,255,0.34),0_30px_90px_rgba(24,24,27,0.14)] ring-1 ring-white/80 backdrop-blur-[28px] backdrop-saturate-150 transition-all duration-300 hover:-translate-y-1 hover:border-amber-200/90 hover:bg-amber-300/10 hover:shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_-1px_0_rgba(255,255,255,0.42),0_0_42px_rgba(245,158,11,0.18),0_36px_100px_rgba(24,24,27,0.15)] hover:ring-amber-200/70">
                        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.44),rgba(255,255,255,0.08)_38%,rgba(255,255,255,0.01)_74%)] transition-opacity duration-300 group-hover:opacity-35"></div>
                        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(251,191,36,0.22),rgba(251,191,36,0.08)_42%,rgba(255,255,255,0.01)_76%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                        <div className="absolute inset-px rounded-[23px] border border-white/85 transition-colors duration-300 group-hover:border-amber-100/90"></div>
                        <div className="relative z-10 flex h-full flex-col justify-center">
                            <h3 className="font-['Be_Vietnam_Pro'] text-2xl md:text-3xl font-bold text-zinc-900 leading-tight transition-colors duration-300 group-hover:text-amber-500">
                                {copy.featureTitle}
                            </h3>
                            <div className="mt-5 space-y-4 text-zinc-600 leading-relaxed">
                                {copy.featureParagraphs.map((paragraph) => (
                                    <p key={paragraph}>{paragraph}</p>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        {differentiators.map((item, index) => (
                            <DifferentiatorCard
                                key={item.id}
                                {...item}
                                title={copy.cards[index].title}
                                description={copy.cards[index].description}
                                className={index === 4 ? 'md:col-span-2' : ''}
                                style={{ '--reveal-delay': `${index * 90}ms` }}
                            />
                        ))}
                    </div>
                </div>

                <div className="mt-16">
                    <div data-reveal className="mb-8 text-center">
                        <h3 className="font-['Be_Vietnam_Pro'] text-2xl md:text-3xl font-bold text-zinc-900">
                            {copy.comparisonTitle}
                        </h3>
                        <p className="text-zinc-600 max-w-2xl mx-auto mt-3">
                            {copy.comparisonDescription}
                        </p>
                    </div>

                    <div data-reveal className="relative overflow-hidden rounded-3xl border border-white bg-white/[0.045] shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_-1px_0_rgba(255,255,255,0.34),0_34px_110px_rgba(24,24,27,0.16)] ring-1 ring-white/90 backdrop-blur-[32px] backdrop-saturate-150 before:absolute before:inset-0 before:pointer-events-none before:bg-[linear-gradient(135deg,rgba(255,255,255,0.34),rgba(255,255,255,0.06)_38%,rgba(255,255,255,0.01)_74%)] before:opacity-75 after:absolute after:inset-px after:pointer-events-none after:rounded-[23px] after:border after:border-white/90">
                        <div className="relative z-10 overflow-x-auto">
                            <div className="min-w-[860px]">
                                <div className="grid grid-cols-[0.85fr_1fr_1fr_1.08fr] border-b border-white/55 bg-white/[0.04]">
                                    <div className="p-5 text-sm font-bold uppercase tracking-[0.12em] text-zinc-500">{criteriaHeader}</div>
                                    <div className="p-5 text-sm font-bold uppercase tracking-[0.12em] text-zinc-500">{workforceHeader}</div>
                                    <div className="p-5 text-sm font-bold uppercase tracking-[0.12em] text-zinc-500">{agentHeader}</div>
                                    <div className="m-3 mb-0 rounded-t-2xl border-x border-t border-amber-200/90 bg-amber-300/15 p-5 text-sm font-extrabold uppercase tracking-[0.14em] text-amber-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_0_36px_rgba(245,158,11,0.24)] backdrop-blur-2xl">{rotexHeader}</div>
                                </div>

                                {copy.comparisonRows.map((row, index) => (
                                    <div className="grid grid-cols-[0.85fr_1fr_1fr_1.08fr] border-b border-white/45 last:border-b-0" key={row[0]}>
                                        <div className="p-5 font-bold text-zinc-900">{row[0]}</div>
                                        <div className="p-5 text-zinc-600">{row[1]}</div>
                                        <div className="p-5 text-zinc-600">{row[2]}</div>
                                        <div className={`mx-3 border-x border-amber-200/90 bg-amber-300/10 p-5 font-normal text-zinc-600 shadow-[inset_1px_0_0_rgba(255,255,255,0.55),inset_-1px_0_0_rgba(255,255,255,0.35),0_0_36px_rgba(245,158,11,0.16)] backdrop-blur-2xl ${index === copy.comparisonRows.length - 1 ? 'mb-3 rounded-b-2xl border-b' : ''}`}>
                                            {row[3]}
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
