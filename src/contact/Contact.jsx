import { useEffect, useRef, useState } from 'react'
import '../landing.css'
import './contact.css'
import { CONTACT_EMAIL, CONTACT_URL, GUIDE, PORTAL, PRICING, TURNSTILE_SITE_KEY } from '../config.js'
import { Icon, SiteFooter, SiteHeader } from '../shared.jsx'
import { TOPICS as TOPIC_IDS } from '../../worker/src/topics.js'

// rotexai.com/contact/ (aos docs/specs/261126-contact-page.md; design: claude.ai/artifact/HBJqGQqV1Y5FxeeWgBYjmR).
// The form posts to the rotexai-contact Worker (worker/), built like the investor page's form (spec 261118).

// What each topic asks for (C3). Ids and labels come from the Worker's list, so the email names the same topic.
const TOPIC_COPY = {
  build: {
    hint: 'Kể quán bạn bán gì, ai ghi đơn, cuối ngày bạn muốn xem gì.',
    example: 'Ví dụ: Quán mình có hai chi nhánh. Thu ngân ghi đơn trên điện thoại, tối mình muốn xem doanh thu từng nơi.',
  },
  billing: {
    hint: 'Ghi email tài khoản và mã hoá đơn, nếu có.',
    example: 'Ví dụ: Mình đã chuyển khoản cho hoá đơn tháng này nhưng gói chưa lên Plus.',
  },
  bug: {
    hint: 'Ghi tên dự án, bạn bấm gì và thấy gì.',
    example: 'Ví dụ: Dự án Quán Mộc, bấm Lưu đơn thì báo lỗi, đơn không vào bảng Đơn hàng.',
  },
  partner: {
    hint: 'Kể bạn là ai và muốn cùng làm gì.',
    example: 'Ví dụ: Bên mình làm kế toán cho nhiều quán, muốn giới thiệu RotexAI cho khách.',
  },
  other: { hint: 'Viết điều bạn muốn hỏi.', example: 'Viết điều bạn muốn hỏi.' },
}
const TOPICS = TOPIC_IDS.map((t) => ({ ...t, ...TOPIC_COPY[t.id] }))

const MAX = { name: 120, email: 254, phone: 32, company: 160, message: 3000 }
const EMPTY = { name: '', email: '', phone: '', company: '', message: '' }
const EMAIL = /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[^\s@<>()",;:]{2,}$/

/** Field messages (C4), in the order focus visits them. The same rules as the Worker's readForm. */
function check(v) {
  const out = {}
  if (!v.name.trim()) out.name = 'Nhập họ tên của bạn.'
  if (!v.email.trim()) out.email = 'Nhập email để chúng tôi trả lời.'
  else if (!EMAIL.test(v.email.trim())) out.email = 'Email chưa đúng. Ví dụ: ten@quancuaban.vn'
  const digits = v.phone.replace(/\D/g, '').length
  if (v.phone.trim() && (!/^[0-9+().\s-]*$/.test(v.phone) || digits < 8 || digits > 15)) out.phone = 'Số điện thoại chưa đúng. Ví dụ: 0912 345 678'
  if (!v.message.trim()) out.message = 'Viết vài dòng để chúng tôi hiểu bạn cần gì.'
  return out
}
const ORDER = ['name', 'email', 'phone', 'company', 'message']
const fieldOf = (key) => document.getElementById(`ct-${key}`)
/** What to say when the Worker refuses a field the page let through (400 with the field's name). */
const REFUSED = {
  name: 'Kiểm tra lại họ tên.',
  email: 'Email chưa đúng. Ví dụ: ten@quancuaban.vn',
  phone: 'Số điện thoại chưa đúng. Ví dụ: 0912 345 678',
  company: 'Tên quán hoặc công ty dài quá.',
  message: 'Lời nhắn dài quá, bạn rút gọn giúp nhé.',
}

// `?topic=<id>` preselects a topic (C3); anything else keeps the first.
function topicFromUrl() {
  if (typeof window === 'undefined') return TOPICS[0].id
  const id = new URLSearchParams(window.location.search).get('topic')
  return TOPICS.some((t) => t.id === id) ? id : TOPICS[0].id
}

// Turnstile, as on the investor page: the script loads once, the widget asks for a check only when Cloudflare needs one.
let turnstileScript = null
function loadTurnstile() {
  turnstileScript ??= new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    s.async = true
    s.onload = () => resolve(window.turnstile)
    s.onerror = reject
    document.head.appendChild(s)
  })
  return turnstileScript
}

