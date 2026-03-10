'use client';

import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─── Animated number counter ─── */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const started = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !started.current) {
                started.current = true;
                let s = 0;
                const step = 16;
                const inc = to / (1400 / step);
                const t = setInterval(() => {
                    s += inc;
                    if (s >= to) { setCount(to); clearInterval(t); }
                    else setCount(Math.round(s));
                }, step);
                obs.disconnect();
            }
        }, { threshold: 0.3 });
        obs.observe(el);
        return () => obs.disconnect();
    }, [to]);

    return <span ref={ref}>{count}{suffix}</span>;
}

/* ─── Data ─── */
const SIGNALS = [
    { label: 'Weather', val: 'Heavy snow Fri–Sat · −18% footfall', accent: 'alert', icon: '☁' },
    { label: 'Competitor', val: 'Target 20% off apparel · 0.4mi radius', accent: 'warn', icon: '⬡' },
    { label: 'Local Event', val: "St Patrick's Parade · +34% Saturday", accent: '', icon: '◎' },
];

const DIFF_ROWS = [
    ['Show you what happened last week', 'Tells you what will likely happen next'],
    ['Generic dashboards across all stores', 'Store-by-store signal curation'],
    ['Trends and insights — not actions', 'Recommended actions — not dashboards'],
    ['No real-world context', 'Weather, events, promos baked in'],
    ['Static — no learning', 'Reinforcement learning — gets smarter'],
];

const PANELS = [
    {
        num: '01', label: 'Signal Curation',
        title: 'Curates what matters',
        body: "Propheus filters noise and curates signals relevant to each store's context, category, and location — so teams are never overwhelmed by generic alerts.",
        stat: 'Context first',
        signals: [
            { l: 'Local Events', v: 'Sports, concerts, school calendars', t: '' },
            { l: 'Competitor Promos', v: 'Ranked by distance and overlap', t: 'warn' },
            { l: 'Weather', v: 'Localized alerts with traffic impact', t: 'alert' },
        ],
    },
    {
        num: '02', label: 'Signals → Actions',
        title: 'Signals into actions — not insights',
        body: 'Instead of dashboards or "interesting trends," Propheus converts real-world signals into clear store-by-store actions before the week begins.',
        stat: '40+ weekly',
        signals: [
            { l: 'Weather Signal', v: 'Heavy snow Fri–Sat · −18% traffic', t: 'alert' },
            { l: 'Competitor Promo', v: 'Target: 20% off apparel nearby', t: 'warn' },
            { l: 'Local Event', v: "St. Patrick's Parade · +34% traffic", t: '' },
        ],
    },
    {
        num: '03', label: 'Learning Engine',
        title: 'Learns and improves over time',
        body: "Propheus learns from store team actions and outcomes — what worked and what didn't — so recommendations become smarter every week.",
        stat: 'Weekly refresh',
        signals: [
            { l: 'Staffing', v: 'Learns which shifts improved service', t: '' },
            { l: 'Replenishment', v: 'Refines reorder timing from demand', t: '' },
            { l: 'Merchandising', v: 'Refines plays from store outcomes', t: '' },
        ],
    },
];

const WHO = [
    {
        title: 'C-Suite', sub: 'Commercial / Ops / Stores',
        body: "Predictable execution, fewer surprises. Know what's coming before it hits your numbers.",
        n: '01',
    },
    {
        title: 'VP Stores', sub: 'Retail Ops / Analytics',
        body: 'Early warning plus targeted interventions — without drowning your team in more data.',
        n: '02',
    },
    {
        title: 'Field Ops', sub: 'Regional Leaders',
        body: 'Prioritize visits and coaching with context. Know which stores need attention and why.',
        n: '03',
    },
    {
        title: 'Store Teams', sub: 'On the Floor',
        body: 'Clear weekly priorities tied to real-world conditions. No interpretation required — just act.',
        n: '04',
    },
];

