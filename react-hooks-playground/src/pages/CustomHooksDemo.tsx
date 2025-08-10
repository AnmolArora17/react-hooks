import { useEffect, useRef, useState } from 'react'

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : initial
  })
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])
  return [value, setValue] as const
}

function usePrevious<T>(value: T) {
  const ref = useRef<T | null>(null)
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}

function useInterval(callback: () => void, delay: number | null) {
  useEffect(() => {
    if (delay === null) return
    const id = setInterval(callback, delay)
    return () => clearInterval(id)
  }, [callback, delay])
}

export default function CustomHooksDemo() {
  const [name, setName] = useLocalStorage('name', '')
  const prevName = usePrevious(name)

  const [ticks, setTicks] = useState(0)
  useInterval(() => setTicks((t) => t + 1), 1000)

  return (
    <section>
      <h2>Custom hooks</h2>
      <div>
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
      </div>
      <p>Previous name: {prevName ?? '—'}</p>
      <p>Ticks (useInterval): {ticks}</p>
    </section>
  )
}