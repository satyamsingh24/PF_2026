import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import '@fontsource/anton/400.css';
import '@fontsource-variable/fraunces/full.css';
import './styles.css';
import './overrides.css';
import './projects.css';
import './about.css';
import './education.css';
import './certifications.css';
import './skills.css';
import './footer.css';
import './navbar.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
