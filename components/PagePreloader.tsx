'use client';

import { useEffect, useRef } from 'react';
import { motion, useAnimation, useAnimationFrame, useMotionValue, useSpring } from 'framer-motion';

// ── Motion-blur tuning knobs ──────────────────────────────────────────────────
const BLUR_Y_MAX       = 48;    // px    – peak vertical blur strength
const BLUR_VEL_SCALE   = 0.05;  // ×     – spring velocity × scale = blur px (tune this)
const BLUR_DECAY_RATE  = 0.72;  // ×/frame – how fast blur fades (lower = faster decay)
const BLUR_DECAY_FLOOR = 0.3;   // px    – snap to zero below this
// ── Spring tuning knobs ───────────────────────────────────────────────────────
const SPRING_DURATION  = 0.9;   // s     – CountUp-style duration reference
const SPRING_DAMPING   = 20 + 40 * (1 / SPRING_DURATION);    // ≈64
const SPRING_STIFFNESS = 100 * (1 / SPRING_DURATION);        // ≈111
// ─────────────────────────────────────────────────────────────────────────────

export default function PagePreloader() {
    const controls = useAnimation();
    const doneRef  = useRef(false);

    // CountUp-style spring — smooth interpolation between progress values
    const motionVal = useMotionValue(0);
    const springVal = useSpring(motionVal, { damping: SPRING_DAMPING, stiffness: SPRING_STIFFNESS });

    // Direct DOM refs — zero React re-renders
    const counterRef = useRef<HTMLSpanElement>(null);
    const blurRef    = useRef<SVGFEGaussianBlurElement>(null);
    const currentBlurRef = useRef(0);

    // Write spring value straight to the DOM
    useEffect(() => {
        const unsub = springVal.on('change', (latest) => {
            if (counterRef.current) {
                counterRef.current.textContent = String(Math.round(latest));
            }
        });
        return () => unsub();
    }, [springVal]);

    // rAF: drive blur from spring velocity — alive as long as number is moving
    useAnimationFrame(() => {
        if (doneRef.current) return;
        const velocity   = Math.abs(springVal.getVelocity());
        const targetBlur = Math.min(BLUR_Y_MAX, velocity * BLUR_VEL_SCALE);

        if (targetBlur > currentBlurRef.current) {
            currentBlurRef.current = targetBlur;                    // spike up
        } else if (currentBlurRef.current > BLUR_DECAY_FLOOR) {
            currentBlurRef.current *= BLUR_DECAY_RATE;              // decay
        } else {
            currentBlurRef.current = 0;
        }

        blurRef.current?.setAttribute('stdDeviation', `0 ${currentBlurRef.current.toFixed(2)}`);
    });

    useEffect(() => {
        const fallback = setTimeout(() => {
            if (!doneRef.current) dismiss();
        }, 15_000);

        const dismiss = () => {
            if (doneRef.current) return;
            doneRef.current = true;
            motionVal.set(100);
            // Wait for the spring to settle at 100 (~350ms) + 200ms intentional pause,
            // then play the slide-out exit animation.
            setTimeout(() => {
                controls
                    .start({
                        y: '-100%',
                        boxShadow: '0 0px 0px 0 rgba(0,0,0,0), 0 0px 0px 0 rgba(0,0,0,0)',
                        transition: { duration: 1.1, ease: [0.87, 0, 0.13, 1], delay: 0 },
                    })
                    .then(() => controls.set({ display: 'none' }));
            }, 550);
        };

        const onProgress = (e: Event) => {
            const val = (e as CustomEvent<{ value: number }>).detail.value;
            motionVal.set(val); // spring smoothly chases this target
        };

        const onComplete = () => dismiss();

        window.addEventListener('propheus:load-progress', onProgress);
        window.addEventListener('propheus:load-complete', onComplete);

        return () => {
            clearTimeout(fallback);
            window.removeEventListener('propheus:load-progress', onProgress);
            window.removeEventListener('propheus:load-complete', onComplete);
        };
    }, [controls, motionVal]);

    return (
        <>
            {/*
              Vertical-only SVG motion blur — feGaussianBlur stdDeviation="0 y"
              blurs ONLY on the Y axis. Over-sized region prevents streak clipping.
            */}
            <svg
                style={{ position: 'fixed', width: 0, height: 0, overflow: 'hidden', zIndex: 0 }}
                aria-hidden="true"
            >
                <defs>
                    <filter id="preloader-motion-blur" x="-5%" y="-100%" width="110%" height="300%">
                        <feGaussianBlur ref={blurRef} in="SourceGraphic" stdDeviation="0 0" />
                    </filter>
                </defs>
            </svg>

            <motion.div
                initial={{
                    y: 0,
                    boxShadow: '0 24px 80px 0 rgba(0,0,0,0.22), 0 8px 24px 0 rgba(0,0,0,0.12)',
                }}
                animate={controls}
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 10000,
                    background: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    pointerEvents: 'all',
                }}
            >
                <div style={{ padding: '0 clamp(28px, 5vw, 64px) clamp(36px, 5vh, 64px)' }}>
                    <span
                        ref={counterRef}
                        style={{
                            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                            fontSize: 'clamp(80px, 12vw, 144px)',
                            fontWeight: 600,
                            lineHeight: 1,
                            letterSpacing: '-0.04em',
                            color: '#111',
                            display: 'block',
                            fontVariantNumeric: 'tabular-nums',
                            WebkitFontSmoothing: 'antialiased',
                            filter: 'url(#preloader-motion-blur)',
                            willChange: 'filter',
                        }}
                    >
                        0
                    </span>
                </div>
            </motion.div>
        </>
    );
}
