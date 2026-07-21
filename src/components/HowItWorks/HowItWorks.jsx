import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Bot, BriefcaseBusiness, CheckCircle2, FileText, Gauge, GitBranch, SearchCheck, ShieldCheck, UsersRound } from 'lucide-react';
import { howItWorks } from '../../dataset/howItWorks';
import SectionIcon from '../SectionIcon';

const detailCopy = {
    en: [
        ['Objective', 'Budget', 'Deadline', 'Risk'],
        ['Skills', 'Data Access', 'Approval', 'Context'],
        ['Human 82%', 'AI Agent 91%', 'Hybrid 95%'],
        ['Permission', 'Checkpoint', 'Human Review', 'Escalation'],
        ['Speed +24%', 'Cost -18%', 'Quality 94%', 'Risk Low'],
    ],
    vi: [
        ['Mục tiêu', 'Ngân sách', 'Deadline', 'Rủi ro'],
        ['Kỹ năng', 'Quyền dữ liệu', 'Phê duyệt', 'Bối cảnh'],
        ['Người 82%', 'AI Agent 91%', 'Hybrid 95%'],
        ['Permission', 'Checkpoint', 'Human Review', 'Escalation'],
        ['Tốc độ +24%', 'Chi phí -18%', 'Chất lượng 94%', 'Rủi ro thấp'],
    ],
};

const stepVisuals = [
    { icon: FileText, type: 'describe' },
    { icon: GitBranch, type: 'map' },
    { icon: SearchCheck, type: 'match' },
    { icon: ShieldCheck, type: 'govern' },
    { icon: Gauge, type: 'measure' },
];

