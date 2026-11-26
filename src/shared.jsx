// Pieces shared by the landing page and the marketplace page.
import { CONTACT, CONTACT_EMAIL, DOCS_AGENTS, GUIDE, MARKET, PORTAL, PRICING, marketHref } from './config.js'
import { TYPES } from './erp.jsx'
import { useDisclosure } from './useDisclosure.js'

// Brand lockup (brand/logo/lockup/rotexai-lockup.svg), inlined so the page loads its fonts once.
export function Lockup() {
  return (
    <svg className="lockup" viewBox="0 0 142 40" fill="none" role="img" aria-label="RotexAI">
      <defs>
        <linearGradient id="ai" gradientUnits="userSpaceOnUse" x1="107" y1="0" x2="131" y2="0">
          <stop offset="0" stopColor="#5B43E8" />
          <stop offset="0.6" stopColor="#4CC9F0" />
          <stop offset="1" stopColor="#A390FF" />
        </linearGradient>
      </defs>
      <g transform="scale(1.5385)">
        <rect x="1" y="1" width="24" height="24" rx="6" stroke="#0E1A24" strokeWidth="1.6" />
        <circle cx="8" cy="9" r="2.4" fill="#2445E8" />
        <circle cx="18" cy="13" r="2.4" fill="#2445E8" />
        <circle cx="9" cy="18.5" r="2.4" fill="#F26A1B" />
        <path d="M10 9.6l6 2.6M16.2 14.2l-5.4 3.2" stroke="#0E1A24" strokeWidth="1.3" />
      </g>
      <text x="50" y="27" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="20" fontWeight="800" letterSpacing="-0.4" fill="#0E1A24">
        Rotex<tspan fontFamily="'JetBrains Mono', ui-monospace, monospace" letterSpacing="0.4" fill="url(#ai)">AI</tspan>
      </text>
      <circle cx="135" cy="11" r="2.5" fill="#4CC9F0" />
    </svg>
  )
}

// The mark alone (brand/logo/mark), shown on a white tile as in brand/logo/favicon.
export function Mark() {
  return (
    <svg viewBox="0 0 26 26" width="64" height="64" fill="none" role="img" aria-label="RotexAI">
      <rect x="1" y="1" width="24" height="24" rx="6" stroke="#0E1A24" strokeWidth="1.6" />
      <circle cx="8" cy="9" r="2.4" fill="#2445E8" />
      <circle cx="18" cy="13" r="2.4" fill="#2445E8" />
      <circle cx="9" cy="18.5" r="2.4" fill="#F26A1B" />
      <path d="M10 9.6l6 2.6M16.2 14.2l-5.4 3.2" stroke="#0E1A24" strokeWidth="1.3" />
    </svg>
  )
}

export function Icon({ d, children, size = 28 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {d ? <path d={d} /> : children}
    </svg>
  )
}

// A button that opens a panel under it (header menus, the "Thêm +" pill). `align` is the panel's anchored side.
export function Popover({ id, label, buttonClass, panelClass = '', align = 'left', children }) {
  const { open, setOpen, root, button, onBlur, onPanelClick } = useDisclosure()
  return (
    <div className="pop-root" ref={root} onBlur={onBlur}>
      <button ref={button} type="button" className={buttonClass} aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
        {label}
      </button>
      {open && (
        <div id={id} data-panel="" className={`pop pop-${align} ${panelClass}`} onClick={onPanelClick}>
          {children}
        </div>
      )}
    </div>
  )
}

// Every ERP type as a link into the marketplace page, then "all templates".
export function TypeMenu() {
  return (
    <>
      <ul className="type-list">
        {TYPES.map((t) => (
          <li key={t.id}>
            <a href={marketHref({ area: t.id })}><Icon size={18}>{t.icon}</Icon>{t.name}</a>
          </li>
        ))}
      </ul>
      <a href={MARKET} className="menu-all">Tất cả mẫu <span aria-hidden="true">→</span></a>
    </>
  )
}

