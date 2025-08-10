import { useSyncExternalStore } from 'react'

function subscribe(callback: () => void) {
  window.addEventListener('resize', callback)
  return () => window.removeEventListener('resize', callback)
}

function getSnapshot() {
  return { width: window.innerWidth, height: window.innerHeight }
}

export default function UseSyncExternalStoreDemo() {
  const size = useSyncExternalStore(subscribe, getSnapshot)
  return (
    <section>
      <h2>useSyncExternalStore</h2>
      <p>
        Window size: {size.width} x {size.height}
      </p>
    </section>
  )
}