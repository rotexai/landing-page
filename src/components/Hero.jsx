import './Hero.css'

const STEPS = [
  { label: 'Yêu cầu', value: 'Tự động xử lý đơn mua hàng định kỳ' },
  { label: 'Workflow', value: 'Kiểm tra → Phê duyệt → Đặt hàng' },
  { label: 'Ứng dụng', value: 'Giao diện mua hàng cho đội vận hành' },
]

function BuilderMockup() {
  return (
    <div className="mockup" role="img" aria-label="RotexAI chuyển yêu cầu thành workflow minh bạch và ứng dụng riêng">
      <div className="mockup__chrome">
        <div className="mockup__dots" aria-hidden="true">
          <span className="mdot mdot--red" /><span className="mdot mdot--yellow" /><span className="mdot mdot--green" />
        </div>
        <div className="mockup__url">portal.rotexai.com</div>
      </div>
      <div className="builder-preview">
        <div className="builder-preview__prompt">
          <span>Bạn mô tả</span>
          <p>“Mỗi thứ Hai, tổng hợp nhu cầu mua hàng. Nếu vượt ngân sách thì gửi quản lý duyệt.”</p>
        </div>
        <div className="builder-preview__flow" aria-hidden="true">
          {STEPS.map((step, index) => (
            <div className="builder-preview__step" key={step.label}>
              <span>{step.label}</span>
              <strong>{step.value}</strong>
              {index < STEPS.length - 1 ? <i>→</i> : null}
            </div>
          ))}
        </div>
        <div className="builder-preview__status">
          <span className="builder-preview__check">✓</span>
          Logic đã kiểm thử · Sẵn sàng chạy lại
        </div>
      </div>
    </div>
  )
}

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__bg" aria-hidden="true" />
      <div className="hero__wrap container">
        <div className="hero__left">
          <div className="hero__eyebrow"><span className="hero__eyebrow-dot" />AI xây dựng · Workflow vận hành</div>
          <h1 className="hero__h1" id="hero-title">Mô tả công việc một lần.<br /><em>Vận hành lặp lại với chi phí tối ưu.</em></h1>
          <p className="hero__sub">RotexAI biến cuộc trò chuyện thành workflow có thể kiểm tra và một ứng dụng web phù hợp với đội ngũ của bạn. AI thiết kế quy trình; logic đã xác thực xử lý những lần chạy tiếp theo.</p>
          <div className="hero__actions">
            <a href="https://portal.rotexai.com" className="btn btn--primary">Bắt đầu xây dựng <span aria-hidden="true">→</span></a>
            <a href="#how-it-works" className="btn btn--outline">Xem cách hoạt động</a>
          </div>
          <div className="hero__trust">
            <div className="hero__trust-item"><span aria-hidden="true">✓</span> Xem và chỉnh sửa toàn bộ logic</div>
            <div className="hero__trust-item"><span aria-hidden="true">✓</span> Chỉ dùng AI khi thực sự cần suy luận</div>
            <div className="hero__trust-item"><span aria-hidden="true">✓</span> Giao diện riêng cho từng quy trình</div>
          </div>
        </div>
        <div className="hero__right"><BuilderMockup /></div>
      </div>
    </section>
  )
}
