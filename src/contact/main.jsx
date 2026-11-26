import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Contact from './Contact.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Contact />
  </StrictMode>,
)
