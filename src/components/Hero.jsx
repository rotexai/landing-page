import './Hero.css'

/* ─── CSS Dashboard Mockup ──────────────────────── */
function DashboardMockup() {
  const navItems = [
    { label: 'Tổng quan',  active: true,  color: 'var(--feat-dashboard)' },
    { label: 'Kho hàng',   active: false, color: 'var(--feat-inventory)' },
    { label: 'Tài liệu',   active: false, color: 'var(--feat-storage)'   },
    { label: 'Hoạt động',  active: false, color: 'var(--feat-activity)'  },
    { label: 'Nhóm',       active: false, color: 'var(--feat-access)'    },
    { label: 'Rox AI',     active: false, color: 'var(--teal)'           },
  ]

  const stats = [
    { label: 'Mặt hàng tồn kho', value: '1.247', trend: '+12%',  color: 'var(--feat-inventory)' },
    { label: 'Tài liệu lưu trữ', value: '328',   trend: '+5',    color: 'var(--feat-storage)'   },
    { label: 'Thành viên nhóm',  value: '14',    trend: '2 mới', color: 'var(--feat-access)'    },
  ]

  const activity = [
    { text: 'Cập nhật kho hàng',     sub: 'Widget A · Nhập thêm 50 đơn vị', time: '2 phút',  color: 'var(--feat-inventory)' },
    { text: 'Tải tài liệu lên',      sub: 'HopDong_Thang3.pdf',              time: '14 phút', color: 'var(--feat-storage)'   },
    { text: 'Cảnh báo sắp hết hàng', sub: 'Widget B · Còn 3 đơn vị',       time: '3 giờ',   color: 'var(--feat-inventory)' },
  ]

  return (
    <div className="mockup" role="img" aria-label="Xem trước giao diện RotexAI ERP">
      {/* Browser chrome */}
      <div className="mockup__chrome">
        <div className="mockup__dots" aria-hidden="true">
          <span className="mdot mdot--red" />
          <span className="mdot mdot--yellow" />
          <span className="mdot mdot--green" />
        </div>
        <div className="mockup__url" aria-hidden="true">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          app.rotexai.com
        </div>
      </div>

      {/* App frame */}
      <div className="mockup__app">
        {/* Sidebar */}
        <div className="mockup__sidebar" aria-hidden="true">
          <div className="mockup__brand-sm"><span>R</span></div>
          <nav className="mockup__nav">
            {navItems.map(item => (
              <div
                key={item.label}
                className={`mockup__nav-item ${item.active ? 'active' : ''}`}
                style={{ '--item-color': item.color }}
                title={item.label}
              >
                <div className="mockup__nav-icon" />
                <span className="mockup__nav-label">{item.label}</span>
              </div>
            ))}
          </nav>
        </div>

        {/* Main content */}
        <div className="mockup__main">
          <div className="mockup__main-header" aria-hidden="true">
            <div className="mockup__greeting">
              <div className="mockup__greeting-line1" />
              <div className="mockup__greeting-line2" />
            </div>
            <div className="mockup__avatar">LA</div>
          </div>

          <div className="mockup__stats" aria-hidden="true">
            {stats.map(s => (
              <div key={s.label} className="mockup__stat" style={{ '--stat-color': s.color }}>
                <div className="mockup__stat-val">{s.value}</div>
                <div className="mockup__stat-label">{s.label}</div>
                <div className="mockup__stat-trend">{s.trend}</div>
              </div>
            ))}
          </div>

          <div className="mockup__section-title" aria-hidden="true">Hoạt động gần đây</div>
          <div className="mockup__activity" aria-hidden="true">
            {activity.map((a, i) => (
              <div key={i} className="mockup__activity-row">
                <div className="mockup__activity-dot" style={{ background: a.color }} />
                <div className="mockup__activity-text">
                  <span className="mockup__activity-main">{a.text}</span>
                  <span className="mockup__activity-sub">{a.sub}</span>
                </div>
                <span className="mockup__activity-time">{a.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI overlay popup */}
        <div className="mockup__ai-popup" aria-hidden="true">
          <div className="mockup__ai-header">
            <div className="mockup__ai-dot" />
            <span>Rox AI</span>
          </div>
          <p className="mockup__ai-text">3 mặt hàng sắp hết. Tôi có thể tạo đơn nhập tự động không?</p>
          <div className="mockup__ai-btns">
            <span className="mockup__ai-btn mockup__ai-btn--yes">Tạo đơn</span>
            <span className="mockup__ai-btn">Bỏ qua</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Hero ──────────────────────────────────────── */
export default function Hero() {
  return (
    <section className="hero" aria-label="Hero">
      <div className="hero__bg" aria-hidden="true" />

      <div className="hero__wrap container">
        {/* Left */}
        <div className="hero__left">
          <div className="hero__eyebrow">
            <span className="hero__eyebrow-dot" aria-hidden="true" />
            Rox AI tích hợp · ERP cho doanh nghiệp Việt Nam
          </div>

          <h1 className="hero__h1">
            Nói với AI —<br />
            <em>mọi việc được xử lý ngay.</em>
          </h1>

          <p className="hero__sub">
            RotexAI ERP tích hợp Rox — trợ lý AI đơn giản hoá toàn bộ vận hành.
            Hỏi Rox để tra cứu, ra lệnh để thực hiện — kho hàng, tài liệu, nhóm
            đều trong một hệ thống duy nhất.
          </p>

          <div className="hero__actions">
            <a href="#get-started" className="btn btn--primary">
              Đặt lịch demo
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a href="#ai-agent" className="btn btn--outline">
              Xem AI hoạt động
            </a>
          </div>

          <div className="hero__trust">
            {[
              { icon: '🤖', text: 'Rox xử lý tác vụ thay bạn'            },
              { icon: '🔒', text: 'Dữ liệu lưu trên máy chủ riêng'       },
              { icon: '🛡️', text: 'Bảo mật và hỗ trợ cấp doanh nghiệp'  },
            ].map(t => (
              <div key={t.text} className="hero__trust-item">
                <span aria-hidden="true">{t.icon}</span>
                {t.text}
              </div>
            ))}
          </div>
        </div>

        {/* Right — Dashboard with AI overlay */}
        <div className="hero__right">
          <DashboardMockup />
        </div>
      </div>
    </section>
  )
}
