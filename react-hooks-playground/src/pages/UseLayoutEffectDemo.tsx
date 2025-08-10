import { useLayoutEffect, useRef, useState } from 'react'

export default function UseLayoutEffectDemo() {
  const boxRef = useRef<HTMLDivElement | null>(null)
  const [size, setSize] = useState<{ w: number; h: number } | null>(null)

  useLayoutEffect(() => {
    const el = boxRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setSize({ w: Math.round(rect.width), h: Math.round(rect.height) })
  })

  return (
    <section>
      <h2>useLayoutEffect</h2>
      <div
        ref={boxRef}
        style={{ width: 200, padding: 24, border: '1px solid #ccc', resize: 'both', overflow: 'auto' }}
        contentEditable
        suppressContentEditableWarning
      >
        Resize or edit me
      </div>
      <p>Measured size: {size ? `${size.w} x ${size.h}` : '—'}</p>
    </section>
  )
}