import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { differentiators } from '../../dataset/differentiators';

gsap.registerPlugin(ScrollTrigger);

const DifferentiatorCard = ({ title, description, icon, color }) => {
    const Icon = icon;
    return (
        <div className="differentiator-card group relative bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:border-zinc-300 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="p-8 flex flex-col h-full relative z-10">
                <div className={`inline-flex p-3 rounded-xl bg-zinc-100 mb-6 ${color} bg-opacity-10 self-start`}>
                    <Icon size={28} className={color} />
                </div>

                <h3 className="text-xl font-bold text-zinc-900 mb-3 group-hover:text-amber-600 transition-colors">
                    {title}
                </h3>

                <p className="text-zinc-600 leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    );
};

const Differentiators = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".differentiator-card", {
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
        <section id="differentiators" ref={containerRef} className="py-24 px-6 relative bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="mb-16 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4 font-['Poppins']">
                        What Makes <span className="text-purple-400">RotexAI</span> Different
                    </h2>
                    <p className="text-zinc-600 max-w-xl mx-auto">
                        Most AI website tools stop at fast generation. RotexAI goes further.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {differentiators.map((item) => (
                        <DifferentiatorCard key={item.id} {...item} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Differentiators;
