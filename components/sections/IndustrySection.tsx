'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import IndustriesWidget from '@/components/ui/IndustriesWidget';

gsap.registerPlugin(ScrollTrigger);

// Split a string into inline-block word spans for stagger animation
function wordSpans(text: string, cls: string) {
    return text.split(' ').map((word, i) => (
        <span
            key={i}
            className={cls}
            style={{ display: 'inline-block', marginRight: '0.3em', willChange: 'opacity, transform, filter' }}
        >
            {word}
        </span>
    ));
}

export default function IndustrySection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const eyebrowRef = useRef<HTMLSpanElement>(null);
    const line1Ref = useRef<HTMLSpanElement>(null);
    const line2Ref = useRef<HTMLSpanElement>(null);
    const subRef = useRef<HTMLParagraphElement>(null);
    const widgetWrapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const line1Words = line1Ref.current?.querySelectorAll('.line1-word');
            const line2Words = line2Ref.current?.querySelectorAll('.line2-word');

            // Single scrub-based timeline — fully scroll-controlled (forward + reverse)
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                    end: 'top 30%',
                    scrub: 0.8,
                },
            });

            tl.from(eyebrowRef.current, { opacity: 0, y: 20, filter: 'blur(4px)', duration: 0.5 });

            if (line1Words?.length) {
                tl.from(line1Words, {
                    y: 55, opacity: 0, filter: 'blur(8px)',
                    stagger: 0.06,
                    duration: 0.7,
                }, '-=0.3');
            }

            if (line2Words?.length) {
                tl.from(line2Words, {
                    y: 30, opacity: 0, filter: 'blur(5px)',
                    stagger: 0.07,
                    duration: 0.6,
                }, '-=0.4');
            }

            tl.from(subRef.current, { opacity: 0, y: 18, duration: 0.5 }, '-=0.3');

            // Widget — perspective tilt rises up
            if (widgetWrapRef.current) {
                gsap.set(widgetWrapRef.current, { transformPerspective: 900 });
                gsap.from(widgetWrapRef.current, {
                    rotateX: 8, y: 80, opacity: 0,
                    scrollTrigger: {
                        trigger: widgetWrapRef.current,
                        start: 'top 80%',
                        end: 'top 45%',
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
                paddingTop: 'clamp(100px, 12vw, 160px)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Subtle noise texture overlay */}
            <div
                aria-hidden="true"
                style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage:
                        'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(45,212,191,0.06) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }}
            />

            {/* ── Section header ── */}
            <div
                style={{
                    maxWidth: '1320px',
                    margin: '0 auto',
                    padding: '0 clamp(20px, 6vw, 80px)',
                    marginBottom: 'clamp(56px, 7vw, 88px)',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
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
                        color: '#2dd4bf',
                        marginBottom: '24px',
                    }}
                >
                    <span
                        style={{
                            display: 'inline-block',
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: '#2dd4bf',
                            boxShadow: '0 0 10px rgba(45,212,191,0.5)',
                        }}
                    />
                    Physical AI Platform
                </span>

                <h2
                    style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 800,
                        letterSpacing: '-0.04em',
                        lineHeight: 1.05,
                        color: '#111111',
                        margin: '0 0 24px',
                    }}
                >
                    <span
                        ref={line1Ref}
                        style={{ display: 'block', fontSize: 'clamp(2.8rem, 5.5vw, 5rem)' }}
                    >
                        {wordSpans('Built for every industry.', 'line1-word')}
                    </span>
                    <span
                        ref={line2Ref}
                        style={{
                            display: 'block',
                            fontSize: 'clamp(1.6rem, 3vw, 2.6rem)',
                            color: '#999999',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {wordSpans('One platform. Infinite context.', 'line2-word')}
                    </span>
                </h2>

                <p
                    ref={subRef}
                    style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)',
                        color: '#666666',
                        lineHeight: 1.7,
                        letterSpacing: '-0.01em',
                        maxWidth: '540px',
                        margin: 0,
                    }}
                >
                    Propheus Physical AI adapts to any industry context — from retail store floors
                    to travel hubs, CPG distribution and O2O ecosystems — delivering real-time
                    intelligence that turns physical signals into decisive action.
                </p>
            </div>

            {/* ── IndustriesWidget — self-contained, internal animations are independent of scroll ── */}
            <div ref={widgetWrapRef}>
                <IndustriesWidget />
            </div>
        </section>
    );
}
