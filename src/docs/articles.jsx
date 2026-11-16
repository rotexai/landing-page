/* eslint-disable react-refresh/only-export-components -- a data module (JSX only for article bodies); no components to hot-reload */
// The guides on rotexai.com/docs/ (aos docs/specs/261117-landing-airtable-style.md, A13). Every statement describes what
// the portal does today; button and menu names are the portal's Vietnamese labels (portal src/i18n/locales/vi).
import { DOCS_AGENTS, PORTAL, PRICING } from '../config.js'

// A portal button or menu name.
export const B = ({ children }) => <span className="ui">{children}</span>
const read = (slug) => `/docs/?read=${slug}`

export const TYPES = [
  { id: 'steps', label: 'Từng bước' },
  { id: 'quick', label: 'Đọc nhanh' },
]

export const TOPICS = [
  { id: 'start', label: 'Bắt đầu' },
  { id: 'build', label: 'Xây dựng và sửa' },
  { id: 'team', label: 'Nhóm và quyền' },
  { id: 'workflow', label: 'Quy trình' },
  { id: 'publish', label: 'Xuất bản' },
  { id: 'billing', label: 'Gói và thanh toán' },
  { id: 'agents', label: 'Coding agent' },
]

const ICONS = {
  start: <><path d="M5 19l6-6M14 4l6 6-8 8H6v-6z" /></>,
  template: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><path d="M17.5 14v7M14 17.5h7" /></>,
  chat: <path d="M4 5h16v11H9l-5 4z" />,
  team: <><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0112 0M16 4a3 3 0 010 6M18 14a5 5 0 013 6" /></>,
  bell: <><path d="M6 16V11a6 6 0 0112 0v5l2 2H4z" /><path d="M10 20a2 2 0 004 0" /></>,
  publish: <><path d="M12 15V4M7 9l5-5 5 5" /><path d="M4 15v4a1 1 0 001 1h14a1 1 0 001-1v-4" /></>,
  card: <><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18M7 15h4" /></>,
  code: <path d="M8 8l-4 4 4 4M16 8l4 4-4 4" />,
}

