
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const GITHUB_URL = "https://github.com/krishnaNallasingu/Video-Annotation-Tool";

const About = React.lazy(() => import('./About'));

const App: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('darkmode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('darkmode');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <Router>
      <div className={`app-layout${darkMode ? ' dark' : ''}`} style={{
        minHeight: '100vh',
        background: darkMode
          ? 'linear-gradient(135deg, #10131a 0%, #181c24 100%)'
          : 'linear-gradient(135deg, #f3f6fa 0%, #e9eef6 100%)',
        color: darkMode ? '#f3f6fa' : '#23272f',
        display: 'flex',
        flexDirection: 'column',
        transition: 'background 0.3s, color 0.3s'
      }}>
        <header className="app-header" style={{
          background: darkMode ? '#181c24' : '#353839',
          borderBottom: `2px solid #0d6efd`,
          boxShadow: '0 2px 8px #0004',
          padding: '0 0.5rem',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div className="header-content" style={{
            display: 'flex',
            alignItems: 'center',
            maxWidth: 1400,
            margin: '0 auto',
            height: 50,
            gap: 15
          }}>
            <img src="/vite.svg" alt="Logo" className="logo" style={{
              width: 45,
              height: 45,
              marginRight: 20
            }} />
            <Link to="/" style={{ textDecoration: 'none' }}>
              <span className="app-title" style={{
                fontWeight: 700,
                fontSize: '1.8rem',
                letterSpacing: '0.03em',
                color: '#ffbf00',
                textShadow: '0 2px 12px #0008',
                cursor: 'pointer'
              }}>
                Video Annotation Tool
              </span>
            </Link>

            <nav style={{ marginLeft: 'auto', display: 'flex', gap: 15 }}>
              <Link to="/" className="header-btn">Home</Link>
              <Link to="/about" className="header-btn">About</Link>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="header-btn code-btn"
                title="View Code on GitHub"
              >
                Code
              </a>
              <button
                className="header-btn darkmode-btn"
                onClick={() => setDarkMode(d => !d)}
                aria-label="Toggle dark mode"
                title="Toggle dark mode"
              >
                {darkMode ? '🌙' : '☀️'}
              </button>
            </nav>
          </div>
        </header>
        <main className="app-main" style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          width: '100%',
          minHeight: 0,
          background: 'transparent'
        }}>
          <React.Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={children} />
              <Route path="/about" element={<About />} />
            </Routes>
          </React.Suspense>
        </main>
        <footer className="app-footer" style={{
          background: darkMode ? '#181c24' : '#181c24',
          color: darkMode ? '#b0b8c9' : '#ff7f50',
          textAlign: 'center',
          padding: '1rem 0',
          fontSize: '1rem',
          borderTop: '1px solid rgb(95, 142, 224)',
          marginTop: 'auto'
        }}>
          &copy; {new Date().getFullYear()} {' '}
          Jagankrishna Nallasingu. All rights reserved.
        </footer>
        {/* Responsive styles and button animations */}
        <style>
          {`
            .header-btn {
              background: none;
              border: none;
              color: #0d6efd;
              font-weight: 600;
              font-size: 1.08rem;
              padding: 8px 16px;
              border-radius: 8px;
              cursor: pointer;
              transition: background 0.18s, color 0.18s, box-shadow 0.18s, transform 0.18s;
              text-decoration: none;
              outline: none;
              display: inline-block;
              position: relative;
            }
            .header-btn:hover, .header-btn:focus {
              background: #0d6efd;
              color: #fff !important;
              box-shadow: 0 2px 12px #0d6efd44;
              transform: translateY(-2px) scale(1.04);
              text-decoration: none;
            }
            .code-btn::after {
              content: '';
              display: block;
              width: 0;
              height: 2px;
              background: #0d6efd;
              transition: width .2s;
              position: absolute;
              left: 50%;
              bottom: 4px;
              transform: translateX(-50%);
            }
            .code-btn:hover::after, .code-btn:focus::after {
              width: 80%;
            }
            .darkmode-btn {
              font-size: 1.3rem;
              padding: 6px 10px;
              background: none;
              border: none;
              color: #0d6efd;
              border-radius: 50%;
              transition: background 0.18s, color 0.18s, transform 0.18s;
            }
            .darkmode-btn:hover, .darkmode-btn:focus {
              background: #0d6efd;
              color: #fff;
              transform: scale(1.15);
            }
            .properties-panel {
              max-width: 800px;
              width: 100%;
              box-sizing: border-box;
              padding: 10px 50px 10px;
            }
            .properties-panel label {
              display: block;
              margin-bottom: 4px;
              font-size: 1rem;
            }
            .properties-panel input[type="number"],
            .properties-panel input[type="text"] {
              width: 100%;
              padding: 6px 8px;
              margin-bottom: 12px;
              border-radius: 6px;
              border: 1px solid #ccc;
              font-size: 0.9rem;
              box-sizing: border-box;
            }
            @media (max-width: 700px) {
              .properties-panel {
                max-width: 98vw;
                padding: 0 2vw;
              }
              .properties-panel > div {
                flex-direction: column !important;
                align-items: flex-start !important;
                gap: 8px !important;
              }
              .properties-panel label {
                min-width: 0 !important;
                margin-right: 0 !important;
              }
            }
            @media (max-width: 900px) {
              .header-content {
                max-width: 98vw !important;
                font-size: 1.1rem !important;
              }
              .app-title {
                font-size: 1.2rem !important;
              }
            }
            @media (max-width: 600px) {
              .header-content {
                height: 48px !important;
                gap: 8px !important;
              }
              .logo {
                width: 28px !important;
                height: 28px !important;
              }
              .app-title {
                font-size: 1rem !important;
              }
              .app-footer {
                font-size: 0.9rem !important;
              }
              .header-btn {
                font-size: 0.98rem !important;
                padding: 4px 10px !important;
              }
            }
            body.darkmode {
              background: #10131a !important;
            }
          `}
        </style>
      </div>
    </Router>
  );
};

export default App;