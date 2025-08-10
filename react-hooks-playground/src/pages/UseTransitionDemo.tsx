import { useMemo, useState, useTransition } from 'react'

export default function UseTransitionDemo() {
  const [input, setInput] = useState('')
  const [list, setList] = useState<string[]>([])
  const [isPending, startTransition] = useTransition()

  const items = useMemo(() => Array.from({ length: 3000 }, (_, i) => `Row ${i}`), [])

  return (
    <section>
      <h2>useTransition</h2>
      <div>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type and add" />
        <button
          onClick={() =>
            startTransition(() => {
              setList((prev) => [input, ...prev])
            })
          }
        >
          Add
        </button>
        {isPending && <span style={{ marginLeft: 8 }}>Updating…</span>}
      </div>
      <ul>
        {items.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
      <h3>Your added items</h3>
      <ul>
        {list.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    </section>
  )
}