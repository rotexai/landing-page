import React from 'react';
import { BadgeDollarSign, Check } from 'lucide-react';
import { pricing } from '../../dataset/pricing';
import SectionIcon from '../SectionIcon';

const PricingCard = ({ name, tagline, priceLabel, features, ctaLabel, ctaHref, featured, badgeLabel, style }) => {
    return (
        <div
            data-reveal
            style={style}
            className={`pricing-card group relative overflow-hidden rounded-2xl flex flex-col h-full border bg-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_-1px_0_rgba(255,255,255,0.34),0_30px_90px_rgba(24,24,27,0.14)] ring-1 ring-white/80 backdrop-blur-[28px] backdrop-saturate-150 transition-all duration-300 before:absolute before:inset-0 before:pointer-events-none before:rounded-2xl before:bg-[linear-gradient(135deg,rgba(255,255,255,0.44),rgba(255,255,255,0.08)_38%,rgba(255,255,255,0.01)_74%)] before:opacity-70 after:absolute after:inset-px after:pointer-events-none after:rounded-[15px] after:border after:border-white/85 hover:-translate-y-1 hover:bg-white/[0.12] hover:shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_-1px_0_rgba(255,255,255,0.42),0_36px_100px_rgba(24,24,27,0.16)] ${featured
                ? 'border-white scale-[1.02]'
                : 'border-white/95 hover:border-white'
                }`}
        >
            {featured && (
                <div className="absolute top-0 right-0 z-20 rounded-bl-xl border-l border-b border-amber-300/80 bg-amber-400 px-4 py-1 text-xs font-extrabold text-[#1A0D06] shadow-[0_10px_26px_rgba(255,176,0,0.28),inset_0_1px_0_rgba(255,255,255,0.55)]">
                    {badgeLabel}
                </div>
            )}

            <div className="relative z-10 p-8 flex flex-col h-full">
                <h3 className="text-xl font-bold text-zinc-900 mb-2">{name}</h3>
                <p className="text-sm text-zinc-600 mb-6">{tagline}</p>
                <p className="text-2xl font-bold text-zinc-900 mb-6">{priceLabel}</p>

                <ul className="flex flex-col gap-3 mb-8 flex-grow">
                    {features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-zinc-600">
                            <Check size={18} className="text-amber-500 shrink-0 mt-0.5" />
                            {feature}
                        </li>
                    ))}
                </ul>

                <a
                    href={ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 shadow-[0_14px_30px_rgba(24,24,27,0.08)] ${featured
                        ? 'bg-amber-500 text-zinc-900 hover:bg-amber-400'
                        : 'bg-zinc-900 text-white hover:bg-amber-500'
                        }`}
                >
                    {ctaLabel}
                </a>
            </div>
        </div>
    );
};

const Pricing = ({ copy }) => {
    return (
        <section id="pricing" className="py-24 px-6 relative bg-zinc-50 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_18%_10%,rgba(255,255,255,0.86),transparent_25rem),radial-gradient(circle_at_88%_14%,rgba(228,228,231,0.42),transparent_26rem)]"></div>
            <div className="relative z-10 max-w-6xl mx-auto">
                <div data-reveal className="mb-16 text-center">
                    <SectionIcon icon={BadgeDollarSign} />
                    <h2 className="font-['Be_Vietnam_Pro'] text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
                        <span className="language-copy inline-block">{copy.title}</span> <span className="language-copy inline-block text-amber-500">{copy.accent}</span>
                    </h2>
                    <p className="text-zinc-600 max-w-xl mx-auto">
                        {copy.description}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                    {pricing.map((tier, index) => (
                        <PricingCard
                            key={tier.id}
                            {...tier}
                            {...copy.tiers[index]}
                            badgeLabel={copy.mostPopular}
                            style={{ '--reveal-delay': `${index * 110}ms` }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Pricing;
