/* eslint-disable react-refresh/only-export-components -- a data module (JSX only for icons); it has no components to hot-reload */
// ERP types and the marketplace's templates (aos docs/specs/261117-landing-airtable-style.md, A6 and A11).
// TEMPLATES is mock data: there are no real listings yet (owner, 2026-11-17), and the marketplace page says so.

export const GROUPS = [
  { id: 'featured', label: 'Nổi bật' },
  { id: 'sell', label: 'Bán hàng' },
  { id: 'service', label: 'Dịch vụ' },
  { id: 'make', label: 'Sản xuất' },
  { id: 'office', label: 'Văn phòng' },
]

// `id` is the marketplace's ?area= value.
export const TYPES = [
  { id: 'retail', name: 'Bán lẻ', group: 'sell', featured: true, tone: 'flame', icon: <><path d="M4 9l1-5h14l1 5" /><path d="M4 9v11h16V9M9 20v-6h6v6" /></> },
  { id: 'restaurant', name: 'Nhà hàng', group: 'service', featured: true, tone: 'ink', icon: <><path d="M5 8h12v5a6 6 0 01-12 0z" /><path d="M17 9h2a2 2 0 010 4h-2M8 3v2M11 3v2M14 3v2" /></> },
  { id: 'warehouse', name: 'Kho hàng', group: 'make', featured: true, tone: 'cyan', icon: <><path d="M3 7l9-4 9 4-9 4-9-4z" /><path d="M3 7v10l9 4 9-4V7M12 11v10" /></> },
  { id: 'manufacturing', name: 'Xưởng sản xuất', group: 'make', featured: true, tone: 'blue', icon: <><path d="M3 21V10l5 3v-3l5 3v-3l5 3V5h3v16z" /><path d="M7 17h2M12 17h2" /></> },
  { id: 'accounting', name: 'Kế toán', group: 'office', featured: true, tone: 'cyan', icon: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01" /></> },
  { id: 'hr', name: 'Nhân sự', group: 'office', featured: true, tone: 'peach', icon: <><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0112 0M16 4a3 3 0 010 6M18 14a5 5 0 013 6" /></> },
  { id: 'clinic', name: 'Phòng khám', group: 'service', featured: true, tone: 'blue', icon: <><rect x="3" y="3" width="18" height="18" rx="4" /><path d="M12 8v8M8 12h8" /></> },
  { id: 'logistics', name: 'Vận chuyển', group: 'service', featured: true, tone: 'ink', icon: <><path d="M3 6h11v10H3zM14 9h4l3 3v4h-7" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></> },
  { id: 'crm', name: 'Khách hàng', group: 'sell', tone: 'sand', icon: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0116 0" /></> },
  { id: 'realestate', name: 'Bất động sản', group: 'sell', tone: 'ink', icon: <><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10M10 20v-5h4v5" /></> },
  { id: 'education', name: 'Trung tâm học', group: 'service', tone: 'flame', icon: <><path d="M2 9l10-5 10 5-10 5z" /><path d="M6 11v5c3 2 9 2 12 0v-5" /></> },
  { id: 'purchasing', name: 'Mua hàng', group: 'make', tone: 'sand', icon: <><path d="M3 4h2l2.4 10.2a1 1 0 001 .8h8.9a1 1 0 001-.8L20 7H6.2" /><circle cx="9" cy="19.5" r="1.3" /><circle cx="17" cy="19.5" r="1.3" /></> },
]

export const TYPE_BY_ID = Object.fromEntries(TYPES.map((t) => [t.id, t]))

// Mock templates: name, the ERP type, one line, and the screens or steps it would hold.
export const TEMPLATES = [
  { id: 'tap-hoa', type: 'retail', name: 'Cửa hàng tạp hoá', line: 'Bán tại quầy, tồn kho và công nợ khách quen.', parts: ['Bán hàng', 'Tồn kho', 'Công nợ'] },
  { id: 'thoi-trang', type: 'retail', name: 'Shop thời trang', line: 'Mẫu mã theo size và màu, đơn tại quầy và đơn online.', parts: ['Sản phẩm', 'Đơn hàng', 'Kho'] },
  { id: 'ca-phe', type: 'restaurant', name: 'Quán cà phê', line: 'Gọi món, trừ nguyên liệu và chốt ca cuối ngày.', parts: ['Gọi món', 'Nguyên liệu', 'Chốt ca'] },
  { id: 'nha-hang', type: 'restaurant', name: 'Nhà hàng', line: 'Đặt bàn, gửi món xuống bếp và tính tiền theo bàn.', parts: ['Đặt bàn', 'Bếp', 'Thu ngân'] },
  { id: 'kho', type: 'warehouse', name: 'Kho hàng', line: 'Nhập, xuất và kiểm kê theo phiếu.', parts: ['Phiếu nhập', 'Phiếu xuất', 'Kiểm kê'] },
  { id: 'xuong-may', type: 'manufacturing', name: 'Xưởng may', line: 'Lệnh sản xuất, định mức vải và tiến độ từng chuyền.', parts: ['Lệnh sản xuất', 'Định mức', 'Tiến độ'] },
  { id: 'xuong-moc', type: 'manufacturing', name: 'Xưởng mộc', line: 'Báo giá theo bản vẽ, vật tư và lịch giao hàng.', parts: ['Báo giá', 'Vật tư', 'Giao hàng'] },
  { id: 'thu-chi', type: 'accounting', name: 'Sổ thu chi', line: 'Phiếu thu, phiếu chi, duyệt chi và báo cáo tháng.', parts: ['Phiếu thu', 'Phiếu chi', 'Báo cáo'] },
  { id: 'hoa-don', type: 'accounting', name: 'Hoá đơn và công nợ', line: 'Xuất hoá đơn, theo dõi công nợ và nhắc khi tới hạn.', parts: ['Hoá đơn', 'Công nợ', 'Nhắc hạn'] },
  { id: 'cham-cong', type: 'hr', name: 'Chấm công và lương', line: 'Chấm công theo ca, tính lương và phụ cấp.', parts: ['Chấm công', 'Bảng lương', 'Phụ cấp'] },
  { id: 'tuyen-dung', type: 'hr', name: 'Tuyển dụng', line: 'Hồ sơ ứng viên, lịch phỏng vấn và ngày nhận việc.', parts: ['Ứng viên', 'Phỏng vấn', 'Nhận việc'] },
  { id: 'phong-kham', type: 'clinic', name: 'Phòng khám', line: 'Lịch hẹn, hồ sơ bệnh nhân và đơn thuốc.', parts: ['Lịch hẹn', 'Hồ sơ', 'Đơn thuốc'] },
  { id: 'spa', type: 'clinic', name: 'Spa và thẩm mỹ', line: 'Đặt lịch, liệu trình và thẻ thành viên.', parts: ['Đặt lịch', 'Liệu trình', 'Thẻ thành viên'] },
  { id: 'giao-hang', type: 'logistics', name: 'Giao hàng', line: 'Đơn giao, phân tài xế và tiền thu hộ.', parts: ['Đơn giao', 'Tài xế', 'Thu hộ'] },
  { id: 'cham-soc', type: 'crm', name: 'Chăm sóc khách hàng', line: 'Danh sách khách, lịch sử mua và nhắc gọi lại.', parts: ['Khách hàng', 'Lịch sử mua', 'Nhắc việc'] },
  { id: 'moi-gioi', type: 'realestate', name: 'Môi giới nhà đất', line: 'Giỏ hàng, khách quan tâm và lịch dẫn xem nhà.', parts: ['Giỏ hàng', 'Khách', 'Lịch xem'] },
  { id: 'cho-thue', type: 'realestate', name: 'Cho thuê phòng', line: 'Phòng trống, hợp đồng và tiền điện nước hằng tháng.', parts: ['Phòng', 'Hợp đồng', 'Điện nước'] },
  { id: 'trung-tam', type: 'education', name: 'Trung tâm học', line: 'Lớp học, học viên, học phí và điểm danh.', parts: ['Lớp học', 'Học phí', 'Điểm danh'] },
  { id: 'mua-hang', type: 'purchasing', name: 'Mua hàng', line: 'Đề nghị mua, so giá nhà cung cấp và duyệt mua.', parts: ['Đề nghị', 'So giá', 'Duyệt mua'] },
]
