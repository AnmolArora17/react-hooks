import type { RouteObject } from 'react-router-dom'

// Eager-load lightweight pages to improve initial navigation UX; heavier demos can be lazy-loaded if needed
import Home from './pages/Home'
import UseStateDemo from './pages/UseStateDemo'
import UseEffectDemo from './pages/UseEffectDemo'
import UseContextDemo from './pages/UseContextDemo'
import UseReducerDemo from './pages/UseReducerDemo'
import UseRefDemo from './pages/UseRefDemo'
import UseMemoDemo from './pages/UseMemoDemo'
import UseCallbackDemo from './pages/UseCallbackDemo'
import UseIdDemo from './pages/UseIdDemo'
import UseLayoutEffectDemo from './pages/UseLayoutEffectDemo'
import UseImperativeHandleDemo from './pages/UseImperativeHandleDemo'
import UseDebugValueDemo from './pages/UseDebugValueDemo'
import UseDeferredValueDemo from './pages/UseDeferredValueDemo'
import UseTransitionDemo from './pages/UseTransitionDemo'
import UseSyncExternalStoreDemo from './pages/UseSyncExternalStoreDemo'
import UseInsertionEffectDemo from './pages/UseInsertionEffectDemo'
import CustomHooksDemo from './pages/CustomHooksDemo'

export type AppRoute = {
  path: string
  label: string
  element: React.ReactElement
}

export const appRoutes: AppRoute[] = [
  { path: '/', label: 'Home', element: <Home /> },
  { path: '/use-state', label: 'useState', element: <UseStateDemo /> },
  { path: '/use-effect', label: 'useEffect', element: <UseEffectDemo /> },
  { path: '/use-context', label: 'useContext', element: <UseContextDemo /> },
  { path: '/use-reducer', label: 'useReducer', element: <UseReducerDemo /> },
  { path: '/use-ref', label: 'useRef', element: <UseRefDemo /> },
  { path: '/use-memo', label: 'useMemo', element: <UseMemoDemo /> },
  { path: '/use-callback', label: 'useCallback', element: <UseCallbackDemo /> },
  { path: '/use-id', label: 'useId', element: <UseIdDemo /> },
  { path: '/use-layout-effect', label: 'useLayoutEffect', element: <UseLayoutEffectDemo /> },
  { path: '/use-imperative-handle', label: 'useImperativeHandle', element: <UseImperativeHandleDemo /> },
  { path: '/use-debug-value', label: 'useDebugValue', element: <UseDebugValueDemo /> },
  { path: '/use-deferred-value', label: 'useDeferredValue', element: <UseDeferredValueDemo /> },
  { path: '/use-transition', label: 'useTransition', element: <UseTransitionDemo /> },
  { path: '/use-sync-external-store', label: 'useSyncExternalStore', element: <UseSyncExternalStoreDemo /> },
  { path: '/use-insertion-effect', label: 'useInsertionEffect', element: <UseInsertionEffectDemo /> },
  { path: '/custom-hooks', label: 'Custom Hooks', element: <CustomHooksDemo /> },
]

export const routerChildren: RouteObject[] = appRoutes.map((r) => {
  if (r.path === '/') return { index: true, element: r.element }
  return { path: r.path.replace(/^\//, ''), element: r.element }
})