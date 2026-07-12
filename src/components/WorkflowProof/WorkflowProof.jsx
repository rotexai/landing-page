import React, { useEffect, useRef, useState } from 'react';
import { Bot, BriefcaseBusiness, ChevronDown, HelpCircle, Search, ShieldCheck, Sparkles, Store, Users } from 'lucide-react';
import SectionIcon from '../SectionIcon';

const marketplaceItems = [
    {
        title: 'Find The Right Experts For The Work',
        description: 'Discover employees, freelancers, consultants, and service providers based on skills, availability, experience, and proven results.',
        icon: BriefcaseBusiness,
    },
    {
        title: 'Find The Right AI Agent For Every Task',
        description: 'Compare capabilities, cost, reliability, integrations, governance requirements, and performance history before adding an agent.',
        icon: Bot,
    },
    {
        title: 'Deploy Human-Agent Teams',
        description: 'Choose recommended combinations of people and AI agents designed around a specific business outcome.',
        icon: Users,
    },
    {
        title: 'Publish And Monetize AI Agents',
        description: 'Developers and organizations can list agents, distribute them to customers, and generate revenue through subscriptions or usage.',
        icon: Store,
    },
];

const MarketplaceIllustration = ({ copy }) => (
    <div data-reveal className="marketplace-panel relative mx-auto mb-12 max-w-5xl overflow-hidden rounded-[2rem] border border-white/95 bg-white/[0.06] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_-1px_0_rgba(255,255,255,0.34),0_34px_100px_rgba(24,24,27,0.14)] ring-1 ring-white/80 backdrop-blur-[28px] backdrop-saturate-150 before:absolute before:inset-0 before:pointer-events-none before:bg-[linear-gradient(135deg,rgba(255,255,255,0.5),rgba(255,255,255,0.09)_38%,rgba(255,255,255,0.01)_74%)] before:opacity-70 after:absolute after:inset-px after:pointer-events-none after:rounded-[31px] after:border after:border-white/85 md:p-5">
        <div className="relative z-10 grid gap-4 rounded-[1.6rem] bg-white/[0.16] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)] backdrop-blur-2xl lg:grid-cols-[1.16fr_0.84fr] lg:gap-0 lg:p-5">
            <div className="marketplace-match-card rounded-[1.35rem] border border-white/85 bg-white/[0.28] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_18px_48px_rgba(24,24,27,0.08)] backdrop-blur-2xl lg:rounded-r-none lg:border-r-0">
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-500">{copy.eyebrow}</p>
                        <h3 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900">{copy.title}</h3>
                    </div>
                    <div className="marketplace-badge hidden rounded-2xl border border-amber-200/90 bg-amber-300/15 px-4 py-2 text-sm font-bold text-amber-600 shadow-[0_0_28px_rgba(245,158,11,0.18)] sm:block">
                        {copy.fit}
                    </div>
                </div>

                <div className="marketplace-query mb-5 flex items-center gap-3 rounded-xl border border-white/85 bg-white/55 px-4 py-3 text-zinc-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]">
                    <Search size={17} className="text-amber-500" />
                    <span className="text-sm leading-none">{copy.query}</span>
                </div>

                <div className="mb-5 flex flex-wrap gap-2">
                    {copy.chips.map((chip) => (
                        <span key={chip} className="rounded-full border border-white/85 bg-white/40 px-3 py-1 text-xs font-semibold text-zinc-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]">
                            {chip}
                        </span>
                    ))}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="marketplace-resource-card rounded-2xl border border-white/85 bg-white/38 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]">
                        <div className="mb-3 flex items-center gap-3">
                            <div className="rounded-xl bg-amber-300/18 p-2 text-amber-500">
                                <BriefcaseBusiness size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-zinc-900">{copy.resources[0][0]}</p>
                                <p className="text-xs text-zinc-500">{copy.resources[0][1]}</p>
                            </div>
                        </div>
                        <div className="h-2 rounded-full bg-zinc-200">
                            <div className="marketplace-progress-fill h-2 rounded-full bg-amber-400" style={{ '--progress-width': '82%' }}></div>
                        </div>
                    </div>

                    <div className="marketplace-resource-card rounded-2xl border border-white/85 bg-white/38 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]">
                        <div className="mb-3 flex items-center gap-3">
                            <div className="rounded-xl bg-amber-300/18 p-2 text-amber-500">
                                <Bot size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-zinc-900">{copy.resources[1][0]}</p>
                                <p className="text-xs text-zinc-500">{copy.resources[1][1]}</p>
                            </div>
                        </div>
                        <div className="h-2 rounded-full bg-zinc-200">
                            <div className="marketplace-progress-fill h-2 rounded-full bg-amber-400" style={{ '--progress-width': '76%' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="marketplace-insight-panel relative overflow-hidden rounded-[1.35rem] border border-white/85 bg-white/[0.2] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_18px_48px_rgba(24,24,27,0.08)] backdrop-blur-2xl lg:rounded-l-none lg:border-l-0">
                <div className="absolute -right-10 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-amber-300/10 blur-3xl" />
                <div className="relative z-10 space-y-3">
                    {copy.insights.map(([label, text], index) => {
                        const Icon = [Sparkles, ShieldCheck, Users][index];
                        return (
                        <div
                            key={label}
                            className="marketplace-side-item flex items-center justify-start gap-4 rounded-2xl border border-white/85 bg-white/42 p-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]"
                            style={{ '--item-delay': `${index * 120}ms`, '--item-offset': '0px' }}
                        >
                            <div className="relative rounded-xl bg-amber-300/18 p-2 text-amber-500 shadow-[0_10px_26px_rgba(245,158,11,0.12)]">
                                <Icon size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-zinc-900">{label}</p>
                                <p className="text-xs text-zinc-500">{text}</p>
                            </div>
                        </div>
                        );
                    })}
                </div>
            </div>
        </div>
    </div>
);

const WorkflowProof = ({ copy }) => {
    const sectionRef = useRef(null);
    const [openFaq, setOpenFaq] = useState(0);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return undefined;

        let frame = 0;
        const clamp = (value) => Math.min(1, Math.max(0, value));

        const update = () => {
            frame = 0;
            const rect = section.getBoundingClientRect();
            const viewport = window.innerHeight || 1;
            const progress = clamp((viewport - rect.top) / (viewport + rect.height * 0.78));
            const focus = Math.sin(progress * Math.PI);
            const activation = clamp((progress - 0.16) / 0.34);
            const cards = clamp((progress - 0.46) / 0.26);

            section.style.setProperty('--market-focus', focus.toFixed(3));
            section.style.setProperty('--market-activate', activation.toFixed(3));
            section.style.setProperty('--market-cards', cards.toFixed(3));
            section.dataset.stage = cards > 0.16 ? 'cards' : activation > 0.2 ? 'active' : 'enter';
        };

        const requestUpdate = () => {
            if (frame) return;
            frame = window.requestAnimationFrame(update);
        };

        update();
        window.addEventListener('scroll', requestUpdate, { passive: true });
        window.addEventListener('resize', requestUpdate);

        return () => {
            if (frame) window.cancelAnimationFrame(frame);
            window.removeEventListener('scroll', requestUpdate);
            window.removeEventListener('resize', requestUpdate);
        };
    }, []);

    return (
        <section ref={sectionRef} id="workflow-proof" className="marketplace-section relative overflow-hidden px-6 py-24">
            <div className="marketplace-bg-lines" aria-hidden="true" />
            <div className="marketplace-bg-overlay" aria-hidden="true" />
            <div className="marketplace-bg-spotlight" aria-hidden="true" />

            <div className="relative z-10 mx-auto max-w-6xl">
                <div data-reveal className="marketplace-heading mb-14 text-center">
                    <SectionIcon icon={Store} />
                    <h2 className="font-['Be_Vietnam_Pro'] text-3xl md:text-5xl font-bold text-zinc-900 mb-4 tracking-tight">
                        <span className="language-copy inline-block">{copy.title}</span> <span className="language-copy inline-block text-amber-500">{copy.accent}</span>
                    </h2>
                    <p className="text-zinc-600 max-w-2xl mx-auto text-lg leading-relaxed">
                        {copy.description}
                    </p>
                </div>

                <MarketplaceIllustration copy={copy.illustration} />

                <div className="marketplace-card-grid grid grid-cols-1 md:grid-cols-2 gap-5 mb-20">
                    {marketplaceItems.map((item, index) => {
                        const Icon = item.icon;
                        const localizedItem = copy.items[index];

                        return (
                            <article
                                key={item.title}
                                style={{ '--card-delay': `${index * 110}ms` }}
                                className="marketplace-benefit-card group relative overflow-hidden rounded-2xl border border-white/95 bg-white/[0.07] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.98),inset_0_-1px_0_rgba(255,255,255,0.3),0_18px_48px_rgba(24,24,27,0.1)] ring-1 ring-white/70 backdrop-blur-2xl backdrop-saturate-150 transition-all duration-300 hover:-translate-y-1 hover:border-amber-200/90 hover:bg-amber-300/10 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.98),0_0_30px_rgba(245,158,11,0.18),0_18px_48px_rgba(24,24,27,0.12)]"
                            >
                                <div className="relative z-10 mb-4 inline-flex rounded-xl border border-white/90 bg-white/[0.08] p-3 text-amber-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)] ring-1 ring-white/60 backdrop-blur-2xl">
                                    <Icon size={24} />
                                </div>
                                <h3 className="relative z-10 text-xl font-bold text-zinc-900 mb-2 transition-colors group-hover:text-amber-500">
                                    {localizedItem.title}
                                </h3>
                                <p className="relative z-10 text-zinc-600 leading-relaxed">
                                    {localizedItem.description}
                                </p>
                            </article>
                        );
                    })}
                </div>

                <div data-reveal className="mb-10 text-center">
                    <SectionIcon icon={HelpCircle} />
                    <h2 className="font-['Be_Vietnam_Pro'] text-3xl md:text-5xl font-bold text-zinc-900 mb-4 tracking-tight">
                        <span className="language-copy inline-block">{copy.faqTitle}</span> <span className="language-copy inline-block text-amber-500">{copy.faqAccent}</span>
                    </h2>
                </div>

                <div data-reveal className="relative overflow-hidden rounded-3xl border border-white/95 bg-white/[0.06] p-4 md:p-6 shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_-1px_0_rgba(255,255,255,0.34),0_34px_100px_rgba(24,24,27,0.14)] ring-1 ring-white/80 backdrop-blur-[28px] backdrop-saturate-150 before:absolute before:inset-0 before:pointer-events-none before:bg-[linear-gradient(135deg,rgba(255,255,255,0.44),rgba(255,255,255,0.08)_38%,rgba(255,255,255,0.01)_74%)] before:opacity-70 after:absolute after:inset-px after:pointer-events-none after:rounded-[23px] after:border after:border-white/85">
                    <div className="relative z-10 flex flex-col gap-3">
                        {copy.faqs.map(([question, answer], index) => (
                            <article
                                key={question}
                                data-reveal
                                style={{ '--reveal-delay': `${index * 70}ms` }}
                                className="overflow-hidden rounded-2xl border border-white/95 bg-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.98),inset_0_-1px_0_rgba(255,255,255,0.3),0_18px_48px_rgba(24,24,27,0.1)] ring-1 ring-white/70 backdrop-blur-2xl backdrop-saturate-150 transition-all duration-300 hover:border-white hover:bg-white/[0.13]"
                            >
                                <button
                                    type="button"
                                    className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left"
                                    onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                                    aria-expanded={openFaq === index}
                                >
                                    <span className="text-base md:text-lg font-bold text-zinc-900">{question}</span>
                                    <ChevronDown className={`shrink-0 text-zinc-500 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} size={22} />
                                </button>
                                <div className={`grid transition-all duration-300 ${openFaq === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                                    <div className="overflow-hidden">
                                        <p className="px-5 md:px-6 pb-5 md:pb-6 text-zinc-600 leading-relaxed">
                                            {answer}
                                        </p>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WorkflowProof;