const LIVE = Boolean(CONTACT_URL && TURNSTILE_SITE_KEY)

/** The Turnstile token, waiting up to `ms` for the check to finish: a fast visitor can press Send before it does. */
async function tokenOf(ref, ms = 5000) {
  for (let waited = 0; !ref.current && waited < ms; waited += 100) await new Promise((r) => setTimeout(r, 100))
  return ref.current
}

// The page that linked here, read once at load.
const ARRIVED = typeof document === 'undefined' ? '' : document.referrer

/** Browser details for the sender check in the email (spec R17). Each read may fail; skip it then. */
function clientInfo() {
  const out = {}
  const tryIt = (fn) => {
    try {
      fn()
    } catch {
      /* not available in this browser */
    }
  }
  tryIt(() => (out.tz = Intl.DateTimeFormat().resolvedOptions().timeZone))
  tryIt(() => (out.offset = new Date().getTimezoneOffset()))
  tryIt(() => (out.screen = { w: window.screen.width, h: window.screen.height }))
  tryIt(() => (out.langs = [...navigator.languages].slice(0, 5)))
  if (ARRIVED) out.arrived = ARRIVED
  return out
}

/** Copies text; when the clipboard is refused, selects `el`'s text instead so the visitor can copy it (R8). */
async function copyText(text, el) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    if (el?.select) el.select()
    else if (el) {
      const range = document.createRange()
      range.selectNodeContents(el)
      const sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(range)
    }
    return false
  }
}

const CheckIcon = ({ size = 18 }) => <Icon size={size}><path d="M5 12.5l4.5 4.5L19 7.5" /></Icon>
const CopyIcon = () => <Icon size={18}><path d="M9 9h10v11H9zM5 15V4h10" /></Icon>
const AlertIcon = () => <Icon size={18}><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5.5M12 16.5v.01" /></Icon>

/** "Chép" / "Đã chép" for a moment after a copy. */
function useCopied() {
  const [copied, setCopied] = useState('')
  const timer = useRef(0)
  useEffect(() => () => clearTimeout(timer.current), [])
  const mark = (key) => {
    setCopied(key)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(''), 2000)
  }
  return [copied, mark]
}

function Field({ id, label, optional, error, children }) {
  return (
    <div className="ct-field">
      <label htmlFor={id}>
        {label}
        {optional && <span className="ct-opt"> (không bắt buộc)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="ct-error">
          <AlertIcon />
          {error}
        </p>
      )}
    </div>
  )
}

