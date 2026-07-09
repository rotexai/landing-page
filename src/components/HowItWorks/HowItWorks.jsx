import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { howItWorks } from '../../dataset/howItWorks';

gsap.registerPlugin(ScrollTrigger);

const HowItWorksItem = ({ step, title, description }) => (
    <div className="how-it-works-item relative pl-8 md:pl-12 py-6 border-l w-full border-zinc-200 hover:border-amber-400 transition-colors duration-300 group">
        <div className="absolute left-[-5px] top-8 w-2.5 h-2.5 rounded-full bg-zinc-300 group-hover:bg-amber-500 transition-colors duration-300 shadow-[0_0_0_4px_rgba(255,255,255,1)]"></div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
            <h3 className="text-xl font-bold text-zinc-900 group-hover:text-amber-500 transition-colors">{title}</h3>
            <span className="text-sm text-zinc-500 font-mono mt-1 sm:mt-0">{step}</span>
        </div>

        <p className="text-zinc-600 leading-relaxed max-w-3xl">
            {description}
        </p>
    </div>
);

const HowItWorks = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".how-it-works-item", {
                x: -30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="how-it-works" ref={containerRef} className="py-24 px-6 bg-zinc-50 relative z-10">
            <div className="max-w-4xl mx-auto">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 mb-4 font-['Poppins'] tracking-tight">
                        A Workflow You Can <span className="text-amber-500">Follow, Not Just Trust</span>
                    </h2>
                    <p className="text-zinc-600 max-w-2xl mx-auto">
                        A repeatable workflow pipeline, not a one-shot generation gamble. The website is the output, the workflow is the product.
                    </p>
                </div>

                <div className="flex flex-col relative">
                    {howItWorks.map((item) => (
                        <HowItWorksItem key={item.id} {...item} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
