import { forwardRef, useImperativeHandle, useRef, useState } from 'react'

export type FancyInputHandle = {
  focus: () => void
  clear: () => void
}

const FancyInput = forwardRef<FancyInputHandle, { placeholder?: string }>(function FancyInput(props, ref) {
  const innerRef = useRef<HTMLInputElement | null>(null)
  useImperativeHandle(
    ref,
    () => ({
      focus: () => innerRef.current?.focus(),
      clear: () => {
        if (innerRef.current) innerRef.current.value = ''
      },
    }),
    [],
  )
  return <input ref={innerRef} placeholder={props.placeholder} />
})

export default function UseImperativeHandleDemo() {
  const fiRef = useRef<FancyInputHandle | null>(null)
  const [log, setLog] = useState<string[]>([])

  return (
    <section>
      <h2>useImperativeHandle</h2>
      <FancyInput ref={fiRef} placeholder="Imperative input" />
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button onClick={() => fiRef.current?.focus()}>Focus</button>
        <button onClick={() => fiRef.current?.clear()}>Clear</button>
        <button onClick={() => setLog((l) => [...l, 'Clicked'])}>Log</button>
      </div>
      <ul>
        {log.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ul>
    </section>
  )
}