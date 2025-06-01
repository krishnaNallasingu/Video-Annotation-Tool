import React from 'react';
import { motion } from 'framer-motion';

const About: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.97 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
    whileHover={{ scale: 1.005, boxShadow: '0 0 24px #0d6efd55' }}
    style={{
      maxWidth: 720,
      margin: '3rem auto',
      background: 'rgba(20, 30, 40, 0.9)',
      borderRadius: 16,
      border: '1.5px solid #0d6efd66',
      boxShadow: '0 4px 24px #ffbf0022',
      padding: '2.5rem',
      color: '#f3f6fa',
      fontSize: '1.1rem',
      lineHeight: 1.7,
      transition: 'all 0.3s ease-in-out'
    }}
  >
    <h2 style={{ color: '#0d6efd', marginBottom: 16 }}>About This Project</h2>
    <p>
      <strong>Video Annotation Tool</strong> is a modern, web-based platform for annotating video frames with shapes, text, and temporal markers. It is purpose-built for use in <strong>research</strong>, <strong>education</strong>, and <strong>media production</strong> workflows that require precise visual labeling and feedback.
    </p>

    <Section title="Core Features" items={[
      'Custom Video Player: Seamless playback controls with an interactive timeline and animated scrubber.',
      'Flexible Annotation Tools: Draw rectangles, circles, lines, and text directly on video frames.',
      'Interactive Editing: Select and reposition annotations on both the video canvas and the timeline.',
      'Undo / Redo: Step through changes without losing progress.',
      'Export to JSON: Download structured annotation data for reuse or analysis.',
      'Responsive Design: Optimized for desktops and tablets.'
    ]} />

    <Section title="How to Use" items={[
      'Select a Tool: Choose from Rectangle, Circle, Line, or Text. Use the Select tool to move or edit existing annotations.',
      'Draw Annotations: Click and drag on the video canvas to create a shape. For text, click and type.',
      'Edit Properties: Change color, text, or timing using the properties panel.',
      'Undo / Redo: Use the toolbar controls to reverse or reapply changes.',
      'Export: Click "Export" to download your annotations as a JSON file.'
    ]} />

    <Section title="Use Cases" items={[
      'Research: Label and track objects or events in video data for experiments or studies.',
      'Education: Annotate instructional videos with notes and highlights.',
      'Media Production: Mark scenes or visual cues for editing, reviews, or collaboration.'
    ]} />

    <Section title="Tech Stack" items={[
      'Frontend: React, Redux Toolkit, TypeScript',
      'Rendering: HTML5 Video, Canvas API',
      'Backend: Node.js, Express, MongoDB',
      'UI: Responsive design with custom theming'
    ]} extraItem={{
      label: 'View Full Documentation',
      href: 'https://github.com/krishnaNallasingu/Video-Annotation-Tool#video-annotation-tool'
    }} />

    <h3 style={{ color: '#0d6efd', marginTop: 32 }}>Developer</h3>
    <p>
      <strong>Jagankrishna Nallasingu</strong><br />
      Prefinal year Computer Science undergraduate at IIIT Hyderabad.<br />

      <a
        href="https://www.linkedin.com/in/jagankrishna-nallasingu-0725b4268/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: '#2ecc71',
          textDecoration: 'underline',
          transition: 'color 0.2s',
        }}
        onMouseOver={(e) => (e.currentTarget.style.color = '#28b463')}
        onMouseOut={(e) => (e.currentTarget.style.color = '#2ecc71')}
      >
        LinkedIn
      </a>{' '}
      |{' '}
      <a
        href="https://github.com/krishnaNallasingu"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: '#2ecc71',
          textDecoration: 'underline',
          transition: 'color 0.2s',
        }}
        onMouseOver={(e) => (e.currentTarget.style.color = '#28b463')}
        onMouseOut={(e) => (e.currentTarget.style.color = '#2ecc71')}
      >
        GitHub
      </a>
    </p>

    <p style={{ marginTop: 24, fontStyle: 'italic', color: '#ffbf00' }}>
      Thank you for using the Video Annotation Tool. Contributions and feedback are welcome via GitHub!
    </p>
  </motion.div>
);

const Section = ({
  title,
  items,
  extraItem
}: {
  title: string;
  items: string[];
  extraItem?: { label: string; href: string };
}) => (
  <div style={{ marginTop: 32 }}>
    <h3 style={{ color: '#0d6efd', marginBottom: 12 }}>{title}</h3>
    <ul style={{ listStyleType: 'disc', paddingLeft: 20 }}>
      {items.map((item, index) => (
        <li
          key={index}
          style={{
            marginBottom: 8,
            transition: 'transform 0.2s ease, color 0.2s ease',
            cursor: 'default'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateX(4px)';
            e.currentTarget.style.color = '#ffbf00';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateX(0)';
            e.currentTarget.style.color = '#f3f6fa';
          }}
        >
          {item}
        </li>
      ))}
      {extraItem && (
        <li>
          <a
            href={extraItem.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#ffbf00',
              textDecoration: 'underline',
              transition: 'color 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = '#ffd700')}
            onMouseOut={(e) => (e.currentTarget.style.color = '#ffbf00')}
          >
            {extraItem.label}
          </a>
        </li>
      )}
    </ul>
  </div>
);

export default About;
