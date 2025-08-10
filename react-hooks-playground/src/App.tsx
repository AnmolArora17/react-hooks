import { NavLink, Outlet } from 'react-router-dom'
import './App.css'
import { appRoutes } from './routes'

function App() {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <h2>React Hooks Playground</h2>
        <nav>
          <ul>
            {appRoutes.map((route) => (
              <li key={route.path}>
                <NavLink
                  to={route.path}
                  className={({ isActive }) => (isActive ? 'active' : undefined)}
                  end
                >
                  {route.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}

export default App
