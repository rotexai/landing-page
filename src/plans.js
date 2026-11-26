// The plans on rotexai.com/pricing/ (aos docs/specs/261117-landing-airtable-style.md, A12).
// Prices: aos codebase/data-plane/killbill/catalogs/vnd.xml (VND per month). Limits: killbill/limits/limits.yaml
// (null = unlimited); projects is per account, team_members is seats per project with the owner's included. Compute hours are compute units x 72 (catalog src/config/planLimits.js CU_HOURS_PER_UNIT).
// This is a copy: a price or limit change there must change here too (the spec's R15 check compares them).

export const PLANS = [
  {
    id: 'free', name: 'Free', price: 0, line: 'Thử với tối đa 3 dự án.',
    limits: { projects: 3, team_members: 2, storage_gb: 2, ai_requests_per_month: 100, workflow_executions_per_day: 50, compute_units: 1, history_retention_days: 7, custom_domain: false, workflows_per_project: 30, tables_per_project: 15, nodes_per_workflow: 10 },
  },
  {
    id: 'plus', name: 'Plus', price: 299000, popular: true, line: 'Tối đa 20 dự án.',
    limits: { projects: 20, team_members: 5, storage_gb: 10, ai_requests_per_month: 300, workflow_executions_per_day: 200, compute_units: 3, history_retention_days: 30, custom_domain: false, workflows_per_project: null, tables_per_project: null, nodes_per_workflow: null },
  },
  {
    id: 'gold', name: 'Gold', price: 599000, line: 'Thêm tên miền riêng.',
    limits: { projects: null, team_members: 10, storage_gb: 30, ai_requests_per_month: 1000, workflow_executions_per_day: 400, compute_units: 5, history_retention_days: 90, custom_domain: true, workflows_per_project: null, tables_per_project: null, nodes_per_workflow: null },
  },
  {
    id: 'diamond', name: 'Diamond', price: 1199000, line: 'Lưu lịch sử một năm.',
    limits: { projects: null, team_members: 20, storage_gb: 80, ai_requests_per_month: 4000, workflow_executions_per_day: 1000, compute_units: 10, history_retention_days: 365, custom_domain: true, workflows_per_project: null, tables_per_project: null, nodes_per_workflow: null },
  },
]

export const CU_HOURS_PER_UNIT = 72

const num = new Intl.NumberFormat('vi-VN')
export const vnd = (n) => `${num.format(n)} ₫`
const count = (n) => (n === null ? 'Không giới hạn' : num.format(n))

// Labels follow the portal's Plans page (portal src/i18n/locales/vi/plans.json, limits.*).
export const LIMIT_ROWS = [
  { key: 'projects', label: 'Dự án', show: (l) => count(l.projects) },
  { key: 'team_members', label: 'Thành viên / dự án', show: (l) => count(l.team_members) },
  { key: 'storage_gb', label: 'Dung lượng', show: (l) => `${num.format(l.storage_gb)} GB` },
  { key: 'ai_requests_per_month', label: 'Yêu cầu AI / tháng', show: (l) => count(l.ai_requests_per_month) },
  { key: 'workflow_executions_per_day', label: 'Lần chạy quy trình / ngày', show: (l) => count(l.workflow_executions_per_day) },
  { key: 'compute_units', label: 'Giờ tính toán / tháng', show: (l) => `${num.format(l.compute_units * CU_HOURS_PER_UNIT)} giờ` },
  { key: 'history_retention_days', label: 'Lưu giữ lịch sử', show: (l) => `${num.format(l.history_retention_days)} ngày` },
  { key: 'custom_domain', label: 'Tên miền riêng', show: (l) => (l.custom_domain ? 'Có' : 'Không') },
  { key: 'workflows_per_project', label: 'Quy trình trong mỗi dự án', show: (l) => count(l.workflows_per_project) },
  { key: 'tables_per_project', label: 'Bảng dữ liệu trong mỗi dự án', show: (l) => count(l.tables_per_project) },
  { key: 'nodes_per_workflow', label: 'Nút trong mỗi quy trình', show: (l) => count(l.nodes_per_workflow) },
]

// The five limits each plan card lists (the rest are in the comparison table).
export const HEADLINE = [
  { key: 'projects', show: (l) => (l.projects === null ? ['Không giới hạn', 'dự án'] : [num.format(l.projects), 'dự án']) },
  { key: 'team_members', show: (l) => [num.format(l.team_members), 'thành viên / dự án'] },
  { key: 'storage_gb', show: (l) => [`${num.format(l.storage_gb)} GB`, 'dung lượng'] },
  { key: 'ai_requests_per_month', show: (l) => [num.format(l.ai_requests_per_month), 'yêu cầu AI / tháng'] },
  { key: 'workflow_executions_per_day', show: (l) => [num.format(l.workflow_executions_per_day), 'lần chạy quy trình / ngày'] },
]
