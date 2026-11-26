// Sender check for the contact email (spec 261126-contact-page.md, C8), copied from the investor Worker (261118) minus
// the two investor-only rules: no "personal email address" note (most shops write from Gmail) and no firm-name match.
// Everything here is a pure function of the request, Cloudflare's request.cf and what the page sends, so it is
// unit-tested without a Worker runtime. The browser-sent values can be faked; the network, place and DNS checks
// come from Cloudflare instead.

const AUTOMATED = /headless|playwright|puppeteer|phantomjs|selenium|webdriver|curl|wget|python|go-http|node-fetch|axios|okhttp|java\/|libwww|httpclient|scrapy/i
const HOSTING = /digitalocean|amazon|aws|google cloud|google llc|microsoft|azure|ovh|hetzner|linode|akamai|vultr|choopa|m247|datacamp|contabo|leaseweb|scaleway|oracle|alibaba|tencent|hostinger|cloudflare|colocrossing|psychz|quadranet|packet host|servers\.com/i

export const DISPOSABLE = new Set([
  'mailinator.com', 'yopmail.com', 'guerrillamail.com', 'guerrillamail.net', 'sharklasers.com', 'grr.la',
  '10minutemail.com', '10minutemail.net', 'temp-mail.org', 'tempmail.com', 'tempmail.dev', 'tmpmail.org',
  'throwawaymail.com', 'trashmail.com', 'getnada.com', 'dispostable.com', 'maildrop.cc', 'mailnesia.com',
  'mintemail.com', 'fakeinbox.com', 'emailondeck.com', 'mohmal.com', 'spamgourmet.com', 'moakt.com',
])

const cap = (v, n) => String(v ?? '').replace(/[\u0000-\u001f\u007f]+/g, ' ').trim().slice(0, n)

