import { useEffect, useRef, useState } from 'react'

// Open/close state for a menu: closes on Escape (focus back on the button), on a pointer press outside `root`, and when
// focus leaves `root`. On open, focus moves to the first link inside the panel.
export function useDisclosure() {
  const [open, setOpen] = useState(false)
  const root = useRef(null)
  const button = useRef(null)
  useEffect(() => {
    if (!open) return
    root.current?.querySelector('[data-panel] a')?.focus()
    const onDown = (e) => { if (!root.current?.contains(e.target)) setOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') { setOpen(false); button.current?.focus() } }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('pointerdown', onDown); document.removeEventListener('keydown', onKey) }
  }, [open])
  // Only a focus move to another element closes it (Tab out). A press on the panel's padding blurs with no target;
  // presses outside are handled by the pointerdown listener above.
  const onBlur = (e) => { if (e.relatedTarget && !root.current?.contains(e.relatedTarget)) setOpen(false) }
  // A click on any link inside the panel closes it (in-page anchors do not unload the page).
  const onPanelClick = (e) => { if (e.target.closest('a')) setOpen(false) }
  return { open, setOpen, root, button, onBlur, onPanelClick }
}
