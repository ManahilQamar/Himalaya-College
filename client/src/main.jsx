import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MotionConfig } from 'framer-motion';
import '@fontsource-variable/plus-jakarta-sans';
import '@fontsource-variable/public-sans';
import App from './App';
import './styles/index.css';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, retry: 1, refetchOnWindowFocus: false } },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {/* reducedMotion="user" respects the visitor's OS reduced-motion setting */}
          <MotionConfig reducedMotion="user">
            <App />
          </MotionConfig>
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
);