/* ─── Main Page ─── */
export default function RetailPage() {
    const heroBadgeRef = useRef<HTMLDivElement>(null);
    const heroHeadRef = useRef<HTMLHeadingElement>(null);
    const heroSubRef = useRef<HTMLParagraphElement>(null);
    const heroCtaRef = useRef<HTMLDivElement>(null);
    const heroDashRef = useRef<HTMLDivElement>(null);
    const statementRef = useRef<HTMLDivElement>(null);
    const problemRef = useRef<HTMLDivElement>(null);
    const panelStickyRef = useRef<HTMLDivElement>(null);
    const panelTrackRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);
    const atlasRef = useRef<HTMLElement>(null);
    const whoRef = useRef<HTMLElement>(null);

    useEffect(() => {
        document.body.classList.add('lenis-revealed');

        const ctx = gsap.context(() => {
            /* ── HERO — staggered entrance ── */
            const heroTl = gsap.timeline({ delay: 0.3 });
            heroTl
                .from(heroBadgeRef.current, { opacity: 0, y: 16, duration: 0.7, ease: 'power3.out' })
                .from(heroHeadRef.current?.querySelectorAll('.rw-word') ?? [], {
                    opacity: 0, y: 60, skewY: 3, stagger: 0.08, duration: 0.9, ease: 'power3.out',
                }, '-=0.3')
                .from(heroSubRef.current, { opacity: 0, y: 20, duration: 0.7, ease: 'power3.out' }, '-=0.4')
                .from(heroCtaRef.current, { opacity: 0, y: 14, duration: 0.6, ease: 'power3.out' }, '-=0.4')
                .from(heroDashRef.current, { opacity: 0, y: 30, duration: 0.9, ease: 'power3.out' }, '-=0.5');

            /* ── PROBLEM STATEMENT — line reveal ── */
            if (statementRef.current) {
                gsap.from(statementRef.current.querySelectorAll('.rw-reveal-line'), {
                    scrollTrigger: { trigger: statementRef.current, start: 'top 75%', once: true },
                    opacity: 0, y: 50, skewY: 2, stagger: 0.12, duration: 1, ease: 'power3.out',
                });
            }
            if (problemRef.current) {
                gsap.from(problemRef.current.querySelectorAll('.diff-row'), {
                    scrollTrigger: { trigger: problemRef.current, start: 'top 70%', once: true },
                    opacity: 0, x: -24, stagger: 0.10, duration: 0.7, ease: 'power2.out',
                });
            }

            /* ── HORIZONTAL PANEL SCROLL ── */
            if (panelStickyRef.current && panelTrackRef.current) {
                const totalWidth = panelTrackRef.current.scrollWidth - window.innerWidth;
                gsap.to(panelTrackRef.current, {
                    x: -totalWidth,
                    ease: 'none',
                    scrollTrigger: {
                        id: 'panels-scroll',
                        trigger: panelStickyRef.current,
                        start: 'top top',
                        end: () => `+=${totalWidth + window.innerHeight * 0.5}`,
                        pin: true,
                        scrub: 1.2,
                        anticipatePin: 1,
                    },
                });
            }

            /* ── STATS ── */
            if (statsRef.current) {
                gsap.from(statsRef.current.querySelectorAll('.stat-item'), {
                    scrollTrigger: { trigger: statsRef.current, start: 'top 75%', once: true },
                    opacity: 0, y: 40, stagger: 0.12, duration: 0.8, ease: 'power3.out',
                });
            }

            /* ── ATLAS ── */
            if (atlasRef.current) {
                gsap.from(atlasRef.current.querySelectorAll('.atlas-node'), {
                    scrollTrigger: { trigger: atlasRef.current, start: 'top 65%', once: true },
                    opacity: 0, scale: 0.8, stagger: 0.12, duration: 0.7, ease: 'back.out(1.4)',
                });
                gsap.from(atlasRef.current.querySelectorAll('.atlas-copy > *'), {
                    scrollTrigger: { trigger: atlasRef.current, start: 'top 70%', once: true },
                    opacity: 0, y: 32, stagger: 0.1, duration: 0.8, ease: 'power3.out',
                });
            }

            /* ── WHO ── */
            if (whoRef.current) {
                gsap.from(whoRef.current.querySelectorAll('.who-card'), {
                    scrollTrigger: { trigger: whoRef.current, start: 'top 70%', once: true },
                    opacity: 0, y: 40, stagger: 0.1, duration: 0.8, ease: 'power3.out',
                });
            }
        });

        return () => ctx.revert();
    }, []);

    return (
        <>
            <Navbar />
            <main className="rw-root">

                {/* ═══════════════════════════ HERO ═══════════════════════════ */}
                <section className="rw-hero">
                    <div className="rw-hero-bg-word" aria-hidden="true">SIGNAL</div>
                    <div className="rw-hero-layout">
                        <div className="rw-hero-copy">
                            <div className="rw-badge" ref={heroBadgeRef}>
                                <span className="rw-badge-dot" />
                                Retail AI Agent
                            </div>
                            <h1 className="rw-hero-h1" ref={heroHeadRef}>
                                {['Retail', 'AI', 'that', 'acts—', 'not', 'reports.'].map((w, i) => (
                                    <span key={i} className="rw-word-wrap">
                                        <span className="rw-word">{w}</span>
                                    </span>
                                ))}
                            </h1>
                            <p className="rw-hero-sub" ref={heroSubRef}>
                                Propheus curates real-world signals — weather, competitor promos, local events — and delivers store-by-store action plans. Not dashboards. <strong>Decisions.</strong>
                            </p>
                            <div className="rw-hero-cta-row" ref={heroCtaRef}>
                                <Link href="/book-demo" className="rw-cta-primary">Book a Demo</Link>
                                <a href="#how" className="rw-cta-ghost">See how it works ↓</a>
                            </div>
                        </div>

                        <div className="rw-hero-right" ref={heroDashRef}>
                            <div className="rw-signal-stack">
                                <div className="rw-signal-stack-header">
                                    <div className="rw-ssh-store">Manchester — Market St</div>
                                    <div className="rw-ssh-meta">Week of March 9, 2026</div>
                                    <span className="rw-live-pill">
                                        <span className="rw-live-dot" />LIVE
                                    </span>
                                </div>
                                {SIGNALS.map((s, i) => (
                                    <div key={i} className={`rw-signal-row rw-signal-${s.accent || 'base'}`}>
                                        <div className="rw-signal-bar" />
                                        <div className="rw-signal-ico">{s.icon}</div>
                                        <div>
                                            <div className="rw-signal-label">{s.label}</div>
                                            <div className="rw-signal-val">{s.val}</div>
                                        </div>
                                    </div>
                                ))}
                                <div className="rw-signal-actions">
                                    <div className="rw-actions-head">Recommended Actions</div>
                                    {[
                                        'Shift labor to Saturday parade window',
                                        'Counter competitor with accessory bundle',
                                        'Reduce Friday staffing — −18% expected',
                                    ].map((a, i) => (
                                        <div key={i} className="rw-action-row">
                                            <span className="rw-action-check">✓</span>
                                            <span>{a}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="rw-forecast">
                                    <div className="rw-forecast-label">Footfall Forecast</div>
                                    <div className="rw-bars">
                                        {[55, 42, 60, 38, 75, 68, 90].map((h, i) => (
                                            <div key={i} className="rw-bar-col">
                                                <div className={`rw-bar ${i === 6 ? 'rw-bar-peak' : ''}`} style={{ height: `${h}%` }} />
                                                <span className="rw-bar-day">{['M','T','W','T','F','S','S'][i]}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="rw-forecast-conf">87% confidence</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rw-scroll-cue" aria-hidden="true">
                        <span>Scroll</span>
                        <div className="rw-scroll-line" />
                    </div>
                </section>

                {/* ═══════════════════════════ PROBLEM ═══════════════════════════ */}
                <section className="rw-statement" id="how">
                    <div className="rw-statement-inner" ref={statementRef}>
                        <div className="rw-section-label">
                            <span className="rw-sl-line" />The Reality
                        </div>
                        <h2 className="rw-statement-head">
                            <span className="rw-reveal-line">Most tools tell store</span>
                            <span className="rw-reveal-line">managers <em>"here's what</em></span>
                            <span className="rw-reveal-line"><em>happened."</em></span>
                        </h2>
                        <p className="rw-statement-body">
                            Real-world conditions hit your stores before your dashboards even register. Propheus intercepts those signals and converts them into decisions — before the week begins.
                        </p>
                    </div>
                    <div className="rw-diff-wrap" ref={problemRef}>
                        <div className="rw-diff">
                            <div className="rw-diff-cols">
                                <div className="rw-diff-col-head rw-diff-old-head">Traditional Analytics</div>
                                <div className="rw-diff-col-head rw-diff-new-head">Propheus Retail Agent</div>
                            </div>
                            {DIFF_ROWS.map(([old, nw], i) => (
                                <div key={i} className="diff-row rw-diff-row">
                                    <div className="rw-diff-cell rw-diff-cell-old">
                                        <span className="rw-x">✗</span>{old}
                                    </div>
                                    <div className="rw-diff-cell rw-diff-cell-new">
                                        <span className="rw-check">✓</span>{nw}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════ HORIZONTAL PANELS ═══════════════════════════ */}
                <div className="rw-panels-outer" ref={panelStickyRef} id="solution">
                    <div className="rw-panels-sticky-label">
                        <span className="rw-sl-line light" />The Solution
                    </div>
                    <div className="rw-panels-track" ref={panelTrackRef}>
                        <div className="rw-panel-intro">
                            <div className="rw-panel-intro-inner">
                                <div className="rw-section-label light">
                                    <span className="rw-sl-line light" />How It Works
                                </div>
                                <h2 className="rw-panel-main-head">
                                    Hire your<br />Retail AI Agent
                                </h2>
                                <p className="rw-panel-main-sub">
                                    Three things Propheus does before your week begins.
                                </p>
                                <div className="rw-panel-arrow">→</div>
                            </div>
                        </div>
                        {PANELS.map((p, i) => (
                            <div key={i} className="rw-panel-card">
                                <div className="rw-panel-inner">
                                    <div className="rw-panel-num">{p.num}</div>
                                    <div className="rw-panel-label-badge">{p.label}</div>
                                    <h3 className="rw-panel-title">{p.title}</h3>
                                    <p className="rw-panel-body">{p.body}</p>
                                    <div className="rw-panel-signals">
                                        {p.signals.map((s, si) => (
                                            <div key={si} className={`rw-ps rw-ps-${s.t || 'base'}`}>
                                                <div className="rw-ps-bar" />
                                                <div>
                                                    <div className="rw-ps-l">{s.l}</div>
                                                    <div className="rw-ps-v">{s.v}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="rw-panel-stat">
                                        <div className="rw-panel-stat-label">
                                            {i === 0 ? 'Signal Mix' : i === 1 ? 'Signals Per Store' : 'Optimization Loop'}
                                        </div>
                                        <div className="rw-panel-stat-val">{p.stat}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ═══════════════════════════ STATS ═══════════════════════════ */}
                <div className="rw-stats" ref={statsRef}>
                    {[
                        { n: 40, suf: '+', desc: 'Real-world signals per store, weekly' },
                        { n: 87, suf: '%', desc: 'Average forecast confidence' },
                        { n: 3, suf: 'x', desc: 'Faster response to market changes' },
                    ].map((s, i) => (
                        <div key={i} className="stat-item">
                            <div className="rw-stat-n"><Counter to={s.n} suffix={s.suf} /></div>
                            <div className="rw-stat-d">{s.desc}</div>
                        </div>
                    ))}
                </div>

                {/* ═══════════════════════════ ATLAS ═══════════════════════════ */}
                <section className="rw-atlas" id="atlas" ref={atlasRef}>
                    <div className="rw-atlas-inner">
                        <div className="atlas-copy">
                            <div className="rw-section-label">
                                <span className="rw-sl-line" />Platform
                            </div>
                            <h2 className="rw-atlas-head">
                                Powered by the<br />
                                <span className="rw-teal">Digital Atlas</span><br />
                                for your Stores
                            </h2>
                            <ul className="rw-atlas-list">
                                {[
                                    'Curates signals from 40+ data sources',
                                    'Maps signals to each store\'s context and location',
                                    'Generates store-by-store action plans',
                                    'Learns from outcomes to sharpen future recommendations',
                                ].map((t, i) => (
                                    <li key={i} className="rw-atlas-li">
                                        <span className="rw-atlas-li-dot" />{t}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/book-demo" className="rw-cta-primary" style={{ marginTop: '36px', display: 'inline-block' }}>
                                Book a Demo
                            </Link>
                        </div>
                        <div className="rw-atlas-diagram">
                            <div className="rw-atlas-glow" />
                            <div className="rw-atlas-ring rw-atlas-ring-1" />
                            <div className="rw-atlas-ring rw-atlas-ring-2" />
                            <div className="rw-atlas-ring rw-atlas-ring-3" />
                            <div className="rw-atlas-center">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                    <polyline points="9 22 9 12 15 12 15 22" />
                                </svg>
                                <span>Your Store</span>
                            </div>
                            {[
                                { label: 'Weather', pos: { top: '5%', left: '10%' } },
                                { label: 'Local Events', pos: { top: '5%', right: '10%' } },
                                { label: 'Competitor Promos', pos: { top: '50%', left: '-2%', transform: 'translateY(-50%)' } },
                                { label: 'Consumer Sentiment', pos: { top: '50%', right: '-2%', transform: 'translateY(-50%)' } },
                                { label: 'Disruptions', pos: { bottom: '8%', left: '10%' } },
                                { label: 'Real-World Signals', pos: { bottom: '8%', right: '8%' } },
                            ].map((n, i) => (
                                <div key={i} className="atlas-node" style={{ position: 'absolute', animationDelay: `${i * 0.9}s`, ...n.pos }}>
                                    {n.label}
                                </div>
                            ))}
                            <svg className="rw-atlas-svg" viewBox="0 0 500 400">
                                {[
                                    { x2: 80, y2: 40 }, { x2: 420, y2: 40 }, { x2: 20, y2: 200 },
                                    { x2: 480, y2: 200 }, { x2: 80, y2: 360 }, { x2: 420, y2: 360 },
                                ].map((l, i) => (
                                    <line key={i} x1={250} y1={200} x2={l.x2} y2={l.y2}
                                        stroke="rgba(13,148,136,0.18)" strokeWidth="1" strokeDasharray="5 7" />
                                ))}
                            </svg>
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════ WHO IT'S FOR ═══════════════════════════ */}
                <section className="rw-who" ref={whoRef}>
                    <div className="rw-who-inner">
                        <div className="rw-section-label">
                            <span className="rw-sl-line" />Who It's For
                        </div>
                        <h2 className="rw-who-head">
                            Built for leaders<br />accountable for outcomes
                        </h2>
                        <div className="rw-who-grid">
                            {WHO.map((w, i) => (
                                <div key={i} className="who-card rw-who-card">
                                    <div className="rw-who-n">{w.n}</div>
                                    <div className="rw-who-title">{w.title}</div>
                                    <div className="rw-who-sub">{w.sub}</div>
                                    <p className="rw-who-body">{w.body}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════ CTA ═══════════════════════════ */}
                <section className="rw-cta-section">
                    <div className="rw-cta-glow" />
                    <div className="rw-cta-grid-overlay" />
                    <div className="rw-cta-inner">
                        <div className="rw-cta-eyebrow">
                            <span className="rw-sl-line" />Retail Signal Platform<span className="rw-sl-line" />
                        </div>
                        <h2 className="rw-cta-head">
                            Hire your<br />
                            <span className="rw-teal">Retail AI Agent.</span>
                        </h2>
                        <p className="rw-cta-sub">
                            See how Propheus curates events, competitor promos, and weather — filtered by your store context — and generates store-by-store actions that improve over time.
                        </p>
                        <Link href="/book-demo" className="rw-cta-primary large">Book a Demo</Link>
                    </div>
                </section>

                {/* ═══════════════════════════ FOOTER ═══════════════════════════ */}
                <footer className="rw-footer">
                    <div className="rw-footer-brand">
                        <svg width="8" height="8" viewBox="0 0 10 10" fill="currentColor"><rect width="10" height="10" rx="1" /></svg>
                        Propheus Retail Agent
                    </div>
                    <div className="rw-footer-sub">
                        The Signal: Retail in the Real World · Real-world decisions. Before the week happens.
                    </div>
                    <div className="rw-footer-right">
                        <Link href="/" className="rw-footer-link">← Home</Link>
                        <Link href="/book-demo" className="rw-footer-demo">Book a Demo →</Link>
                    </div>
                </footer>
            </main>

            <style>{`
/* ══════════════════════════════════════════════════════════════
   RETAIL PAGE — REVAMP 2026
   Prefix: rw-
   Philosophy: white/black dominant, teal accent only.
   GSAP ScrollTrigger + Lenis smooth scroll throughout.
══════════════════════════════════════════════════════════════ */

@keyframes rw-blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
@keyframes rw-ring-spin { to { transform: translate(-50%,-50%) rotate(360deg); } }
@keyframes rw-ring-pulse {
    0%,100%{opacity:.5;transform:translate(-50%,-50%) scale(1)}
    50%{opacity:.85;transform:translate(-50%,-50%) scale(1.04)}
}
@keyframes rw-center-aura {
    0%,100%{box-shadow:0 0 0 8px rgba(13,148,136,.12),0 0 0 20px rgba(13,148,136,.05)}
    50%{box-shadow:0 0 0 14px rgba(13,148,136,.10),0 0 0 32px rgba(13,148,136,.04)}
}
@keyframes rw-node-float {
    0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)}
}
@keyframes rw-scroll-line {
    0%{transform:scaleY(0);transform-origin:top}
    50%{transform:scaleY(1);transform-origin:top}
    50.001%{transform:scaleY(1);transform-origin:bottom}
    100%{transform:scaleY(0);transform-origin:bottom}
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.rw-root {
    background: #ffffff;
    color: #111111;
    font-family: var(--font-body, 'Inter', sans-serif);
    overflow-x: hidden;
}

/* ── Typographic primitives ── */
.rw-section-label {
    display: inline-flex; align-items: center; gap: 10px;
    font-size: .58rem; font-weight: 700; letter-spacing: .26em;
    text-transform: uppercase; color: #0d9488; margin-bottom: 20px;
}
.rw-section-label.light { color: rgba(13,212,197,.75); }
.rw-sl-line { display: inline-block; width: 18px; height: 1.5px; background: #0d9488; flex-shrink: 0; }
.rw-sl-line.light { background: rgba(13,212,197,.6); }
.rw-teal { color: #0d9488; }

/* ══════════════════════ HERO ══════════════════════ */
.rw-hero {
    position: relative; min-height: 100vh;
    display: flex; flex-direction: column; justify-content: center;
    padding: 140px clamp(24px,6vw,80px) 100px;
    background: #ffffff; overflow: hidden;
}
.rw-hero-bg-word {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%,-50%);
    font-family: var(--font-display,'Syne',sans-serif); font-weight: 700;
    font-size: clamp(10vw,13vw,16vw); letter-spacing: .08em;
    color: rgba(0,0,0,.03); white-space: nowrap;
    pointer-events: none; user-select: none; line-height: 1; text-transform: uppercase;
}
.rw-hero-layout {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: clamp(40px,6vw,96px); align-items: center;
    max-width: 1360px; margin: 0 auto; width: 100%; position: relative; z-index: 1;
}
.rw-badge {
    display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px;
    background: #111111; border-radius: 999px; font-size: 9px;
    font-weight: 700; letter-spacing: .2em; text-transform: uppercase;
    color: #ffffff; width: fit-content; margin-bottom: 28px;
}
.rw-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #0d9488; animation: rw-blink 1.4s step-end infinite; }
.rw-hero-h1 {
    font-family: var(--font-body,'Inter',sans-serif); font-weight: 700;
    font-size: clamp(1.9rem,3vw,2.8rem); line-height: 1.15;
    letter-spacing: -.025em; color: #111111; margin-bottom: 32px;
    display: flex; flex-wrap: wrap; gap: .12em .18em;
}
.rw-word-wrap { overflow: hidden; display: inline-block; }
.rw-word { display: inline-block; }
.rw-hero-sub {
    font-size: clamp(15px,1.3vw,18px); line-height: 1.72; color: #555;
    max-width: 460px; margin-bottom: 44px;
}
.rw-hero-sub strong { color: #111111; font-weight: 700; }
.rw-hero-cta-row { display: flex; gap: 16px; flex-wrap: wrap; align-items: center; }
.rw-cta-primary {
    display: inline-block; background: #111111; color: #ffffff;
    font-size: 11px; font-weight: 700; letter-spacing: .18em;
    text-transform: uppercase; padding: 15px 34px;
    border: 2px solid #111111; border-radius: 3px; text-decoration: none;
    transition: background .22s, border-color .22s, transform .18s;
}
.rw-cta-primary:hover { background: #0d9488; border-color: #0d9488; transform: translateY(-2px); }
.rw-cta-primary.large { padding: 18px 44px; font-size: 12px; }
.rw-cta-ghost {
    font-size: 12px; font-weight: 600; letter-spacing: .1em;
    color: #888; text-decoration: none; transition: color .2s;
}
.rw-cta-ghost:hover { color: #111111; }

/* Signal stack (hero right) */
.rw-signal-stack {
    background: #0d0d0d; border-radius: 12px; overflow: hidden;
    box-shadow: 0 32px 80px rgba(0,0,0,.22), 0 4px 16px rgba(0,0,0,.10);
}
.rw-signal-stack-header {
    background: rgba(255,255,255,.04); border-bottom: 1px solid rgba(255,255,255,.07);
    padding: 14px 18px; display: flex; align-items: center; gap: 10px;
}
.rw-ssh-store { font-size: 13px; font-weight: 700; color: #ffffff; flex: 1; }
.rw-ssh-meta { font-size: 9px; letter-spacing: .08em; color: rgba(255,255,255,.25); }
.rw-live-pill {
    display: inline-flex; align-items: center; gap: 5px;
    background: rgba(13,148,136,.18); border: 1px solid rgba(13,148,136,.35);
    border-radius: 999px; padding: 3px 8px; font-size: 7.5px;
    letter-spacing: .18em; font-weight: 700; text-transform: uppercase; color: #0d9488;
}
.rw-live-dot { width: 5px; height: 5px; border-radius: 50%; background: #0d9488; animation: rw-blink 1.2s step-end infinite; }
.rw-signal-row {
    display: flex; align-items: center; gap: 12px; padding: 12px 18px;
    border-bottom: 1px solid rgba(255,255,255,.05); position: relative; overflow: hidden;
}
.rw-signal-bar { position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: rgba(255,255,255,.15); }
.rw-signal-alert .rw-signal-bar { background: #ff6b6b; }
.rw-signal-warn  .rw-signal-bar { background: #f0b429; }
.rw-signal-base  .rw-signal-bar { background: rgba(13,148,136,.6); }
.rw-signal-ico { font-size: 14px; color: rgba(255,255,255,.3); flex-shrink: 0; }
.rw-signal-label { font-size: 8px; letter-spacing: .12em; text-transform: uppercase; color: rgba(255,255,255,.3); margin-bottom: 2px; }
.rw-signal-val { font-size: 12px; font-weight: 600; color: rgba(255,255,255,.82); line-height: 1.3; }
.rw-signal-actions { padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,.05); }
.rw-actions-head { font-size: 8px; letter-spacing: .18em; text-transform: uppercase; color: rgba(255,255,255,.25); margin-bottom: 10px; }
.rw-action-row { display: flex; align-items: flex-start; gap: 9px; font-size: 11px; color: rgba(255,255,255,.65); line-height: 1.45; margin-bottom: 7px; }
.rw-action-check { color: #0d9488; flex-shrink: 0; font-size: 12px; }
.rw-forecast { padding: 14px 18px; }
.rw-forecast-label { font-size: 8px; letter-spacing: .16em; text-transform: uppercase; color: rgba(255,255,255,.25); margin-bottom: 10px; }
.rw-bars { display: flex; align-items: flex-end; gap: 4px; height: 44px; }
.rw-bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; height: 100%; justify-content: flex-end; }
.rw-bar { width: 100%; background: rgba(13,148,136,.28); border-radius: 2px 2px 0 0; }
.rw-bar-peak { background: #0d9488; }
.rw-bar-day { font-size: 7px; letter-spacing: .06em; color: rgba(255,255,255,.2); }
.rw-forecast-conf { margin-top: 6px; font-size: 9px; color: #0d9488; letter-spacing: .1em; }
.rw-scroll-cue {
    position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    font-size: 8px; letter-spacing: .22em; text-transform: uppercase; color: rgba(0,0,0,.25);
}
.rw-scroll-line { width: 1px; height: 40px; background: rgba(0,0,0,.15); animation: rw-scroll-line 2s ease-in-out infinite; }

/* ══════════════════════ PROBLEM / STATEMENT ══════════════════════ */
.rw-statement { background: #111111; }
.rw-statement-inner {
    max-width: 1200px; margin: 0 auto;
    padding: clamp(80px,10vw,140px) clamp(24px,6vw,80px) 0;
}
.rw-statement-head {
    font-family: var(--font-heading,'Playfair Display',serif); font-weight: 600;
    font-size: clamp(1.7rem,2.8vw,2.6rem); line-height: 1.25;
    letter-spacing: -.01em; color: #ffffff; margin-bottom: 28px;
    display: flex; flex-direction: column; gap: .1em;
}
.rw-reveal-line { display: block; }
.rw-statement-head em { font-style: normal; color: rgba(255,255,255,.38); }
.rw-statement-body { font-size: 16px; color: rgba(255,255,255,.42); max-width: 520px; line-height: 1.72; margin-bottom: clamp(48px,6vw,80px); }
.rw-diff-wrap { max-width: 1200px; margin: 0 auto; padding: 0 clamp(24px,6vw,80px) clamp(60px,8vw,100px); }
.rw-diff { border: 1px solid rgba(255,255,255,.08); border-radius: 6px; overflow: hidden; }
.rw-diff-cols { display: grid; grid-template-columns: 1fr 1fr; }
.rw-diff-col-head { padding: 14px 22px; font-size: 9px; letter-spacing: .22em; text-transform: uppercase; border-bottom: 1px solid rgba(255,255,255,.08); }
.rw-diff-old-head { color: rgba(255,255,255,.3); border-right: 1px solid rgba(255,255,255,.08); }
.rw-diff-new-head { color: #0d9488; }
.rw-diff-row { display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid rgba(255,255,255,.05); }
.rw-diff-cell { padding: 13px 22px; font-size: 14px; line-height: 1.55; display: flex; align-items: flex-start; gap: 10px; }
.rw-diff-cell-old { color: rgba(255,255,255,.28); border-right: 1px solid rgba(255,255,255,.06); }
.rw-diff-cell-new { color: rgba(255,255,255,.78); }
.rw-x { color: rgba(255,100,100,.5); flex-shrink: 0; font-family: monospace; line-height: 1.55; }
.rw-check { color: #0d9488; flex-shrink: 0; font-family: monospace; line-height: 1.55; }

/* ══════════════════════ HORIZONTAL PANELS ══════════════════════ */
.rw-panels-outer { position: relative; overflow: hidden; background: #0a0a0a; }
.rw-panels-sticky-label {
    position: absolute; top: 36px; left: clamp(24px,5vw,80px); z-index: 10;
    display: inline-flex; align-items: center; gap: 10px;
    font-size: .58rem; font-weight: 700; letter-spacing: .26em;
    text-transform: uppercase; color: rgba(13,212,197,.7);
}
.rw-panels-track { display: flex; will-change: transform; }
.rw-panel-intro {
    width: 100vw; min-width: 100vw; height: 100vh;
    display: flex; align-items: center; justify-content: center;
    padding: clamp(24px,5vw,80px); flex-shrink: 0;
}
.rw-panel-intro-inner { max-width: 620px; }
.rw-panel-main-head {
    font-family: var(--font-heading,'Playfair Display',serif); font-weight: 600;
    font-size: clamp(1.8rem,3vw,2.8rem); line-height: 1.2;
    letter-spacing: -.01em; color: #ffffff; margin-bottom: 24px;
}
.rw-panel-main-sub { font-size: 16px; color: rgba(255,255,255,.42); line-height: 1.7; margin-bottom: 32px; }
.rw-panel-arrow { font-size: 2rem; color: rgba(255,255,255,.18); }
.rw-panel-card {
    width: 680px; min-width: 680px; height: 100vh;
    display: flex; align-items: center;
    padding: 80px clamp(40px,4vw,70px);
    border-left: 1px solid rgba(255,255,255,.06); flex-shrink: 0;
}
.rw-panel-inner { width: 100%; max-width: 560px; }
.rw-panel-num {
    font-family: var(--font-display,'Syne',sans-serif); font-size: clamp(3rem,5vw,4rem);
    font-weight: 700; line-height: 1; letter-spacing: -.04em;
    color: rgba(255,255,255,.06); margin-bottom: -10px; display: block;
}
.rw-panel-label-badge {
    display: inline-block; margin-bottom: 14px; font-size: 9px;
    letter-spacing: .22em; text-transform: uppercase;
    color: #0d9488; border-bottom: 1px solid rgba(13,148,136,.35); padding-bottom: 4px;
}
.rw-panel-title {
    font-family: var(--font-body,'Inter',sans-serif); font-weight: 700;
    font-size: clamp(17px,1.6vw,21px); letter-spacing: -.015em;
    color: #ffffff; margin-bottom: 16px; line-height: 1.3;
}
.rw-panel-body { font-size: 15px; color: rgba(255,255,255,.48); line-height: 1.7; margin-bottom: 28px; max-width: 460px; }
.rw-panel-signals { display: flex; flex-direction: column; gap: 8px; margin-bottom: 28px; }
.rw-ps {
    display: flex; align-items: center; gap: 12px;
    background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.07);
    border-radius: 5px; padding: 10px 14px; position: relative; overflow: hidden;
}
.rw-ps-bar { position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: rgba(255,255,255,.15); }
.rw-ps-warn  .rw-ps-bar { background: #f0b429; }
.rw-ps-alert .rw-ps-bar { background: #ff6b6b; }
.rw-ps-base  .rw-ps-bar { background: rgba(13,148,136,.5); }
.rw-ps-l { font-size: 8px; letter-spacing: .12em; text-transform: uppercase; color: rgba(255,255,255,.28); margin-bottom: 2px; }
.rw-ps-v { font-size: 12px; font-weight: 600; color: rgba(255,255,255,.7); line-height: 1.3; }
.rw-panel-stat { border-top: 1px solid rgba(255,255,255,.08); padding-top: 20px; }
.rw-panel-stat-label { font-size: 8px; letter-spacing: .14em; text-transform: uppercase; color: rgba(255,255,255,.25); margin-bottom: 4px; }
.rw-panel-stat-val {
    font-family: var(--font-display,'Syne',sans-serif); font-size: 17px;
    font-weight: 700; letter-spacing: -.02em; color: #0d9488;
}

/* ══════════════════════ STATS ══════════════════════ */
.rw-stats { display: flex; align-items: stretch; background: #f5f5f5; border-top: 1px solid #e8e8e8; border-bottom: 1px solid #e8e8e8; }
.stat-item { flex: 1; padding: clamp(36px,5vw,64px) clamp(20px,3vw,40px); text-align: center; border-right: 1px solid #e8e8e8; }
.stat-item:last-child { border-right: none; }
.rw-stat-n {
    font-family: var(--font-display,'Syne',sans-serif);
    font-size: clamp(2.2rem,3.5vw,3.2rem); font-weight: 700;
    letter-spacing: -.03em; color: #111111; margin-bottom: 10px; line-height: 1;
}
.rw-stat-d { font-size: 13px; color: #888; line-height: 1.5; max-width: 180px; margin: 0 auto; }

/* ══════════════════════ ATLAS ══════════════════════ */
.rw-atlas { background: #ffffff; }
.rw-atlas-inner {
    max-width: 1280px; margin: 0 auto;
    padding: clamp(80px,10vw,140px) clamp(24px,6vw,80px);
    display: grid; grid-template-columns: 1fr 1.1fr; gap: 80px; align-items: center;
}
.rw-atlas-head {
    font-family: var(--font-heading,'Playfair Display',serif); font-weight: 600;
    font-size: clamp(1.65rem,2.6vw,2.4rem); line-height: 1.3;
    letter-spacing: -.01em; color: #111111; margin-bottom: 28px;
}
.rw-atlas-list { list-style: none; display: flex; flex-direction: column; gap: 14px; }
.rw-atlas-li { display: flex; align-items: flex-start; gap: 14px; font-size: 15px; color: #555; line-height: 1.6; }
.rw-atlas-li-dot { width: 6px; height: 6px; border-radius: 50%; background: #0d9488; flex-shrink: 0; margin-top: 8px; }
.rw-atlas-diagram {
    position: relative; height: 480px;
    display: flex; align-items: center; justify-content: center; isolation: isolate;
}
.rw-atlas-glow {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
    width: 260px; height: 260px; border-radius: 50%;
    background: radial-gradient(circle, rgba(13,148,136,.10) 0%, transparent 70%); pointer-events: none;
}
.rw-atlas-ring { position: absolute; top: 50%; left: 50%; border-radius: 50%; pointer-events: none; }
.rw-atlas-ring-1 { width: 140px; height: 140px; border: 1px solid rgba(13,148,136,.14); transform: translate(-50%,-50%); animation: rw-ring-pulse 5s ease-in-out infinite; }
.rw-atlas-ring-2 { width: 220px; height: 220px; border: 1px solid rgba(13,148,136,.08); transform: translate(-50%,-50%); animation: rw-ring-pulse 5s ease-in-out .8s infinite; }
.rw-atlas-ring-3 { width: 320px; height: 320px; border: 1px dashed rgba(13,148,136,.06); transform: translate(-50%,-50%); animation: rw-ring-spin 24s linear infinite; }
.rw-atlas-center {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
    width: 72px; height: 72px; background: #0d9488; border-radius: 50%;
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px;
    z-index: 5; animation: rw-center-aura 3s ease-in-out infinite;
}
.rw-atlas-center span { font-size: 7px; letter-spacing: .1em; text-transform: uppercase; color: rgba(255,255,255,.7); }
.rw-atlas-svg { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
.atlas-node {
    padding: 7px 12px; background: #ffffff; border: 1px solid rgba(0,0,0,.10); border-radius: 6px;
    font-size: 9.5px; letter-spacing: .08em; text-transform: uppercase; color: #555;
    white-space: nowrap; z-index: 4; box-shadow: 0 2px 10px rgba(0,0,0,.07);
    animation: rw-node-float 4s ease-in-out infinite;
}

/* ══════════════════════ WHO IT'S FOR ══════════════════════ */
.rw-who { background: #f8f8f8; border-top: 1px solid #ebebeb; }
.rw-who-inner { max-width: 1280px; margin: 0 auto; padding: clamp(80px,10vw,140px) clamp(24px,6vw,80px); }
.rw-who-head {
    font-family: var(--font-heading,'Playfair Display',serif); font-weight: 600;
    font-size: clamp(1.65rem,2.6vw,2.4rem); line-height: 1.3;
    letter-spacing: -.01em; color: #111111; margin-bottom: 48px;
}
.rw-who-grid { display: grid; grid-template-columns: repeat(4,1fr); border: 1px solid #e5e5e5; border-radius: 4px; overflow: hidden; }
.rw-who-card {
    padding: clamp(24px,3vw,40px); background: #ffffff; border-right: 1px solid #e5e5e5;
    position: relative; overflow: hidden; transition: background .22s;
}
.rw-who-card:last-child { border-right: none; }
.rw-who-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: transparent; transition: background .22s; }
.rw-who-card:hover { background: #fafafa; }
.rw-who-card:hover::before { background: #0d9488; }
.rw-who-n { font-family: var(--font-display,'Syne',sans-serif); font-size: 1.4rem; font-weight: 700; letter-spacing: -.03em; color: rgba(0,0,0,.08); margin-bottom: 12px; line-height: 1; }
.rw-who-title { font-size: 17px; font-weight: 700; color: #111111; margin-bottom: 4px; letter-spacing: -.01em; }
.rw-who-sub { font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: #0d9488; margin-bottom: 16px; }
.rw-who-body { font-size: 13.5px; color: #666; line-height: 1.65; }

/* ══════════════════════ CTA SECTION ══════════════════════ */
.rw-cta-section {
    position: relative; overflow: hidden; background: #f8f8f8;
    border-top: 1px solid #e5e5e5; text-align: center;
    padding: clamp(100px,14vw,180px) clamp(24px,6vw,80px);
}
.rw-cta-glow {
    position: absolute; top: 0; left: 50%; transform: translateX(-50%);
    width: clamp(500px,70vw,1100px); height: clamp(280px,45vw,650px);
    background: radial-gradient(ellipse at 50% 0%, rgba(13,148,136,.09) 0%, transparent 70%); pointer-events: none;
}
.rw-cta-grid-overlay {
    position: absolute; inset: 0; pointer-events: none;
    background-image: linear-gradient(rgba(0,0,0,.02) 1px,transparent 1px), linear-gradient(90deg,rgba(0,0,0,.02) 1px,transparent 1px);
    background-size: 72px 72px;
    mask-image: radial-gradient(ellipse 70% 80% at 50% 0%,black 20%,transparent 100%);
    -webkit-mask-image: radial-gradient(ellipse 70% 80% at 50% 0%,black 20%,transparent 100%);
}
.rw-cta-inner { position: relative; z-index: 1; max-width: 900px; margin: 0 auto; }
.rw-cta-eyebrow { display: inline-flex; align-items: center; gap: 10px; font-size: .62rem; font-weight: 700; letter-spacing: .22em; text-transform: uppercase; color: #0d9488; margin-bottom: 28px; }
.rw-cta-head {
    font-family: var(--font-heading,'Playfair Display',serif); font-weight: 600;
    font-size: clamp(2rem,4vw,3.8rem); line-height: 1.18;
    letter-spacing: -.02em; color: #111111; margin-bottom: 28px;
}
.rw-cta-sub { font-size: 17px; color: rgba(0,0,0,.5); max-width: 520px; margin: 0 auto 48px; line-height: 1.7; }

/* ══════════════════════ FOOTER ══════════════════════ */
.rw-footer {
    background: #111111; padding: 28px clamp(24px,5vw,56px);
    display: flex; align-items: center; gap: 16px;
    border-top: 1px solid rgba(255,255,255,.07); flex-wrap: wrap;
}
.rw-footer-brand { font-size: 10px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: rgba(255,255,255,.6); display: flex; align-items: center; gap: 7px; flex: 1; }
.rw-footer-sub { font-size: 9px; color: rgba(255,255,255,.2); letter-spacing: .06em; flex: 2; text-align: center; }
.rw-footer-right { display: flex; align-items: center; gap: 16px; flex: 1; justify-content: flex-end; }
.rw-footer-link { font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: rgba(255,255,255,.3); text-decoration: none; transition: color .2s; }
.rw-footer-link:hover { color: rgba(255,255,255,.7); }
.rw-footer-demo { font-size: 10px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: #ffffff; text-decoration: none; padding: 9px 20px; border: 1px solid rgba(255,255,255,.2); border-radius: 3px; transition: border-color .2s, color .2s; }
.rw-footer-demo:hover { border-color: #0d9488; color: #0d9488; }

/* ══════════════════════ RESPONSIVE ══════════════════════ */
@media (max-width: 1024px) {
    .rw-who-grid { grid-template-columns: repeat(2,1fr); }
    .rw-who-card:nth-child(2) { border-right: none; }
    .rw-who-card:nth-child(3) { border-right: 1px solid #e5e5e5; }
    .rw-who-card:nth-child(1), .rw-who-card:nth-child(2) { border-bottom: 1px solid #e5e5e5; }
    .rw-atlas-inner { grid-template-columns: 1fr; gap: 48px; }
    .rw-atlas-diagram { height: 360px; max-width: 500px; margin: 0 auto; }
}
@media (max-width: 900px) {
    .rw-hero-layout { grid-template-columns: 1fr; }
    .rw-hero-bg-word { font-size: 38vw; }
    .rw-diff-row { grid-template-columns: 1fr; }
    .rw-diff-cell-old { border-right: none; border-bottom: 1px solid rgba(255,255,255,.05); }
    .rw-diff-cols { grid-template-columns: 1fr; }
    .rw-diff-old-head { border-right: none; border-bottom: 1px solid rgba(255,255,255,.08); }
    .rw-panel-card { width: 92vw; min-width: 92vw; padding: 60px 28px; }
    .rw-stats { flex-direction: column; }
    .stat-item { border-right: none; border-bottom: 1px solid #e8e8e8; }
    .stat-item:last-child { border-bottom: none; }
    .rw-who-grid { grid-template-columns: 1fr; }
    .rw-who-card { border-right: none; border-bottom: 1px solid #e5e5e5; }
    .rw-who-card:last-child { border-bottom: none; }
    .rw-footer { flex-direction: column; text-align: center; }
    .rw-footer-right { justify-content: center; }
}
            `}</style>
        </>
    );
}
