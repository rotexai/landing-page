import { useEffect, useState } from 'react'
import '../landing.css'
import './guide.css'
import { GUIDE, PORTAL } from '../config.js'
import { Icon, SiteFooter, SiteHeader } from '../shared.jsx'
import { ARTICLES, BY_SLUG, TOPICS, TOPIC_LABEL, TYPES, TYPE_LABEL, articleHref } from './articles.jsx'

// rotexai.com/docs/ "Hướng dẫn" (aos docs/specs/261117-landing-airtable-style.md, A13), laid out like a resource hub:
// featured carousel, filters by type and topic, a card grid. An article opens at /docs/?read=<slug>.
// Filters are GET parameters (?type=steps,quick&topic=team); with JS on they update the URL in place.

const TYPE_ICON = {
  steps: <><path d="M9 6h11M9 12h11M9 18h11" /><path d="M4 6h.01M4 12h.01M4 18h.01" /></>,
  quick: <><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></>,
}
const list = (v, known) => (v ?? '').split(',').filter((x) => known.some((k) => k.id === x))

function readUrl() {
  const params = new URLSearchParams(window.location.search)
  return { types: list(params.get('type'), TYPES), topics: list(params.get('topic'), TOPICS) }
}

function Crumbs({ items }) {
  return (
    <nav className="gd-crumbs small" aria-label="Vị trí">
      <ol>
        {items.map(([label, href], i) => (
          <li key={label}>{href ? <a href={href}>{label}</a> : <span aria-current="page">{label}</span>}{i < items.length - 1 && <span aria-hidden="true">›</span>}</li>
        ))}
      </ol>
    </nav>
  )
}

function Kind({ a }) {
  return <span className="gd-kind small"><Icon size={16}>{TYPE_ICON[a.type]}</Icon>{TYPE_LABEL[a.type]} · {TOPIC_LABEL[a.topic]}</span>
}

function Card({ a }) {
  return (
    <li>
      <a href={articleHref(a)} className="gd-card">
        <span className={`gd-cover tone-${a.tone}`}><Icon size={88}>{a.icon}</Icon></span>
        <span className="gd-card-body">
          <Kind a={a} />
          <span className="gd-card-title">{a.title}</span>
          <span className="gd-card-line small">{a.line}</span>
        </span>
      </a>
    </li>
  )
}

// One featured guide at a time; the arrows and the dashes move between them. Slides out of view are inert.
function Featured() {
  const items = ARTICLES.filter((a) => a.featured)
  const [i, setI] = useState(0)
  const go = (n) => setI((n + items.length) % items.length)
  return (
    <section className="gd-feat" aria-roledescription="carousel" aria-label="Bài nổi bật">
      <div className="gd-feat-view">
        <ul className="gd-feat-track" style={{ transform: `translateX(-${i * 100}%)` }}>
          {items.map((a, n) => (
            <li key={a.slug} className={`gd-slide tone-${a.tone}`} inert={n !== i} aria-roledescription="slide" aria-label={`${n + 1} / ${items.length}`}>
              <div className="gd-slide-text">
                <Kind a={a} />
                <h2 className="h2">{a.title}</h2>
                <p>{a.line}</p>
                <a href={articleHref(a)} className={a.tone === 'blue' || a.tone === 'ink' ? 'btn btn-white' : 'btn btn-dark'}>Đọc ngay</a>
              </div>
              <span className="gd-slide-art"><Icon size={160}>{a.icon}</Icon></span>
            </li>
          ))}
        </ul>
      </div>
      <div className="gd-feat-nav">
        <button type="button" className="gd-arrow" aria-label="Bài trước" onClick={() => go(i - 1)}><Icon size={20}><path d="M15 6l-6 6 6 6" /></Icon></button>
        {items.map((a, n) => (
          <button key={a.slug} type="button" className="gd-dash" aria-label={a.title} aria-current={n === i ? 'true' : undefined} onClick={() => setI(n)} />
        ))}
        <button type="button" className="gd-arrow" aria-label="Bài sau" onClick={() => go(i + 1)}><Icon size={20}><path d="M9 6l6 6-6 6" /></Icon></button>
      </div>
    </section>
  )
}

function FilterGroup({ legend, options, picked, count, onToggle }) {
  return (
    <fieldset className="gd-filter">
      <legend className="small">{legend}</legend>
      {options.map((o) => (
        <label key={o.id}>
          <input type="checkbox" name={legend} value={o.id} checked={picked.includes(o.id)} onChange={() => onToggle(o.id)} />
          <span>{o.label}</span>
          <span className="gd-count small">{count(o.id)}</span>
        </label>
      ))}
    </fieldset>
  )
}

