'use client';
import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      });

      const data = await response.json();

      if (data.error) {
        setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${data.error}` }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error connecting to AI service.' }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🤖 Personal AI Agent</h1>
        <button onClick={clearChat} style={styles.clearBtn}>Clear Chat</button>
      </div>

      <div style={styles.chatContainer}>
        {messages.length === 0 && (
          <div style={styles.welcome}>
            <h2>Welcome to Your Personal AI Agent</h2>
            <p>Ask me anything! I can help with:</p>
            <ul style={styles.featureList}>
              <li>Answering questions</li>
              <li>Writing and editing text</li>
              <li>Brainstorming ideas</li>
              <li>Coding assistance</li>
              <li>General conversation</li>
            </ul>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} style={msg.role === 'user' ? styles.userMessage : styles.assistantMessage}>
            <div style={styles.messageHeader}>
              {msg.role === 'user' ? '👤 You' : '🤖 AI Agent'}
            </div>
            <div style={styles.messageContent}>{msg.content}</div>
          </div>
        ))}

        {loading && (
          <div style={styles.assistantMessage}>
            <div style={styles.messageHeader}>🤖 AI Agent</div>
            <div style={styles.messageContent}>
              <span style={styles.typing}>Thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} style={styles.inputForm}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={styles.input}
          disabled={loading}
        />
        <button type="submit" style={styles.sendBtn} disabled={loading || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    maxWidth: '900px',
    margin: '0 auto',
    backgroundColor: '#0f0f0f',
    color: '#fff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  header: {
    padding: '20px',
    borderBottom: '1px solid #333',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a'
  },
  title: {
    margin: 0,
    fontSize: '24px',
    fontWeight: '600'
  },
  clearBtn: {
    padding: '8px 16px',
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  chatContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  welcome: {
    textAlign: 'center',
    color: '#999',
    padding: '40px 20px'
  },
  featureList: {
    textAlign: 'left',
    display: 'inline-block',
    marginTop: '20px'
  },
  userMessage: {
    alignSelf: 'flex-end',
    maxWidth: '70%',
    backgroundColor: '#2563eb',
    padding: '12px 16px',
    borderRadius: '12px',
    marginLeft: 'auto'
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    maxWidth: '70%',
    backgroundColor: '#262626',
    padding: '12px 16px',
    borderRadius: '12px'
  },
  messageHeader: {
    fontSize: '12px',
    fontWeight: '600',
    marginBottom: '6px',
    opacity: 0.8
  },
  messageContent: {
    fontSize: '15px',
    lineHeight: '1.5',
    whiteSpace: 'pre-wrap'
  },
  typing: {
    opacity: 0.6
  },
  inputForm: {
    display: 'flex',
    gap: '12px',
    padding: '20px',
    borderTop: '1px solid #333',
    backgroundColor: '#1a1a1a'
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    backgroundColor: '#262626',
    border: '1px solid #333',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '15px',
    outline: 'none'
  },
  sendBtn: {
    padding: '12px 24px',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600'
  }
};
