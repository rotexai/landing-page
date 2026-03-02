import { useScrollReveal } from '../hooks/useScrollReveal.js'
import './AIAgent.css'

const CHAT = [
  {
    role: 'user',
    text: 'Kho hàng còn bao nhiêu sản phẩm iPhone 14 Pro?',
  },
  {
    role: 'agent',
    text: 'Hiện tại kho còn 47 chiếc iPhone 14 Pro. Mức tồn kho đang ở ngưỡng cảnh báo (tối thiểu 50). Bạn có muốn tôi tạo đơn nhập hàng ngay không?',
    chips: ['Tạo đơn nhập hàng', 'Xem lịch sử nhập', 'Bỏ qua'],
  },
  {
    role: 'user',
    text: 'Tạo đơn nhập hàng 100 chiếc.',
  },
  {
    role: 'agent',
    text: 'Đã tạo đơn nhập hàng #PO-2026-0312 — 100 chiếc iPhone 14 Pro. Đơn hàng đang chờ duyệt từ quản lý. Tôi có thể gửi thông báo cho người phụ trách không?',
    chips: ['Gửi thông báo', 'Xem đơn hàng'],
  },
]

const CAPABILITIES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
    title: 'Tra cứu tức thì',
    desc: 'Hỏi bất cứ điều gì về tồn kho, tài liệu, lịch sử hoạt động — nhận câu trả lời chính xác trong vài giây.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
      </svg>
    ),
    title: 'Thực hiện tác vụ',
    desc: 'Tạo đơn hàng, tải tài liệu, thêm sản phẩm, gửi thông báo — chỉ bằng một câu lệnh tự nhiên.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
    title: 'Tóm tắt & Báo cáo',
    desc: 'Nhận báo cáo tóm tắt hoạt động tuần, tháng. Phát hiện bất thường và nhận đề xuất hành động.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    title: 'Cảnh báo thông minh',
    desc: 'Tự động theo dõi và cảnh báo khi hàng sắp hết, hợp đồng sắp hết hạn, hoặc có hoạt động bất thường.',
  },
]

export default function AIAgent() {
  const headerRef = useScrollReveal({ stagger: 0 })
  const leftRef   = useScrollReveal({ stagger: 60 })
  const rightRef  = useScrollReveal({ stagger: 0 })

  return (
    <section className="ai-agent section" id="ai-agent">
      <div className="ai-agent__bg" aria-hidden="true" />

      <div className="container">
        {/* Header */}
        <div className="ai-agent__header" ref={headerRef} data-reveal>
          <span className="section-eyebrow ai-agent__eyebrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            Trợ lý AI
          </span>
          <h2 className="section-title">
            Quản lý doanh nghiệp<br />
            <span className="ai-agent__title-accent">bằng ngôn ngữ tự nhiên.</span>
          </h2>
          <p className="section-sub">
            Không cần học phần mềm phức tạp. Chỉ cần hỏi — trợ lý AI sẽ tra cứu,
            thực hiện tác vụ và báo cáo cho bạn ngay lập tức.
          </p>
        </div>

        {/* Body: capabilities + chat demo */}
        <div className="ai-agent__body">
          {/* Left: capability list */}
          <div className="ai-agent__caps" ref={leftRef}>
            {CAPABILITIES.map(cap => (
              <div className="ai-cap" data-reveal key={cap.title}>
                <div className="ai-cap__icon">{cap.icon}</div>
                <div>
                  <h3 className="ai-cap__title">{cap.title}</h3>
                  <p className="ai-cap__desc">{cap.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right: chat mockup */}
          <div className="ai-agent__demo" ref={rightRef} data-reveal>
            <div className="chat-window">
              {/* Window chrome */}
              <div className="chat-window__bar">
                <span className="chat-window__dot chat-window__dot--red" />
                <span className="chat-window__dot chat-window__dot--yellow" />
                <span className="chat-window__dot chat-window__dot--green" />
                <span className="chat-window__title">Trợ lý RotexAI</span>
                <span className="chat-window__badge">AI</span>
              </div>

              {/* Messages */}
              <div className="chat-messages">
                {CHAT.map((msg, i) => (
                  <div key={i} className={`chat-msg chat-msg--${msg.role}`}>
                    {msg.role === 'agent' && (
                      <div className="chat-msg__avatar" aria-hidden="true">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                          <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        </svg>
                      </div>
                    )}
                    <div className="chat-msg__bubble">
                      <p>{msg.text}</p>
                      {msg.chips && (
                        <div className="chat-msg__chips">
                          {msg.chips.map(chip => (
                            <span key={chip} className="chat-chip">{chip}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="chat-input">
                <span className="chat-input__text">Nhập câu hỏi hoặc yêu cầu...</span>
                <button className="chat-input__send" aria-label="Gửi">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                    <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
