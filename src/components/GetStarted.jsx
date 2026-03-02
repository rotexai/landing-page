import { useScrollReveal } from '../hooks/useScrollReveal.js'
import './GetStarted.css'

export default function GetStarted() {
  const sectionRef = useScrollReveal({ stagger: 100, threshold: 0.08 })

  return (
    <section className="gs section" id="get-started">
      <div className="container">
        <div className="gs__inner" ref={sectionRef}>
          {/* Main CTA card */}
          <div className="gs__card" data-reveal>
            <div className="gs__card-bg" aria-hidden="true" />

            <div className="gs__card-content">
              <span className="section-eyebrow">Liên hệ tư vấn</span>
              <h2 className="gs__title">
                Sẵn sàng nâng cấp<br />
                cách vận hành doanh nghiệp?
              </h2>
              <p className="gs__sub">
                Đội ngũ của chúng tôi sẽ tư vấn giải pháp phù hợp với quy mô
                và đặc thù của doanh nghiệp bạn, sau đó hỗ trợ triển khai
                từ đầu đến cuối.
              </p>

              <div className="gs__actions">
                <a href="mailto:contact@rotexai.com" className="btn btn--primary">
                  Đặt lịch demo miễn phí
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
                <a href="mailto:contact@rotexai.com" className="btn btn--outline">
                  Gửi yêu cầu tư vấn
                </a>
              </div>

              <p className="gs__note">
                Phản hồi trong vòng 1 ngày làm việc · Không ràng buộc hợp đồng ngay
              </p>
            </div>

            <div className="gs__card-visual" aria-hidden="true">
              <div className="gs__vis-grid">
                {[
                  { icon: '📦', label: 'Kho hàng',         val: 'Theo dõi tức thời'  },
                  { icon: '📁', label: 'Tài liệu',          val: 'Lưu trữ tập trung'  },
                  { icon: '🤖', label: 'Rox AI',             val: 'Hỗ trợ 24/7'        },
                  { icon: '👥', label: 'Nhóm',              val: 'Phân quyền linh hoạt' },
                  { icon: '🔒', label: 'Bảo mật',           val: 'Máy chủ riêng'      },
                  { icon: '📊', label: 'Báo cáo',           val: 'Tự động hoá'         },
                ].map(item => (
                  <div key={item.label} className="gs__vis-item">
                    <span className="gs__vis-icon">{item.icon}</span>
                    <span className="gs__vis-label">{item.label}</span>
                    <span className="gs__vis-val">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Enterprise badges */}
          <div className="gs__for-devs" data-reveal>
            <div className="gs__devs-label">Cam kết doanh nghiệp</div>
            <div className="gs__devs-chips">
              {[
                { icon: '🛡️', text: 'Bảo mật dữ liệu'       },
                { icon: '🔧', text: 'Tuỳ chỉnh theo yêu cầu' },
                { icon: '🚀', text: 'Triển khai nhanh'        },
                { icon: '📞', text: 'Hỗ trợ kỹ thuật'        },
                { icon: '📈', text: 'Mở rộng dễ dàng'        },
              ].map(c => (
                <span key={c.text} className="gs__chip">
                  <span aria-hidden="true">{c.icon}</span>
                  {c.text}
                </span>
              ))}
            </div>
            <a href="mailto:contact@rotexai.com" className="gs__devs-link">
              Liên hệ ngay: contact@rotexai.com →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
