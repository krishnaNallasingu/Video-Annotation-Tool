// import React from 'react';

// const App: React.FC<React.PropsWithChildren> = ({ children }) => (
//   <div className="app-layout" style={{
//     minHeight: '100vh',
//     background: 'linear-gradient(135deg, #181c24 0%, #23272f 100%)',
//     color: '#f3f6fa',
//     display: 'flex',
//     flexDirection: 'column'
//   }}>
//     <header className="app-header" style={{
//       background: '#181c24',
//       borderBottom: '2px solid #0d6efd',
//       boxShadow: '0 2px 8px #0004',
//       padding: '0 0.5rem',
//       position: 'sticky',
//       top: 0,
//       zIndex: 10
//     }}>
//       <div className="header-content" style={{
//         display: 'flex',
//         alignItems: 'center',
//         maxWidth: 1400,
//         margin: '0 auto',
//         height: 64,
//         gap: 16
//       }}>
//         <img src="/vite.svg" alt="Logo" className="logo" style={{
//           width: 38,
//           height: 38,
//           marginRight: 10
//         }} />
//         <span className="app-title" style={{
//           fontWeight: 700,
//           fontSize: '1.7rem',
//           letterSpacing: '0.03em',
//           color: '#0d6efd',
//           textShadow: '0 2px 12px #0008'
//         }}>
//           Video Annotation Tool
//         </span>
//       </div>
//     </header>
//     <main className="app-main" style={{
//       flex: 1,
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       justifyContent: 'flex-start',
//       width: '100%',
//       padding: '2vw 0 2vw 0',
//       minHeight: 0
//     }}>
//       {children}
//     </main>
//     <footer className="app-footer" style={{
//       background: '#181c24',
//       color: '#b0b8c9',
//       textAlign: 'center',
//       padding: '1rem 0',
//       fontSize: '1rem',
//       borderTop: '1px solid #232323',
//       marginTop: 'auto'
//     }}>
//       &copy; {new Date().getFullYear()} Jagankrishna Nallasingu. All rights reserved.
//     </footer>
//     {/* Responsive styles */}
//     <style>
//       {`
//         @media (max-width: 900px) {
//           .header-content {
//             max-width: 98vw !important;
//             font-size: 1.1rem !important;
//           }
//           .app-title {
//             font-size: 1.2rem !important;
//           }
//         }
//         @media (max-width: 600px) {
//           .header-content {
//             height: 48px !important;
//             gap: 8px !important;
//           }
//           .logo {
//             width: 28px !important;
//             height: 28px !important;
//           }
//           .app-title {
//             font-size: 1rem !important;
//           }
//           .app-footer {
//             font-size: 0.9rem !important;
//           }
//         }
//       `}
//     </style>
//   </div>
// );
// export default App;

import React from 'react';

const App: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="app-layout" style={{
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #181c24 0%, #23272f 100%)',
    color: '#f3f6fa',
    display: 'flex',
    flexDirection: 'column'
  }}>
    <header className="app-header" style={{
      background: '#181c24',
      borderBottom: '2px solid #0d6efd',
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
        height: 64,
        gap: 16
      }}>
        <img src="/vite.svg" alt="Logo" className="logo" style={{
          width: 38,
          height: 38,
          marginRight: 10
        }} />
        <span className="app-title" style={{
          fontWeight: 700,
          fontSize: '1.7rem',
          letterSpacing: '0.03em',
          color: '#0d6efd',
          textShadow: '0 2px 12px #0008'
        }}>
          Video Annotation Tool
        </span>
      </div>
    </header>
    {/* Main content area: children will be your YouTube-style layout */}
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
      {children}
    </main>
    <footer className="app-footer" style={{
      background: '#181c24',
      color: '#b0b8c9',
      textAlign: 'center',
      padding: '1rem 0',
      fontSize: '1rem',
      borderTop: '1px solid #232323',
      marginTop: 'auto'
    }}>
      &copy; {new Date().getFullYear()} Jagankrishna Nallasingu. All rights reserved.
    </footer>
    {/* Responsive styles */}
    <style>
      {`
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
        }
      `}
    </style>
  </div>
);

export default App;