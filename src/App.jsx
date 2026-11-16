import { useEffect, useState } from 'react'
import './landing.css'
import { PORTAL, MARKET, marketHref } from './config.js'
import { GROUPS, TYPES } from './erp.jsx'
import { Icon, Mark, Popover, SiteFooter, SiteHeader, TypeMenu } from './shared.jsx'

// Landing page. Specs: aos docs/specs/261107-landing-redesign.md, restyled by 261117-landing-airtable-style.md.

const BENEFITS = [
  {
    id: 'loi-ich-1',
    tone: 'blue',
    title: 'Đúng tiền, đúng kho',
    line: 'Mỗi đơn đi qua từng bước bạn đọc hiểu được.',
    icon: <><path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" /><path d="M9 8h6M9 12h6M9 16h3" /></>,
  },
  {
    id: 'loi-ich-2',
    tone: 'cyan',
    title: 'Tự sửa bằng một câu',
    line: 'Cách làm đổi thì nói một câu, xem trước rồi mới áp dụng.',
    icon: <path d="M4 5h16v11H9l-5 4z" />,
  },
  {
    id: 'loi-ich-3',
    tone: 'orange',
    title: 'Sai ở đâu, thấy ngay',
    line: 'Mở đơn lỗi là biết kẹt ở bước nào, vì sao.',
    icon: <><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.2-4.2" /></>,
  },
]

// "Thêm +" at the end of the filter row (spec A6): every ERP type as a link into the marketplace page.
function MoreMenu() {
  return (
    <Popover id="more-menu" buttonClass="pill" panelClass="types-menu" align="right" label={<>Thêm <span aria-hidden="true">+</span></>}>
      <TypeMenu />
    </Popover>
  )
}

function Templates() {
  const [filter, setFilter] = useState('featured')
  const shown = TYPES.filter((t) => (filter === 'featured' ? t.featured : t.group === filter))
  return (
    <section id="nganh-nghe" className="section wrap">
      <div className="tpl-head">
        <h2 className="h2">Bắt đầu từ ngành của bạn</h2>
        <div className="filter-row">
          <div className="pills" role="group" aria-label="Lọc theo nhóm ngành">
            {GROUPS.map((f) => (
              <button key={f.id} type="button" className="pill" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>{f.label}</button>
            ))}
          </div>
          <MoreMenu />
        </div>
      </div>
      <ul className="tpl-grid">
        {shown.map((t) => (
          <li key={t.id}>
            <a href={marketHref({ area: t.id })} className={`tpl tone-${t.tone}`}>
              <span className="tpl-name">{t.name}</span>
              <span className="tpl-art"><Icon size={128}>{t.icon}</Icon></span>
            </a>
          </li>
        ))}
      </ul>
      <div className="tpl-more">
        <a href={MARKET} className="btn btn-line">Xem tất cả</a>
      </div>
    </section>
  )
}

// What shops manage with today: the closing card's answer to its own question (spec A7).
const TOOLS = [
  { label: 'Sổ tay', icon: <><path d="M6 3h12a1 1 0 011 1v16a1 1 0 01-1 1H6z" /><path d="M9 3v18M12 8h4M12 12h4" /></> },
  { label: 'Excel', icon: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 10h18M3 15h18M9 4v16" /></> },
  { label: 'Tin nhắn', icon: <path d="M4 5h16v11H9l-5 4z" /> },
]

function useMedia(query) {
  const [match, setMatch] = useState(() => typeof window !== 'undefined' && !!window.matchMedia?.(query).matches)
  useEffect(() => {
    const mq = window.matchMedia?.(query)
    if (!mq) return
    const sync = () => setMatch(mq.matches)
    sync()
    mq.addEventListener?.('change', sync)
    return () => mq.removeEventListener?.('change', sync)
  }, [query])
  return match
}

// Which benefit card is in the middle band of the viewport (drives the numbered list, spec A5).
function useActiveCard(ids) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -45% 0px' },
    )
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [ids])
  return active
}

// Muted loop of the simulated portal (aos video/src/landing/Hero.tsx): 16:9 cut, or the 4:5 cut on phones.
// Reduced motion gets the poster only.
function HeroVideo() {
  const still = useMedia('(prefers-reduced-motion: reduce)')
  const tall = useMedia('(max-width: 760px)')
  const name = tall ? 'hero-tall' : 'hero'
  const [w, h] = tall ? [1080, 1350] : [1600, 900]
  const alt = 'RotexAI dựng phần mềm quản lý kho từ một câu mô tả'
  return (
    <figure id="cach-lam" className="video">
      <div className={tall ? 'video-frame tall' : 'video-frame'}>
        {still ? (
          <img src={`/hero/${name}-poster.jpg`} width={w} height={h} alt={alt} />
        ) : (
          <video key={name} autoPlay muted loop playsInline preload="auto" poster={`/hero/${name}-poster.jpg`} width={w} height={h} aria-label={alt}>
            <source src={`/hero/${name}.webm`} type="video/webm" />
            <source src={`/hero/${name}.mp4`} type="video/mp4" />
          </video>
        )}
      </div>
      <figcaption>Mô phỏng giao diện</figcaption>
    </figure>
  )
}

const BENEFIT_IDS = BENEFITS.map((b) => b.id)

function Benefits() {
  const active = useActiveCard(BENEFIT_IDS)
  return (
    <section id="loi-ich" className="section wrap">
      <h2 className="h2">Phần mềm chạy đúng cách quán bạn làm.</h2>
      <div className="steps">
        <nav className="step-list" aria-label="Lợi ích">
          <ol>
            {BENEFITS.map((b, i) => (
              <li key={b.id}>
                <a href={`#${b.id}`} className="step-link" aria-current={active === b.id ? 'true' : undefined}>
                  <span className="step-num">{String(i + 1).padStart(2, '0')}</span> {b.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <ul className="cards">
          {BENEFITS.map((b) => (
            <li key={b.id} id={b.id} className={`card tone-${b.tone}`}>
              <div className="card-text">
                <h3 className="title">{b.title}</h3>
                <p className="card-line">{b.line}</p>
              </div>
              <span className="card-art"><Icon size={120}>{b.icon}</Icon></span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default function App() {
  return (
    <div id="top">
      <SiteHeader />

      <main>
        <section className="hero wrap">
          <h1 className="display">Kể cách quán bạn bán hàng.<br />Có ngay phần mềm quản lý.</h1>
          <p className="lead">Không cần lập trình. Bạn kể bằng lời thường ngày, RotexAI làm phần mềm đúng như vậy.</p>
          <div className="actions">
            <a href={PORTAL} className="btn btn-dark">Thử ngay</a>
            <a href="#loi-ich" className="btn btn-line">Xem cách làm</a>
          </div>
          <HeroVideo />
        </section>

        <Benefits />

        <Templates />

        <section className="section wrap">
          <div className="cta">
            <div className="cta-text">
              <h2 className="h2">Quán của bạn đang quản lý bằng gì?</h2>
              <a href={PORTAL} className="btn btn-white">Kể cho RotexAI nghe</a>
            </div>
            <div className="cta-art">
              <ul className="cta-tools">
                {TOOLS.map((t) => (
                  <li key={t.label} className="cta-tool"><Icon size={22}>{t.icon}</Icon>{t.label}</li>
                ))}
              </ul>
              <svg className="cta-join" viewBox="0 0 88 188" fill="none" aria-hidden="true">
                <path d="M0 26C44 26 44 94 88 94M0 94h88M0 162C44 162 44 94 88 94" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 5" />
              </svg>
              <span className="cta-mark"><Mark /></span>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
