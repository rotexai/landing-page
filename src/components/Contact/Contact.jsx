import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".contact-content", {
                y: 30,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
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
        <section id="cta" ref={containerRef} className="py-32 px-6 flex flex-col items-center justify-center bg-white relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-100 via-white to-white pointer-events-none"></div>

            <div className="contact-content max-w-3xl mx-auto text-center relative z-10">
                <h2 className="text-4xl md:text-6xl font-bold text-zinc-900 mb-8 font-['Poppins'] tracking-tight">
                    Stop Trusting The Output. <br />
                    <span className="text-amber-500">Start Reading The Workflow.</span>
                </h2>

                <p className="text-xl text-zinc-600 mb-12 max-w-2xl mx-auto">
                    RotexAI exposes the workflow logic behind every AI-built website across multiple workspaces, so you can validate, debug, and trust what was built, not just the website it produced.
                </p>

                <a
                    href="https://portal.rotexai.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-zinc-900 text-white rounded-full font-bold text-lg hover:bg-amber-500 transition-colors duration-300 group"
                >
                    Try RotexAI
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </a>

                <div className="mt-24 text-sm text-zinc-400">
                    <p>© 2026 RotexAI. All rights reserved.</p>
                </div>
            </div>
        </section>
    );
};

export default Contact;
