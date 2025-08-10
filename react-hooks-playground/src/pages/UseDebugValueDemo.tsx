import { useDebugValue, useEffect, useState } from 'react'

function useOnlineStatus() {
  const [online, setOnline] = useState<boolean>(navigator.onLine)
  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])
  useDebugValue(online ? 'online' : 'offline')
  return online
}

export default function UseDebugValueDemo() {
  const online = useOnlineStatus()
  return (
    <section>
      <h2>useDebugValue</h2>
      <p>Status: {online ? 'Online' : 'Offline'}</p>
    </section>
  )
}