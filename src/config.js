// Site-wide links. The marketplace is a page of this site (aos docs/specs/261117-landing-airtable-style.md, A11):
// the portal's marketplace holds mock data only (owner, 2026-11-17).
export const PORTAL = 'https://portal.rotexai.com'
export const MARKET = '/marketplace/'
export const PRICING = '/pricing/'
export const GUIDE = '/docs/'
export const DOCS_AGENTS = '/docs/coding-agents/'
export const CONTACT = '/contact/'
export const CONTACT_EMAIL = 'contact@rotexai.com'

// The contact form (aos docs/specs/261126-contact-page.md) posts to a Cloudflare Worker after a Turnstile check. Both
// come from GitHub repo variables at build time; with either unset the form asks visitors to write to CONTACT_EMAIL.
export const CONTACT_URL = import.meta.env.VITE_CONTACT_URL || null
export const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || null

// GET filters the marketplace page reads from its URL: ?area=<type id> and ?q=<search>.
export const marketHref = ({ area, q } = {}) => {
  const params = new URLSearchParams()
  if (area) params.set('area', area)
  if (q) params.set('q', q)
  const query = params.toString()
  return query ? `${MARKET}?${query}` : MARKET
}
