import React from 'react';
import ReactDOM from 'react-dom';

import Spins from './Spins.jsx';

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('react-root');
  ReactDOM.render(<Spins/>, root, () => {
    console.debug('initialized spins');
  });
});
