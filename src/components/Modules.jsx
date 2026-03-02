import { useScrollReveal } from '../hooks/useScrollReveal.js'
import './Modules.css'

const FEATURES = [
  {
    id: 'inventory',
    name: 'Quản lý kho hàng',
    color: 'var(--feat-inventory)',
    colorSoft: 'rgba(193, 100, 25, 0.09)',
    desc: 'Luôn biết chính xác bạn đang có gì. Thêm sản phẩm, theo dõi mức tồn kho và nhận thông báo trước khi hết hàng.',
    benefit: 'Không cần bảng tính nữa',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
      </svg>
    ),
  },
  {
    id: 'files',
    name: 'Lưu trữ tài liệu',
    color: 'var(--feat-storage)',
    colorSoft: 'rgba(37, 99, 235, 0.08)',
    desc: 'Tải lên hóa đơn, hình ảnh, hợp đồng và tài liệu. Sắp xếp vào thư mục và tìm kiếm bất cứ thứ gì chỉ trong vài giây.',
    benefit: 'Tất cả hồ sơ, một nơi',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        <line x1="12" y1="11" x2="12" y2="17" />
        <line x1="9" y1="14" x2="15" y2="14" />
      </svg>
    ),
  },
  {
    id: 'activity',
    name: 'Nhật ký hoạt động',
    color: 'var(--feat-activity)',
    colorSoft: 'rgba(124, 58, 237, 0.08)',
    desc: 'Ghi lại rõ ràng mọi việc diễn ra trong doanh nghiệp. Biết ai đã làm gì và vào lúc nào, tất cả ở một nơi.',
    benefit: 'Minh bạch hoàn toàn',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    id: 'dashboard',
    name: 'Bảng điều khiển',
    color: 'var(--feat-dashboard)',
    colorSoft: 'rgba(5, 150, 105, 0.08)',
    desc: 'Một màn hình cho thấy toàn bộ tình hình doanh nghiệp. Số liệu quan trọng, hoạt động gần đây và cảnh báo — tất cả một cái nhìn.',
    benefit: 'Rõ ràng ngay lập tức',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: 'team',
    name: 'Phân quyền nhóm',
    color: 'var(--feat-access)',
    colorSoft: 'rgba(220, 38, 38, 0.07)',
    desc: 'Mời nhân viên và quyết định ai được xem và làm gì. Thêm thành viên mới chỉ mất chưa đến một phút.',
    benefit: 'Đúng quyền cho từng người',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
]

export default function Modules() {
  const headerRef = useScrollReveal({ stagger: 0 })
  const gridRef   = useScrollReveal({ stagger: 70, threshold: 0.06 })

  return (
    <section className="features section" id="features">
      <div className="features__bg" aria-hidden="true" />
      <div className="container">
        {/* Header */}
        <div className="features__header" ref={headerRef} data-reveal>
          <span className="section-eyebrow">Tính năng</span>
          <h2 className="section-title">Mọi thứ nhóm bạn cần,<br />không hơn không kém.</h2>
          <p className="section-sub">
            Mỗi tính năng được xây dựng cho người thực sự sử dụng hàng ngày —
            không chỉ dành riêng cho người cài đặt hệ thống.
          </p>
        </div>

        {/* Grid */}
        <div className="features__grid" ref={gridRef}>
          {FEATURES.map(f => (
            <div
              key={f.id}
              className="feat-card"
              data-reveal
              style={{ '--feat-color': f.color, '--feat-soft': f.colorSoft }}
            >
              <div className="feat-card__icon-wrap" aria-hidden="true">
                {f.icon}
              </div>
              <div className="feat-card__body">
                <h3 className="feat-card__name">{f.name}</h3>
                <p className="feat-card__desc">{f.desc}</p>
              </div>
              <div className="feat-card__benefit">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                {f.benefit}
              </div>
            </div>
          ))}

          {/* "And more" card */}
          <div className="feat-card feat-card--more" data-reveal>
            <p className="feat-card__more-text">
              Các tính năng được phát triển liên tục theo nhu cầu thực tế của doanh nghiệp.
              Liên hệ với chúng tôi để tư vấn giải pháp phù hợp với đặc thù của bạn.
            </p>
            <a href="#get-started" className="feat-card__more-link">
              Liên hệ tư vấn →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
