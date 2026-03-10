'use client';

/**
 * LenisTextReveal — word-by-word opacity + blur reveal.
 *
 * Two-phase reveal:
 *   Phase 1 (propheus:lenis-progress events, rawProgress 0→1):
 *     Heading words begin revealing from rawProgress 0.55.
 *     All heading words finish by rawProgress 0.92.
 *
 *   Phase 2 (ScrollTrigger on hero section, post-lenis-buffer zone):
 *     Body words reveal as user scrolls through the remaining 500px
 *     of hero height after the canvas-shrink zone ends. This runs
 *     continuously as scroll progress goes from 0 to 1 over that range.
 *
 * Parent container visibility is managed externally (PropheusExperience).
 */

import React, { useEffect, useRef } from 'react';

export interface LenisTextRevealProps {
    heading: string;
    body: string;
}

export default function LenisTextReveal({ heading, body }: LenisTextRevealProps) {
    const headingRef = useRef<HTMLHeadingElement>(null);
    const bodyRef    = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const hw = Array.from(headingRef.current?.querySelectorAll<HTMLSpanElement>('.ltw') ?? []);
        const bw = Array.from(bodyRef.current?.querySelectorAll<HTMLSpanElement>('.ltw')    ?? []);

        // Start fully hidden
        hw.forEach(w => { w.style.opacity = '0'; w.style.filter = 'blur(9px)'; });
        bw.forEach(w => { w.style.opacity = '0'; w.style.filter = 'blur(6px)'; });

        // ── Single-phase reveal: both heading and body driven by lenis-progress ──
        //
        // LENIS_POST_BUFFER = 0, so rawProgress 0→1 spans the full 700px scroll zone.
        // Heading words: reveal from progress 0.60 → 0.82 (container slides in at 0.58).
        // Body words:    reveal from progress 0.78 → 1.00 (all done by the time canvas hits 1:1).
        //
        // Formula ensures last word of each group finishes exactly at the target end:
        //   STEP = (END - START - WINDOW) / (count - 1)
        //   last word starts at: START + (count-1) * STEP = END - WINDOW
        //   last word done  at: END ✓

        const hCount = hw.length;
        const H_START = 0.60;
        const H_WIN   = 0.10;
        const H_END   = 0.82;
        const H_STEP  = hCount > 1 ? (H_END - H_START - H_WIN) / (hCount - 1) : 0;

        const bCount = bw.length;
        const B_START = 0.78;
        const B_WIN   = 0.06;
        const B_END   = 1.00;
        const B_STEP  = bCount > 1 ? (B_END - B_START - B_WIN) / (bCount - 1) : 0;

        const onProgress = (ev: Event) => {
            const p = (ev as CustomEvent<{ progress: number }>).detail.progress;

            hw.forEach((word, i) => {
                const start = H_START + i * H_STEP;
                const t = Math.max(0, Math.min(1, (p - start) / H_WIN));
                word.style.opacity = String(t);
                word.style.filter  = `blur(${(1 - t) * 9}px)`;
            });

            bw.forEach((word, i) => {
                const start = B_START + i * B_STEP;
                const t = Math.max(0, Math.min(1, (p - start) / B_WIN));
                word.style.opacity = String(t);
                word.style.filter  = `blur(${(1 - t) * 6}px)`;
            });
        };

        window.addEventListener('propheus:lenis-progress', onProgress);

        return () => {
            window.removeEventListener('propheus:lenis-progress', onProgress);
        };
    }, [heading, body]);

    const split = (text: string) =>
        text.split(/(\s+)/).map((chunk, i) =>
            /^\s+$/.test(chunk)
                ? chunk
                : (
                    <span
                        key={i}
                        className="ltw"
                        style={{ display: 'inline', willChange: 'opacity, filter' }}
                    >
                        {chunk}
                    </span>
                )
        );

    const sys: React.CSSProperties = {
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif",
        WebkitFontSmoothing: 'antialiased',
    };

    return (
        <>
            <h3
                ref={headingRef}
                style={{
                    ...sys,
                    fontSize: 'clamp(1.65rem, 2.6vw, 2.9rem)',
                    fontWeight: 700,
                    letterSpacing: '-0.035em',
                    lineHeight: 1.1,
                    color: '#111111',
                    margin: '0 0 1.5rem',
                    textAlign: 'center',
                }}
            >
                {split(heading)}
            </h3>
            <p
                ref={bodyRef}
                style={{
                    ...sys,
                    fontSize: 'clamp(0.9rem, 1.15vw, 1.05rem)',
                    lineHeight: 1.78,
                    color: 'rgba(0,0,0,0.50)',
                    fontWeight: 400,
                    margin: '0 auto',
                    maxWidth: '540px',
                    textAlign: 'center',
                }}
            >
                {split(body)}
            </p>
        </>
    );
}
