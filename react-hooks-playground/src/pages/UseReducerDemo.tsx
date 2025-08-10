import { useReducer, useState } from 'react'

type Todo = { id: number; title: string; done: boolean }

type Action =
  | { type: 'add'; title: string }
  | { type: 'toggle'; id: number }
  | { type: 'remove'; id: number }

function todosReducer(state: Todo[], action: Action): Todo[] {
  switch (action.type) {
    case 'add':
      return [...state, { id: Date.now(), title: action.title, done: false }]
    case 'toggle':
      return state.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t))
    case 'remove':
      return state.filter((t) => t.id !== action.id)
    default:
      return state
  }
}

export default function UseReducerDemo() {
  const [todos, dispatch] = useReducer(todosReducer, [])
  const [title, setTitle] = useState('')
  return (
    <section>
      <h2>useReducer</h2>
      <div>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New todo" />
        <button
          onClick={() => {
            if (title.trim()) dispatch({ type: 'add', title: title.trim() })
            setTitle('')
          }}
        >
          Add
        </button>
      </div>
      <ul>
        {todos.map((t) => (
          <li key={t.id}>
            <label>
              <input type="checkbox" checked={t.done} onChange={() => dispatch({ type: 'toggle', id: t.id })} />
              <span style={{ textDecoration: t.done ? 'line-through' : 'none', marginLeft: 8 }}>{t.title}</span>
            </label>
            <button style={{ marginLeft: 8 }} onClick={() => dispatch({ type: 'remove', id: t.id })}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}