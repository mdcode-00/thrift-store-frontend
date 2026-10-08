import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { store } from './store/index.ts'
import ScrollToTop from './components/ui/ScrollToTop.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
        <BrowserRouter>
        <ScrollToTop />
          <App />
        </BrowserRouter>
    </Provider>
  </StrictMode>,
)