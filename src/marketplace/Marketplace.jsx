import { useEffect, useMemo, useState } from 'react'
import '../landing.css'
import './marketplace.css'
import { MARKET, PORTAL, marketHref } from '../config.js'
import { TEMPLATES, TYPES, TYPE_BY_ID } from '../erp.jsx'
import { Icon, SiteFooter, SiteHeader } from '../shared.jsx'

// rotexai.com/marketplace/ (aos docs/specs/261117-landing-airtable-style.md, A11). Filters are GET parameters:
// ?area=<type id>&q=<search>. The <form> submits them with GET; with JS on, typing and the pills update the URL in place.

// Lower-case, without Vietnamese marks, so "nha hang" finds "Nhà hàng".
const fold = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase().trim()

const SEARCHABLE = TEMPLATES.map((t) => ({
  ...t,
  haystack: fold([t.name, t.line, TYPE_BY_ID[t.type].name, ...t.parts].join(' ')),
}))

function readUrl() {
  const params = new URLSearchParams(window.location.search)
  const area = params.get('area')
  return { area: TYPE_BY_ID[area] ? area : '', q: params.get('q') ?? '' }
}

export default function Marketplace() {
  const [state, setState] = useState(readUrl)
  const { area, q } = state

  // Keep the URL in step (shareable, reload-safe); Back and Forward restore the filters.
  useEffect(() => {
    const next = marketHref({ area, q: q.trim() })
    if (next !== window.location.pathname + window.location.search) window.history.replaceState(null, '', next)
  }, [area, q])
  useEffect(() => {
    const onPop = () => setState(readUrl())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const shown = useMemo(() => {
    const words = fold(q).split(/\s+/).filter(Boolean)
    return SEARCHABLE.filter((t) => (!area || t.type === area) && words.every((w) => t.haystack.includes(w)))
  }, [area, q])

  const setArea = (next) => setState((s) => ({ ...s, area: next }))

  return (
    <div id="top">
      <SiteHeader home="/" current="market" />

      <main className="wrap">
        <section className="mk-hero">
          <h1 className="h2">Mẫu phần mềm quản lý</h1>
          <p className="mk-lead">Chọn mẫu gần với cách bạn làm. RotexAI dựng phần mềm đúng như vậy, rồi bạn kể thêm để chỉnh.</p>
          <p className="mk-note small">Các mẫu dưới đây là mẫu minh hoạ.</p>
          <form className="mk-search" method="get" action={MARKET} role="search" onSubmit={(e) => e.preventDefault()}>
            <Icon size={20}><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.2-4.2" /></Icon>
            <label htmlFor="mk-q" className="sr-only">Tìm mẫu</label>
            <input
              id="mk-q" name="q" type="search" value={q} placeholder="Tìm theo ngành hoặc việc, ví dụ: chấm công"
              onChange={(e) => setState((s) => ({ ...s, q: e.target.value }))}
            />
            {area && <input type="hidden" name="area" value={area} />}
          </form>
        </section>

        <div className="pills mk-pills" role="group" aria-label="Lọc theo ngành">
          <button type="button" className="pill" aria-pressed={!area} onClick={() => setArea('')}>Tất cả</button>
          {TYPES.map((t) => (
            <button key={t.id} type="button" className="pill" aria-pressed={area === t.id} onClick={() => setArea(t.id)}>{t.name}</button>
          ))}
        </div>

        <p className="mk-count small" aria-live="polite">{shown.length} mẫu</p>

        {shown.length ? (
          <ul className="mk-grid">
            {shown.map((t) => {
              const type = TYPE_BY_ID[t.type]
              return (
                <li key={t.id}>
                  <a href={PORTAL} className="mk-card">
                    <span className={`mk-cover tone-${type.tone}`}><Icon size={96}>{type.icon}</Icon></span>
                    <span className="mk-body">
                      <span className="mk-type small">{type.name}</span>
                      <span className="title">{t.name}</span>
                      <span className="mk-line">{t.line}</span>
                      <span className="mk-parts">
                        {t.parts.map((p) => <span key={p} className="mk-part small">{p}</span>)}
                      </span>
                      <span className="mk-go">Làm phần mềm như vậy <span aria-hidden="true">→</span></span>
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="mk-empty">
            <p className="title">Chưa có mẫu nào khớp.</p>
            <p className="mk-line">Không sao, cứ kể cách bạn làm, RotexAI dựng từ đầu.</p>
            <div className="actions">
              <a href={PORTAL} className="btn btn-dark">Kể cho RotexAI nghe</a>
              <button type="button" className="btn btn-line" onClick={() => setState({ area: '', q: '' })}>Xem tất cả mẫu</button>
            </div>
          </div>
        )}
      </main>

      <SiteFooter home="/" />
    </div>
  )
}