function Hub() {
  const [state, setState] = useState(readUrl)
  const { types, topics } = state

  useEffect(() => {
    const params = new URLSearchParams()
    if (types.length) params.set('type', types.join(','))
    if (topics.length) params.set('topic', topics.join(','))
    const next = params.toString() ? `${GUIDE}?${params.toString().replaceAll('%2C', ',')}` : GUIDE
    if (next !== window.location.pathname + window.location.search) window.history.replaceState(null, '', next)
  }, [types, topics])
  useEffect(() => {
    const onPop = () => setState(readUrl())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // Within a group any ticked box matches; across groups both must match.
  const match = (a, t = types, p = topics) => (!t.length || t.includes(a.type)) && (!p.length || p.includes(a.topic))
  const shown = ARTICLES.filter((a) => match(a))
  const toggle = (key, id) => setState((s) => ({ ...s, [key]: s[key].includes(id) ? s[key].filter((x) => x !== id) : [...s[key], id] }))
  const clear = () => setState({ types: [], topics: [] })

  return (
    <>
      <div className="gd-band">
        <div className="wrap">
          <Crumbs items={[['Trang chủ', '/'], ['Hướng dẫn']]} />
          <h1 className="gd-eyebrow title">Hướng dẫn</h1>
          <p className="h2 gd-tagline">Làm chủ phần mềm của bạn, từng bước một.</p>
          <Featured />
        </div>
      </div>

      <div className="wrap gd-browse">
        <aside className="gd-filters" aria-label="Bộ lọc">
          <p className="gd-side-h">Bộ lọc</p>
          <FilterGroup legend="Theo loại" options={TYPES} picked={types} count={(id) => ARTICLES.filter((a) => match(a, [id])).length} onToggle={(id) => toggle('types', id)} />
          <FilterGroup legend="Theo chủ đề" options={TOPICS} picked={topics} count={(id) => ARTICLES.filter((a) => match(a, types, [id])).length} onToggle={(id) => toggle('topics', id)} />
          <button type="button" className="btn btn-line btn-sm gd-clear" onClick={clear} disabled={!types.length && !topics.length}>
            <span aria-hidden="true">×</span> Xoá bộ lọc
          </button>
        </aside>
        <section className="gd-results" aria-labelledby="gd-browse-h">
          <div className="gd-results-head">
            <h2 id="gd-browse-h" className="gd-side-h">Tất cả bài</h2>
            <p className="small" aria-live="polite">{shown.length} bài</p>
          </div>
          {shown.length ? (
            <ul className="gd-grid">{shown.map((a) => <Card key={a.slug} a={a} />)}</ul>
          ) : (
            <div className="gd-empty">
              <p className="title">Chưa có bài nào khớp.</p>
              <button type="button" className="btn btn-dark" onClick={clear}>Xoá bộ lọc</button>
            </div>
          )}
        </section>
      </div>
    </>
  )
}

function Article({ a }) {
  const numbered = a.type === 'steps'
  const related = [...ARTICLES.filter((x) => x !== a && x.topic === a.topic), ...ARTICLES.filter((x) => x !== a && x.topic !== a.topic)].slice(0, 3)
  useEffect(() => { document.title = `${a.title} — Hướng dẫn RotexAI` }, [a])
  return (
    <div className="wrap">
      <Crumbs items={[['Trang chủ', '/'], ['Hướng dẫn', GUIDE], [a.title]]} />
      <header className="gd-art-head">
        <Kind a={a} />
        <h1 className="display">{a.title}</h1>
        <p className="gd-lead">{a.line}</p>
      </header>

      <div className="gd-body">
        <nav className="gd-toc" aria-label="Trong bài này">
          <ol>
            {a.sections.map((s, n) => (
              <li key={s.id}><a href={`#${s.id}`}>{numbered && <span className="gd-num">{String(n + 1).padStart(2, '0')}</span>}{s.h}</a></li>
            ))}
          </ol>
        </nav>
        <ol className="gd-steps">
          {a.sections.map((s, n) => (
            <li key={s.id} id={s.id} className="gd-step">
              {numbered && <span className="gd-num" aria-hidden="true">{String(n + 1).padStart(2, '0')}</span>}
              <h2 className="title">{s.h}</h2>
              {s.body}
            </li>
          ))}
        </ol>
      </div>

      <section className="section" aria-labelledby="gd-related-h">
        <h2 className="h2" id="gd-related-h">Đọc tiếp</h2>
        <ul className="gd-grid gd-related">{related.map((r) => <Card key={r.slug} a={r} />)}</ul>
      </section>

      <section className="section">
        <div className="gd-cta">
          <h2 className="h2">Sẵn sàng thử?</h2>
          <a href={PORTAL} className="btn btn-white">Thử ngay</a>
        </div>
      </section>
    </div>
  )
}

export default function Guide() {
  // An unknown or external slug falls back to the hub.
  const slug = new URLSearchParams(window.location.search).get('read')
  const article = BY_SLUG[slug]?.sections ? BY_SLUG[slug] : null
  return (
    <div id="top">
      <SiteHeader home="/" current="docs" />
      <main>{article ? <Article a={article} /> : <Hub />}</main>
      <SiteFooter home="/" />
    </div>
  )
}
