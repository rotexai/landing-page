// The five topics of rotexai.com/contact/ (spec 261126-contact-page.md, C3). One list for the page and the Worker:
// the page imports it for its pills, the Worker checks the id and puts the label in the email.
export const TOPICS = [
  { id: 'build', label: 'Làm phần mềm cho quán' },
  { id: 'billing', label: 'Gói và thanh toán' },
  { id: 'bug', label: 'Lỗi khi dùng' },
  { id: 'partner', label: 'Hợp tác' },
  { id: 'other', label: 'Khác' },
]

export const topicLabel = (id) => TOPICS.find((t) => t.id === id)?.label
