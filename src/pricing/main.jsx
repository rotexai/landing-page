import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Pricing from './Pricing.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Pricing />
  </StrictMode>,
)
