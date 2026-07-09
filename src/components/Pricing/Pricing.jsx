import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check } from 'lucide-react';
import { pricing } from '../../dataset/pricing';

gsap.registerPlugin(ScrollTrigger);

const PricingCard = ({ name, tagline, priceLabel, features, ctaLabel, ctaHref, featured }) => {
    return (
        <div
            className={`pricing-card relative bg-white rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-300 ${featured
                ? 'border-2 border-amber-400 shadow-lg scale-[1.02]'
                : 'border border-zinc-200 shadow-sm hover:shadow-md'
                }`}
        >
            {featured && (
                <div className="absolute top-0 right-0 bg-amber-400 text-zinc-900 text-xs font-bold px-4 py-1 rounded-bl-xl">
                    Most Popular
                </div>
            )}

            <div className="p-8 flex flex-col h-full">
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
                    className={`inline-flex items-center justify-center px-6 py-3 rounded-full font-bold text-sm transition-colors duration-300 ${featured
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

const Pricing = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".pricing-card", {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="pricing" ref={containerRef} className="py-24 px-6 relative bg-zinc-50">
            <div className="max-w-6xl mx-auto">
                <div className="mb-16 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4 font-['Poppins']">
                        Simple Pricing, <span className="text-amber-500">No Surprises</span>
                    </h2>
                    <p className="text-zinc-600 max-w-xl mx-auto">
                        Start free, then scale up as you run more workspaces and projects.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                    {pricing.map((tier) => (
                        <PricingCard key={tier.id} {...tier} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Pricing;
