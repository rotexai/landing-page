import { useScrollReveal } from '../hooks/useScrollReveal.js'
import './Architecture.css'

const APPS = [
  { icon: 'ĐH', title: 'Phê duyệt đơn hàng', body: 'Biểu mẫu tạo yêu cầu, trạng thái ngân sách và thao tác duyệt cho đúng người.' },
  { icon: 'KH', title: 'Onboarding khách hàng', body: 'Danh sách hồ sơ, các bước cần hoàn tất và cảnh báo thiếu thông tin.' },
  { icon: 'BC', title: 'Báo cáo định kỳ', body: 'Chọn kỳ báo cáo, xem tiến độ tổng hợp và tải kết quả đã được xác thực.' },
]

const COMPARE = [
  ['Thiết lập quy trình', 'Prompt cho mỗi lần chạy', 'Lắp ghép thủ công', 'AI tạo từ mô tả'],
  ['Công việc lặp lại', 'AI suy luận lại', 'Chạy workflow', 'Chạy logic đã duyệt'],
  ['Khả năng kiểm tra', 'Phụ thuộc mô hình', 'Xem được workflow', 'Workflow, logic và dữ liệu'],
  ['Giao diện cho đội ngũ', 'Khung chat', 'Trình workflow', 'Ứng dụng web riêng'],
]

const FAQ = [
  { q: 'RotexAI dùng AI vào lúc nào?', a: 'AI được dùng để hiểu yêu cầu, tạo hoặc thay đổi workflow và xử lý những bước thật sự cần phán đoán. Các thao tác ổn định có thể chạy bằng logic xác định.' },
  { q: 'Tôi có thể xem và sửa workflow do AI tạo không?', a: 'Có. Bạn có thể xem sơ đồ, logic, kiểu dữ liệu, kết quả kiểm thử và phiên bản trước khi phát hành.' },
  { q: 'Nếu quy trình kinh doanh thay đổi thì sao?', a: 'Mô tả phần cần đổi cho AI, xem khác biệt, chạy kiểm thử rồi phát hành một phiên bản mới.' },
  { q: 'Workflow có thể gọi AI trong khi chạy không?', a: 'Có. Một workflow có thể dùng AI ở bước cần đọc hiểu hoặc suy luận, đồng thời giữ những bước còn lại nhanh và xác định.' },
  { q: 'Ai sử dụng giao diện web được tạo?', a: 'Nhân viên vận hành sử dụng giao diện theo nghiệp vụ; người xây workflow vẫn có thể mở phần logic và cấu hình phía sau.' },
  { q: 'RotexAI có thể self-host không?', a: 'Có. Nền tảng được thiết kế để triển khai trên hạ tầng do doanh nghiệp kiểm soát.' },
]

export default function Architecture() {
  const appsRef = useScrollReveal({ stagger: 90, threshold: 0.08 })
  const faqRef = useScrollReveal({ stagger: 50, threshold: 0.06 })
  return (
    <>
      <section className="hiw section" id="custom-apps" aria-labelledby="apps-title">
        <div className="container">
          <div className="hiw__header" data-reveal ref={useScrollReveal({ stagger: 0 })}>
            <span className="section-eyebrow">Ẩn sự phức tạp đúng chỗ</span>
            <h2 className="section-title" id="apps-title">Đội ngũ dùng một ứng dụng.<br />Không phải vận hành một workflow.</h2>
            <p className="section-sub">RotexAI tạo giao diện web phù hợp với quy trình và vai trò người dùng. Nhân viên thấy đúng biểu mẫu, dữ liệu và hành động cần thiết; logic phía sau vẫn mở cho người quản trị.</p>
          </div>
          <div className="hiw__steps" ref={appsRef}>
            {APPS.map((app) => (
              <article className="hiw__step" data-reveal key={app.title}>
                <div className="app-monogram" aria-hidden="true">{app.icon}</div>
                <h3 className="hiw__step-title">{app.title}</h3>
                <p className="hiw__step-body">{app.body}</p>
                <p className="hiw__step-note">Giao diện tập trung vào công việc, không lộ cấu hình kỹ thuật.</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="comparison section" id="comparison" aria-labelledby="comparison-title">
        <div className="container">
          <div className="comparison__header">
            <h2 className="section-title" id="comparison-title">Không chỉ là agent.<br />Không chỉ là workflow.</h2>
            <p className="section-sub">RotexAI kết hợp tốc độ xây dựng của AI, tính ổn định của automation và trải nghiệm của phần mềm nghiệp vụ.</p>
          </div>
          <div className="comparison__scroll" tabIndex="0" aria-label="Bảng so sánh RotexAI với AI agent và công cụ workflow">
            <table className="comparison__table">
              <thead><tr><th>Tiêu chí</th><th>AI agent động</th><th>Công cụ workflow</th><th>RotexAI</th></tr></thead>
              <tbody>{COMPARE.map((row) => <tr key={row[0]}>{row.map((cell, i) => <td key={cell} className={i === 3 ? 'is-rotex' : ''}>{cell}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </div>
      </section>

      <div className="section-divider" />
      <section className="faq section" id="faq">
        <div className="container"><div className="faq__layout">
          <div className="faq__left" data-reveal ref={useScrollReveal({ stagger: 0 })}>
            <span className="section-eyebrow">Câu hỏi thường gặp</span>
            <h2 className="section-title">Rõ trước khi bắt đầu.</h2>
            <p className="section-sub">Những điều cần biết về vai trò của AI, quyền kiểm soát và cách workflow đi vào vận hành.</p>
          </div>
          <div className="faq__items" ref={faqRef}>{FAQ.map((item) => <article className="faq__item" data-reveal key={item.q}><h3 className="faq__q">{item.q}</h3><p className="faq__a">{item.a}</p></article>)}</div>
        </div></div>
      </section>
    </>
  )
}
