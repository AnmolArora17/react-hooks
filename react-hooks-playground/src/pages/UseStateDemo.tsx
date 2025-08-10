import { useState } from 'react'

export default function UseStateDemo() {
  const [count, setCount] = useState(0)
  const [form, setForm] = useState({ name: '', email: '' })
  const [items, setItems] = useState<string[]>([])

  return (
    <section>
      <h2>useState</h2>

      <h3>Counter</h3>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button onClick={() => setCount((c) => c - 1)}>-</button>
        <span>{count}</span>
        <button onClick={() => setCount((c) => c + 1)}>+</button>
        <button onClick={() => setCount(0)}>Reset</button>
      </div>

      <h3 style={{ marginTop: 24 }}>Form state</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          alert(JSON.stringify(form, null, 2))
        }}
      >
        <div>
          <label>
            Name
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </label>
        </div>
        <div>
          <label>
            Email
            <input
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>

      <h3 style={{ marginTop: 24 }}>List state (immutable updates)</h3>
      <div style={{ display: 'flex', gap: 8 }}>
        <input id="newItem" placeholder="Add item then click Add" />
        <button
          onClick={() => {
            const input = document.getElementById('newItem') as HTMLInputElement
            const value = input.value.trim()
            if (!value) return
            setItems((prev) => [...prev, value])
            input.value = ''
          }}
        >
          Add
        </button>
      </div>
      <ul>
        {items.map((it, idx) => (
          <li key={idx}>
            {it}
            <button style={{ marginLeft: 8 }} onClick={() => setItems((prev) => prev.filter((_, i) => i !== idx))}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}