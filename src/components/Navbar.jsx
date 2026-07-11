import React, { useState, useRef, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const NAV_ITEMS = [
    { id: 'value-props', label: 'Capabilities' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'differentiators', label: 'Why RotexAI' },
    { id: 'workflow-proof', label: 'Marketplace' },
    { id: 'pricing', label: 'Pricing' },
];

const Navbar = () => {
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
                        className="text-lg font-bold tracking-tight text-zinc-900 hover:text-amber-500 transition-colors focus:outline-none font-['Poppins']"
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
                                className={`text-sm font-medium transition-colors hover:text-zinc-900 ${activeSection === item.id ? 'text-zinc-900' : 'text-zinc-500'
                                    }`}
                            >
                                {item.label}
                            </a>
                        ))}
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
                        className={`text-sm font-medium transition-colors hover:text-zinc-900 opacity-0 ${activeSection === item.id ? 'text-zinc-900' : 'text-zinc-500'}`}
                        onClick={toggleMenu}
                    >
                        {item.label}
                    </a>
                ))}
            </div>
        </nav>
    );
};

export default Navbar;
