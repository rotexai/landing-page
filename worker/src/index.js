// Contact form Worker (spec docs/specs/261126-contact-page.md in the aos workspace), copied from the investor page's
// Worker (261118) and changed only for this form's fields. The form on rotexai.com/contact/ posts here; a request that
// passes every check sends one email to MAIL_TO. Checks run cheapest first, so floods are turned away before anything
// costs a KV write or an SMTP connection.
import { WorkerMailer } from 'worker-mailer'
import { collect, flags, mailDomainOk, verdict } from './sender.js'
import { mailHtml, mailText, subjectOf } from './mail.js'
import { topicLabel } from './topics.js'

// Vietnamese text takes 1-3 bytes a character, so a 3,000-character message needs more room than the investor form.
const MAX_BODY = 16 * 1024
const MAX = { name: 120, email: 254, phone: 32, company: 160, message: 3000 }
const MIN_FILL_MS = 3000
const PER_IP_DAY = 5
const GLOBAL_DAY = 50
const DAY_S = 24 * 60 * 60

/** Removes CR, LF and other control characters (header injection), trims, and caps the length. */
export function clean(value, max) {
  return String(value ?? '')
    .replace(/[\u0000-\u001f\u007f]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)
}

const EMAIL = /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[^\s@<>()",;:]{2,}$/
const PHONE = /^[0-9+().\s-]*$/

/** The form fields after validation, or the name of the first bad field. Over-long values are refused, not cut. */
export function readForm(body) {
  const raw = (k) => String(body[k] ?? '')
  for (const k of Object.keys(MAX)) if (raw(k).length > MAX[k]) return { error: k }
  const f = {
    name: clean(body.name, MAX.name),
    email: clean(body.email, MAX.email),
    phone: clean(body.phone, MAX.phone),
    company: clean(body.company, MAX.company),
    topic: topicLabel(body.topic) ? body.topic : '',
    // The message keeps its line breaks; it only goes in the body, never in a header.
    message: raw('message').replace(/\r\n?/g, '\n').replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, '').trim(),
  }
  if (!f.name) return { error: 'name' }
  if (!EMAIL.test(f.email)) return { error: 'email' }
  const digits = f.phone.replace(/\D/g, '').length
  if (f.phone && (!PHONE.test(f.phone) || digits < 8 || digits > 15)) return { error: 'phone' }
  if (!f.topic) return { error: 'topic' }
  if (!f.message) return { error: 'message' }
  return { form: f }
}

function cors(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
}

function reply(status, body, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...(origin ? cors(origin) : {}) },
  })
}

/** The siteverify result when the token is valid for our hostname, otherwise null. */
async function turnstileOk(env, token, ip) {
  if (!token) return null
  const data = new FormData()
  data.append('secret', env.TURNSTILE_SECRET)
  data.append('response', String(token))
  if (ip) data.append('remoteip', ip)
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: data })
  if (!res.ok) return null
  const out = await res.json()
  const host = env.TURNSTILE_HOSTNAME ?? 'rotexai.com'
  return out.success === true && out.hostname === host ? out : null
}

/** Adds one to a daily counter; returns the count before the increment. KV is eventually consistent, so the caps
 *  are approximate under a burst; the per-IP rate limit in front of them is the hard limit. */
async function bump(kv, key) {
  const n = Number((await kv.get(key)) ?? 0)
  await kv.put(key, String(n + 1), { expirationTtl: 2 * DAY_S })
  return n
}

export async function sendMail(env, form, sig) {
  if (!env.MAIL_TO || !env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) throw new Error('mail settings missing')
  const port = Number(env.SMTP_PORT ?? 465)
  const list = flags(form, sig)
  const verdictOf = verdict(list)
  await WorkerMailer.send(
    {
      host: env.SMTP_HOST,
      port,
      secure: port === 465,
      startTls: port !== 465,
      credentials: { username: env.SMTP_USER, password: env.SMTP_PASS },
      authType: ['plain', 'login'],
    },
    {
      from: { name: 'RotexAI contact form', email: env.MAIL_FROM ?? env.SMTP_USER },
      to: { email: env.MAIL_TO },
      reply: { name: form.name, email: form.email },
      subject: subjectOf(form),
      text: mailText(form, sig, list, verdictOf),
      html: mailHtml(form, sig, list, verdictOf),
    },
  )
}

/** The request handler. `deps` lets tests replace the mailer, the clock and the DNS check. */
export async function handle(request, env, deps = {}) {
  const send = deps.send ?? sendMail
  const now = deps.now ?? (() => Date.now())
  const allowed = String(env.ALLOWED_ORIGINS ?? 'https://rotexai.com').split(',').map((s) => s.trim())
  const origin = request.headers.get('Origin') ?? ''
  const ok = allowed.includes(origin) ? origin : ''

  if (request.method === 'OPTIONS') return new Response(null, { status: ok ? 204 : 403, headers: ok ? cors(ok) : {} })
  if (request.method !== 'POST') return reply(405, { error: 'method' }, ok)
  if (!ok) return reply(403, { error: 'origin' }, '')

  const size = Number(request.headers.get('Content-Length') ?? 0)
  if (size > MAX_BODY) return reply(413, { error: 'size' }, ok)
  const raw = await request.text()
  // Bytes, not characters: without a Content-Length header, 9,000 Vietnamese letters would pass a character count.
  if (new TextEncoder().encode(raw).length > MAX_BODY) return reply(413, { error: 'size' }, ok)
  let body
  try {
    body = JSON.parse(raw)
  } catch {
    return reply(400, { error: 'json' }, ok)
  }
  if (!body || typeof body !== 'object') return reply(400, { error: 'json' }, ok)

  // Bots: a filled decoy field or a too-fast submit looks like success and sends nothing.
  const started = Number(body.started)
  if (body.website || !Number.isFinite(started) || now() - started < MIN_FILL_MS) return reply(200, { ok: true }, ok)

  const { form, error } = readForm(body)
  if (error) return reply(400, { error }, ok)

  const ip = request.headers.get('CF-Connecting-IP') ?? ''
  if (env.LIMITER) {
    const { success } = await env.LIMITER.limit({ key: ip || 'unknown' })
    if (!success) return reply(429, { error: 'rate' }, ok)
  }

  const check = await turnstileOk(env, body.turnstile, ip)
  if (!check) return reply(403, { error: 'turnstile' }, ok)

  const day = new Date(now()).toISOString().slice(0, 10)
  const sentToday = await bump(env.COUNTS, `ip:${day}:${ip}`)
  if (sentToday >= PER_IP_DAY) return reply(429, { error: 'daily' }, ok)
  if ((await bump(env.COUNTS, `all:${day}`)) >= GLOBAL_DAY) return reply(503, { error: 'cap' }, ok)

  // Sender details are gathered only for requests that will be sent, so rejected floods cost no DNS lookup.
  const sig = collect(request, body, {
    now: now(),
    today: sentToday + 1,
    fillSeconds: Math.round((now() - started) / 1000),
    turnstileAt: typeof check.challenge_ts === 'string' ? check.challenge_ts : '',
    mx: await (deps.mailDomainOk ?? mailDomainOk)(form.email.split('@')[1]),
  })

  try {
    await send(env, form, sig)
  } catch {
    return reply(502, { error: 'mail' }, ok)
  }
  return reply(200, { ok: true }, ok)
}

export default { fetch: (request, env) => handle(request, env) }
