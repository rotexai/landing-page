import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import SectionIcon from '../SectionIcon';

const Contact = ({ copy }) => {
    return (
        <section id="cta" className="py-32 px-6 flex flex-col items-center justify-center bg-white relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-100 via-white to-white pointer-events-none"></div>

            <div className="contact-content max-w-3xl mx-auto text-center relative z-10">
                <SectionIcon icon={Sparkles} />
                <h2 data-reveal className="font-['Be_Vietnam_Pro'] text-4xl md:text-6xl font-bold leading-[1.1] text-zinc-900 mb-8 tracking-tight">
                    <span className="language-copy inline-block">{copy.line1}</span> <br />
                    <span className="language-copy inline-block text-amber-500">{copy.accent}</span>
                </h2>

                <p data-reveal style={{ '--reveal-delay': '110ms' }} className="text-xl text-zinc-600 mb-12 max-w-2xl mx-auto">
                    {copy.description}
                </p>

                <a
                    data-reveal
                    style={{ '--reveal-delay': '220ms' }}
                    href="https://portal.rotexai.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-zinc-900 text-white rounded-full font-bold text-lg shadow-[0_18px_44px_rgba(24,24,27,0.16)] transition-all duration-300 hover:-translate-y-1 hover:bg-amber-500 hover:text-zinc-900 hover:shadow-[0_22px_54px_rgba(245,158,11,0.28)] group"
                >
                    {copy.cta}
                    <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1.5" />
                </a>

                <footer data-reveal style={{ '--reveal-delay': '330ms' }} className="mt-24 border-t border-zinc-200/80 pt-8 text-sm text-zinc-500">
                    <div className="flex flex-col items-center gap-5 md:flex-row md:justify-between">
                        <div className="text-center md:text-left">
                            <p className="font-['Be_Vietnam_Pro'] text-base font-bold text-zinc-900">RotexAI</p>
                            <p className="mt-1 max-w-md text-zinc-500">{copy.footerTagline}</p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 font-semibold text-zinc-500">
                            {copy.footerLinks.map((link) => (
                                <a key={link.href} href={link.href} className="transition-colors hover:text-amber-500">
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </div>
                    <p className="mt-8 text-center text-zinc-400">{copy.copyright}</p>
                </footer>
            </div>
        </section>
    );
};

export default Contact;
