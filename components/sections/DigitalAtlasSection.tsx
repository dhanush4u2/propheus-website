'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Dynamically load the atlas so Leaflet only runs client-side
const DigitalAtlas = dynamic(() => import('./DigitalAtlasMap'), { ssr: false });

const INTEL_TYPES = [
    { color: '#3b82f6', label: 'Transit', desc: 'Infrastructure & access nodes' },
    { color: '#f43f5e', label: 'Competitor', desc: 'Same-category rivals nearby' },
    { color: '#10b981', label: 'Complementary', desc: 'Footfall-driving anchors' },
    { color: '#f59e0b', label: 'Demand', desc: 'High-intent destination pressure' },
];

export default function DigitalAtlasSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const eyebrowRef = useRef<HTMLSpanElement>(null);
    const headlineRef = useRef<HTMLHeadingElement>(null);
    const subRef = useRef<HTMLParagraphElement>(null);
    const legendRef = useRef<HTMLDivElement>(null);

    const mapWrapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Eyebrow — slides in from left
            gsap.from(eyebrowRef.current, {
                x: -50, opacity: 0,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 65%',
                    end: 'top 30%',
                    scrub: 0.8,
                },
            });

            // Headline line 1 — sweeps from left
            const spanEls = headlineRef.current?.querySelectorAll('span');
            if (spanEls?.[0]) {
                gsap.from(spanEls[0], {
                    x: -80, opacity: 0,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 62%',
                        end: 'top 26%',
                        scrub: 0.8,
                    },
                });
            }
            // Headline line 2 — sweeps from right
            if (spanEls?.[1]) {
                gsap.from(spanEls[1], {
                    x: 80, opacity: 0,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 59%',
                        end: 'top 22%',
                        scrub: 0.8,
                    },
                });
            }

            // Subtext — drifts from right
            gsap.from(subRef.current, {
                x: 50, opacity: 0,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 55%',
                    end: 'top 18%',
                    scrub: 0.8,
                },
            });

            // Legend — fades up
            gsap.from(legendRef.current, {
                y: 30, opacity: 0,
                scrollTrigger: {
                    trigger: legendRef.current,
                    start: 'top 72%',
                    end: 'top 45%',
                    scrub: 0.8,
                },
            });

            // Map — rises up
            if (mapWrapRef.current) {
                gsap.from(mapWrapRef.current, {
                    y: 60, opacity: 0,
                    scrollTrigger: {
                        trigger: mapWrapRef.current,
                        start: 'top 75%',
                        end: 'top 40%',
                        scrub: 0.9,
                    },
                });
            }


        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            style={{
                background: '#fafafa',
                padding: 'clamp(100px, 12vw, 160px) clamp(20px, 6vw, 80px)',
                position: 'relative',
                overflowX: 'hidden',
            }}
        >
            {/* Subtle grid bg */}
            <div
                aria-hidden="true"
                style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage:
                        'linear-gradient(rgba(0,0,0,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.025) 1px, transparent 1px)',
                    backgroundSize: '64px 64px',
                    pointerEvents: 'none',
                    maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)',
                }}
            />

            <div style={{ maxWidth: '1320px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

                {/* ── Section header ── */}
                <div style={{ marginBottom: 'clamp(56px, 7vw, 88px)', maxWidth: '720px' }}>
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
                        <span
                            style={{
                                display: 'inline-block',
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: '#0d9488',
                                boxShadow: '0 0 10px rgba(13,148,136,0.4)',
                            }}
                        />
                        Location Intelligence
                    </span>

                    <h2
                        ref={headlineRef}
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontWeight: 800,
                            letterSpacing: '-0.04em',
                            lineHeight: 1.05,
                            color: '#111111',
                            margin: '0 0 24px',
                        }}
                    >
                        <span style={{ display: 'block', fontSize: 'clamp(2.8rem, 5.5vw, 5rem)' }}>The Digital Atlas.</span>
                        <span style={{ display: 'block', fontSize: 'clamp(1.6rem, 3vw, 2.6rem)', color: '#999999', whiteSpace: 'nowrap' }}>Your operating system for action in the real world </span>
                    </h2>

                    <p
                        ref={subRef}
                        style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)',
                            color: '#555555',
                            lineHeight: 1.7,
                            letterSpacing: '-0.01em',
                            maxWidth: '540px',
                            margin: 0,
                        }}
                    >
                        Perceives the physical world. Context-aware AI Agents continuously curate real-world data 
                        Fuses real-world signals like weather, people movement, demographics, and consumer sentiment into the most comprehensive representation of the world.
                    </p>
                </div>

                {/* ── Legend row — sits above the map ── */}
                <div
                    ref={legendRef}
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '12px',
                        marginBottom: '28px',
                    }}
                >
                    {INTEL_TYPES.map(({ color, label, desc }) => (
                        <div
                            key={label}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '8px 16px',
                                borderRadius: '999px',
                                background: '#ffffff',
                                border: '1px solid rgba(0,0,0,0.08)',
                                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                            }}
                        >
                            <span
                                style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: color,
                                    flexShrink: 0,
                                    boxShadow: `0 0 8px ${color}60`,
                                }}
                            />
                            <span
                                style={{
                                    fontFamily: 'var(--font-body)',
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    letterSpacing: '0.06em',
                                    textTransform: 'uppercase',
                                    color: '#222222',
                                }}
                            >
                                {label}
                            </span>
                            <span
                                style={{
                                    fontFamily: 'var(--font-body)',
                                    fontSize: '0.72rem',
                                    color: '#888888',
                                    fontWeight: 500,
                                }}
                            >
                                {desc}
                            </span>
                        </div>
                    ))}
                </div>

                {/* ── The atlas map — self-contained, no Lenis/ScrollTrigger inside ── */}
                <div ref={mapWrapRef}>
                    <DigitalAtlas />
                </div>


            </div>
        </section>
    );
}
