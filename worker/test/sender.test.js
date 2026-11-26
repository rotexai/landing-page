import { describe, expect, it, vi } from 'vitest'
import { flags, mailDomainOk, offsetMinutes, parseAgent, readClient, verdict } from '../src/sender.js'

const UA = {
  mac: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  iphone: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1',
  headless: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/131.0.0.0 Safari/537.36',
  curl: 'curl/8.7.1',
  edge: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0',
  android: 'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/25.0 Chrome/121.0.0.0 Mobile Safari/537.36',
}

describe('parseAgent', () => {
  it('names browser, system and device', () => {
    expect(parseAgent(UA.mac)).toEqual({ browser: 'Chrome 131', os: 'macOS', device: 'Computer' })
    expect(parseAgent(UA.iphone)).toEqual({ browser: 'Safari 18', os: 'iOS 18', device: 'Phone' })
    expect(parseAgent(UA.headless)).toEqual({ browser: 'HeadlessChrome 131', os: 'Linux', device: 'Computer' })
    expect(parseAgent(UA.curl)).toEqual({ browser: 'curl 8', os: 'Unknown', device: 'Script' })
    expect(parseAgent(UA.edge)).toEqual({ browser: 'Edge 131', os: 'Windows', device: 'Computer' })
    expect(parseAgent(UA.android)).toEqual({ browser: 'Samsung Internet 25', os: 'Android 14', device: 'Phone' })
    expect(parseAgent('')).toEqual({ browser: 'Unknown', os: 'Unknown', device: 'Computer' })
  })
})

describe('readClient', () => {
  it('keeps valid values and drops junk', () => {
    expect(readClient({ tz: 'America/Argentina/Buenos_Aires', offset: 180, screen: { w: 393, h: 852 }, langs: ['en-US', 'vi'], arrived: 'https://deck.rotexai.com/x?token=secret#y' }))
      .toEqual({ tz: 'America/Argentina/Buenos_Aires', offset: 180, screen: { w: 393, h: 852 }, langs: ['en-US', 'vi'], arrived: 'https://deck.rotexai.com/x' })
    expect(readClient({ tz: '<script>', offset: 5000, screen: { w: -1, h: 'x' }, langs: ['<b>', 'x'.repeat(50)], arrived: 'javascript:alert(1)' })).toEqual({})
    expect(readClient({ langs: ['a-b', 'en', 'vi', 'fr', 'de', 'ja', 'ko'] }).langs).toHaveLength(5)
    expect(readClient(null)).toEqual({})
    expect(readClient('nope')).toEqual({})
  })
})

describe('mailDomainOk', () => {
  const dns = (answers) => vi.fn(async (url) => {
    const type = new URL(url).searchParams.get('type')
    const a = answers[type]
    if (a instanceof Error) throw a
    return new Response(JSON.stringify(a ?? { Status: 0 }))
  })
  it('reads MX, null MX, A fallback, NXDOMAIN and failures', async () => {
    expect(await mailDomainOk('a.example', dns({ MX: { Status: 0, Answer: [{ type: 15, data: '10 mx.a.example.' }] } }))).toBe(true)
    expect(await mailDomainOk('a.example', dns({ MX: { Status: 0, Answer: [{ type: 15, data: '0 .' }] } }))).toBe(false)
    expect(await mailDomainOk('a.example', dns({ MX: { Status: 0 }, A: { Status: 0, Answer: [{ type: 1, data: '192.0.2.1' }] } }))).toBe(true)
    expect(await mailDomainOk('a.example', dns({ MX: { Status: 0 }, A: { Status: 0 } }))).toBe(false)
    expect(await mailDomainOk('a.example', dns({ MX: { Status: 3 } }))).toBe(false)
    expect(await mailDomainOk('a.example', dns({ MX: new Error('timeout') }))).toBeNull()
  })
})

// The investor Worker's three senders (its design artifact), checked against this form's rules (spec C8).
const base = { client: {}, today: 1, fillSeconds: 90, mx: true }
const real = {
  form: { email: 'lan@quanmoc.vn' },
  sig: { ...base, ua: UA.mac, agent: parseAgent(UA.mac), org: 'Viettel Group', city: 'Ho Chi Minh City', ipTz: 'Asia/Ho_Chi_Minh', client: { tz: 'Asia/Ho_Chi_Minh', arrived: 'https://deck.rotexai.com/' } },
}
const vpn = {
  form: { email: 'james@gmail.com' },
  sig: { ...base, ua: UA.iphone, agent: parseAgent(UA.iphone), org: 'DigitalOcean, LLC', city: 'Singapore', ipTz: 'Asia/Singapore', fillSeconds: 52, client: { tz: 'America/Los_Angeles' } },
}
const scam = {
  form: { email: 'verify@acme-cafe.example' },
  sig: { ...base, ua: UA.headless, agent: parseAgent(UA.headless), org: 'Hetzner Online GmbH', city: 'Falkenstein', ipTz: 'Europe/Berlin', fillSeconds: 8, today: 3, mx: false, client: { tz: 'America/New_York' } },
}

describe('flags and verdict (R17, spec C8)', () => {
  it('a shop owner on their own network: nothing unusual', () => {
    const f = flags(real.form, real.sig)
    expect(f).toEqual([])
    expect(verdict(f)).toEqual(['ok', 'Nothing unusual'])
  })
  it('a Gmail address raises no note; a VPN and another clock are two things to check', () => {
    const f = flags(vpn.form, vpn.sig)
    expect(f.map((x) => x[0])).toEqual(['warn', 'warn'])
    expect(f[1][1]).toBe('Browser clock is set to America/Los_Angeles, but the IP is in Singapore (Asia/Singapore).')
    expect(verdict(f)).toEqual(['warn', '2 things to check before replying'])
  })
  it('a scammer: stop', () => {
    const f = flags(scam.form, scam.sig)
    expect(f.filter((x) => x[0] === 'bad')).toHaveLength(2)
    expect(f.map((x) => x[1])).toContain('Form filled in 8 seconds.')
    expect(f.map((x) => x[1])).toContain('Message 3 from this IP today.')
    expect(verdict(f)[0]).toBe('bad')
  })
  it('time zone aliases with the same clock raise nothing; unknown zones are ignored', () => {
    const at = Date.parse('2026-11-18T09:00:00Z')
    expect(offsetMinutes('Asia/Saigon', at)).toBe(420)
    expect(offsetMinutes('America/New_York', at)).toBe(-300)
    expect(offsetMinutes('Not/AZone', at)).toBeNull()
    const sig = { ...real.sig, now: at, client: { tz: 'Asia/Saigon' } }
    expect(flags(real.form, sig).some((x) => x[0] === 'warn')).toBe(false)
    expect(flags(real.form, { ...sig, client: { tz: 'Not/AZone' } }).some((x) => x[0] === 'warn')).toBe(false)
  })
  it('a throwaway address and a missing browser name stop; unknown DNS or clock raise nothing', () => {
    const f = flags({ email: 'x@mailinator.com' }, { ...base, ua: '', agent: parseAgent(''), mx: null, client: {} })
    expect(f.map((x) => x[1])).toEqual(['The browser sent no browser name at all.', 'mailinator.com is a throwaway mail service.'])
  })
})
