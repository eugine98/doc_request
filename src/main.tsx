import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename="/doc">
    <StrictMode>
        <QueryClientProvider client={queryClient}>
          <App />
          {/* <ReactQueryDevtools /> */}
          <Toaster richColors position="top-center" closeButton />
        </QueryClientProvider>
    </StrictMode>
  </BrowserRouter>
);
