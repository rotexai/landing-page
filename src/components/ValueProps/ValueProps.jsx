import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { valueProps } from '../../dataset/valueProps';

gsap.registerPlugin(ScrollTrigger);

const ValuePropCard = ({ title, description, icon, color }) => {
    const Icon = icon;
    return (
        <div className="value-prop-card min-w-[260px] flex-1 basis-[260px] max-w-sm bg-zinc-50 border border-zinc-200 rounded-2xl p-6 hover:border-zinc-300 transition-colors duration-300">
            <div className={`inline-flex p-3 rounded-xl bg-white mb-4 ${color}`}>
                <Icon size={28} />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                {title}
            </h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
                {description}
            </p>
        </div>
    );
};

const ValueProps = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".value-prop-card", {
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
        <section id="value-props" ref={containerRef} className="py-24 px-6 relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="mb-16 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4 font-['Poppins']">
                        The <span className="text-amber-500">Workflow</span> Is The Product
                    </h2>
                    <p className="text-zinc-600 max-w-2xl mx-auto">
                        RotexAI is built around visible, inspectable workflows. Websites are just what those workflows produce.
                    </p>
                </div>

                <div className="flex flex-wrap gap-6 justify-center">
                    {valueProps.map((prop) => (
                        <ValuePropCard key={prop.id} {...prop} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ValueProps;
