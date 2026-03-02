import './Footer.css'

const LINKS = {
  'Sản phẩm': [
    { label: 'Tính năng',          href: '#features'  },
    { label: 'Trợ lý AI',          href: '#ai-agent'  },
    { label: 'Cách hoạt động',     href: '#how-it-works' },
    { label: 'Câu hỏi thường gặp', href: '#faq'       },
  ],
  'Dịch vụ': [
    { label: 'Tư vấn triển khai',  href: '#get-started' },
    { label: 'Đào tạo nhân viên',  href: '#get-started' },
    { label: 'Hỗ trợ kỹ thuật',   href: '#get-started' },
    { label: 'Tuỳ chỉnh hệ thống', href: '#get-started' },
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
            <a href="/" className="footer__logo" aria-label="Trang chủ RotexAI ERP">
              <span className="footer__logo-r">Rotex</span><span className="footer__logo-ai">AI</span>
              <span className="footer__logo-sub">ERP</span>
            </a>

            <p className="footer__tagline">
              Giải pháp quản trị doanh nghiệp tích hợp AI —
              đơn giản, bảo mật và được hỗ trợ chuyên nghiệp.
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
          <p className="footer__love">Được xây dựng cho doanh nghiệp Việt Nam 🇻🇳</p>
        </div>
      </div>
    </footer>
  )
}
