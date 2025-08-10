import { memo, useCallback, useState } from 'react'

const List = memo(function List({ items, onRemove }: { items: string[]; onRemove: (idx: number) => void }) {
  return (
    <ul>
      {items.map((it, i) => (
        <li key={i}>
          {it}
          <button style={{ marginLeft: 8 }} onClick={() => onRemove(i)}>
            Remove
          </button>
        </li>
      ))}
    </ul>
  )
})

export default function UseCallbackDemo() {
  const [items, setItems] = useState(['apple', 'banana', 'citrus'])
  const handleRemove = useCallback((idx: number) => setItems((prev) => prev.filter((_, i) => i !== idx)), [])

  return (
    <section>
      <h2>useCallback</h2>
      <List items={items} onRemove={handleRemove} />
      <button onClick={() => setItems((prev) => [...prev, `item ${prev.length + 1}`])}>Add item</button>
    </section>
  )
}