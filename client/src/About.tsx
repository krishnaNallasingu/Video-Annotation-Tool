import React from 'react';

const About: React.FC = () => (
    <div style={{
        maxWidth: 700,
        margin: '3rem auto',
        background: 'rgba(20,30,40,0.85)',
        borderRadius: 16,
        boxShadow: '0 4px 24px #ffbf0022',
        padding: '2rem 2.5rem',
        color: '#f3f6fa',
        fontSize: '1.15rem',
        lineHeight: 1.7,
        textAlign: 'left'
    }}>
        <h2 style={{ color: '#0d6efd', marginBottom: 12 }}>About This Project</h2>
        <p>
            <b>Video Annotation Tool</b> is a professional web-based platform for annotating videos with shapes, lines, and text.
            It is designed for efficient video review, labeling, and collaborative feedback. Features include advanced drawing tools, timeline integration, undo/redo, and persistent storage.
        </p>
        <h3 style={{ color: '#0d6efd', marginTop: 24 }}>Author</h3>
        <p>
            <b>Jagankrishna Nallasingu</b><br />
            Software Engineer &amp; Full Stack Developer<br />
            <a href="https://www.linkedin.com/in/jagankrishna-nallasingu-0725b4268/" target="_blank" rel="noopener noreferrer" style={{ color: '#2ecc71', textDecoration: 'underline' }}>
                LinkedIn Profile
            </a> <br />
            <a href="https://github.com/krishnaNallasingu" target="_blank" rel="noopener noreferrer" style={{ color: '#2ecc71', textDecoration: 'underline' }}>
                GitHub Profile
            </a>
        </p>
        <h4 style={{ color: '#0d6efd', marginTop: 24 }}>Tech Stack</h4>
        <ul>
            <li>React, Redux Toolkit, TypeScript</li>
            <li>HTML5 Video, Canvas</li>
            <li>Styled for dark/light mode</li>
            <li>Responsive design for desktop and mobile</li>
            <li> <a href="https://github.com/krishnaNallasingu/Video-Annotation-Tool#video-annotation-tool" target="_blank" rel="noopener noreferrer" style={{ color: '#ffbf00', textDecoration: 'underline' }}>
                Complete Documentation
            </a>
            </li>
        </ul>
    </div>
);

export default About;