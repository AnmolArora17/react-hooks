import { useId, useState } from 'react'

function LabeledInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}

export default function UseIdDemo() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  return (
    <section>
      <h2>useId</h2>
      <LabeledInput label="Name" value={name} onChange={setName} />
      <LabeledInput label="Email" value={email} onChange={setEmail} />
    </section>
  )
}