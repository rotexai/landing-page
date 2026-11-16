import '../landing.css'
import './pricing.css'
import { PORTAL } from '../config.js'
import { HEADLINE, LIMIT_ROWS, PLANS, vnd } from '../plans.js'
import { Icon, SiteFooter, SiteHeader } from '../shared.jsx'

// rotexai.com/pricing/ (aos docs/specs/261117-landing-airtable-style.md, A12). Prices and limits: ../plans.js.

// Free starts in the portal; a paid plan opens the portal's Plans page (after sign-in), where the plan is chosen and paid.
const PLANS_PAGE = `${PORTAL}/account/plans`

// Facts from the portal's Plans page and catalog's billing rules (spec A12 lists the sources).
const FAQ = [
  {
    q: 'Đổi gói thế nào?',
    a: 'Đổi bất cứ lúc nào trong portal. Gói cao hơn bắt đầu khi hoá đơn được thanh toán. Gói trả phí thấp hơn áp dụng ngay. Về Free thì bạn giữ gói hiện tại đến cuối kỳ thanh toán.',
  },
  {
    q: 'Thanh toán bằng gì?',
    a: 'Chuyển khoản ngân hàng bằng mã VietQR, được xác nhận tự động. Bạn có thể trả một hoá đơn thành nhiều đợt.',
  },
  {
    q: 'Giới hạn tính theo dự án hay tài khoản?',
    a: 'Theo tài khoản: một gói áp dụng cho mọi dự án của bạn. Riêng quy trình, bảng dữ liệu và nút được tính trong từng dự án.',
  },
  {
    q: 'Dùng quá giới hạn thì sao?',
    a: 'Không có gì bị xoá. Bạn chỉ chưa thêm mới được cho đến khi dùng ít lại, hoặc chuyển lên gói cao hơn.',
  },
]

const Check = () => <Icon size={18}><path d="M5 12.5l4.5 4.5L19 7.5" /></Icon>

function PlanCard({ plan }) {
  const paid = plan.price > 0
  return (
    <li className={plan.popular ? 'plan plan-popular' : 'plan'}>
      <div className="plan-head">
        <h2 className="title">{plan.name}</h2>
        {plan.popular && <span className="plan-badge small">Phổ biến</span>}
      </div>
      <p className="plan-line">{plan.line}</p>
      <p className="plan-price">
        <span className="h2">{vnd(plan.price)}</span> <span className="small">/ tháng</span>
      </p>
      <a
        href={paid ? PLANS_PAGE : PORTAL}
        className={plan.popular ? 'btn btn-dark' : 'btn btn-line'}
      >
        {paid ? `Chọn ${plan.name}` : 'Bắt đầu miễn phí'}
      </a>
      <ul className="plan-limits">
        {HEADLINE.map((h) => {
          const [value, noun] = h.show(plan.limits)
          return <li key={h.key}><Check /><span><strong>{value}</strong> {noun}</span></li>
        })}
      </ul>
    </li>
  )
}

export default function Pricing() {
  return (
    <div id="top">
      <SiteHeader home="/" current="pricing" />

      <main className="wrap">
        <section className="pr-hero">
          <h1 className="display">Bảng giá</h1>
          <p className="pr-lead">Bắt đầu miễn phí. Lên gói khi bạn cần thêm dự án, thêm người hoặc thêm dữ liệu. Giá tính theo tháng, áp dụng cho mọi dự án trong tài khoản.</p>
        </section>

        <ul className="plans" aria-label="Các gói">
          {PLANS.map((p) => <PlanCard key={p.id} plan={p} />)}
        </ul>
        <p className="pr-pay small">Thanh toán bằng chuyển khoản VietQR, xác nhận tự động.</p>

        <section className="section pr-compare" aria-labelledby="so-sanh">
          <h2 className="h2" id="so-sanh">So sánh các gói</h2>
          <div className="pr-table-wrap" role="region" aria-labelledby="so-sanh" tabIndex={0}>
            <table className="pr-table">
              <thead>
                <tr>
                  <th scope="col"><span className="sr-only">Giới hạn</span></th>
                  {PLANS.map((p) => <th key={p.id} scope="col">{p.name}<span className="small">{vnd(p.price)}</span></th>)}
                </tr>
              </thead>
              <tbody>
                {LIMIT_ROWS.map((r) => (
                  <tr key={r.key}>
                    <th scope="row">{r.label}</th>
                    {PLANS.map((p) => <td key={p.id}>{r.show(p.limits)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="section pr-faq" aria-labelledby="hoi-dap">
          <h2 className="h2" id="hoi-dap">Câu hỏi thường gặp</h2>
          <div className="faq">
            {FAQ.map((f) => (
              <details key={f.q}>
                <summary className="title">{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter home="/" />
    </div>
  )
}
