import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import './ChatInput.css';

export default function ChatInput({ onSend, isThinking }) {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  const handleSend = () => {
    if (!input.trim() || isThinking) return;
    onSend(input.trim());
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '24px';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 120) + 'px';
    }
  }, [input]);

  return (
    <div className="input-bar">
      <div className="input-bar-inner">
        <textarea
          ref={textareaRef}
          className="chat-input"
          placeholder="Ask a question about your documents..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isThinking}
          rows={1}
        />
        <button 
          className="btn-send"
          onClick={handleSend}
          disabled={!input.trim() || isThinking}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