const WorkflowVisual = ({ type, active, labels }) => {
    if (type === 'map') {
        const nodes = [
            ['top-4 left-1/2 -translate-x-1/2', labels[0]],
            ['left-4 top-1/2 -translate-y-1/2', labels[1]],
            ['right-4 top-1/2 -translate-y-1/2', labels[2]],
            ['bottom-4 left-1/2 -translate-x-1/2', labels[3]],
        ];

        return (
            <div className="relative h-48 overflow-hidden rounded-2xl border border-white/80 bg-white/[0.16] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                <div className="absolute left-1/2 top-8 h-32 w-px -translate-x-1/2 bg-amber-300/50" />
                <div className="absolute left-10 right-10 top-1/2 h-px -translate-y-1/2 bg-amber-300/50" />
                <div className="absolute left-1/2 top-1/2 z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-white/90 bg-white/55 text-amber-500 shadow-[0_16px_36px_rgba(245,158,11,0.16)] backdrop-blur-xl">
                    <BriefcaseBusiness size={24} />
                </div>
                {nodes.map(([position, label]) => (
                    <div key={label} className={`absolute ${position} rounded-full border border-white/90 bg-white/60 px-3 py-1.5 text-[11px] font-bold text-zinc-700 shadow-sm backdrop-blur-xl`}>
                        {label}
                    </div>
                ))}
            </div>
        );
    }

    if (type === 'match') {
        return (
            <div className="relative h-48 overflow-hidden rounded-2xl border border-white/80 bg-white/[0.16] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                <div className="grid h-full grid-cols-3 gap-3">
                    {labels.slice(0, 3).map((label, index) => (
                        <div key={label} className={`workflow-score-card flex flex-col justify-end rounded-2xl border border-white/85 bg-white/55 p-3 shadow-sm backdrop-blur-xl ${active ? 'is-active' : ''}`} style={{ '--score-delay': `${index * 90}ms` }}>
                            <div className="mb-auto flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100/70 text-amber-500">
                                {index === 0 ? <UsersRound size={18} /> : index === 1 ? <Bot size={18} /> : <GitBranch size={18} />}
                            </div>
                            <p className="mt-8 text-xs font-bold text-zinc-800">{label}</p>
                            <div className="mt-3 h-1.5 rounded-full bg-zinc-200/80">
                                <span className="workflow-fill block h-full rounded-full bg-amber-400" style={{ '--fill': `${index === 0 ? 72 : index === 1 ? 84 : 95}%`, '--score-delay': `${index * 90}ms` }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (type === 'govern') {
        return (
            <div className="relative h-48 overflow-hidden rounded-2xl border border-white/80 bg-white/[0.16] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                <div className="grid h-full grid-cols-2 gap-3">
                    {labels.map((label, index) => (
                        <div key={label} className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/55 px-3 py-2 shadow-sm backdrop-blur-xl">
                            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100/70 text-amber-500">
                                <CheckCircle2 size={17} />
                            </span>
                            <span className="text-xs font-bold text-zinc-700">{label}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (type === 'measure') {
        return (
            <div className="relative h-48 overflow-hidden rounded-2xl border border-white/80 bg-white/[0.16] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                <div className="flex h-24 items-end gap-3">
                    {[46, 72, 58, 98, 116].map((height, index) => (
                        <div key={height} className="flex flex-1 flex-col items-center gap-2">
                            <span className="w-full rounded-t-xl border border-amber-200/80 bg-amber-300/30" style={{ height }} />
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400/80" />
                        </div>
                    ))}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                    {labels.slice(0, 4).map((label) => (
                        <span key={label} className="rounded-full border border-white/75 bg-white/55 px-3 py-1.5 text-[11px] font-bold text-zinc-700 backdrop-blur-xl">
                            {label}
                        </span>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="relative h-48 overflow-hidden rounded-2xl border border-white/80 bg-white/[0.16] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
            <div className="mb-4 rounded-2xl border border-white/85 bg-white/60 px-4 py-3 text-sm font-semibold text-zinc-500 shadow-sm backdrop-blur-xl">
                Describe your task...
            </div>
            <div className="space-y-2">
                {labels.map((label, index) => (
                    <div key={label} className="flex items-center gap-3 rounded-xl border border-white/75 bg-white/50 px-3 py-2 shadow-sm backdrop-blur-xl">
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                        <span className="text-xs font-bold text-zinc-700">{label}</span>
                        <span className="ml-auto h-1.5 w-14 rounded-full bg-amber-300/55" />
                    </div>
                ))}
            </div>
        </div>
    );
};

const WorkflowCard = ({ step, index, activeIndex, language, title, description }) => {
    const isActive = index === activeIndex;
    const isPast = index < activeIndex;
    const visual = stepVisuals[index] || stepVisuals[0];
    const Icon = visual.icon;
    const labels = detailCopy[language]?.[index] || detailCopy.en[index];

    return (
        <article className={`workflow-card relative h-[500px] w-[min(78vw,390px)] shrink-0 overflow-hidden rounded-[1.65rem] border bg-white/[0.18] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_24px_70px_rgba(40,30,10,0.08)] ring-1 ring-white/75 backdrop-blur-[24px] transition-[opacity,transform,border-color,box-shadow] duration-[520ms] ease-out ${isActive ? 'is-active border-amber-300/70 opacity-100 scale-100 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_32px_86px_rgba(245,158,11,0.16)]' : 'border-white/90 opacity-70 scale-[0.96]'} ${isPast ? 'opacity-75' : ''}`}>
            <div className="pointer-events-none absolute inset-0 rounded-[1.65rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.46),rgba(255,255,255,0.08)_44%,rgba(245,158,11,0.06))]" />
            <div className="relative z-10 mb-4 flex items-center justify-between">
                <span className={`font-mono text-3xl font-black ${isActive ? 'text-amber-500' : 'text-zinc-400'}`}>{step.step}</span>
                <span className="rounded-full border border-white/85 bg-white/45 px-3 py-1 text-xs font-bold text-zinc-500 shadow-sm backdrop-blur-xl">
                    {language === 'vi' ? 'Bước' : 'Step'} {index + 1}
                </span>
            </div>
            <div className="relative z-10">
                <WorkflowVisual type={visual.type} active={isActive} labels={labels} />
            </div>
            <div className="relative z-10 mt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/85 bg-white/50 text-amber-500 shadow-sm backdrop-blur-xl">
                    <Icon size={22} />
                </div>
                <h3 className="text-2xl font-extrabold leading-tight tracking-tight text-zinc-900">{title}</h3>
                <p className="mt-3 text-base leading-relaxed text-zinc-600">{description}</p>
            </div>
        </article>
    );
};

const Connector = ({ complete, muted = false }) => (
    <div className="workflow-connector relative flex w-16 shrink-0 items-center justify-center md:w-20" aria-hidden="true">
        <span className={`h-px w-full transition-colors duration-300 ${complete ? 'bg-amber-400' : muted ? 'bg-zinc-100' : 'bg-zinc-200'}`} />
        <span className={`workflow-dot absolute h-2.5 w-2.5 rounded-full ${complete ? 'bg-amber-400' : 'bg-zinc-300'}`} />
        <ArrowRight className={`absolute right-0 ${complete ? 'text-amber-500' : muted ? 'text-zinc-200' : 'text-zinc-300'}`} size={18} />
    </div>
);

const HowItWorks = ({ copy, language = 'en' }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [translateX, setTranslateX] = useState(0);
    const carouselRef = useRef(null);
    const itemRefs = useRef([]);
    const total = howItWorks.length;
    const loopedSteps = [
        { sourceIndex: total - 1, key: 'lead-clone' },
        ...howItWorks.map((_, index) => ({ sourceIndex: index, key: `step-${index}` })),
        { sourceIndex: 0, key: 'tail-clone' },
    ];
    const activeLoopIndex = activeIndex + 1;

    const measureActiveCard = () => {
        const carousel = carouselRef.current;
        const activeItem = itemRefs.current[activeLoopIndex];
        const activeCard = activeItem?.querySelector('.workflow-card');
        if (!carousel || !activeItem || !activeCard) return;

        const carouselCenter = carousel.clientWidth / 2;
        const activeCardCenter = activeItem.offsetLeft + (activeCard.offsetWidth / 2);
        setTranslateX(carouselCenter - activeCardCenter);
    };

    useLayoutEffect(() => {
        measureActiveCard();
    }, [activeIndex, language, activeLoopIndex]);

    useEffect(() => {
        let frame = 0;
        const requestMeasure = () => {
            if (frame) return;
            frame = window.requestAnimationFrame(() => {
                frame = 0;
                measureActiveCard();
            });
        };

        requestMeasure();
        window.addEventListener('resize', requestMeasure);
        return () => {
            if (frame) window.cancelAnimationFrame(frame);
            window.removeEventListener('resize', requestMeasure);
        };
    }, [activeIndex, language, activeLoopIndex]);

    const goPrev = () => setActiveIndex((current) => (current - 1 + total) % total);
    const goNext = () => setActiveIndex((current) => (current + 1) % total);

    return (
        <section id="how-it-works" className="relative z-10 overflow-hidden bg-white px-6 py-24">
            <div className="mx-auto max-w-7xl">
                <div data-reveal className="mx-auto mb-14 max-w-4xl text-center">
                    <SectionIcon icon={GitBranch} />
                    <h2 className="font-['Be_Vietnam_Pro'] mb-4 text-3xl font-extrabold tracking-tight text-zinc-900 md:text-[2.65rem] md:leading-tight">
                        <span className="language-copy inline-block">{copy.title}</span> <span className="language-copy inline-block text-amber-500">{copy.accent}</span>
                    </h2>
                    <p className="section-subtitle">
                        {copy.description}
                    </p>
                </div>

                <div data-reveal className="relative mx-auto max-w-6xl" style={{ '--reveal-delay': '90ms' }}>
                    <div className="mb-6 flex items-center justify-between gap-4">
                        <button
                            type="button"
                            onClick={goPrev}
                            aria-label="Previous workflow step"
                            className="workflow-nav-button"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div className="hidden items-center gap-2 md:flex">
                            {howItWorks.map((item, index) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    aria-label={`Go to workflow step ${index + 1}`}
                                    onClick={() => setActiveIndex(index)}
                                    className={`h-2.5 rounded-full transition-all duration-300 ${index === activeIndex ? 'w-9 bg-amber-400' : 'w-2.5 bg-zinc-200 hover:bg-amber-200'}`}
                                />
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={goNext}
                            aria-label="Next workflow step"
                            className="workflow-nav-button"
                        >
                            <ArrowRight size={20} />
                        </button>
                    </div>

                    <div ref={carouselRef} className="workflow-carousel overflow-hidden px-1 py-5">
                        <div
                            className="flex items-center transition-transform duration-[620ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
                            style={{ transform: `translate3d(${translateX}px, 0, 0)` }}
                        >
                            {loopedSteps.map(({ sourceIndex, key }, loopIndex) => {
                                const item = howItWorks[sourceIndex];
                                const isClone = key.includes('clone');
                                const isActive = loopIndex === activeLoopIndex;
                                const isCompletedConnector = !isClone && sourceIndex < activeIndex;

                                return (
                                <div
                                    key={key}
                                    ref={(node) => { itemRefs.current[loopIndex] = node; }}
                                    className="flex shrink-0 items-center"
                                >
                                    <WorkflowCard
                                        step={item}
                                        index={sourceIndex}
                                        activeIndex={isActive ? sourceIndex : -1}
                                        language={language}
                                        title={copy.steps[sourceIndex].title}
                                        description={copy.steps[sourceIndex].description}
                                    />
                                    {loopIndex < loopedSteps.length - 1 && (
                                        <Connector complete={isCompletedConnector} muted={isClone} />
                                    )}
                                </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-center gap-4">
                        <span className="font-mono text-sm font-black tracking-widest text-zinc-500">
                            {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
