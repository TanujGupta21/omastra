import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import ErrorBoundary from './components/ui/ErrorBoundary'
import AppRouter from './routes/AppRouter'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <ErrorBoundary>
                <AppRouter />
              </ErrorBoundary>

              <Toaster
                position="bottom-right"
                toastOptions={{
                  style: {
                    background: '#0E1526',
                    color: '#F8FAFC',
                    border: '1px solid #1E293B',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontFamily: 'Manrope, sans-serif',
                  },
                  success: {
                    iconTheme: { primary: '#2E68FF', secondary: '#070B14' },
                  },
                }}

              />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)


