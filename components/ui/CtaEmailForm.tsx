'use client';

export default function CtaEmailForm() {
    return (
        <>
            {/* Email newsletter input */}
            <form
                onSubmit={(e) => e.preventDefault()}
                style={{
                    display: 'flex',
                    gap: '0',
                    marginBottom: '28px',
                    width: '100%',
                    maxWidth: '420px',
                    borderRadius: '100px',
                    border: '1px solid #e0e0e0',
                    background: '#ffffff',
                    boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
                    overflow: 'hidden',
                }}
            >
                <input
                    type="email"
                    placeholder="Enter your work email"
                    aria-label="Work email address"
                    style={{
                        flex: 1,
                        border: 'none',
                        outline: 'none',
                        background: 'transparent',
                        padding: '14px 20px',
                        fontFamily: "var(--font-body)",
                        fontSize: '0.9rem',
                        color: '#111111',
                        letterSpacing: '-0.01em',
                    }}
                />
                <button
                    type="submit"
                    className="cta-email-submit"
                    style={{
                        flexShrink: 0,
                        background: '#111111',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '100px',
                        padding: '10px 22px',
                        margin: '4px',
                        fontFamily: "var(--font-body)",
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        letterSpacing: '0.04em',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        transition: 'background 0.2s',
                    }}
                >
                    Get early access
                </button>
            </form>

            {/* View Demo — primary CTA */}
            <a
                href="https://retail-agent.alchemy-propheus.ai/explorer/"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-view-demo"
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
                    color: '#ffffff',
                    textDecoration: 'none',
                    borderRadius: '100px',
                    padding: '16px 36px',
                    fontFamily: "var(--font-body)",
                    fontSize: '1rem',
                    fontWeight: 700,
                    letterSpacing: '-0.01em',
                    boxShadow: '0 4px 24px rgba(13,148,136,0.35)',
                    animation: 'cta-pulse 2.4s ease-in-out infinite',
                }}
            >
                View Demo
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
            </a>
        </>
    );
}
