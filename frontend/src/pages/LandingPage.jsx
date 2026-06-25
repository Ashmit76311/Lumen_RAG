import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Search, Lock, ArrowRight } from 'lucide-react';
import Logo from '../components/ui/Logo';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container bg-dot-grid">
      <nav className="landing-nav">
        <Logo size="large" />
        <div className="landing-nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>

          <button className="btn-primary-small" onClick={() => navigate('/auth')}>
            Launch app <ArrowRight size={16} />
          </button>
        </div>
      </nav>

      <main className="landing-main">
        <section className="hero-section">
          <div className="hero-badge">
            <SparklesIcon size={14} /> Now with source citations
          </div>
          <h1 className="hero-title">
            Chat with your<br />
            documents,<br />
            <span className="text-gradient">grounded in truth.</span>
          </h1>
          <p className="hero-subtitle">
            Upload a PDF or TXT and ask anything. Lumen reads your files and answers with precise citations — so you can trust every response.
          </p>
          <div className="hero-cta">
            <button className="btn-primary-large" onClick={() => navigate('/auth')}>
              Launch app <ArrowRight size={18} />
            </button>
            <a href="#how-it-works" className="btn-secondary-large">
              See how it works <ArrowRight size={18} />
            </a>
          </div>

          {/* Fake Dashboard Preview Image Area (Optional mock) */}
          <div className="hero-preview">
            <div className="preview-window">
              <div className="preview-header">
                <span className="dot dot-red"></span>
                <span className="dot dot-yellow"></span>
                <span className="dot dot-green"></span>
                <div className="preview-title">Lumen · resume.pdf</div>
              </div>
              <div className="preview-body">
                <div className="message-user-preview">What are the candidate's top skills?</div>
                <div className="message-ai-preview">
                  <div className="ai-avatar-preview"><SparklesIcon size={14} color="white" /></div>
                  <div className="ai-text-preview">Python, distributed systems and ML pipelines — cited from page 1 of resume.pdf.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="features-section">
          <h4 className="section-label">CAPABILITIES</h4>
          <h2 className="section-title">Everything you need<br />to talk to your files</h2>
          <p className="section-subtitle">Built for documents — fast retrieval, transparent sourcing and a focused chat workflow.</p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon"><FileText size={20} /></div>
              <h3>PDF & TXT upload</h3>
              <p>Drag in files up to 200MB. Lumen parses and indexes them in seconds, ready for questions.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><Search size={20} /></div>
              <h3>Answers with citations</h3>
              <p>Every response links back to the exact source passage, so you can verify before you trust.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><DatabaseIcon size={20} /></div>
              <h3>Smart retrieval</h3>
              <p>A LangGraph RAG pipeline finds the most relevant chunks before the model ever responds.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><Lock size={20} /></div>
              <h3>Private & secure</h3>
              <p>Your documents stay yours. Sessions are isolated and nothing is used to train models.</p>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="how-section">
          <h4 className="section-label">HOW IT WORKS</h4>
          <h2 className="section-title">From upload to<br />answer in three steps</h2>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <h3>Upload your file</h3>
              <p>Drop a PDF or TXT into the sidebar and add a short description.</p>
            </div>
            <div className="step-card">
              <div className="step-number">02</div>
              <h3>Ask anything</h3>
              <p>Type a question or pick a suggested prompt to start the conversation.</p>
            </div>
            <div className="step-card">
              <div className="step-number">03</div>
              <h3>Get cited answers</h3>
              <p>Read clear responses with links back to the exact source passages.</p>
            </div>
          </div>
        </section>

        <section className="bottom-cta">
          <div className="bottom-cta-card">
            <h2>Start chatting with<br />your documents</h2>
            <p>No setup required. Upload a file and ask your first question in seconds.</p>
            <button className="btn-primary" onClick={() => navigate('/auth')}>
              Launch app <ArrowRight size={16} />
            </button>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <Logo size="small" />
            <p>Chat with your documents. Answers grounded in your own files, with citations you can trust.</p>
          </div>
          <div className="footer-links">
            <div className="link-group">
              <h4>PRODUCT</h4>
              <a href="#features">Features</a>
              <a href="#how-it-works">How it works</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/auth'); }}>Launch app</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Lumen. All rights reserved.</p>
          <p className="footer-built">By Ashmit Kumar Srivastav | <a href="https://www.linkedin.com/in/ashmit-kumar-srivastav/">LinkedIn</a> | <a href="https://github.com/Ashmit76311">GitHub</a></p>
        </div>
      </footer>
    </div>
  );
}

// Helpers for icons
function SparklesIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" />
    </svg>
  );
}

function DatabaseIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5V19A9 3 0 0 0 21 19V5" /><path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  );
}
