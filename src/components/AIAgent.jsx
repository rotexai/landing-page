import { useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal.js'
import './AIAgent.css'

const SCENARIOS = [
  {
    id: 'inventory',
    label: 'Kho hàng',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
      </svg>
    ),
    messages: [
      { role: 'user',  text: 'iPhone 14 Pro còn bao nhiêu chiếc trong kho?' },
      { role: 'agent', text: 'Kho hiện còn 47 chiếc iPhone 14 Pro. Mức tối thiểu bạn đặt là 50 — đang ở ngưỡng cảnh báo đỏ.', chips: ['Tạo đơn nhập hàng', 'Xem lịch sử nhập'] },
      { role: 'user',  text: 'Tạo đơn nhập 100 chiếc, giao cho nhà cung cấp A.' },
      { role: 'agent', text: 'Xong. Đơn #PO-2026-0312 đã được tạo — 100 chiếc iPhone 14 Pro, nhà cung cấp A. Đang chờ duyệt từ quản lý.', chips: ['Gửi thông báo duyệt', 'Xem đơn hàng'] },
    ],
  },
  {
    id: 'report',
    label: 'Báo cáo',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
    messages: [
      { role: 'user',  text: 'Tóm tắt hoạt động tuần này cho tôi.' },
      { role: 'agent', text: 'Tuần này (24–30/3): Nhập kho 3 lần (+340 đơn vị), 12 tài liệu mới được tải lên, 2 thành viên tham gia. Cảnh báo: 5 mặt hàng dưới ngưỡng tối thiểu.', chips: ['Xuất PDF', 'Xem chi tiết cảnh báo'] },
      { role: 'user',  text: 'Xuất báo cáo ra file PDF.' },
      { role: 'agent', text: 'Đã xuất BaoCaoTuan_2026-W13.pdf và lưu vào thư mục Báo cáo tháng 3. Bạn có muốn gửi email cho ban giám đốc không?', chips: ['Gửi email', 'Tải về máy'] },
    ],
  },
  {
    id: 'team',
    label: 'Nhóm',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    messages: [
      { role: 'user',  text: 'Thêm Nguyễn Minh vào nhóm Kho hàng, quyền xem và chỉnh sửa.' },
      { role: 'agent', text: 'Đã thêm Nguyễn Minh (minh@cty.com) vào nhóm Kho hàng với quyền Xem + Chỉnh sửa. Anh ấy sẽ nhận email mời đăng nhập.', chips: ['Mời thêm người', 'Xem nhóm'] },
      { role: 'user',  text: 'Ai trong nhóm có quyền duyệt đơn hàng?' },
      { role: 'agent', text: '3 người có quyền duyệt đơn: Trần Lan (Quản lý), Phạm Hùng (Kho trưởng), và Lê An (Giám đốc). Bạn có muốn điều chỉnh danh sách này không?', chips: ['Điều chỉnh quyền', 'Không cần'] },
    ],
  },
]

const STATS = [
  { value: '< 3s', label: 'Thời gian phản hồi' },
  { value: '100%', label: 'Hoạt động 24/7'     },
  { value: '0',    label: 'Màn hình cần mở thêm' },
]

export default function AIAgent() {
  const [active, setActive] = useState(0)
  const headerRef  = useScrollReveal({ stagger: 0 })
  const contentRef = useScrollReveal({ stagger: 0 })

  const scenario = SCENARIOS[active]

  return (
    <section className="ai-agent" id="ai-agent">
      <div className="ai-agent__grain" aria-hidden="true" />

      <div className="container">
        {/* Header */}
        <div className="ai-agent__header" ref={headerRef} data-reveal>
          <span className="ai-agent__eyebrow">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            Tính năng trọng tâm
          </span>
          <h2 className="ai-agent__title">
            Một câu hỏi.<br />Xong việc ngay.
          </h2>
          <p className="ai-agent__sub">
            Trợ lý AI của RotexAI hiểu ngôn ngữ tự nhiên — không cần nhớ menu,
            không cần biết phần mềm. Chỉ cần nói, AI sẽ làm.
          </p>
        </div>

        {/* Main content */}
        <div className="ai-agent__body" ref={contentRef} data-reveal>
          {/* Scenario tabs */}
          <div className="ai-agent__tabs" role="tablist" aria-label="Ví dụ sử dụng">
            {SCENARIOS.map((s, i) => (
              <button
                key={s.id}
                role="tab"
                aria-selected={i === active}
                className={`ai-tab ${i === active ? 'ai-tab--active' : ''}`}
                onClick={() => setActive(i)}
              >
                <span className="ai-tab__icon">{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>

          {/* Chat window */}
          <div className="ai-chat" role="tabpanel">
            {/* Header */}
            <div className="ai-chat__bar">
              <div className="ai-chat__avatar">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <div>
                <div className="ai-chat__name">Trợ lý RotexAI</div>
                <div className="ai-chat__status">
                  <span className="ai-chat__online" />
                  Đang hoạt động
                </div>
              </div>
              <span className="ai-chat__badge">AI</span>
            </div>

            {/* Messages */}
            <div className="ai-chat__messages" key={active}>
              {scenario.messages.map((msg, i) => (
                <div
                  key={i}
                  className={`ai-msg ai-msg--${msg.role}`}
                  style={{ animationDelay: `${i * 0.12}s` }}
                >
                  {msg.role === 'agent' && (
                    <div className="ai-msg__avatar" aria-hidden="true">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                      </svg>
                    </div>
                  )}
                  <div className="ai-msg__bubble">
                    <p>{msg.text}</p>
                    {msg.chips && (
                      <div className="ai-msg__chips">
                        {msg.chips.map(chip => (
                          <span key={chip} className="ai-chip">{chip}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="ai-chat__input">
              <span className="ai-chat__placeholder">Hỏi hoặc yêu cầu bất cứ điều gì...</span>
              <button className="ai-chat__send" aria-label="Gửi">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                  <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="ai-agent__stats">
          {STATS.map(s => (
            <div key={s.label} className="ai-stat">
              <div className="ai-stat__value">{s.value}</div>
              <div className="ai-stat__label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
