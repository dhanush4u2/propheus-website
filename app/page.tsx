import Navbar from '@/components/Navbar';
import HeroExperience from '@/components/HeroExperience';
import RetailFlow from '@/components/sections/RetailFlow';
import DigitalAtlasSection from '@/components/sections/DigitalAtlasSection';
import IndustrySection from '@/components/sections/IndustrySection';
import Image from 'next/image';
import PagePreloader from '@/components/PagePreloader';
import NewsletterForm from '@/components/ui/NewsletterForm';
import PageCurtain from '@/components/PageCurtain';


export default function Home() {
    return (
        <>
            <PagePreloader />
            <PageCurtain />
            <Navbar />
            <HeroExperience />

            {/* Breathing room between hero and RetailFlow */}
            <div style={{ background: '#ffffff', height: 'clamp(80px, 10vw, 140px)' }} />

            {/* Section 1 — Retail Flow */}
            <RetailFlow />

            {/* Section 2 — Digital Atlas */}
            <div id="digital-atlas">
                <DigitalAtlasSection />
            </div>

            {/* Section 3 — Industry capabilities */}
            <div id="industry-section">
                <IndustrySection />
            </div>

            {/* CTA Footer */}
            <footer
                id="cta-footer"
                style={{
                    background: '#f8f8f8',
                    position: 'relative',
                    overflow: 'hidden',
                    borderTop: '1px solid #e5e5e5',
                }}
            >
                {/* Subtle grid */}
                <div
                    aria-hidden="true"
                    style={{
                        position: 'absolute', inset: 0, pointerEvents: 'none',
                        backgroundImage: 'linear-gradient(rgba(0,0,0,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.022) 1px, transparent 1px)',
                        backgroundSize: '72px 72px',
                        maskImage: 'radial-gradient(ellipse 80% 80% at 50% 0%, black 20%, transparent 100%)',
                        WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 0%, black 20%, transparent 100%)',
                    }}
                />
                {/* Large teal glow — top center */}
                <div
                    aria-hidden="true"
                    style={{
                        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                        width: 'clamp(600px, 80vw, 1200px)', height: 'clamp(300px, 50vw, 700px)',
                        background: 'radial-gradient(ellipse at 50% 0%, rgba(13,148,136,0.09) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }}
                />

                {/* ── Hero headline block ── */}
                <div style={{
                    position: 'relative', zIndex: 1,
                    maxWidth: '1200px', margin: '0 auto',
                    padding: 'clamp(72px, 10vw, 112px) clamp(24px, 6vw, 80px) clamp(56px, 7vw, 80px)',
                    textAlign: 'center',
                }}>
                    {/* Eyebrow */}
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '10px',
                        fontFamily: 'var(--font-body)', fontSize: '0.68rem', fontWeight: 700,
                        letterSpacing: '0.22em', textTransform: 'uppercase', color: '#0d9488',
                        marginBottom: '32px',
                    }}>
                        <span style={{ width: '20px', height: '1.5px', background: '#0d9488', display: 'inline-block' }} />
                        Signal Intelligence Platform
                        <span style={{ width: '20px', height: '1.5px', background: '#0d9488', display: 'inline-block' }} />
                    </div>

                    {/* Main headline */}
                    <h2 style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 800,
                        fontSize: 'clamp(3rem, 7vw, 6.5rem)',
                        letterSpacing: '-0.05em',
                        lineHeight: 0.95,
                        color: '#111111',
                        margin: '0 0 28px',
                    }}>
                        See the world<br />
                        <span style={{ color: '#0d9488' }}>more clearly.</span>
                    </h2>

                    {/* Sub-copy */}
                    <p style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'clamp(0.95rem, 1.4vw, 1.15rem)',
                        color: '#777777',
                        maxWidth: '560px',
                        margin: '0 auto 0',
                        lineHeight: 1.65,
                        letterSpacing: '-0.01em',
                    }}>
                        Physical AI that reads 140+ real-world signals in under a second —
                        purpose-built for industries where timing is everything.
                    </p>
                </div>

                {/* ── Two-column CTA block ── */}
                <div style={{
                    position: 'relative', zIndex: 1,
                    maxWidth: '1200px', margin: '0 auto',
                    padding: '0 clamp(24px, 6vw, 80px) clamp(72px, 10vw, 112px)',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 'clamp(48px, 7vw, 100px)',
                    alignItems: 'start',
                }}>
                    {/* Left — newsletter pitch */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{
                            fontFamily: 'var(--font-display)',
                            fontWeight: 700,
                            fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
                            letterSpacing: '-0.04em',
                            lineHeight: 1.15,
                            color: '#111',
                            margin: '0 0 16px',
                        }}>
                            Be first to know.
                        </h3>
                        <p style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 'clamp(0.88rem, 1.1vw, 0.98rem)',
                            color: '#666',
                            lineHeight: 1.7,
                            margin: '0 0 32px',
                            maxWidth: '380px',
                        }}>
                            Get exclusive insights on physical AI, real-world signal intelligence,
                            and early access to new capabilities as we build the future of
                            location-aware decision making.
                        </p>
                        {/* Trust badges */}
                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                            {['No spam', 'Cancel anytime', 'Early access'].map(b => (
                                <span key={b} style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                                    fontFamily: 'var(--font-body)', fontSize: '0.75rem',
                                    fontWeight: 600, color: '#999', letterSpacing: '0.01em',
                                }}>
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <circle cx="6" cy="6" r="5.5" stroke="#0d9488" strokeWidth="1" />
                                        <path d="M3.5 6l1.8 1.8L8.5 4.5" stroke="#0d9488" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    {b}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Right — form + demo CTA */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* HubSpot newsletter form (firstname, lastname, email) */}
                        <NewsletterForm />

                        {/* Divider */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.08)' }} />
                            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: '#bbb', letterSpacing: '0.1em', textTransform: 'uppercase' }}>or</span>
                            <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.08)' }} />
                        </div>

                        {/* View Demo — properly sized, not oversized */}
                        <a
                            href="https://retail-agent.alchemy-propheus.ai/explorer/"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '12px',
                                background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
                                color: '#fff',
                                textDecoration: 'none',
                                borderRadius: '12px',
                                padding: '16px 20px',
                                fontFamily: 'var(--font-body)',
                                boxShadow: '0 4px 20px rgba(13,148,136,0.28)',
                                transition: 'box-shadow 0.2s, transform 0.2s',
                            }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <span style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.75 }}>Live product</span>
                                <span style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.02em' }}>View Live Demo →</span>
                            </div>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '10px',
                                background: 'rgba(255,255,255,0.15)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0,
                            }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" stroke="none" />
                                </svg>
                            </div>
                        </a>
                    </div>
                </div>

                {/* ── Footer bar ── */}
                <div style={{
                    position: 'relative', zIndex: 1,
                    borderTop: '1px solid rgba(0,0,0,0.07)',
                    padding: 'clamp(20px, 3vw, 28px) clamp(24px, 6vw, 80px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    flexWrap: 'wrap',
                }}>
                    <Image
                        src="/logo.avif"
                        alt="Propheus"
                        width={72}
                        height={24}
                        style={{ objectFit: 'contain', objectPosition: 'left', opacity: 0.5 }}
                    />
                    <p style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.72rem',
                        color: '#aaaaaa',
                        letterSpacing: '0.04em',
                        margin: 0,
                    }}>
                        &copy; 2026 Propheus &mdash; Signal Intelligence Platform
                    </p>
                </div>
            </footer>
        </>
    );
}
