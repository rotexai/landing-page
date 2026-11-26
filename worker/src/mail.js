// The contact email: an HTML part and a plain-text part (spec 261126-contact-page.md), laid out like the investor email
// (261118; design in artifact 9MrxPyzw7fKUwoWxoMDDSJ). Chrome in English for the same reader; the visitor's words and
// the topic label stay as typed. Email-safe HTML: nested tables, inline styles, system fonts, no images. Every value
// from the form, the browser or Cloudflare goes through escapeHtml; nothing from the form becomes a link except the
// validated email in the Reply button.
import { topicLabel } from './topics.js'

export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
}

const C = {
  outer: '#e9ecf3', card: '#ffffff', ink: '#111827', label: '#3d4656', line: '#d9dde6', tint: '#f1f4ff', accent: '#4a33d6',
  btn: '#2445e8', btnText: '#ffffff',
  ok: '#17703a', okBg: '#e6f4ea', warn: '#8a4b00', warnBg: '#fff3e0', bad: '#a4221b', badBg: '#fdeceb', info: '#3d4656', infoBg: '#f1f3f7',
}
const MARK = { ok: 'Good', warn: 'Check', bad: 'Stop', info: 'Note' }
const FONT = "-apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
const VN = 'Asia/Ho_Chi_Minh'

export const subjectOf = (form) => `Contact (${topicLabel(form.topic)}): ${form.name}${form.company ? ` (${form.company})` : ''}`
const who = (form) => (form.company ? `${form.name} from ${form.company}` : form.name)

function country(code) {
  if (!code) return ''
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) ?? code
  } catch {
    return code
  }
}
function fmt(ms, tz, withDate = true) {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false,
      ...(withDate ? { day: 'numeric', month: 'short', year: 'numeric' } : {}),
    }).format(new Date(ms))
  } catch {
    return new Date(ms).toISOString().slice(0, 16).replace('T', ' ') + ' UTC'
  }
}

/** The facts both parts show, as [label, text] pairs; empty values are left out. */
function details(form, sig) {
  const place = [sig.city, sig.region, country(sig.country)].filter(Boolean).join(', ')
  const a = sig.agent
  return {
    top: [
      ['Email', form.email],
      ['Phone', form.phone],
      ['Company', form.company],
      ['Topic', topicLabel(form.topic)],
      ['From', [sig.city, country(sig.country)].filter(Boolean).join(', ') || 'Unknown'],
      ['Sent', `${fmt(sig.now, VN)} Vietnam time (${fmt(sig.now, 'UTC', false)} UTC)`],
      ['Their time', sig.client.tz ? `${fmt(sig.now, sig.client.tz, false)} (${sig.client.tz})` : ''],
    ].filter(([, v]) => v),
    tech: [
      ['IP address', sig.ip || 'Unknown'],
      ['Network', sig.org ? `${sig.org}${sig.asn ? ` (AS${sig.asn})` : ''}` : ''],
      ['Place', place ? `${place}${sig.ipTz ? ` (${sig.ipTz})` : ''}` : ''],
      ['Browser', sig.ua ? `${a.browser} on ${a.os}, ${a.device.toLowerCase()}` : 'None sent'],
      ['Screen', sig.client.screen ? `${sig.client.screen.w} × ${sig.client.screen.h}` : ''],
      ['Languages', sig.client.langs?.join(', ') || sig.acceptLang],
      ['Came from', sig.client.arrived || 'Direct, no link'],
      ['Fill time', Number.isFinite(sig.fillSeconds) ? `${sig.fillSeconds} seconds` : ''],
      ['Mail server', `${form.email.split('@')[1]} ${sig.mx === true ? 'receives mail' : sig.mx === false ? 'has none' : 'could not be checked'}`],
      ['Today', `${sig.today} ${sig.today === 1 ? 'message' : 'messages'} from this IP`],
      ['Checked', sig.turnstileAt ? `Turnstile passed at ${sig.turnstileAt.slice(11, 19)} UTC` : 'Turnstile passed'],
      ['Raw browser', sig.ua],
    ].filter(([, v]) => v),
  }
}

export function preheader(form, verdictText) {
  const first = form.message.split('\n').find((l) => l.trim()).slice(0, 80)
  return `${verdictText}. ${first}`
}

