import React, { useEffect, useRef } from 'react';
import { Sparkles, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import './ChatThread.css';

export default function ChatThread({ messages, isThinking, onSuggestedPrompt }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  if (messages.length === 0) {
    return (
      <div className="chat-empty">
        <Sparkles size={32} color="#7C3AED" />
        <h2>Ask anything about your document</h2>
        <p>Upload a PDF or TXT from the sidebar, then start asking questions.</p>
        <div className="suggested-prompts">
          <button onClick={() => onSuggestedPrompt("Summarize this document")}>"Summarize this document"</button>
          <button onClick={() => onSuggestedPrompt("What are the key findings?")}>"What are the key findings?"</button>
          <button onClick={() => onSuggestedPrompt("List all action items")}>"List all action items"</button>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-thread">
      <div className="chat-inner">
        {messages.map(msg => (
          msg.role === 'user' ? (
            <div key={msg.id} className="message-user">
              <div className="message-user-bubble">{msg.content}</div>
            </div>
          ) : (
            <div key={msg.id} className="message-ai">
              <div className="ai-avatar">
                <Sparkles size={16} color="white" />
              </div>
              <div className="message-ai-content">
                <div className="message-ai-text">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          )
        ))}
        {isThinking && (
          <div className="message-thinking">
            <div className="ai-avatar">
              <Sparkles size={16} color="white" />
            </div>
            <div className="thinking-content">
              <div className="thinking-dots">
                <div className="thinking-dot"></div>
                <div className="thinking-dot"></div>
                <div className="thinking-dot"></div>
              </div>
              <div className="thinking-label">Reading your document...</div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
