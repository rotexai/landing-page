import { useScrollReveal } from '../hooks/useScrollReveal.js'
import './Architecture.css'

const STEPS = [
  {
    num: '1',
    emoji: '🛠️',
    title: 'Bộ phận IT cài đặt hệ thống',
    body: "Một lập trình viên hoặc nhân viên IT triển khai RotexAI lên máy chủ trong vài phút. Sau khi xong, công việc kỹ thuật là hoàn tất — không cần bảo trì thêm.",
    note: 'Cài đặt một lần. Lưu trữ trên máy chủ riêng của bạn.',
  },
  {
    num: '2',
    emoji: '👥',
    title: 'Thêm thành viên vào nhóm',
    body: "Mời nhân viên qua email. Thiết lập ai được xem và làm gì — một số người quản lý kho, số khác chỉ xem tài liệu. Tất cả đều thao tác bằng chuột, không cần gõ lệnh.",
    note: 'Không cần đào tạo. Thay đổi quyền chỉ mất vài giây.',
  },
  {
    num: '3',
    emoji: '📊',
    title: 'Điều hành doanh nghiệp từ một nơi',
    body: "Cả đội nhóm làm việc trên cùng một hệ thống. Kiểm tra tồn kho, tải tài liệu lên, xem lại hoạt động — từ bất kỳ thiết bị nào, ở bất kỳ đâu.",
    note: 'Hoạt động trên máy tính, máy tính bảng và điện thoại.',
  },
]

const FAQ = [
  {
    q: 'Tôi có cần biết về công nghệ không?',
    a: 'Hoàn toàn không. Sau khi bộ phận IT cài đặt xong, mọi thao tác đều bằng chuột, dễ như dùng mạng xã hội.',
  },
  {
    q: 'Dữ liệu của tôi được lưu ở đâu?',
    a: 'Dữ liệu lưu trên máy chủ riêng của bạn — không phải trên đám mây của bất kỳ công ty nào khác. Bạn hoàn toàn làm chủ dữ liệu.',
  },
  {
    q: 'Chi phí hàng tháng là bao nhiêu?',
    a: 'RotexAI hoàn toàn miễn phí và mã nguồn mở. Không phí đăng ký, không tính theo số người dùng, không có khoản thu ẩn.',
  },
  {
    q: 'Cài đặt mất bao lâu?',
    a: 'Một lập trình viên có thể cho hệ thống hoạt động trong vòng 30 phút. Phần lớn thời gian là chờ tải xuống.',
  },
]

export default function Architecture() {
  const headerRef = useScrollReveal({ stagger: 0 })
  const stepsRef  = useScrollReveal({ stagger: 110, threshold: 0.06 })
  const faqRef    = useScrollReveal({ stagger: 80,  threshold: 0.06 })

  return (
    <>
      {/* How it works */}
      <section className="hiw section" id="how-it-works">
        <div className="container">
          <div ref={headerRef} data-reveal className="hiw__header">
            <span className="section-eyebrow">Cách hoạt động</span>
            <h2 className="section-title">Hoạt động ngay trong ba bước đơn giản.</h2>
            <p className="section-sub">
              RotexAI được thiết kế để đơn giản với tất cả mọi người —
              không chỉ dành riêng cho người cài đặt.
            </p>
          </div>

          <div className="hiw__steps" ref={stepsRef}>
            {STEPS.map((s, i) => (
              <div key={s.num} className="hiw__step" data-reveal>
                <div className="hiw__step-top">
                  <div className="hiw__step-emoji" aria-hidden="true">{s.emoji}</div>
                  <div className="hiw__step-num" aria-hidden="true">{s.num}</div>
                </div>
                <h3 className="hiw__step-title">{s.title}</h3>
                <p className="hiw__step-body">{s.body}</p>
                <p className="hiw__step-note">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                    <path d="M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10z"/>
                    <path d="M12 16v-4M12 8h.01"/>
                  </svg>
                  {s.note}
                </p>
                {i < STEPS.length - 1 && (
                  <div className="hiw__connector" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* FAQ */}
      <section className="faq section" id="faq">
        <div className="container">
          <div className="faq__layout">
            <div className="faq__left" ref={useScrollReveal({ stagger: 0 })} data-reveal>
              <span className="section-eyebrow">Câu hỏi thường gặp</span>
              <h2 className="section-title">Bạn có thắc mắc?<br />Chúng tôi có câu trả lời.</h2>
              <p className="section-sub">
                Vẫn chưa chắc RotexAI có phù hợp với nhóm của bạn không?
                Dưới đây là những điều mọi người thường hay hỏi nhất.
              </p>
            </div>

            <div className="faq__items" ref={faqRef}>
              {FAQ.map((item, i) => (
                <div key={i} className="faq__item" data-reveal>
                  <h3 className="faq__q">{item.q}</h3>
                  <p className="faq__a">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
