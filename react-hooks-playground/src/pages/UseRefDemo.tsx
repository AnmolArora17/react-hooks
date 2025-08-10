import { useEffect, useRef, useState } from 'react'

export default function UseRefDemo() {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const rendersRef = useRef(0)
  const [value, setValue] = useState('')

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    rendersRef.current += 1
  })

  const prevValueRef = useRef('')
  useEffect(() => {
    prevValueRef.current = value
  }, [value])

  return (
    <section>
      <h2>useRef</h2>
      <div>
        <input ref={inputRef} value={value} onChange={(e) => setValue(e.target.value)} placeholder="Type here" />
        <button onClick={() => inputRef.current?.select()}>Select text</button>
      </div>
      <p>Renders (tracked in ref): {rendersRef.current}</p>
      <p>Previous value: {prevValueRef.current}</p>
    </section>
  )
}