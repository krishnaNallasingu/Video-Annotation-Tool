import React from 'react';

const App: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="app-layout">
    <header className="app-header">
      <div className="header-content">
        <img src="/vite.svg" alt="Logo" className="logo" />
        <span className="app-title">Video Annotation Tool</span>
      </div>
    </header>
    <main className="app-main">
      {children}
    </main>
    <footer className="app-footer">
      &copy; {new Date().getFullYear()} Jagankrishna Nallasingu. All rights reserved.
    </footer>
  </div>
);

export default App;