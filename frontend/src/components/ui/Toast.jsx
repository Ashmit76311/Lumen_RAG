import React from 'react';
import './Toast.css';

export default function Toast({ message, type, onClose }) {
  return (
    <div className={`toast ${type}`}>
      <div className="toast-message">{message}</div>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}>×</button>
    </div>
  );
}
