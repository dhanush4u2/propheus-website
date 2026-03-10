'use client';

/**
 * GlowCard — Shared interactive spotlight border card.
 * Uses the data-glow CSS system defined in globals.css for a consistent
 * design language across all signal/widget components.
 *
 * Usage:
 *   <GlowCard>...</GlowCard>
 *   <GlowCard isCircular baseHue={160}>...</GlowCard>
 */

import React, { useEffect, useRef } from 'react';

export interface GlowCardProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    /** Shape: true = full circle (border-radius 999px) */
    isCircular?: boolean;
    /**
     * Hue angle for the spotlight/border glow.
     * 175 = teal (default, matches brand accent)
     * 160 = emerald (vegetation)
     * 220 = blue
     */
    baseHue?: number;
    /**
     * Border thickness in px. Default 2.5.
     * Higher = more visible glow border on pointer move.
     */
    borderSize?: number;
}

export default function GlowCard({
    children,
    className = '',
    style = {},
    isCircular = false,
    baseHue = 175,
    borderSize = 2,
}: GlowCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = cardRef.current;
        if (!el) return;
        const syncPointer = (e: PointerEvent) => {
            const rect = el.getBoundingClientRect();
            el.style.setProperty('--x', (e.clientX - rect.left).toFixed(2));
            el.style.setProperty('--xp', (e.clientX / window.innerWidth).toFixed(2));
            el.style.setProperty('--y', (e.clientY - rect.top).toFixed(2));
            el.style.setProperty('--yp', (e.clientY / window.innerHeight).toFixed(2));
        };
        document.addEventListener('pointermove', syncPointer);
        return () => document.removeEventListener('pointermove', syncPointer);
    }, []);

    const borderSizePx = `${borderSize}px`;
    const radius = isCircular ? '999' : '20';

    return (
        <div
            ref={cardRef}
            data-glow
            style={{
                '--base': String(baseHue),
                '--spread': '30',
                '--radius': radius,
                '--border': String(borderSize),
                '--backdrop': 'rgba(0, 0, 0, 0.97)',
                '--backup-border': 'rgba(255, 255, 255, 0.08)',
                '--size': '250',
                '--outer': '1',
                '--border-size': borderSizePx,
                '--spotlight-size': 'calc(var(--size, 250) * 1px)',
                '--hue': `calc(var(--base, ${baseHue}) + (var(--xp, 0) * var(--spread, 30)))`,
                '--saturation': '100',
                '--lightness': '50',
                '--border-spot-opacity': '1',
                '--border-light-opacity': '0.4',
                '--bg-spot-opacity': '0.02',
                backgroundImage: `radial-gradient(var(--spotlight-size) var(--spotlight-size) at calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px), hsl(var(--hue) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 50) * 1%) / var(--bg-spot-opacity, 0.02)), transparent)`,
                backgroundColor: 'var(--backdrop)',
                backgroundSize: `calc(100% + (2 * ${borderSizePx})) calc(100% + (2 * ${borderSizePx}))`,
                backgroundPosition: '50% 50%',
                border: `${borderSizePx} solid var(--backup-border)`,
                borderRadius: isCircular ? '999px' : `${+radius}px`,
                backdropFilter: 'blur(80px)',
                boxShadow: '0 20px 60px -10px rgba(0,0,0,0.95)',
                position: 'relative',
                touchAction: 'none',
                ...style,
            } as React.CSSProperties}
            className={`overflow-hidden relative ${className}`}
        >
            {/* Border glow layer — driven by [data-glow]::before/::after in globals.css */}
            <div
                data-glow-inner
                style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 'inherit',
                    border: 'none',
                    pointerEvents: 'none',
                }}
            />
            <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif", WebkitFontSmoothing: 'antialiased' }}>
                {children}
            </div>
        </div>
    );
}