// Each article: slug, type, topic, tone (landing.css tones), icon, title, one line for its card, and sections
// ({ id, h, body }). `href` instead of sections sends the card to an existing page.
export const ARTICLES = [
  {
    slug: 'bat-dau', type: 'steps', topic: 'start', tone: 'blue', icon: ICONS.start, featured: true,
    title: 'Bắt đầu trong sáu bước',
    line: 'Từ một câu mô tả đến phần mềm cả nhóm dùng được.',
    sections: [
      { id: 'tao-tai-khoan', h: 'Tạo tài khoản', body: <p>Vào <a href={PORTAL}>portal.rotexai.com</a> và đăng ký. Gói Free đủ để thử với tối đa 5 dự án và không cần thanh toán.</p> },
      {
        id: 'ke-cach-lam', h: 'Kể cách bạn làm',
        body: (
          <>
            <p>Ở <B>Trang chủ</B>, viết một hai câu về việc bạn muốn quản lý, bằng lời thường ngày. Hoặc vào <B>Chợ</B>, chọn một mẫu gần với cách bạn làm (xem <a href={read('tu-mau')}>Bắt đầu từ một mẫu</a>).</p>
            <figure className="say">
              <figcaption className="small">Ví dụ</figcaption>
              <p>Quán cà phê hai chi nhánh. Gọi món tại quầy, trừ nguyên liệu theo công thức, cuối ngày chốt ca và đối chiếu tiền mặt.</p>
            </figure>
          </>
        ),
      },
      { id: 'tra-loi', h: 'Trả lời vài câu hỏi', body: <p>RotexAI hỏi để hiểu đúng cách bạn làm. Chọn một đáp án, tự gõ câu trả lời, hoặc để mở. Câu nào bạn để mở, RotexAI chọn phương án hợp lý nhất và ghi lại để bạn đổi sau. Trong portal, trợ lý trò chuyện tên là Rox, còn phần viết yêu cầu và xây dựng tên là Rix.</p> },
      { id: 'duyet', h: 'Duyệt yêu cầu, rồi duyệt thiết kế', body: <p>Rix viết danh sách yêu cầu, mỗi yêu cầu kèm điều kiện thế nào là xong. Đọc, nhờ sửa bằng lời nếu cần, rồi nhấn <B>Duyệt yêu cầu</B>. Tiếp theo là thiết kế: màn hình, quy trình, bảng dữ liệu và ai được làm gì. Thấy ổn thì nhấn <B>Duyệt và xây dựng</B>. Chưa có gì được xây trước khi bạn duyệt.</p> },
      { id: 'xay-dung', h: 'Theo dõi xây dựng', body: <p>Việc xây dựng chia thành nhiều công việc nhỏ, và mỗi việc chỉ xong khi qua được kiểm tra của nó. Bạn theo dõi từng bước ngay trong trò chuyện và vẫn nhắn thêm được trong lúc chờ. Nếu một kiểm tra không qua, Rix dừng lại và nói rõ yêu cầu nào chưa đạt, vì sao. Mọi thứ nằm trong bản xem trước, chưa ai dùng được cho đến khi bạn xuất bản.</p> },
      { id: 'xuat-ban', h: 'Xuất bản', body: <p>Khi ứng dụng sẵn sàng, nhấn <B>Xuất bản</B> trong dự án và chọn ai được mở. Chi tiết ở <a href={read('xuat-ban')}>Xuất bản và chọn ai được mở</a>.</p> },
    ],
  },
  {
    slug: 'tu-mau', type: 'quick', topic: 'start', tone: 'flame', icon: ICONS.template,
    title: 'Bắt đầu từ một mẫu trong Chợ',
    line: 'Sao chép một ứng dụng có sẵn, đổi vài chỗ cho đúng cách bạn làm.',
    sections: [
      { id: 'chon-cach', h: 'Chọn cách bắt đầu', body: <p>Khi tạo dự án, chọn <B>Dự án trống</B> nếu bạn đã rõ mình muốn gì, hoặc <B>Bắt đầu từ một mẫu</B> để chọn một ứng dụng hay quy trình có sẵn trong <B>Chợ</B>.</p> },
      { id: 'doi-truoc', h: 'Đổi trước khi sao chép', body: <p>Ở ô <B>Cần thay đổi gì trước không?</B>, viết điều cần đổi, như dùng màu và logo của bạn hay thêm một bước duyệt. RotexAI áp dụng ngay sau khi sao chép.</p> },
      { id: 'di-kem', h: 'Những gì đi kèm', body: <p>Màn hình, quy trình và bảng dữ liệu của mẫu được thêm vào dự án mới. Dữ liệu, thành viên và kết nối thì không. Mã của mẫu chạy với quyền của bạn trong dự án đó.</p> },
      { id: 'len-mang', h: 'Đưa lên mạng', body: <p>Màn hình của mẫu được thêm dưới dạng bản phát hành v1.0.0 nhưng chưa hoạt động. Xuất bản từ dự án mới để mọi người dùng được (<a href={read('xuat-ban')}>xem cách xuất bản</a>).</p> },
    ],
  },
  {
    slug: 'sua-phan-mem', type: 'quick', topic: 'build', tone: 'cyan', icon: ICONS.chat,
    title: 'Sửa phần mềm bằng một câu',
    line: 'Nói điều cần đổi, duyệt bản cập nhật, rồi xuất bản lại.',
    sections: [
      { id: 'noi', h: 'Nói điều cần đổi', body: <p>Trong trò chuyện của dự án, nhắn điều cần đổi hoặc kể lỗi bạn gặp, bằng lời thường ngày. Bạn nhắn được cả khi đang xây dựng.</p> },
      { id: 'duyet-cap-nhat', h: 'Duyệt bản cập nhật', body: <p>Rix viết kế hoạch cập nhật và cho bạn so với bản trước. Thấy ổn thì nhấn <B>Duyệt cập nhật</B>; muốn khác thì nói tiếp.</p> },
      { id: 'giu-nguyen', h: 'Bản đang chạy giữ nguyên', body: <p>Thay đổi đối với những gì đã có chỉ áp dụng khi bạn xuất bản. Đến lúc đó, mọi người vẫn dùng bản đang chạy.</p> },
      { id: 'hoan-tac', h: 'Hoàn tác', body: <p>Bạn có thể hoàn tác thay đổi mới nhất, trừ lúc Rox đang làm việc.</p> },
    ],
  },
  {
    slug: 'moi-nhom', type: 'steps', topic: 'team', tone: 'peach', icon: ICONS.team,
    title: 'Mời nhóm và phân quyền',
    line: 'Ai vào được dự án, và mỗi người được làm gì.',
    sections: [
      { id: 'moi', h: 'Mời người', body: <p>Mở <B>Cài đặt → Nhóm</B> của dự án, chọn <B>Mời người</B> và nhập email. Người được mời cần có tài khoản RotexAI trước. Chỉ Chủ sở hữu và Quản trị viên thay đổi được nhóm.</p> },
      { id: 'vai-tro', h: 'Chọn vai trò', body: <p>Chủ sở hữu nắm mọi thứ, kể cả thanh toán và quyền sở hữu. Quản trị viên có mọi quyền trong dự án. Vai trò tuỳ chỉnh chọn từng quyền cụ thể và có thể chỉ áp dụng cho vài màn hình hay quy trình; bảng dữ liệu thì luôn áp dụng cho cả dự án.</p> },
      { id: 'chia-se', h: 'Chia sẻ một màn hình', body: <p>Muốn ai đó chỉ dùng một màn hình hay một quy trình, nhấn <B>Chia sẻ</B> trên đó. Họ chỉ thấy những gì được chia sẻ, không thấy gì khác trong dự án.</p> },
      { id: 'go', h: 'Gỡ người', body: <p>Người bị gỡ mất vai trò trong dự án. Những gì đã chia sẻ trực tiếp với họ vẫn giữ nguyên cho đến khi bạn gỡ.</p> },
    ],
  },
  {
    slug: 'viec-cho', type: 'quick', topic: 'workflow', tone: 'sand', icon: ICONS.bell,
    title: 'Việc chờ người làm',
    line: 'Khi quy trình cần ai đó duyệt hay xác nhận, việc hiện ở đâu.',
    sections: [
      { id: 'khi-nao', h: 'Khi nào có việc chờ', body: <p>Một quy trình có thể có bước cần người, như duyệt chi hay xác nhận đơn. Đến bước đó, quy trình chờ người xử lý.</p> },
      { id: 'o-dau', h: 'Tìm việc của bạn', body: <p>Các bước đang chờ trong mọi dự án của bạn hiện ở <B>Thông báo</B>. Trong từng dự án có danh sách <B>Đang chờ người xử lý</B>. Bước mới hiện ngay khi quy trình đến đó.</p> },
      { id: 'tra-loi-buoc', h: 'Trả lời', body: <p>Mở bước, điền những gì được hỏi rồi gửi. Câu trả lời được ghi lại và quy trình đi tiếp.</p> },
    ],
  },
  {
    slug: 'xuat-ban', type: 'steps', topic: 'publish', tone: 'ink', icon: ICONS.publish, featured: true,
    title: 'Xuất bản và chọn ai được mở',
    line: 'Đưa bản mới lên mạng mà không làm gián đoạn việc đang chạy.',
    sections: [
      { id: 'ban-phat-hanh', h: 'Bản phát hành', body: <p>Mỗi lần Rix xây xong, một bản phát hành được gắn thẻ, như v1.0.0. Chưa ai dùng được bản đó cho đến khi bạn xuất bản.</p> },
      { id: 'nhan-xuat-ban', h: 'Xuất bản', body: <p>Nhấn <B>Xuất bản</B> trong dự án. Nếu việc xuất bản không thành, trang đang hoạt động vẫn giữ nguyên.</p> },
      { id: 'ai-mo', h: 'Ai được mở', body: <p>Chọn <B>Bất kỳ ai có liên kết</B> hoặc <B>Những người đã đăng nhập vào dự án này</B>. Lựa chọn có hiệu lực trong khoảng 30 giây.</p> },
      { id: 'dang-chay', h: 'Quy trình đang chạy', body: <p>Lần chạy mới dùng phiên bản vừa xuất bản. Lần đang chạy dở kết thúc trên phiên bản nó đã bắt đầu.</p> },
      { id: 'agent', h: 'Khi coding agent xin xuất bản', body: <p>Một coding agent có thể xin xuất bản ứng dụng. Chưa có gì lên mạng cho đến khi bạn đồng ý trong portal, và yêu cầu hết hạn nếu không ai trả lời.</p> },
    ],
  },
  {
    slug: 'thanh-toan', type: 'quick', topic: 'billing', tone: 'orange', icon: ICONS.card,
    title: 'Gói và thanh toán',
    line: 'Một gói cho cả tài khoản, trả bằng VietQR.',
    sections: [
      { id: 'mot-goi', h: 'Một gói cho cả tài khoản', body: <p>Gói dùng chung cho mọi dự án trong tài khoản. Giá và giới hạn từng gói ở <a href={PRICING}>Bảng giá</a>.</p> },
      { id: 'tra-tien', h: 'Thanh toán', body: <p>Chuyển khoản ngân hàng bằng mã VietQR, được xác nhận tự động. Bạn có thể trả một hoá đơn thành nhiều đợt.</p> },
      { id: 'doi-goi', h: 'Đổi gói', body: <p>Gói cao hơn bắt đầu khi hoá đơn được thanh toán; đến lúc đó các dự án giữ giới hạn hiện tại. Gói trả phí thấp hơn áp dụng ngay. Về Free thì bạn giữ gói hiện tại đến cuối kỳ thanh toán.</p> },
      { id: 'vuot', h: 'Dùng quá giới hạn', body: <p>Không có gì bị xoá. Bạn chỉ chưa thêm mới được cho đến khi dùng ít lại, hoặc chuyển lên gói cao hơn.</p> },
    ],
  },
  {
    slug: 'coding-agents', type: 'steps', topic: 'agents', tone: 'cyan', icon: ICONS.code, featured: true, href: DOCS_AGENTS,
    title: 'Kết nối coding agent',
    line: 'Dùng Claude Code, Codex, claude.ai hoặc ChatGPT với các dự án RotexAI.',
  },
]

export const BY_SLUG = Object.fromEntries(ARTICLES.map((a) => [a.slug, a]))
export const TYPE_LABEL = Object.fromEntries(TYPES.map((t) => [t.id, t.label]))
export const TOPIC_LABEL = Object.fromEntries(TOPICS.map((t) => [t.id, t.label]))
export const articleHref = (a) => a.href ?? read(a.slug)
