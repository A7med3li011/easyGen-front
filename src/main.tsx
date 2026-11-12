import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ToastContainer, toast } from 'react-toastify'
import './index.css'
import App from './App.tsx'
import { getErrorMessage } from './shared/api/errors.ts'
import { installAuthInterceptors } from './features/auth'

// Adds the access token to API calls and refreshes it when it expires
installAuthInterceptors()

// One shared cache for every query and mutation in the app
const queryClient = new QueryClient({
  // Any failed mutation (login, register, ...) shows its error as a toast,
  // unless it sets `meta: { skipGlobalErrorToast: true }` and handles errors itself
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (mutation.meta?.skipGlobalErrorToast) return
      toast.error(getErrorMessage(error))
    },
  }),
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      {/* "auto" follows the system light/dark setting, like the rest of the app */}
      <ToastContainer position="top-right" theme="auto" />
    </QueryClientProvider>
  </StrictMode>,
)
