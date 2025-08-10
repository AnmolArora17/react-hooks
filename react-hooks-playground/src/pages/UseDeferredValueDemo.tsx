import { useDeferredValue, useMemo, useState } from 'react'

function SlowList({ query }: { query: string }) {
  const items = useMemo(() => Array.from({ length: 5000 }, (_, i) => `Item ${i + 1}`), [])
  const filtered = items.filter((it) => it.toLowerCase().includes(query.toLowerCase()))
  return (
    <ul>
      {filtered.map((it) => (
        <li key={it}>{it}</li>
      ))}
    </ul>
  )
}

export default function UseDeferredValueDemo() {
  const [text, setText] = useState('')
  const deferred = useDeferredValue(text)
  return (
    <section>
      <h2>useDeferredValue</h2>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type to filter" />
      <p>Immediate: {text}</p>
      <p>Deferred: {deferred}</p>
      <SlowList query={deferred} />
    </section>
  )
}