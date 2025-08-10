import { useMemo, useState } from 'react'

function expensiveFib(n: number): number {
  if (n <= 1) return n
  return expensiveFib(n - 1) + expensiveFib(n - 2)
}

const Child = ({ data }: { data: { value: number } }) => {
  return <p>Child sees value: {data.value}</p>
}

export default function UseMemoDemo() {
  const [n, setN] = useState(20)
  const fibN = useMemo(() => expensiveFib(n), [n])

  const [value, setValue] = useState(0)
  const memoData = useMemo(() => ({ value }), [value])

  return (
    <section>
      <h2>useMemo</h2>

      <h3>Expensive calculation</h3>
      <div>
        <label>
          n
          <input type="number" value={n} onChange={(e) => setN(Number(e.target.value))} min={0} max={35} />
        </label>
        <p>fib(n): {fibN}</p>
      </div>

      <h3>Memoized object identity</h3>
      <div>
        <button onClick={() => setValue((v) => v + 1)}>Increment</button>
        <Child data={memoData} />
      </div>
    </section>
  )
}