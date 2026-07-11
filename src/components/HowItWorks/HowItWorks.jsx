import React from 'react';
import { GitBranch } from 'lucide-react';
import { howItWorks } from '../../dataset/howItWorks';
import SectionIcon from '../SectionIcon';

const HowItWorksItem = ({ step, title, description, style }) => (
    <div data-reveal style={style} className="how-it-works-item group relative grid grid-cols-[44px_1fr_auto] gap-4 md:grid-cols-[56px_1fr_auto] md:gap-7">
        <div className="relative flex justify-center">
            <div className="absolute top-0 bottom-0 w-px bg-zinc-200"></div>
            <div
                className="relative mt-5 h-3.5 w-3.5 rounded-full border-[5px] border-zinc-200 bg-zinc-300 shadow-[0_0_0_7px_rgba(255,255,255,0.96)] transition-colors duration-300 group-hover:border-amber-400 group-hover:bg-amber-400"
            ></div>
            <div className="absolute top-0 h-16 w-px bg-amber-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
        </div>

        <div className="py-4 md:py-5">
            <h3 className="text-lg md:text-xl font-extrabold tracking-tight text-zinc-900 transition-colors duration-300 group-hover:text-amber-500">
                {title}
            </h3>

            <p className="mt-3 max-w-3xl text-sm md:text-base leading-relaxed text-zinc-600">
                {description}
            </p>
        </div>

        <div className="py-5 md:py-6">
            <span className="font-mono text-sm md:text-base font-bold text-zinc-500">
                {step}
            </span>
        </div>
    </div>
);

const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-24 px-6 bg-white relative z-10 overflow-hidden">
            <div className="max-w-5xl mx-auto">
                <div data-reveal className="mb-10 text-center">
                    <SectionIcon icon={GitBranch} />
                    <h2 className="text-3xl md:text-[2.65rem] md:leading-tight font-extrabold text-zinc-900 mb-4 font-['Poppins'] tracking-tight">
                        From Business Requirements To A <span className="text-amber-500">Team Ready To Deliver</span>
                    </h2>
                    <p className="text-zinc-600 max-w-2xl mx-auto">
                        RotexAI turns business objectives into assigned responsibilities, governed workflows, and measurable outcomes.
                    </p>
                </div>

                <div className="relative">
                    {howItWorks.map((item, index) => (
                        <HowItWorksItem key={item.id} {...item} style={{ '--reveal-delay': `${index * 90}ms` }} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
