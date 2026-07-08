import { useScrollReveal } from '../hooks/useScrollReveal.js'
import './AIAgent.css'

const PHASES = [
  { number: '01', title: 'Mô tả công việc', text: 'Nói với AI quy trình đang lặp lại, dữ liệu cần dùng và kết quả mong muốn.' },
  { number: '02', title: 'Tạo workflow', text: 'RotexAI tạo các bước thực thi, điều kiện, kiểu dữ liệu và phần logic cần thiết.' },
  { number: '03', title: 'Kiểm tra và duyệt', text: 'Xem sơ đồ, đọc logic, chạy thử với dữ liệu mẫu và chỉnh sửa trước khi phát hành.' },
  { number: '04', title: 'Đưa vào vận hành', text: 'Đội ngũ dùng giao diện web riêng; workflow đã xác thực chạy lại theo cùng một cách.' },
]

export default function AIAgent() {
  const headerRef = useScrollReveal({ stagger: 0 })
  const bodyRef = useScrollReveal({ stagger: 90, threshold: 0.08 })
  return (
    <section className="ai-agent" id="how-it-works" aria-labelledby="process-title">
      <div className="ai-agent__grain" aria-hidden="true" />
      <div className="container">
        <div className="ai-agent__header" ref={headerRef} data-reveal>
          <span className="ai-agent__eyebrow">Từ hội thoại đến vận hành</span>
          <h2 className="ai-agent__title" id="process-title">AI không làm lại mọi thứ.<br />AI xây cách làm tốt hơn.</h2>
          <p className="ai-agent__sub">Tách phần cần suy luận khỏi phần có thể chạy ổn định giúp quy trình nhanh hơn, dễ kiểm soát hơn và tránh tiêu tốn AI cho cùng một quyết định lặp đi lặp lại.</p>
        </div>
        <div className="process" ref={bodyRef}>
          {PHASES.map((phase) => (
            <article className="process__item" data-reveal key={phase.number}>
              <span className="process__number">{phase.number}</span>
              <h3>{phase.title}</h3>
              <p>{phase.text}</p>
            </article>
          ))}
        </div>
        <div className="ai-agent__stats" data-reveal>
          <div className="ai-stat"><div className="ai-stat__value">AI</div><div className="ai-stat__label">Thiết kế và thay đổi quy trình</div></div>
          <div className="ai-stat"><div className="ai-stat__value">Logic</div><div className="ai-stat__label">Xử lý các lần chạy lặp lại</div></div>
          <div className="ai-stat"><div className="ai-stat__value">Bạn</div><div className="ai-stat__label">Kiểm tra và giữ quyền kiểm soát</div></div>
        </div>
      </div>
    </section>
  )
}
