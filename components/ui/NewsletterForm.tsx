'use client';

import { useState } from 'react';

const HS_PORTAL_ID = '242333258';
const HS_FORM_ID   = '37e75a88-a672-4282-b8a0-ffe4d4729bbd';
const HS_ENDPOINT  = `https://api.hsforms.com/submissions/v3/integration/submit/${HS_PORTAL_ID}/${HS_FORM_ID}`;

type State = 'idle' | 'loading' | 'success' | 'error';

export default function NewsletterForm() {
    const [firstname, setFirstname] = useState('');
    const [lastname,  setLastname]  = useState('');
    const [email,     setEmail]     = useState('');
    const [state,     setState]     = useState<State>('idle');
    const [errorMsg,  setErrorMsg]  = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setState('loading');
        setErrorMsg('');

        try {
            const res = await fetch(HS_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fields: [
                        { objectTypeId: '0-1', name: 'firstname', value: firstname },
                        { objectTypeId: '0-1', name: 'lastname',  value: lastname  },
                        { objectTypeId: '0-1', name: 'email',     value: email     },
                    ],
                    context: {
                        pageUri:  typeof window !== 'undefined' ? window.location.href : '',
                        pageName: 'Propheus — Signal Intelligence Platform',
                    },
                }),
            });

            if (res.ok) {
                setState('success');
                setFirstname('');
                setLastname('');
                setEmail('');
            } else {
                const body = await res.json().catch(() => ({}));
                setErrorMsg(body?.message ?? 'Something went wrong. Please try again.');
                setState('error');
            }
        } catch {
            setErrorMsg('Network error. Please check your connection and try again.');
            setState('error');
        }
    };

    if (state === 'success') {
        return (
            <div style={{
                border: '1px solid rgba(13,148,136,0.25)',
                borderRadius: '12px',
                background: 'rgba(13,148,136,0.04)',
                padding: '24px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
            }}>
                <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: 'rgba(13,148,136,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2.5 8l4 4 7-7" stroke="#0d9488" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600, color: '#111', margin: '0 0 2px', letterSpacing: '-0.01em' }}>
                        You&apos;re on the list.
                    </p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: '#888', margin: 0, lineHeight: 1.5 }}>
                        We&apos;ll be in touch with exclusive insights and early access.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Name row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <input
                    type="text"
                    placeholder="First name"
                    aria-label="First name"
                    value={firstname}
                    onChange={e => setFirstname(e.target.value)}
                    style={inputStyle}
                />
                <input
                    type="text"
                    placeholder="Last name"
                    aria-label="Last name"
                    value={lastname}
                    onChange={e => setLastname(e.target.value)}
                    style={inputStyle}
                />
            </div>

            {/* Email + submit row */}
            <div style={{
                display: 'flex',
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                background: '#fff',
                boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
                overflow: 'hidden',
            }}>
                <input
                    type="email"
                    placeholder="Work email address"
                    aria-label="Work email address"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{
                        flex: 1, border: 'none', outline: 'none',
                        background: 'transparent',
                        padding: '14px 18px',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.9rem',
                        color: '#111',
                        letterSpacing: '-0.01em',
                        minWidth: 0,
                    }}
                />
                <button
                    type="submit"
                    disabled={state === 'loading'}
                    style={{
                        flexShrink: 0,
                        background: state === 'loading' ? '#555' : '#111',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        margin: '5px',
                        padding: '9px 18px',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        letterSpacing: '0.03em',
                        cursor: state === 'loading' ? 'not-allowed' : 'pointer',
                        whiteSpace: 'nowrap',
                        transition: 'background 0.18s',
                    }}
                >
                    {state === 'loading' ? 'Sending…' : 'Get early access'}
                </button>
            </div>

            {state === 'error' && (
                <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.8rem',
                    color: '#e53e3e',
                    margin: 0,
                    letterSpacing: '-0.01em',
                }}>
                    {errorMsg}
                </p>
            )}
        </form>
    );
}

const inputStyle: React.CSSProperties = {
    border: '1px solid #e0e0e0',
    borderRadius: '10px',
    background: '#fff',
    padding: '12px 16px',
    fontFamily: 'var(--font-body)',
    fontSize: '0.88rem',
    color: '#111',
    letterSpacing: '-0.01em',
    outline: 'none',
    boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
    width: '100%',
    boxSizing: 'border-box',
};