// The "Sản phẩm" menu: what the product does, how it looks, and the coding-agent guide.
function productLinks(home) {
  return [
    { href: `${home}#loi-ich`, title: 'Bốn bước', line: 'Kể, duyệt kế hoạch, xem dựng, rồi dùng ngay.' },
    { href: `${home}#cach-lam`, title: 'Xem cách làm', line: 'Kể một câu, có phần mềm quản lý.' },
    { href: DOCS_AGENTS, title: 'Kết nối coding agent', line: 'Dùng RotexAI từ Claude Code, Codex, claude.ai hoặc ChatGPT.' },
  ]
}

const Chevron = () => (
  <svg className="chev" viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 4.5l3 3 3-3" />
  </svg>
)

// Phones: one button opens a full-width panel with every header destination.
function MobileMenu({ home, current }) {
  const { open, setOpen, root, button, onBlur, onPanelClick } = useDisclosure()
  return (
    <div className="mobile-menu" ref={root} onBlur={onBlur}>
      <button ref={button} type="button" className="menu-btn" aria-expanded={open} aria-controls="mobile-panel" aria-label={open ? 'Đóng menu' : 'Mở menu'} onClick={() => setOpen((o) => !o)}>
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      {open && (
        <div id="mobile-panel" data-panel="" className="mobile-panel" onClick={onPanelClick}>
          <p className="small mobile-group">Sản phẩm</p>
          {productLinks(home).map((l) => <a key={l.title} href={l.href}>{l.title}</a>)}
          <p className="small mobile-group">Khám phá</p>
          <a href={MARKET}>Ngành nghề</a>
          <a href={PRICING}>Bảng giá</a>
          <a href={GUIDE}>Hướng dẫn</a>
          <a href={CONTACT} aria-current={current === 'contact' ? 'page' : undefined}>Liên hệ</a>
          <div className="mobile-actions">
            <a href={PORTAL} className="btn btn-line">Đăng nhập</a>
            <a href={PORTAL} className="btn btn-dark">Thử ngay</a>
          </div>
        </div>
      )}
    </div>
  )
}

// `home` is '' on the landing page (in-page anchors) and '/' elsewhere. `current` marks the page the visitor is on.
export function SiteHeader({ home = '', current = '' }) {
  return (
    <header className="bar">
      <div className="bar-in wrap">
        <a href={home ? '/' : '#top'} className="brand"><Lockup /></a>
        <nav className="nav" aria-label="Trang">
          <Popover id="menu-product" buttonClass="nav-btn" panelClass="product-menu" label={<>Sản phẩm <Chevron /></>}>
            <ul>
              {productLinks(home).map((l) => (
                <li key={l.title}>
                  <a href={l.href}><span className="menu-title">{l.title}</span><span className="small">{l.line}</span></a>
                </li>
              ))}
            </ul>
          </Popover>
          {/* One entry for industries and templates: the menu lists every type and ends with "Tất cả mẫu". */}
          <Popover id="menu-types" buttonClass={current === 'market' ? 'nav-btn is-current' : 'nav-btn'} panelClass="types-menu" label={<>Ngành nghề <Chevron /></>}>
            <TypeMenu />
          </Popover>
          <a href={PRICING} className="nav-link" aria-current={current === 'pricing' ? 'page' : undefined}>Bảng giá</a>
          <a href={GUIDE} className="nav-link" aria-current={current === 'docs' ? 'page' : undefined}>Hướng dẫn</a>
          <a href={CONTACT} className="nav-link" aria-current={current === 'contact' ? 'page' : undefined}>Liên hệ</a>
        </nav>
        <div className="bar-actions">
          <a href={PORTAL} className="btn btn-line btn-sm bar-login">Đăng nhập</a>
          <a href={PORTAL} className="btn btn-dark btn-sm">Thử ngay</a>
          <MobileMenu home={home} current={current} />
        </div>
      </div>
    </header>
  )
}

export function SiteFooter({ home = '' }) {
  return (
    <footer className="foot">
      <div className="foot-top wrap">
        <a href={home ? '/' : '#top'} className="brand"><Lockup /></a>
      </div>
      <div className="foot-strip">
        <div className="foot-in wrap">
          <span className="small">© 2026 RotexAI</span>
          <span className="foot-links">
            <a href={`mailto:${CONTACT_EMAIL}`} className="small">{CONTACT_EMAIL}</a>
            <a href={PORTAL} className="small">portal.rotexai.com</a>
          </span>
        </div>
      </div>
    </footer>
  )
}
