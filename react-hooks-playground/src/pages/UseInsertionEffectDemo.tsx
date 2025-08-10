import { useEffect, useInsertionEffect, useRef, useState } from 'react'

export default function UseInsertionEffectDemo() {
  const [color, setColor] = useState('#4f46e5')
  const styleRef = useRef<HTMLStyleElement | null>(null)

  useInsertionEffect(() => {
    if (!styleRef.current) {
      styleRef.current = document.createElement('style')
      document.head.appendChild(styleRef.current)
    }
    styleRef.current.textContent = `
      .dynamic-border { border: 4px solid ${color}; }
    `
  }, [color])

  useEffect(() => {
    return () => {
      if (styleRef.current) {
        styleRef.current.remove()
        styleRef.current = null
      }
    }
  }, [])

  return (
    <section>
      <h2>useInsertionEffect</h2>
      <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
      <div className="dynamic-border" style={{ padding: 16, marginTop: 12 }}>
        This box has a dynamic border color.
      </div>
    </section>
  )
}