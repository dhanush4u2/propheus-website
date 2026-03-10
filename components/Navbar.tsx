'use client';

import { useEffect, useRef, useState } from 'react';
import Button from './Button';

const DEMO_URL = 'https://retail-agent.alchemy-propheus.ai/explorer/';

export default function Navbar() {
    const navRef = useRef<HTMLElement>(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [hidden, setHidden] = useState(false);
    const lastY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const y = window.scrollY;
            const heroHeight = document.getElementById('hero-experience')?.offsetHeight || 0;
            const pastHero = y > heroHeight * 0.9;

            setIsScrolled(pastHero);

            // Hide on scroll-down past hero, reveal on scroll-up
            if (pastHero) {
                const delta = y - lastY.current;
                if (delta > 8) {
                    setHidden(true);
                } else if (delta < -4) {
                    setHidden(false);
                }
            } else {
                setHidden(false);
            }
            lastY.current = y;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollTo = (id: string) => {
        // If the hero is still active (lenis-revealed not yet set), use the white curtain
        // transition so we don't glitch the locked scroll state machine.
        if (!document.body.classList.contains('lenis-revealed')) {
            window.dispatchEvent(
                new CustomEvent('propheus:curtain', { detail: { sectionId: id } })
            );
        } else {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const navClass = [
        'site-navbar',
        isScrolled ? 'scrolled' : '',
        hidden ? 'nav-hidden' : '',
    ].filter(Boolean).join(' ');

    return (
        <nav ref={navRef} className={navClass}>
            <div className="navbar-container">
                <div className="navbar-left">
                    <div className="navbar-links">
                        <button onClick={() => scrollTo('digital-atlas')} className="navbar-link">DIGITAL ATLAS</button>
                        <button onClick={() => scrollTo('industry-section')} className="navbar-link">INDUSTRIES</button>
                        <a href="/retail" className="navbar-link">RETAIL</a>
                    </div>
                </div>
                <div className="navbar-center" style={{ transform: 'translateX(-50%)' }}>
                    <a href="/" className="navbar-logo">
                        <img src="/logo.avif" alt="Propheus" />
                    </a>
                </div>
                <div className="navbar-right">
                    <a
                        href={DEMO_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="navbar-link"
                    >
                        WATCH DEMO
                    </a>
                    <Button
                        variant="primary"
                        className="navbar-btn-primary"
                        onClick={() => scrollTo('cta-footer')}
                    >
                        REQUEST ACCESS
                    </Button>
                </div>
            </div>
        </nav>
    );
}
