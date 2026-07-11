import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import SectionIcon from '../SectionIcon';

const Contact = () => {
    return (
        <section id="cta" className="py-32 px-6 flex flex-col items-center justify-center bg-white relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-100 via-white to-white pointer-events-none"></div>

            <div className="contact-content max-w-3xl mx-auto text-center relative z-10">
                <SectionIcon icon={Sparkles} />
                <h2 data-reveal className="text-4xl md:text-6xl font-bold text-zinc-900 mb-8 font-['Poppins'] tracking-tight">
                    Stop Managing Humans And AI <br />
                    <span className="text-amber-500">In Separate Systems.</span>
                </h2>

                <p data-reveal style={{ '--reveal-delay': '110ms' }} className="text-xl text-zinc-600 mb-12 max-w-2xl mx-auto">
                    Build one unified workforce. Find the right capabilities, assign every task to the right resource, maintain control through execution, and measure results in one system.
                </p>

                <a
                    data-reveal
                    style={{ '--reveal-delay': '220ms' }}
                    href="https://portal.rotexai.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-zinc-900 text-white rounded-full font-bold text-lg shadow-[0_18px_44px_rgba(24,24,27,0.16)] transition-all duration-300 hover:-translate-y-1 hover:bg-amber-500 hover:text-zinc-900 hover:shadow-[0_22px_54px_rgba(245,158,11,0.28)] group"
                >
                    Create a Free Workspace
                    <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1.5" />
                </a>

                <div data-reveal style={{ '--reveal-delay': '330ms' }} className="mt-24 text-sm text-zinc-400">
                    <p>© 2026 RotexAI Human-AgentOS. All rights reserved.</p>
                </div>
            </div>
        </section>
    );
};

export default Contact;
