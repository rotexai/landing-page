import React, { useEffect, useRef } from 'react';
import { UsersRound } from 'lucide-react';
import { valueProps } from '../../dataset/valueProps';
import SectionIcon from '../SectionIcon';

const CardVisual = ({ type, icon: Icon }) => {
    if (type === 'decision') {
        return (
            <div className="relative h-44 overflow-hidden rounded-xl border border-white/80 bg-[linear-gradient(145deg,rgba(255,251,235,0.58),rgba(255,255,255,0.14))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                <div className="absolute left-0 top-0 h-20 w-28 bg-white/30 blur-2xl" />
                <div className="relative flex h-full items-end justify-between gap-3">
                    {[42, 72, 54, 96, 124].map((height, index) => (
                        <div key={height} className="flex flex-1 flex-col items-center gap-2">
                            <div
                                className="w-full rounded-t-xl border border-amber-200/70 bg-amber-400/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_12px_30px_rgba(245,158,11,0.14)]"
                                style={{ height }}
                            />
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400/70" />
                        </div>
                    ))}
                </div>
                <div className="absolute right-5 top-5 rounded-full border border-white/90 bg-white/45 px-3 py-1 text-xs font-semibold text-amber-600 shadow-sm backdrop-blur-xl">
                    Control
                </div>
            </div>
        );
    }

    if (type === 'team') {
        const nodes = [
            'left-8 top-8', 'right-10 top-10', 'left-16 bottom-8', 'right-16 bottom-7'
        ];

        return (
            <div className="relative h-44 overflow-hidden rounded-xl border border-white/80 bg-[linear-gradient(145deg,rgba(255,251,235,0.58),rgba(255,255,255,0.14))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                <div className="absolute inset-x-10 top-1/2 h-px bg-amber-300/55" />
                <div className="absolute left-1/2 top-8 h-24 w-px -translate-x-1/2 bg-amber-300/45" />
                <div className="absolute left-[32%] top-[32%] h-px w-[36%] rotate-[28deg] bg-amber-300/45" />
                <div className="absolute left-[32%] bottom-[34%] h-px w-[36%] -rotate-[28deg] bg-amber-300/45" />
                <div className="absolute left-1/2 top-1/2 z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-white/90 bg-white/40 text-amber-500 shadow-[0_16px_36px_rgba(245,158,11,0.18)] backdrop-blur-xl">
                    <Icon size={24} />
                </div>
                {nodes.map((position, index) => (
                    <div key={position} className={`absolute ${position} flex h-10 w-10 items-center justify-center rounded-xl border border-white/90 bg-white/45 shadow-[0_12px_28px_rgba(24,24,27,0.08)] backdrop-blur-xl`}>
                        <span className="h-3 w-3 rounded-full bg-amber-400/80" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="relative h-44 overflow-hidden rounded-xl border border-white/80 bg-[linear-gradient(145deg,rgba(255,251,235,0.58),rgba(255,255,255,0.14))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
            <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/90 bg-white/45 text-amber-500 shadow-sm backdrop-blur-xl">
                <Icon size={20} />
            </div>
            <div className="relative mt-8 space-y-3">
                {['Capability fit', 'Cost range', 'Risk level'].map((label, index) => (
                    <div key={label} className="flex items-center gap-3 rounded-lg border border-white/75 bg-white/45 px-3 py-2 shadow-[0_10px_28px_rgba(245,158,11,0.08)] backdrop-blur-xl">
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/85" />
                        <span className="text-xs font-semibold text-zinc-700">{label}</span>
                        <span className="ml-auto h-1.5 w-14 rounded-full bg-amber-300/60" />
                    </div>
                ))}
            </div>
        </div>
    );
};

const ValuePropCard = ({ title, description, icon, color, visual, className = '', style }) => {
    const Icon = icon;
    return (
        <div data-reveal style={style} className={`value-prop-card group relative min-w-0 overflow-hidden rounded-2xl border border-white/95 bg-white/[0.06] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_-1px_0_rgba(255,255,255,0.34),0_30px_90px_rgba(24,24,27,0.14)] ring-1 ring-white/80 backdrop-blur-[28px] backdrop-saturate-150 transition-all duration-300 before:absolute before:inset-0 before:pointer-events-none before:rounded-2xl before:bg-[linear-gradient(135deg,rgba(255,255,255,0.42),rgba(255,255,255,0.08)_38%,rgba(255,255,255,0.01)_74%)] before:opacity-70 after:absolute after:inset-px after:pointer-events-none after:rounded-[15px] after:border after:border-white/85 hover:-translate-y-1 hover:border-white hover:bg-amber-100/[0.16] hover:shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_-1px_0_rgba(255,255,255,0.42),0_36px_100px_rgba(245,158,11,0.16)] ${className}`}>
            <div className="relative z-10 mb-6">
                <CardVisual type={visual} icon={Icon} />
            </div>
            <h3 className="relative z-10 mb-3 px-2 text-xl font-semibold text-zinc-900">
                {title}
            </h3>
            <p className="relative z-10 px-2 pb-2 text-base leading-relaxed text-zinc-600">
                {description}
            </p>
        </div>
    );
};

const ValueProps = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return undefined;

        let frame = 0;
        const clamp = (value) => Math.min(1, Math.max(0, value));

        const updateFocus = () => {
            frame = 0;
            const rect = section.getBoundingClientRect();
            const viewport = window.innerHeight || 1;
            const progress = clamp((viewport - rect.top) / (viewport + rect.height));
            const focus = Math.sin(progress * Math.PI);

            section.style.setProperty('--value-focus', focus.toFixed(3));
        };

        const requestUpdate = () => {
            if (frame) return;
            frame = window.requestAnimationFrame(updateFocus);
        };

        updateFocus();
        window.addEventListener('scroll', requestUpdate, { passive: true });
        window.addEventListener('resize', requestUpdate);

        return () => {
            if (frame) window.cancelAnimationFrame(frame);
            window.removeEventListener('scroll', requestUpdate);
            window.removeEventListener('resize', requestUpdate);
        };
    }, []);

    return (
        <section ref={sectionRef} id="value-props" className="value-focus-section relative overflow-hidden px-6 py-24">
            <div className="value-focus-lines" aria-hidden="true" />
            <div className="value-focus-overlay" aria-hidden="true" />
            <div className="value-focus-spotlight" aria-hidden="true" />

            <div className="relative z-10 mx-auto max-w-7xl">
                <div data-reveal className="mb-16 text-center">
                    <SectionIcon icon={UsersRound} />
                    <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4 font-['Poppins']">
                        One Operating System For Your <span className="text-amber-500">Entire Workforce</span>
                    </h2>
                    <p className="text-zinc-600 max-w-2xl mx-auto">
                        Describe the task. RotexAI analyzes the work, identifies required capabilities, and recommends the best person, AI agent, or hybrid team.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {valueProps.map((prop, index) => (
                        <ValuePropCard
                            key={prop.id}
                            {...prop}
                            style={{ '--reveal-delay': `${index * 90}ms` }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ValueProps;
