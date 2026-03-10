'use client';

/**
 * CensusWidget — Premium Compact Census Analysis v3.6
 * - Shared GlowCard for consistent interactive border glow
 * - Animated counters for population and income
 * - Gender ratio bar
 * - Managed via propheus:state1 / propheus:state1:exit events
 * - Fast exit (0.4s) to match map-marker fade timing
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, animate } from 'framer-motion';
import GlowCard from './GlowCard';

// ─── Icons ────────────────────────────────────────────────────────────────────

const UsersIcon = () => (
    <svg
        viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        style={{ width: 14, height: 14, color: 'rgba(255,255,255,0.55)' }}
    >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

// ─── Animated Counter ─────────────────────────────────────────────────────────

interface AnimatedCounterProps {
    value: number;
    prefix?: string;
}

const AnimatedCounter = ({ value, prefix = '' }: AnimatedCounterProps) => {
    const nodeRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const node = nodeRef.current;
        if (!node) return;
        const controls = animate(0, value, {
            duration: 2.0,
            ease: [0.16, 1, 0.3, 1],
            onUpdate(v: number) {
                node.textContent = `${prefix}${Math.round(v).toLocaleString()}`;
            },
        });
        return () => controls.stop();
    }, [value, prefix]);

    return <span ref={nodeRef} />;
};

// ─── Main Component ───────────────────────────────────────────────────────────

const fastExit = { duration: 0.38, ease: 'easeIn' as const };

export default function CensusWidget() {
    const [isVisible, setIsVisible] = useState(false);
    const [playKey, setPlayKey] = useState(0);
    const [entryDelay, setEntryDelay] = useState(0.3);
    const comingBack = useRef(false);

    useEffect(() => {
        const onState2 = () => { comingBack.current = true; };
        const onEnter = () => {
            const delay = comingBack.current ? 2.0 : 0.3;
            comingBack.current = false;
            setEntryDelay(delay);
            setIsVisible(true);
            setPlayKey(k => k + 1);
        };
        const onExit = () => setIsVisible(false);
        window.addEventListener('propheus:state2',      onState2);
        window.addEventListener('propheus:state1', onEnter);
        window.addEventListener('propheus:state1:exit', onExit);
        return () => {
            window.removeEventListener('propheus:state2',      onState2);
            window.removeEventListener('propheus:state1', onEnter);
            window.removeEventListener('propheus:state1:exit', onExit);
        };
    }, []);

    const sys: React.CSSProperties = {
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif",
        WebkitFontSmoothing: 'antialiased',
        userSelect: 'none',
    };

    return (
        <div style={{ ...sys, maxWidth: 400 }}>
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        key={playKey}
                        initial={{ opacity: 0, y: 18, filter: 'blur(12px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: 18, filter: 'blur(12px)', transition: fastExit }}
                        transition={{ duration: 0.75, delay: entryDelay, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <GlowCard style={{ padding: '20px 28px 28px' }}>

                            {/* HEADER */}
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                marginBottom: 18, paddingBottom: 14,
                                borderBottom: '1px solid rgba(255,255,255,0.06)',
                            }}>
                                <UsersIcon />
                                <h2 style={{ color: 'rgba(255,255,255,0.92)', fontWeight: 600, fontSize: 18, letterSpacing: '-0.03em', lineHeight: 1, margin: 0 }}>
                                    Census
                                </h2>
                            </div>

                            {/* POPULATION + AVG INCOME — side by side */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20, gap: 24 }}>
                                {/* Population — left */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flexShrink: 0 }}>
                                    <span style={{ color: 'rgba(255,255,255,0.32)', fontWeight: 800, fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.18em' }}>
                                        Population
                                    </span>
                                    <span style={{ color: '#fff', fontWeight: 900, fontSize: 26, lineHeight: 1, letterSpacing: '-0.03em', display: 'inline-block', minWidth: '112px', fontVariantNumeric: 'tabular-nums' }}>
                                        <AnimatedCounter value={142600} />
                                    </span>
                                </div>

                                {/* Divider */}
                                <div style={{ width: 1, background: 'rgba(255,255,255,0.08)', alignSelf: 'stretch', flexShrink: 0 }} />

                                {/* Avg Income — right */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'flex-end', flexShrink: 0 }}>
                                    <span style={{ color: 'rgba(255,255,255,0.32)', fontWeight: 800, fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.18em' }}>
                                        Avg Income
                                    </span>
                                    <span style={{ color: '#2dd4bf', fontWeight: 900, fontSize: 26, lineHeight: 1, letterSpacing: '-0.03em', filter: 'drop-shadow(0 0 8px rgba(45,212,191,0.2))', display: 'inline-block', minWidth: '86px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                                        <AnimatedCounter value={98400} prefix="$" />
                                    </span>
                                </div>
                            </div>

                            {/* GENDER RATIO */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <span style={{ color: 'rgba(255,255,255,0.25)', fontWeight: 800, fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.18em' }}>Male</span>
                                        <span style={{ color: '#60a5fa', fontWeight: 900, fontSize: 14, letterSpacing: '-0.02em', lineHeight: 1 }}>49%</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <span style={{ color: '#fb7185', fontWeight: 900, fontSize: 14, letterSpacing: '-0.02em', lineHeight: 1 }}>51%</span>
                                        <span style={{ color: 'rgba(255,255,255,0.25)', fontWeight: 800, fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.18em' }}>Female</span>
                                    </div>
                                </div>
                                <div style={{ height: 4, width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: 99, display: 'flex', overflow: 'hidden' }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '49%' }}
                                        exit={{ width: 0, transition: fastExit }}
                                        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                                        style={{ background: 'rgba(96,165,250,0.75)', borderRadius: '99px 0 0 99px' }}
                                    />
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '51%' }}
                                        exit={{ width: 0, transition: fastExit }}
                                        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                                        style={{ background: 'rgba(251,113,133,0.75)', borderRadius: '0 99px 99px 0' }}
                                    />
                                </div>
                            </div>

                        </GlowCard>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
