import { useEffect, useState } from 'react'
import './landing.css'

// Landing page, "product video first". Spec: aos docs/specs/261107-landing-redesign.md.
const PORTAL = 'https://portal.rotexai.com'

// Brand lockup (brand/logo/lockup/rotexai-lockup.svg), inlined so the page loads its fonts once.
function Lockup() {
  return (
    <svg className="lockup" viewBox="0 0 142 40" fill="none" role="img" aria-label="RotexAI">
      <defs>
        <linearGradient id="ai" gradientUnits="userSpaceOnUse" x1="107" y1="0" x2="131" y2="0">
          <stop offset="0" stopColor="#5B43E8" />
          <stop offset="0.6" stopColor="#4CC9F0" />
          <stop offset="1" stopColor="#A390FF" />
        </linearGradient>
      </defs>
      <g transform="scale(1.5385)">
        <rect x="1" y="1" width="24" height="24" rx="6" stroke="#0E1A24" strokeWidth="1.6" />
        <circle cx="8" cy="9" r="2.4" fill="#2445E8" />
        <circle cx="18" cy="13" r="2.4" fill="#2445E8" />
        <circle cx="9" cy="18.5" r="2.4" fill="#F26A1B" />
        <path d="M10 9.6l6 2.6M16.2 14.2l-5.4 3.2" stroke="#0E1A24" strokeWidth="1.3" />
      </g>
      <text x="50" y="27" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="20" fontWeight="800" letterSpacing="-0.4" fill="#0E1A24">
        Rotex<tspan fontFamily="'JetBrains Mono', ui-monospace, monospace" letterSpacing="0.4" fill="url(#ai)">AI</tspan>
      </text>
      <circle cx="135" cy="11" r="2.5" fill="#4CC9F0" />
    </svg>
  )
}

function Icon({ d, children }) {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {d ? <path d={d} /> : children}
    </svg>
  )
}

const BENEFITS = [
  {
    title: 'Đúng tiền, đúng kho',
    line: 'Mỗi đơn đi qua từng bước bạn đọc hiểu được.',
    icon: <Icon><path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" /><path d="M9 8h6M9 12h6M9 16h3" /></Icon>,
  },
  {
    title: 'Tự sửa bằng một câu',
    line: 'Cách làm đổi thì nói một câu, xem trước rồi mới áp dụng.',
    icon: <Icon d="M4 5h16v11H9l-5 4z" />,
  },
  {
    title: 'Sai ở đâu, thấy ngay',
    line: 'Mở đơn lỗi là biết kẹt ở bước nào, vì sao.',
    icon: <Icon><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.2-4.2" /></Icon>,
  },
]

const USES = [
  { label: 'Bán hàng & hoá đơn', icon: <Icon><path d="M3 4h2l2.4 10.2a1 1 0 001 .8h8.9a1 1 0 001-.8L20 7H6.2" /><circle cx="9" cy="19.5" r="1.3" /><circle cx="17" cy="19.5" r="1.3" /></Icon> },
  { label: 'Kho & nhập hàng', icon: <Icon><path d="M3 7l9-4 9 4-9 4-9-4z" /><path d="M3 7v10l9 4 9-4V7M12 11v10" /></Icon> },
  { label: 'Duyệt chi phí', icon: <Icon><circle cx="12" cy="12" r="9" /><path d="M8 12l3 3 5-6" /></Icon> },
  { label: 'Công nợ khách hàng', icon: <Icon><path d="M3 7h15a3 3 0 013 3v7a3 3 0 01-3 3H3z" /><path d="M3 7l12-4v4M16 14h2" /></Icon> },
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

// Muted loop of the simulated portal (aos video/src/landing/Hero.tsx): 16:9 cut, or the 4:5 cut on phones.
// Reduced motion gets the poster only.
function HeroVideo() {
  const still = useMedia('(prefers-reduced-motion: reduce)')
  const tall = useMedia('(max-width: 760px)')
  const name = tall ? 'hero-tall' : 'hero'
  const [w, h] = tall ? [1080, 1350] : [1600, 900]
  const alt = 'RotexAI dựng phần mềm quản lý kho từ một câu mô tả'
  return (
    <figure className="video">
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

export default function App() {
  return (
    <div id="top">
      <header className="bar wrap">
        <a href="#top" className="brand"><Lockup /></a>
        <a href={PORTAL} className="btn btn-dark">Thử ngay</a>
      </header>

      <main>
        <section className="hero wrap">
          <h1 className="display">Kể cách quán bạn bán hàng.<br />Có ngay phần mềm quản lý.</h1>
          <p className="lead">Không cần lập trình. Bạn kể bằng lời thường ngày, RotexAI làm phần mềm đúng như vậy.</p>
          <a href={PORTAL} className="btn btn-blue btn-lg">Thử ngay</a>
          <HeroVideo />
        </section>

        <section className="band">
          <div className="wrap">
            <h2 className="h2">Phần mềm chạy đúng cách quán bạn làm.</h2>
            <ul className="tiles">
              {BENEFITS.map((b) => (
                <li key={b.title} className="tile">
                  <span className="tile-icon">{b.icon}</span>
                  <h3 className="title">{b.title}</h3>
                  <p className="body">{b.line}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="wrap uses">
          <h2 className="h2">Dùng cho cửa hàng, quán, xưởng nhỏ</h2>
          <ul className="chips">
            {USES.map((u) => (
              <li key={u.label} className="chip">
                <span className="chip-icon">{u.icon}</span>
                <span className="title">{u.label}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="wrap">
          <div className="cta">
            <h2 className="h2">Quán của bạn đang quản lý bằng gì?</h2>
            <a href={PORTAL} className="btn btn-white btn-lg">Kể cho RotexAI nghe</a>
          </div>
        </section>
      </main>

      <footer className="foot-rule">
        <div className="foot wrap">
          <span className="small">© 2026 RotexAI</span>
          <span className="foot-links">
            <a href="mailto:contact@rotexai.com" className="small">contact@rotexai.com</a>
            <a href={PORTAL} className="small">portal.rotexai.com</a>
          </span>
        </div>
      </footer>
    </div>
  )
}
