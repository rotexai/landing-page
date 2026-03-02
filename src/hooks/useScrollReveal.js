import { useEffect, useRef } from 'react'

/**
 * Attach to a container element. When it enters the viewport,
 * all [data-reveal] children become visible with staggered delays.
 */
export function useScrollReveal(options = {}) {
  const ref = useRef(null)
  const { threshold = 0.08, rootMargin = '0px 0px -40px 0px', stagger = 90 } = options

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return

        // Reveal the container itself
        el.classList.add('is-visible')

        // Stagger-reveal all [data-reveal] children
        el.querySelectorAll('[data-reveal]').forEach((child, i) => {
          child.style.transitionDelay = `${i * stagger}ms`
          // Force layout to pick up the delay before adding class
          void child.offsetWidth
          child.classList.add('is-visible')
        })

        io.disconnect()
      },
      { threshold, rootMargin }
    )

    io.observe(el)
    return () => io.disconnect()
  }, [threshold, rootMargin, stagger])

  return ref
}