function ContactForm() {
  const [topic, setTopic] = useState(topicFromUrl)
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | failed | unavailable (C5)
  const [copied, markCopied] = useCopied()
  const started = useRef(0)
  const decoy = useRef(null)
  const box = useRef(null)
  const widget = useRef(null)
  const token = useRef('')
  const sentHeading = useRef(null)
  const current = TOPICS.find((t) => t.id === topic)
  const sent = status === 'sent'

  // Render time, for the Worker's too-fast-to-be-human check.
  useEffect(() => {
    started.current = Date.now()
  }, [])

  useEffect(() => {
    if (!LIVE || sent) return
    let gone = false
    loadTurnstile()
      .then((ts) => {
        if (gone || !box.current || !ts) return
        widget.current = ts.render(box.current, {
          sitekey: TURNSTILE_SITE_KEY,
          appearance: 'interaction-only',
          language: 'vi',
          callback: (v) => (token.current = v),
          'expired-callback': () => (token.current = ''),
          'error-callback': () => (token.current = ''),
        })
      })
      .catch(() => {})
    return () => {
      gone = true
      if (widget.current != null) window.turnstile?.remove(widget.current)
      widget.current = null
      token.current = ''
    }
  }, [sent])

  useEffect(() => {
    if (sent) sentHeading.current?.focus()
  }, [sent])

  const set = (key) => (e) => {
    const value = e.target.value
    setValues((v) => ({ ...v, [key]: value }))
    if (errors[key]) setErrors((x) => ({ ...x, [key]: undefined }))
  }

  const describedBy = (key, extra) => [extra, errors[key] ? `ct-${key}-error` : null].filter(Boolean).join(' ') || undefined
  const inputProps = (key) => ({
    id: `ct-${key}`,
    name: key,
    value: values[key],
    onChange: set(key),
    maxLength: MAX[key],
    'aria-invalid': errors[key] ? 'true' : undefined,
    'aria-describedby': describedBy(key),
  })

  async function submit(e) {
    e.preventDefault()
    if (status === 'sending') return
    const found = check(values)
    setErrors(found)
    const first = ORDER.find((k) => found[k])
    if (first) {
      fieldOf(first)?.focus()
      return
    }
    if (!LIVE) {
      setStatus('unavailable')
      return
    }
    setStatus('sending')
    const body = {
      ...values,
      topic,
      website: decoy.current?.value ?? '',
      started: started.current,
      turnstile: await tokenOf(token),
      client: clientInfo(),
    }
    try {
      const res = await fetch(CONTACT_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (res.ok) {
        setStatus('sent')
        return
      }
      // A token is good for one check: drop it and ask Turnstile for a new one before a retry.
      token.current = ''
      if (widget.current != null) window.turnstile?.reset(widget.current)
      // A field the Worker refused: show it on that field, like the page's own check.
      if (res.status === 400) {
        const { error } = await res.json().catch(() => ({}))
        if (REFUSED[error]) {
          setErrors({ [error]: REFUSED[error] })
          setStatus('idle')
          fieldOf(error)?.focus()
          return
        }
      }
      // 429 rate limit, 502 mail failure, 503 daily cap: point to the address instead of asking to retry.
      setStatus([429, 502, 503].includes(res.status) ? 'unavailable' : 'failed')
    } catch {
      token.current = ''
      if (widget.current != null) window.turnstile?.reset(widget.current)
      setStatus('failed')
    }
  }

  function again() {
    setValues(EMPTY)
    setErrors({})
    setStatus('idle')
    started.current = Date.now()
  }

  async function copyMessage() {
    await copyText(values.message, fieldOf('message'))
    markCopied('message')
  }

  if (sent) {
    return (
      <div className="ct-sent" role="status">
        <span className="ct-tick"><CheckIcon size={30} /></span>
        <h2 className="h2" tabIndex={-1} ref={sentHeading}>Đã gửi. Cảm ơn bạn.</h2>
        <p className="ct-muted">Chúng tôi sẽ trả lời qua email bạn vừa nhập trong 1 ngày làm việc. Nếu chưa thấy thư, bạn xem thêm trong mục Thư rác.</p>
        <dl className="ct-summary small">
          <dt>Chủ đề</dt>
          <dd>{current.label}</dd>
        </dl>
        <div className="ct-actions">
          <a href={PORTAL} className="btn btn-dark">Thử ngay trên portal</a>
          <button type="button" className="btn btn-line" onClick={again}>Gửi tin khác</button>
        </div>
      </div>
    )
  }

  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(current.label)}&body=${encodeURIComponent(values.message.slice(0, 1500))}`
  const down = status === 'failed' || status === 'unavailable'

  return (
    <form className="ct-form" onSubmit={submit} noValidate>
      <fieldset className="ct-topics">
        <legend className="title">Bạn cần gì?</legend>
        <div className="ct-pills">
          {TOPICS.map((t) => (
            <button key={t.id} type="button" className="pill" aria-pressed={t.id === topic} onClick={() => setTopic(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
        <p id="ct-topic-hint" className="small">{current.hint}</p>
      </fieldset>

      <div className="ct-fields">
        <Field id="ct-name" label="Họ tên" error={errors.name}>
          <input type="text" autoComplete="name" placeholder="Nguyễn Văn Bình" {...inputProps('name')} />
        </Field>
        <Field id="ct-email" label="Email" error={errors.email}>
          <input type="email" autoComplete="email" inputMode="email" placeholder="ten@quancuaban.vn" {...inputProps('email')} />
        </Field>
        <Field id="ct-phone" label="Số điện thoại" optional error={errors.phone}>
          <input type="tel" autoComplete="tel" inputMode="tel" placeholder="09xx xxx xxx" {...inputProps('phone')} />
        </Field>
        <Field id="ct-company" label="Tên quán hoặc công ty" optional error={errors.company}>
          <input type="text" autoComplete="organization" placeholder="Quán Mộc" {...inputProps('company')} />
        </Field>
      </div>

      <Field id="ct-message" label="Lời nhắn" error={errors.message}>
        <textarea rows={6} placeholder={current.example} {...inputProps('message')} aria-describedby={describedBy('message', 'ct-topic-hint')} />
      </Field>

      {/* Decoy for bots; people never see or fill it. */}
      <label className="ct-hp" aria-hidden="true">
        Website
        <input ref={decoy} name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <div ref={box} className="ct-turnstile" />

      {down && (
        <div className="ct-banner" role="alert">
          <Icon size={22}><path d="M12 4l9 16H3z" /><path d="M12 10v4.5M12 17.5v.01" /></Icon>
          <div>
            <strong>Chưa gửi được tin nhắn.</strong>
            {status === 'failed' ? (
              <span> Lời nhắn của bạn vẫn ở đây. Bấm Gửi lại, hoặc gửi thẳng tới <a href={mailto}>{CONTACT_EMAIL}</a>.</span>
            ) : (
              <span> Lời nhắn của bạn vẫn ở đây; bạn gửi thẳng tới <a href={mailto}>{CONTACT_EMAIL}</a> nhé.</span>
            )}
          </div>
        </div>
      )}

      <div className="ct-submit">
        <p className="small">Để chặn thư rác, chúng tôi lưu địa chỉ IP, trình duyệt và thiết bị của bạn cùng tin nhắn.</p>
        <div className="ct-actions">
          <button type="submit" className="btn btn-dark" disabled={status === 'sending'} aria-busy={status === 'sending' || undefined}>
            {status === 'sending' ? 'Đang gửi…' : status === 'failed' ? 'Gửi lại' : 'Gửi tin nhắn'}
            {status === 'idle' && <Icon size={20}><path d="M4 12h15M13 6l6 6-6 6" /></Icon>}
          </button>
          {down ? (
            <button type="button" className="btn btn-line" onClick={copyMessage} disabled={!values.message}>
              {copied === 'message' ? 'Đã chép' : 'Chép lời nhắn'}
            </button>
          ) : (
            <span className="small">Hoặc viết thẳng tới <a href={`mailto:${CONTACT_EMAIL}`} className="ct-link">{CONTACT_EMAIL}</a></span>
          )}
        </div>
      </div>
    </form>
  )
}

function EmailCard() {
  const [copied, markCopied] = useCopied()
  const address = useRef(null)
  return (
    <div className="ct-card ct-mail">
      <span className="small ct-label">Email</span>
      <div className="ct-mail-row">
        <a ref={address} href={`mailto:${CONTACT_EMAIL}`} className="ct-address">{CONTACT_EMAIL}</a>
        <button type="button" className="ct-copy" onClick={async () => { await copyText(CONTACT_EMAIL, address.current); markCopied('email') }}>
          {copied === 'email' ? <><CheckIcon /> Đã chép</> : <><CopyIcon /> Chép</>}
        </button>
        <span className="ct-sr" aria-live="polite">{copied === 'email' ? 'Đã chép địa chỉ email' : ''}</span>
      </div>
    </div>
  )
}

export default function Contact() {
  return (
    <div id="top">
      <SiteHeader home="/" current="contact" />
      <main className="wrap">
        <section className="ct-hero">
          <p className="small ct-eyebrow">Liên hệ</p>
          <h1 className="display">Bạn cần gì, cứ kể cho chúng tôi.</h1>
          <p className="ct-muted ct-lead">Hỏi về phần mềm cho quán, gói và thanh toán, hay một lỗi bạn gặp. Viết như nhắn cho người quen; chúng tôi đọc từng tin và trả lời qua email trong 1 ngày làm việc.</p>
        </section>

        <div className="ct-grid">
          <section className="ct-form-card" aria-label="Gửi tin nhắn">
            <ContactForm />
          </section>

          <aside className="ct-side" aria-label="Cách khác">
            <div className="ct-card tone-cyan">
              <h2 className="title">Muốn thử ngay?</h2>
              <p>Không cần hẹn ai. Kể cho Rox một câu trên portal; gói Free dùng được 3 dự án.</p>
              <a href={PORTAL} className="btn btn-dark">Thử ngay</a>
            </div>
            <div className="ct-card tone-sand">
              <h2 className="title">Tự tìm câu trả lời</h2>
              <p>Tám hướng dẫn ngắn: bắt đầu, mời nhóm và phân quyền, gói và thanh toán, kết nối coding agent.</p>
              <div className="ct-actions">
                <a href={GUIDE} className="btn btn-line">Xem hướng dẫn</a>
                <a href={PRICING} className="ct-link">Xem bảng giá</a>
              </div>
            </div>
            <EmailCard />
          </aside>
        </div>
      </main>
      <SiteFooter home="/" />
    </div>
  )
}
