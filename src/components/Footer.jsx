import './Footer.css'

const LINKS = {
  'Sản phẩm': [
    { label: 'Cách hoạt động',     href: '#how-it-works' },
    { label: 'Logic minh bạch',    href: '#transparency' },
    { label: 'Ứng dụng riêng',     href: '#custom-apps' },
    { label: 'So sánh',            href: '#comparison' },
    { label: 'Câu hỏi thường gặp', href: '#faq'       },
  ],
  'Bắt đầu': [
    { label: 'Mở trình xây dựng',  href: 'https://portal.rotexai.com' },
    { label: 'Đăng nhập',          href: 'https://portal.rotexai.com' },
    { label: 'Liên hệ',            href: 'mailto:contact@rotexai.com' },
  ],
  'Công ty': [
    { label: 'Về chúng tôi',       href: '#' },
    { label: 'Khách hàng',         href: '#' },
    { label: 'Chính sách bảo mật', href: '#' },
    { label: 'Điều khoản sử dụng', href: '#' },
  ],
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer__wave" aria-hidden="true" />

      <div className="container">
        <div className="footer__inner">
          {/* Brand */}
          <div className="footer__brand">
            <a href="/" className="footer__logo" aria-label="Trang chủ RotexAI">
              <span className="footer__logo-r">Rotex</span><span className="footer__logo-ai">AI</span>
            </a>

            <p className="footer__tagline">
              Biến công việc lặp lại thành workflow minh bạch
              và ứng dụng web phù hợp với đội ngũ của bạn.
            </p>

            <a href="mailto:contact@rotexai.com" className="footer__contact-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              contact@rotexai.com
            </a>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section} className="footer__col">
              <h3 className="footer__col-title">{section}</h3>
              <ul className="footer__col-list">
                {links.map(link => (
                  <li key={link.label}>
                    <a href={link.href} className="footer__link">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">© {year} RotexAI. Bản quyền thuộc về RotexAI. Mọi quyền được bảo lưu.</p>
          <p className="footer__love">AI xây dựng · Workflow vận hành</p>
        </div>
      </div>
    </footer>
  )
}
