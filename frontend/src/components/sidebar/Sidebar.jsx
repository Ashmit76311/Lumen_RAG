import React, { useState, useRef } from 'react';
import { LogOut, UploadCloud, FileText, Trash2 } from 'lucide-react';
import Logo from '../ui/Logo';
import './Sidebar.css';

export default function Sidebar({ documents, selectedDocument, onSelectDocument, onUploadSuccess, onUploadError, onDeleteDocument, onLogout }) {
  const [dragOver, setDragOver] = useState(false);
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile.name.endsWith('.pdf') && !selectedFile.name.endsWith('.txt')) {
      onUploadError("Only PDF and TXT files are accepted.");
      return;
    }
    if (selectedFile.size > 200 * 1024 * 1024) {
      onUploadError("File exceeds 200MB limit.");
      return;
    }
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file || !description) return;
    
    setIsUploading(true);
    try {
      const token = localStorage.getItem('lumen_token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${apiUrl}/rag/documents/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Description': description
        },
        body: formData
      });

      if (!response.ok) throw new Error("Upload failed");
      
      const data = await response.json();
      onUploadSuccess({ id: data.id, name: file.name, description });
      
      setFile(null);
      setDescription('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error(err);
      onUploadError("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <Logo size="small" />
      </div>

      <div 
        className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <UploadCloud className="upload-icon" size={24} />
        <span className="upload-label">{file ? file.name : "Drop PDF or TXT"}</span>
        <span className="upload-sublabel">{file ? "Click to change" : "or click to browse"}</span>
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept=".pdf,.txt"
          onChange={handleFileChange}
        />
      </div>

      <div className="doc-description-label">Describe this document</div>
      <textarea 
        className="doc-description-input"
        placeholder="e.g. Acme Corp 2024 Q1 Financial Report"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
      />

      <button 
        className="btn-upload" 
        disabled={!file || !description || isUploading}
        onClick={handleUpload}
      >
        {isUploading ? "Uploading..." : "Upload ↑"}
      </button>

      <div className="docs-section-label">DOCUMENTS</div>
      <div className="doc-list">
        {documents.map(doc => (
          <div 
            key={doc.id} 
            className={`doc-row ${selectedDocument?.id === doc.id ? 'active' : ''}`}
            onClick={() => onSelectDocument(doc)}
          >
            <FileText className="doc-icon" size={14} />
            <span className="doc-name">{doc.name}</span>
            <button 
              className="doc-delete" 
              onClick={(e) => { e.stopPropagation(); onDeleteDocument(doc.id, doc.name); }}
              title="Delete document"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {documents.length === 0 && (
          <div style={{ fontSize: '12px', color: '#6B7280', padding: '8px' }}>
            No documents uploaded yet.
          </div>
        )}
      </div>

      <button className="btn-logout" onClick={onLogout}>
        <LogOut size={14} /> Logout
      </button>
    </div>
  );
}
