import { useScrollReveal } from '../hooks/useScrollReveal.js'
import './Modules.css'

const CAPABILITIES = [
  { id: 'graph', name: 'Sơ đồ workflow', desc: 'Nhìn thấy từng bước, điều kiện và đường đi của dữ liệu trong toàn bộ quy trình.', benefit: 'Hiểu quy trình trong một màn hình', color: 'var(--feat-inventory)' },
  { id: 'logic', name: 'Logic có thể đọc', desc: 'Mở, kiểm tra và chỉnh sửa phần logic thực thi thay vì phụ thuộc vào quyết định ẩn của AI.', benefit: 'Không còn hộp đen', color: 'var(--feat-storage)' },
  { id: 'contracts', name: 'Dữ liệu có hợp đồng rõ ràng', desc: 'Đầu vào và đầu ra được định nghĩa bằng kiểu dữ liệu để lỗi xuất hiện trước khi đi vào vận hành.', benefit: 'Kết quả nhất quán hơn', color: 'var(--feat-activity)' },
  { id: 'tests', name: 'Kiểm thử trước khi phát hành', desc: 'Chạy workflow với dữ liệu mẫu, xem log và xác nhận kết quả trước khi đội ngũ sử dụng.', benefit: 'Phát hành có kiểm soát', color: 'var(--feat-dashboard)' },
  { id: 'versions', name: 'Phiên bản và lịch sử chạy', desc: 'Theo dõi thay đổi, trạng thái và kết quả thực thi để biết chính xác điều gì đã xảy ra.', benefit: 'Dễ kiểm tra và cải tiến', color: 'var(--feat-access)' },
]

export default function Modules() {
  const headerRef = useScrollReveal({ stagger: 0 })
  const gridRef = useScrollReveal({ stagger: 70, threshold: 0.06 })
  return (
    <section className="features section" id="transparency" aria-labelledby="transparency-title">
      <div className="features__bg" aria-hidden="true" />
      <div className="container">
        <div className="features__header" ref={headerRef} data-reveal>
          <span className="section-eyebrow">Minh bạch từ thiết kế đến vận hành</span>
          <h2 className="section-title" id="transparency-title">Workflow do AI tạo.<br />Logic vẫn thuộc về bạn.</h2>
          <p className="section-sub">RotexAI giúp bạn hiểu, kiểm thử và thay đổi cách tự động hóa hoạt động. AI tăng tốc việc xây dựng nhưng không lấy đi quyền kiểm soát.</p>
        </div>
        <div className="features__grid" ref={gridRef}>
          {CAPABILITIES.map((item) => (
            <article className="feat-card" data-reveal key={item.id} style={{ '--feat-color': item.color, '--feat-soft': 'var(--surface)' }}>
              <div className="feat-card__body">
                <span className="capability-dot" aria-hidden="true" />
                <h3 className="feat-card__name">{item.name}</h3>
                <p className="feat-card__desc">{item.desc}</p>
              </div>
              <div className="feat-card__benefit">✓ {item.benefit}</div>
            </article>
          ))}
          <div className="feat-card feat-card--more" data-reveal>
            <p className="feat-card__more-text">Khi quy trình thay đổi, hãy yêu cầu AI cập nhật workflow, kiểm tra phần khác biệt rồi phát hành phiên bản mới.</p>
            <a href="https://portal.rotexai.com" className="feat-card__more-link">Mở trình xây dựng →</a>
          </div>
        </div>
      </div>
    </section>
  )
}
