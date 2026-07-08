import { useScrollReveal } from '../hooks/useScrollReveal.js'
import './GetStarted.css'

export default function GetStarted() {
  const sectionRef = useScrollReveal({ stagger: 100, threshold: 0.08 })
  return (
    <section className="gs section" id="get-started" aria-labelledby="start-title">
      <div className="container"><div className="gs__inner" ref={sectionRef}>
        <div className="gs__card" data-reveal>
          <div className="gs__card-bg" aria-hidden="true" />
          <div className="gs__card-content">
            <span className="section-eyebrow">Bắt đầu với một quy trình</span>
            <h2 className="gs__title" id="start-title">Công việc nào đang được<br />lặp lại trong doanh nghiệp bạn?</h2>
            <p className="gs__sub">Mô tả quy trình cho RotexAI. Xem AI biến nó thành workflow có thể kiểm tra, sau đó đưa đội ngũ vào một ứng dụng được tạo riêng cho công việc đó.</p>
            <div className="gs__actions">
              <a href="https://portal.rotexai.com" className="btn btn--primary">Bắt đầu xây dựng <span aria-hidden="true">→</span></a>
              <a href="mailto:contact@rotexai.com" className="btn btn--outline">Trao đổi với chúng tôi</a>
            </div>
            <p className="gs__note">Bắt đầu từ quy trình thực tế · Xem logic trước khi phát hành</p>
          </div>
          <div className="gs__card-visual" aria-hidden="true"><div className="gs__vis-grid">
            {[
              ['01', 'Mô tả', 'Nói bằng ngôn ngữ tự nhiên'], ['02', 'Tạo', 'Workflow và dữ liệu'], ['03', 'Kiểm tra', 'Logic và kết quả'],
              ['04', 'Giao diện', 'Ứng dụng theo nghiệp vụ'], ['05', 'Phát hành', 'Phiên bản đã duyệt'], ['06', 'Vận hành', 'Chạy lại ổn định'],
            ].map(([icon, label, val]) => <div className="gs__vis-item" key={label}><span className="gs__vis-icon">{icon}</span><span className="gs__vis-label">{label}</span><span className="gs__vis-val">{val}</span></div>)}
          </div></div>
        </div>
        <div className="gs__for-devs" data-reveal>
          <div className="gs__devs-label">Được thiết kế để bạn giữ quyền kiểm soát</div>
          <div className="gs__devs-chips">{['Logic minh bạch', 'Dữ liệu có kiểu', 'Kiểm thử trước', 'Phiên bản rõ ràng', 'Self-host'].map((text) => <span className="gs__chip" key={text}>✓ {text}</span>)}</div>
          <a href="mailto:contact@rotexai.com" className="gs__devs-link">contact@rotexai.com →</a>
        </div>
      </div></div>
    </section>
  )
}
