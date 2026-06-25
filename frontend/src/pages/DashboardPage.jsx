import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar/Sidebar';
import ChatThread from '../components/chat/ChatThread';
import ChatInput from '../components/chat/ChatInput';
import Toast from '../components/ui/Toast';
import useToast from '../hooks/useToast';
import './DashboardPage.css';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();
  
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [sessionId] = useState(() => Date.now().toString()); // Simple session ID for RAG

  useEffect(() => {
    const token = localStorage.getItem('lumen_token');
    if (!token) {
      navigate('/auth');
      return;
    }
    fetchDocuments();
  }, [navigate]);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem('lumen_token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/documents`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.status === 401) {
        localStorage.removeItem('lumen_token');
        navigate('/auth');
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadSuccess = (newDoc) => {
    showToast(`✓ ${newDoc.name} uploaded`, 'success');
    fetchDocuments();
  };

  const handleDeleteDocument = async (docId, docName) => {
    try {
      const token = localStorage.getItem('lumen_token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/documents/${docId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        showToast(`${docName} removed.`, 'success');
        fetchDocuments();
      } else {
        showToast("Failed to delete document", "error");
      }
    } catch (err) {
      showToast("Network error. Check your connection.", "error");
    }
  };

  const handleSendMessage = async (text) => {
    const newMsg = { id: Date.now(), role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, newMsg]);
    setIsThinking(true);

    try {
      const token = localStorage.getItem('lumen_token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
      const response = await fetch(`${apiUrl}/rag/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query: text, session_id: sessionId })
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      const aiContent = data?.result?.content || data?.result || "I couldn't generate a response.";
      
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: aiContent,
        timestamp: new Date()
      }]);

    } catch (err) {
      showToast("Failed to get response from AI.", "error");
      console.error(err);
    } finally {
      setIsThinking(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('lumen_token');
    navigate('/auth');
  };

  return (
    <div className="dashboard-container">
      <div className="toast-container">
        {toasts.map(t => (
          <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
        ))}
      </div>

      <Sidebar 
        documents={documents}
        selectedDocument={selectedDocument}
        onSelectDocument={setSelectedDocument}
        onUploadSuccess={handleUploadSuccess}
        onUploadError={(msg) => showToast(msg, 'error')}
        onDeleteDocument={handleDeleteDocument}
        onLogout={handleLogout}
      />
      
      <div className="chat-area">
        <ChatThread 
          messages={messages} 
          isThinking={isThinking} 
          onSuggestedPrompt={handleSendMessage}
        />
        <ChatInput 
          onSend={handleSendMessage} 
          isThinking={isThinking} 
        />
      </div>
    </div>
  );
}
