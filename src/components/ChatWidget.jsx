import React, { useEffect, useRef, useState } from 'react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user', text: userText }];
    setMessages(newMessages);
    setLoading(true);

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

      const data = await response.json().catch(() => null);

      if (!response.ok || !data || !data.reply) {
        console.error('Chat API error:', response.status, response.statusText, data);
        throw new Error(data?.error || `Request failed with status ${response.status}`);
      }
      setMessages(prev => [...prev, { role: 'model', text: data.reply }]);
    } catch (err) {
      console.error('ChatWidget fetch failed:', err);
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
