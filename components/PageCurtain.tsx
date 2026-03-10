'use client';

/**
 * PageCurtain — white curtain transition used when a navbar link is clicked
 * while the hero state machine is still active (before lenis-revealed).
 *
 * Flow:
 *   1. Listens for  `propheus:curtain` event (dispatched by Navbar).
 *   2. Slides a white sheet DOWN to cover the entire viewport.
 *   3. Fires `propheus:force-exit` to unlock the hero state machine.
 *   4. Jumps the page to the target section (instant, no scroll).
 *   5. Slides the sheet back UP, revealing the destination.
 */

import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

export default function PageCurtain() {
    const controls = useAnimation();

    useEffect(() => {
        let busy = false;

        const onCurtain = async (e: Event) => {
            if (busy) return;
            busy = true;

            const { sectionId } = (e as CustomEvent<{ sectionId: string }>).detail;

            // Reset: place curtain above viewport, make it visible
            controls.set({ y: '-100%', display: 'block', pointerEvents: 'all' });

            // Slide DOWN to cover screen — fast and decisive
            await controls.start({
                y: '0%',
                transition: { duration: 0.48, ease: [0.87, 0, 0.13, 1] },
            });

            // Force-exit the hero experience while the curtain covers everything
            window.dispatchEvent(new CustomEvent('propheus:force-exit'));

            // Jump to target section (instant)
            await new Promise<void>((r) => requestAnimationFrame(() => r()));
            const targetEl = document.getElementById(sectionId);
            if (targetEl) {
                const top = targetEl.getBoundingClientRect().top + window.scrollY;
                window.scrollTo(0, top);
            }

            // Short pause so the browser paints the destination
            await new Promise<void>((r) => setTimeout(r, 100));

            // Slide UP to reveal the destination — slightly slower for premium feel
            await controls.start({
                y: '-100%',
                transition: { duration: 0.72, ease: [0.87, 0, 0.13, 1] },
            });

            // Hide completely (no layout cost)
            controls.set({ display: 'none', pointerEvents: 'none' });
            busy = false;
        };

        window.addEventListener('propheus:curtain', onCurtain);
        return () => window.removeEventListener('propheus:curtain', onCurtain);
    }, [controls]);

    return (
        <motion.div
            initial={{ y: '-100%', display: 'none' }}
            animate={controls}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9998,
                background: '#ffffff',
                pointerEvents: 'none',
                // Drop shadow so curtain feels like a real page sliding over content
                boxShadow: '0 24px 80px 0 rgba(0,0,0,0.20), 0 4px 20px 0 rgba(0,0,0,0.10)',
            }}
        />
    );
}
