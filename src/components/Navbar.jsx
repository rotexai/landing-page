import React, { useState, useRef, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const NAV_ITEMS = [
    { id: 'value-props', key: 'valueProps' },
    { id: 'how-it-works', key: 'howItWorks' },
    { id: 'differentiators', key: 'differentiators' },
    { id: 'workflow-proof', key: 'marketplace' },
    { id: 'pricing', key: 'pricing' },
];

const LanguageToggle = ({ language, onLanguageChange, label }) => (
    <button
        type="button"
        aria-label={label}
        onClick={() => onLanguageChange(language === 'en' ? 'vi' : 'en')}
        className="language-toggle relative flex h-9 w-[72px] shrink-0 items-center justify-between rounded-full border border-[rgba(255,184,0,0.25)] bg-white/65 p-1 text-[11px] font-extrabold uppercase tracking-[0.08em] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_10px_24px_rgba(24,24,27,0.08)] backdrop-blur-xl transition-colors duration-[250ms] hover:border-amber-300/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70"
    >
        <span
            aria-hidden="true"
            className={`absolute left-1 top-1 h-7 w-[30px] rounded-full bg-[#FFB000] shadow-[0_8px_18px_rgba(255,176,0,0.28)] transition-transform duration-[250ms] ease-out ${language === 'vi' ? 'translate-x-[34px]' : 'translate-x-0'}`}
        />
        <span className={`relative z-10 flex h-7 w-[30px] items-center justify-center transition-colors duration-[250ms] ${language === 'en' ? 'text-[#1A0D06]' : 'text-[#6F6A72]'}`}>
            EN
        </span>
        <span className={`relative z-10 flex h-7 w-[30px] items-center justify-center transition-colors duration-[250ms] ${language === 'vi' ? 'text-[#1A0D06]' : 'text-[#6F6A72]'}`}>
            VI
        </span>
    </button>
);

const Navbar = ({ language = 'en', onLanguageChange = () => { }, copy = {} }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const containerRef = useRef(null);
    const linksRef = useRef([]);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 200; // Offset for better detection

            for (const item of NAV_ITEMS) {
                const element = document.getElementById(item.id);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (
                        scrollPosition >= offsetTop &&
                        scrollPosition < offsetTop + offsetHeight
                    ) {
                        setActiveSection(item.id);
                        return;
                    }
                }
            }
            setActiveSection('');
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useGSAP(() => {
        // Scroll Animation
        gsap.to(containerRef.current, {
            y: -20, // Move up slightly
            scale: 0.9, // Make it slightly smaller
            duration: 0.3,
            ease: "power2.out",
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "100px top",
                scrub: true,
            }
        });

        if (isOpen) {
            gsap.to(containerRef.current, {
                height: 'auto',
                duration: 0.5,
                ease: 'power2.out',
            });
            gsap.fromTo(
                linksRef.current,
                { opacity: 0, y: -10 },
                { opacity: 1, y: 0, duration: 0.3, stagger: 0.1, delay: 0.2 }
            );
        } else {
            gsap.to(containerRef.current, {
                height: '70px',
                duration: 0.4,
                ease: 'power2.in',
            });
        }
    }, [isOpen]);

    return (
        <nav
            ref={containerRef}
            className="fixed top-12 left-1/2 -translate-x-1/2 z-[100] w-[95%] sm:w-[90%] md:w-fit md:max-w-none rounded-3xl border border-zinc-200 bg-white/70 backdrop-blur-md px-6 py-3 shadow-lg overflow-hidden h-[70px]"
        >
            <div className="flex items-center justify-between h-[46px]"> {/* Fixed height for header part */}
                <div className="flex items-center gap-8">
                    {/* Wordmark */}
                    <button
                        onClick={scrollToTop}
                        className="font-['Be_Vietnam_Pro'] text-lg font-bold tracking-tight text-zinc-900 hover:text-amber-500 transition-colors focus:outline-none"
                        aria-label="Scroll to top"
                    >
                        RotexAI
                    </button>

                    {/* Desktop Links Section */}
                    <div className="hidden md:flex items-center gap-6">
                        {NAV_ITEMS.map((item) => (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                className={`whitespace-nowrap text-sm font-medium transition-colors hover:text-zinc-900 ${activeSection === item.id ? 'text-zinc-900' : 'text-zinc-500'
                                    }`}
                            >
                                {copy[item.key]}
                            </a>
                        ))}
                        <LanguageToggle
                            language={language}
                            onLanguageChange={onLanguageChange}
                            label={copy.toggleLabel}
                        />
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button onClick={toggleMenu} className="text-zinc-500 hover:text-zinc-900 focus:outline-none">
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Links Section */}
            <div className="md:hidden mt-4 flex flex-col gap-4 pb-4">
                {NAV_ITEMS.map((item, index) => (
                    <a
                        key={item.id}
                        ref={(el) => (linksRef.current[index] = el)}
                        href={`#${item.id}`}
                        className={`whitespace-nowrap text-sm font-medium transition-colors hover:text-zinc-900 opacity-0 ${activeSection === item.id ? 'text-zinc-900' : 'text-zinc-500'}`}
                        onClick={toggleMenu}
                    >
                        {copy[item.key]}
                    </a>
                ))}
                <div ref={(el) => (linksRef.current[NAV_ITEMS.length] = el)} className="opacity-0">
                    <LanguageToggle
                        language={language}
                        onLanguageChange={onLanguageChange}
                        label={copy.toggleLabel}
                    />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
