import React from 'react';

const Footer: React.FC = () => (
  <footer style={{ padding: '1rem', borderTop: '1px solid #eee', marginTop: '2rem', textAlign: 'center' }}>
    <small>© {new Date().getFullYear()} E-Learning Research</small>
  </footer>
);

export default Footer;