export function mailHtml(form, sig, flagList, [level, verdictText]) {
  const { top, tech } = details(form, sig)
  const e = escapeHtml
  const row = (k, v, extra = '') =>
    `<tr><td style="padding:9px 16px 9px 0;width:118px;vertical-align:top;font-family:${FONT};font-size:15px;line-height:22px;font-weight:600;color:${C.label}">${e(k)}</td><td style="padding:9px 0;font-family:${FONT};font-size:16px;line-height:22px;color:${C.ink};word-break:break-word;${extra}">${e(v)}</td></tr>`
  const techRow = ([k, v]) =>
    k === 'Raw browser' ? row(k, v, `font-family:${MONO};font-size:13px;line-height:20px;color:${C.label}`)
      : k === 'IP address' ? row(k, v, `font-family:${MONO};font-size:15px`)
        : row(k, v)
  const flagRows = flagList.map(([l, t]) =>
    `<tr><td style="padding:6px 12px 6px 0;width:56px;vertical-align:top;font-family:${FONT};font-size:14px;line-height:22px;font-weight:700;color:${C[l]}">${MARK[l]}</td><td style="padding:6px 0;font-family:${FONT};font-size:15px;line-height:22px;color:${C.ink}">${e(t)}</td></tr>`).join('')
  const message = `<div style="padding:18px 20px;background:${C.tint};border:1px solid ${C.line};border-radius:8px;font-family:${FONT};font-size:16px;line-height:26px;color:${C.ink};white-space:pre-wrap;word-break:break-word">${e(form.message)}</div>`
  const sec = (t) => `<div style="padding-bottom:10px;font-family:${FONT};font-size:16px;line-height:22px;font-weight:700;color:${C.ink}">${t}</div>`
  const replyHref = `mailto:${encodeURIComponent(form.email).replace('%40', '@')}?subject=${encodeURIComponent('Re: ' + subjectOf(form))}`
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="color-scheme" content="light"><title>${e(subjectOf(form))}</title></head><body style="margin:0;padding:0;background:${C.outer}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${e(preheader(form, verdictText))}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.outer}">
<tr><td align="center" style="padding:28px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:${C.card};border:1px solid ${C.line};border-radius:12px">
<tr><td style="padding:18px 32px;border-bottom:1px solid ${C.line}">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
  <td style="font-family:${FONT};font-size:18px;line-height:24px;font-weight:800;color:${C.ink}">Rotex<span style="color:${C.accent}">AI</span></td>
  <td align="right" style="font-family:${FONT};font-size:14px;line-height:24px;color:${C.label}">Contact form</td>
  </tr></table></td></tr>
<tr><td style="padding:28px 32px 4px">
  <div style="font-family:${FONT};font-size:14px;line-height:20px;font-weight:600;color:${C.accent}">New message from rotexai.com: ${e(topicLabel(form.topic))}</div>
  <div style="padding-top:8px;font-family:${FONT};font-size:26px;line-height:33px;font-weight:700;color:${C.ink}">${e(who(form))} wrote in</div>
</td></tr>
<tr><td style="padding:18px 32px 4px">
  <div style="padding:16px 18px;background:${C[level + 'Bg']};border-radius:8px">
    <div style="font-family:${FONT};font-size:17px;line-height:24px;font-weight:700;color:${C[level]}">Sender check: ${e(verdictText)}</div>
    ${flagRows ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px">${flagRows}</table>` : ''}
  </div></td></tr>
<tr><td style="padding:16px 32px 4px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${C.line};border-bottom:1px solid ${C.line}">
  ${top.map(([k, v]) => row(k, v)).join('\n  ')}
  </table></td></tr>
<tr><td style="padding:24px 32px 6px">${sec('Message')}${message}</td></tr>
<tr><td style="padding:20px 32px 22px">
  <table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="background:${C.btn};border-radius:8px">
  <a href="${e(replyHref)}" style="display:inline-block;padding:13px 24px;font-family:${FONT};font-size:16px;line-height:20px;font-weight:600;color:${C.btnText};text-decoration:none">Reply to ${e(form.name)}</a>
  </td></tr></table>
  <div style="padding-top:12px;font-family:${FONT};font-size:15px;line-height:22px;color:${C.label}">Or press Reply. It goes to ${e(form.email)}.</div>
</td></tr>
<tr><td style="padding:22px 32px 8px;border-top:1px solid ${C.line}">${sec('Technical details')}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
  ${tech.map(techRow).join('\n  ')}
  </table></td></tr>
<tr><td style="padding:18px 32px 24px;border-top:1px solid ${C.line};font-family:${FONT};font-size:14px;line-height:21px;color:${C.label}">
  Sent by the contact form on rotexai.com/contact/ after a Cloudflare Turnstile check. Browser details can be faked; network and place come from Cloudflare. At most 5 messages per sender and 50 in total per day. Nothing is stored outside this email.
</td></tr>
</table></td></tr></table></body></html>`
}

export function mailText(form, sig, flagList, [, verdictText]) {
  const { top, tech } = details(form, sig)
  const pad = (rows) => rows.map(([k, v]) => `${(k + ':').padEnd(13)}${v}`)
  return [
    `${who(form)} wrote in about: ${topicLabel(form.topic)}.`,
    '',
    `SENDER CHECK: ${verdictText}`,
    ...flagList.map(([l, t]) => `  ${MARK[l].padEnd(6)} ${t}`),
    '',
    ...pad(top),
    '',
    'Message',
    '-------',
    form.message,
    '',
    `Reply to this email to answer ${form.name} at ${form.email}.`,
    '',
    'Technical details',
    '-----------------',
    ...pad(tech),
    '',
    '-- ',
    'Sent by the contact form on rotexai.com/contact/ after a Cloudflare Turnstile check.',
    'Browser details can be faked; network and place come from Cloudflare. Nothing is stored outside this email.',
  ].join('\n')
}
