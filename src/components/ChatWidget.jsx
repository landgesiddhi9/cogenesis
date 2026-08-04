import React, { useEffect, useRef, useState } from 'react';

const IS_DEV = import.meta.env.DEV === true;

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [lastError, setLastError] = useState(null); // { status, body, message, stack }
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, isOpen]);

  // Auto-dismiss the dev error overlay after a few seconds so it doesn't linger.
  useEffect(() => {
    if (!lastError) return;
    const t = setTimeout(() => setLastError(null), 8000);
    return () => clearTimeout(t);
  }, [lastError]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user', text: userText }];
    setMessages(newMessages);
    setLoading(true);
    setLastError(null);

    try {
      const historyPayload = newMessages.slice(0, -1).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        content: m.text
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, history: historyPayload })
      });

      // 1. Always read the raw body text first, so we never lose the response
      //    payload (json() throws on non-JSON responses like HTML 404s).
      const rawBody = await response.text();
      let data = null;
      try {
        data = rawBody ? JSON.parse(rawBody) : null;
      } catch (parseErr) {
        console.error(
          '[ChatWidget] Response was not valid JSON (status %d). Raw body follows:',
          response.status,
          rawBody.slice(0, 500),
        );
      }

      if (!response.ok || !data || !data.reply) {
        const detail = {
          status: response.status,
          statusText: response.statusText,
          body: data,
          rawBodyPreview: rawBody.slice(0, 300),
          message: data?.error || `Request failed with status ${response.status}`,
          stack: new Error().stack,
        };
        console.error('[ChatWidget] Chat API returned an error:', detail);
        setLastError(detail);
        throw new Error(detail.message);
      }

      setMessages(prev => [...prev, { role: 'model', text: data.reply }]);
    } catch (err) {
      console.error('[ChatWidget] fetch failed:', err);
      if (!lastError) {
        setLastError({
          status: 'network',
          message: err.message,
          stack: err.stack,
        });
      }
      setMessages(prev => [
        ...prev,
        { role: 'model', text: 'I couldn\'t reach the assistant right now. Please try again in a moment.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 1. Floating Toggle Button (Bottom Right) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Assistant"
          style={{
            position: 'fixed',
            bottom: 'calc(var(--bottom-nav-height, 56px) + env(safe-area-inset-bottom, 0px) + 24px - 1cm)',
            right: '24px',
            zIndex: 1000,
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            border: '1px solid #f0f0f0',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#111111',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 6px 18px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
          }}
        >
          <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"></path>
          </svg>
        </button>
      )}

      {/* 2. Backdrop Overlay (Darkens background when open) */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            zIndex: 9998,
            transition: 'opacity 0.3s ease'
          }}
        />
      )}

      {/* 3. Full-Height Right Sidebar Drawer (Top to Bottom) */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: '420px', // Covers ~25%-30% screen area on desktop
          height: '100vh',
          backgroundColor: '#F9F8F6', // Off-white / Cream background
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-8px 0 25px rgba(0, 0, 0, 0.08)',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease-in-out',
          color: '#111111',
          pointerEvents: isOpen ? 'auto' : 'none'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '24px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #EBE8E2'
          }}
        >
          <span
            style={{
              fontSize: '13px',
              letterSpacing: '3px',
              fontWeight: 600,
              textTransform: 'uppercase'
            }}
          >
            AI ASSISTANT
          </span>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#EAE6E1',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              color: '#333'
            }}
          >
            ✕
          </button>
        </div>

        {/* Chat Content Body */}
        <div
          style={{
            flex: 1,
            padding: '28px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {messages.length === 0 ? (
            /* Empty State */
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '0 10px'
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#EAE6E1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '28px'
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"></path>
                </svg>
              </div>

              <h2
                style={{
                  fontSize: '14px',
                  letterSpacing: '2.5px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  marginBottom: '16px'
                }}
              >
                HOW CAN I HELP YOU?
              </h2>

              <p
                style={{
                  fontSize: '13px',
                  lineHeight: '1.6',
                  color: '#666666',
                  maxWidth: '280px'
                }}
              >
                Ask me about products, sizes, styling advice, or anything else about your shopping experience.
              </p>
            </div>
          ) : (
            /* Active Messages Container */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                    backgroundColor: m.role === 'user' ? '#ffffff' : '#EAE6E1',
                    color: '#111111',
                    padding: '14px 18px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    lineHeight: '1.6',
                    maxWidth: '85%',
                    boxShadow: m.role === 'user' ? '0 2px 8px rgba(0,0,0,0.04)' : 'none',
                    border: m.role === 'user' ? '1px solid #EBE8E2' : 'none'
                  }}
                >
                  {m.text}
                </div>
              ))}
              {loading && (
                <div style={{ fontSize: '12px', color: '#888888', fontStyle: 'italic', paddingLeft: '4px' }}>
                  Thinking...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Dev-only error overlay — shows raw failure details while debugging */}
          {IS_DEV && lastError && (
            <div
              style={{
                marginTop: '12px',
                padding: '12px 14px',
                backgroundColor: '#FDF0EF',
                border: '1px solid #F2C4C0',
                borderRadius: '8px',
                fontSize: '11px',
                color: '#7A1F1B',
                fontFamily: 'monospace',
                lineHeight: 1.5,
                wordBreak: 'break-word'
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: '6px' }}>
                ⚠ API ERROR {lastError.status ? `(HTTP ${lastError.status})` : '(network)'}
              </div>
              <div>{lastError.message}</div>
              {lastError.body && (
                <div style={{ marginTop: '6px', whiteSpace: 'pre-wrap' }}>
                  {JSON.stringify(lastError.body)}
                </div>
              )}
              {lastError.rawBodyPreview && (
                <div style={{ marginTop: '6px', whiteSpace: 'pre-wrap', color: '#8A3A36' }}>
                  raw: {lastError.rawBodyPreview}
                </div>
              )}
              {lastError.stack && (
                <details style={{ marginTop: '6px' }}>
                  <summary style={{ cursor: 'pointer' }}>stack trace</summary>
                  <pre style={{ whiteSpace: 'pre-wrap', margin: '6px 0 0' }}>{lastError.stack}</pre>
                </details>
              )}
            </div>
          )}
        </div>

        {/* Input Footer */}
        <form
          onSubmit={handleSend}
          style={{
            padding: '20px 24px 28px 24px',
            backgroundColor: '#F9F8F6'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#ffffff',
              border: '1px solid #E3E0D9',
              borderRadius: '4px',
              padding: '4px 12px 4px 16px'
            }}
          >
            <input
              type="text"
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                padding: '12px 0',
                fontSize: '13px',
                color: '#111111'
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                color: '#111111',
                opacity: loading ? 0.3 : 1
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
