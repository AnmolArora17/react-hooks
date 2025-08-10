import { createContext, useContext, useMemo, useState } from 'react'

type Theme = 'light' | 'dark'

const ThemeContext = createContext<{ theme: Theme; toggle: () => void } | null>(null)

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const value = useMemo(() => ({ theme, toggle: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')) }), [theme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

function ThemedBox() {
  const ctx = useContext(ThemeContext)
  if (!ctx) return null
  const { theme, toggle } = ctx
  return (
    <div
      style={{
        padding: 16,
        borderRadius: 8,
        background: theme === 'dark' ? '#222' : '#f3f3f3',
        color: theme === 'dark' ? '#fff' : '#111',
      }}
    >
      <p>Current theme: {theme}</p>
      <button onClick={toggle}>Toggle theme</button>
    </div>
  )
}

export default function UseContextDemo() {
  return (
    <section>
      <h2>useContext</h2>
      <ThemeProvider>
        <ThemedBox />
      </ThemeProvider>
    </section>
  )
}