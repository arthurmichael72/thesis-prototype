import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import NationalBurdenChart from './NationalBurdenChart.tsx';
import './index.css';

const rootElement = document.getElementById('isotype-react-root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

const nationalBurdenRoot = document.getElementById('national-burden-react-root');
if (nationalBurdenRoot) {
  createRoot(nationalBurdenRoot).render(
    <StrictMode>
      <NationalBurdenChart />
    </StrictMode>,
  );
}
