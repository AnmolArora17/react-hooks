import { useEffect, useState } from 'react'

function useFakeApi(query: string) {
  const [data, setData] = useState<string[] | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    const timer = setTimeout(() => {
      if (!cancelled) {
        setData(Array.from({ length: 5 }, (_, i) => `${query} result ${i + 1}`))
        setLoading(false)
      }
    }, 600)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query])

  return { data, loading }
}

export default function UseEffectDemo() {
  const [query, setQuery] = useState('react')
  const { data, loading } = useFakeApi(query)
  const [isTicking, setIsTicking] = useState(false)
  const [ticks, setTicks] = useState(0)

  useEffect(() => {
    if (!isTicking) return
    const id = setInterval(() => setTicks((t) => t + 1), 500)
    return () => clearInterval(id)
  }, [isTicking])

  return (
    <section>
      <h2>useEffect</h2>

      <h3>Fetch with cancellation/cleanup</h3>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" />
      {loading ? <p>Loading…</p> : <ul>{data?.map((d) => <li key={d}>{d}</li>)}</ul>}

      <h3 style={{ marginTop: 24 }}>Intervals and cleanup</h3>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button onClick={() => setIsTicking((v) => !v)}>{isTicking ? 'Stop' : 'Start'}</button>
        <span>Ticks: {ticks}</span>
        <button onClick={() => setTicks(0)}>Reset</button>
      </div>
    </section>
  )
}