'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import WorkflowStoryWidget from './WorkflowStoryWidget';

gsap.registerPlugin(ScrollTrigger);

export default function RetailFlow() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const eyebrowRef = useRef<HTMLSpanElement>(null);
    const line1Ref = useRef<HTMLSpanElement>(null);
    const line2Ref = useRef<HTMLSpanElement>(null);
    const subRef = useRef<HTMLParagraphElement>(null);
    const widgetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Scrub-based: plays forward and reverses as you scroll with Lenis
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 65%',
                    end: 'top 20%',
                    scrub: 0.7,
                },
            });

            // Opacity-only fade — no y movement so text doesn't fly as widget pins
            tl.from(eyebrowRef.current, { opacity: 0, duration: 0.5 })
              .from(line1Ref.current, { opacity: 0, duration: 0.7 }, '-=0.3')
              .from(line2Ref.current, { opacity: 0, duration: 0.7 }, '-=0.5')
              .from(subRef.current, { opacity: 0, duration: 0.5 }, '-=0.4');
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            style={{
                background: '#ffffff',
                padding: 'clamp(100px, 12vw, 160px) clamp(20px, 6vw, 80px)',
                position: 'relative',
                overflowX: 'hidden',
            }}
        >
            {/* Subtle grid */}
            <div
                aria-hidden="true"
                style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)',
                    backgroundSize: '64px 64px',
                    pointerEvents: 'none',
                    maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)',
                }}
            />

            <div style={{ maxWidth: '1320px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

                {/* Section header */}
                <div style={{ marginBottom: 'clamp(64px, 8vw, 100px)', maxWidth: '680px' }}>
                    <span
                        ref={eyebrowRef}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '9px',
                            fontFamily: 'var(--font-body)',
                            fontSize: '0.62rem',
                            fontWeight: 700,
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            color: '#0d9488',
                            marginBottom: '24px',
                        }}
                    >
                        <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#0d9488', boxShadow: '0 0 10px rgba(13,148,136,0.4)' }} />
                        Signal Intelligence Platform
                    </span>

                    <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(3rem, 6vw, 5.5rem)', letterSpacing: '-0.04em', lineHeight: 1, color: '#111111', margin: 0 }}>
                        <span ref={line1Ref} style={{ display: 'block' }}>Old methods.</span>
                        <span ref={line2Ref} style={{ display: 'block', color: '#999999' }}>New standards.</span>
                    </h2>

                    <p
                        ref={subRef}
                        style={{
                            fontFamily: 'var(--font-body)',
                            fontWeight: 400,
                            fontSize: 'clamp(1rem, 1.4vw, 1.15rem)',
                            color: '#666666',
                            marginTop: '22px',
                            lineHeight: 1.65,
                            letterSpacing: '-0.01em',
                        }}
                    >
                        Two paths. One choice. Your customers will not wait.
                    </p>
                </div>

                {/* Workflow Widget — IntersectionObserver inside the widget
                     controls when its sequence starts; no GSAP wrapper needed */}
                <div ref={widgetRef}>
                    <WorkflowStoryWidget />
                </div>

            </div>
        </section>
    );
}