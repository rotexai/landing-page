import { useState, useEffect } from 'react'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setMenuOpen(false)

  return (
    <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="nav__inner container">
        <a href="/" className="nav__logo" aria-label="Trang chủ RotexAI ERP">
          <span className="nav__logo-r">Rotex</span><span className="nav__logo-ai">AI</span>
        </a>

        <div className={`nav__links ${menuOpen ? 'nav__links--open' : ''}`}>
          <a href="#features"     className="nav__link" onClick={close}>Tính năng</a>
          <a href="#ai-agent"    className="nav__link nav__link--ai" onClick={close}>Trợ lý AI</a>
          <a href="#how-it-works" className="nav__link" onClick={close}>Cách hoạt động</a>
          <a href="#faq"          className="nav__link" onClick={close}>Câu hỏi thường gặp</a>
          <a href="#get-started"  className="nav__link" onClick={close}>Liên hệ</a>
        </div>

        <div className="nav__actions">
          <a href="#" className="nav__login">Đăng nhập</a>
          <a href="#get-started" className="btn btn--primary nav__cta">Đặt lịch demo</a>
        </div>

        <button
          className={`nav__toggle ${menuOpen ? 'nav__toggle--open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Mở menu"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  )
}