/** Browser, system and device from a User-Agent string. Unknown parts stay "Unknown". */
export function parseAgent(ua) {
  const s = String(ua ?? '')
  const tool = s.match(/^(curl|wget|python-requests|python-urllib|go-http-client|node-fetch|axios|okhttp|scrapy|java)[/ ]?([\d.]*)/i)
  if (tool) return { browser: tool[1] + (tool[2] ? ' ' + tool[2].split('.')[0] : ''), os: 'Unknown', device: 'Script' }
  const v = (re) => (s.match(re) || [])[1]?.split('.')[0]
  let browser = 'Unknown'
  if (/HeadlessChrome\//.test(s)) browser = `HeadlessChrome ${v(/HeadlessChrome\/([\d.]+)/)}`
  else if (/Edg\//.test(s)) browser = `Edge ${v(/Edg\/([\d.]+)/)}`
  else if (/SamsungBrowser\//.test(s)) browser = `Samsung Internet ${v(/SamsungBrowser\/([\d.]+)/)}`
  else if (/OPR\//.test(s)) browser = `Opera ${v(/OPR\/([\d.]+)/)}`
  else if (/Firefox\//.test(s)) browser = `Firefox ${v(/Firefox\/([\d.]+)/)}`
  else if (/CriOS\//.test(s)) browser = `Chrome ${v(/CriOS\/([\d.]+)/)}`
  else if (/Chrome\//.test(s)) browser = `Chrome ${v(/Chrome\/([\d.]+)/)}`
  else if (/Version\/[\d.]+.*Safari\//.test(s)) browser = `Safari ${v(/Version\/([\d.]+)/)}`
  else if (AUTOMATED.test(s)) browser = cap(s.split(/[ /]/)[0], 40)

  let os = 'Unknown'
  if (/iPhone|iPad|iPod/.test(s)) os = `iOS ${(s.match(/OS (\d+)[_.]/) || [])[1] ?? ''}`.trim()
  else if (/Android/.test(s)) os = `Android ${(s.match(/Android (\d+)/) || [])[1] ?? ''}`.trim()
  else if (/Mac OS X|Macintosh/.test(s)) os = 'macOS'
  else if (/Windows/.test(s)) os = 'Windows'
  else if (/CrOS/.test(s)) os = 'ChromeOS'
  else if (/Linux|X11/.test(s)) os = 'Linux'

  const device = /iPad|Tablet/.test(s) || (/Android/.test(s) && !/Mobile/.test(s)) ? 'Tablet' : /Mobi|iPhone|iPod/.test(s) ? 'Phone' : 'Computer'
  return { browser, os, device }
}

/** What the page sends about the browser, checked and capped. Invalid values are dropped, never guessed. */
export function readClient(raw) {
  const c = raw && typeof raw === 'object' ? raw : {}
  const out = {}
  if (typeof c.tz === 'string' && c.tz.length <= 64 && /^[A-Za-z_]+(\/[A-Za-z0-9_+-]+){0,2}$/.test(c.tz)) out.tz = c.tz
  if (Number.isInteger(c.offset) && Math.abs(c.offset) <= 840) out.offset = c.offset
  const w = c.screen?.w, h = c.screen?.h
  if (Number.isInteger(w) && Number.isInteger(h) && w > 0 && h > 0 && w <= 10000 && h <= 10000) out.screen = { w, h }
  if (Array.isArray(c.langs)) {
    const langs = c.langs.filter((l) => typeof l === 'string' && /^[A-Za-z]{2,8}(-[A-Za-z0-9]{1,8}){0,3}$/.test(l)).slice(0, 5)
    if (langs.length) out.langs = langs
  }
  if (typeof c.arrived === 'string' && c.arrived) {
    try {
      const u = new URL(c.arrived)
      if (u.protocol === 'https:' || u.protocol === 'http:') out.arrived = (u.origin + u.pathname).slice(0, 200)
    } catch {
      /* not a URL: leave it out */
    }
  }
  return out
}

/** Whether the email domain can receive mail: true, false, or null when DNS could not be asked. */
export async function mailDomainOk(domain, fetchFn = fetch) {
  const ask = async (type) => {
    const res = await fetchFn(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${type}`, {
      headers: { accept: 'application/dns-json' },
      signal: AbortSignal.timeout(2000),
    })
    if (!res.ok) throw new Error(`dns ${res.status}`)
    return res.json()
  }
  try {
    const mx = await ask('MX')
    if (mx.Status === 3) return false
    const records = (mx.Answer ?? []).filter((a) => a.type === 15)
    if (records.length) return records.some((a) => !/^\s*\d+\s+\.?\s*$/.test(String(a.data)))
    const a = await ask('A')
    return (a.Answer ?? []).some((r) => r.type === 1)
  } catch {
    return null
  }
}

/** The signals the email shows, from the request, Cloudflare and the page. */
export function collect(request, body, extra) {
  const cf = request.cf ?? {}
  const ua = cap(request.headers.get('User-Agent'), 400)
  return {
    ip: cap(request.headers.get('CF-Connecting-IP'), 64),
    asn: Number.isInteger(cf.asn) ? cf.asn : null,
    org: cap(cf.asOrganization, 120),
    city: cap(cf.city, 80),
    region: cap(cf.region, 80),
    country: cap(cf.country ?? request.headers.get('CF-IPCountry'), 8),
    ipTz: cap(cf.timezone, 64),
    ua,
    agent: parseAgent(ua),
    acceptLang: cap(request.headers.get('Accept-Language'), 120),
    client: readClient(body.client),
    ...extra,
  }
}

const domainOf = (email) => email.split('@')[1].toLowerCase()

/** Minutes ahead of UTC for an IANA zone at a moment, or null for an unknown zone. Comparing offsets, not names,
 *  keeps aliases such as Asia/Saigon and Asia/Ho_Chi_Minh from looking like a mismatch. */
export function offsetMinutes(tz, ms) {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric',
    }).formatToParts(new Date(ms))
    const p = Object.fromEntries(parts.map((x) => [x.type, Number(x.value)]))
    return Math.round((Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute) - Math.floor(ms / 60000) * 60000) / 60000)
  } catch {
    return null
  }
}

/** Plain-language flags: [level, text], level bad or warn. */
export function flags(form, sig) {
  const out = []
  const domain = domainOf(form.email)
  if (!sig.ua) out.push(['bad', 'The browser sent no browser name at all.'])
  else if (AUTOMATED.test(sig.ua)) out.push(['bad', `The browser calls itself automated (${sig.agent.browser}).`])
  if (sig.mx === false) out.push(['bad', `${domain} has no mail server, so a reply cannot arrive.`])
  if (DISPOSABLE.has(domain)) out.push(['bad', `${domain} is a throwaway mail service.`])
  if (sig.org && HOSTING.test(sig.org)) out.push(['warn', `Sent from a hosting company's network (${sig.org}). People rarely do; VPNs, iCloud Private Relay and bots do.`])
  const at = sig.now ?? Date.now()
  const browserOff = sig.client.tz ? offsetMinutes(sig.client.tz, at) : null
  const ipOff = sig.ipTz ? offsetMinutes(sig.ipTz, at) : null
  if (browserOff != null && ipOff != null && browserOff !== ipOff) {
    out.push(['warn', `Browser clock is set to ${sig.client.tz}, but the IP is in ${sig.city || sig.country || 'another place'} (${sig.ipTz}).`])
  }
  if (Number.isFinite(sig.fillSeconds) && sig.fillSeconds < 15) out.push(['warn', `Form filled in ${sig.fillSeconds} seconds.`])
  if (sig.today > 1) out.push(['warn', `Message ${sig.today} from this IP today.`])
  return out
}

export function verdict(list) {
  const bad = list.filter((f) => f[0] === 'bad').length
  const warn = list.filter((f) => f[0] === 'warn').length
  if (bad) return ['bad', 'Stop: this looks like a scammer or a bot']
  if (warn) return ['warn', `${warn} ${warn === 1 ? 'thing' : 'things'} to check before replying`]
  return ['ok', 'Nothing unusual']
}
