// Site-wide links. The marketplace is a page of this site (aos docs/specs/261117-landing-airtable-style.md, A11):
// the portal's marketplace holds mock data only (owner, 2026-11-17).
export const PORTAL = 'https://portal.rotexai.com'
export const MARKET = '/marketplace/'
export const PRICING = '/pricing/'
export const GUIDE = '/docs/'
export const DOCS_AGENTS = '/docs/coding-agents/'

// GET filters the marketplace page reads from its URL: ?area=<type id> and ?q=<search>.
export const marketHref = ({ area, q } = {}) => {
  const params = new URLSearchParams()
  if (area) params.set('area', area)
  if (q) params.set('q', q)
  const query = params.toString()
  return query ? `${MARKET}?${query}` : MARKET
}
