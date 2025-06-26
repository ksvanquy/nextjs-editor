// Main exports
export * from './components'

// Hooks
export * from './hooks/useEditor'
export * from './hooks/useHistory'

// Types & Core
export * from './core/types'
export * from './core/editor'

// Context
export { useEditor as useEditorContext } from './context/EditorContext'

// Styles (chỉ import nếu dùng với webpack/vite)
// import './styles/editor.css'

export function helloWorld(): string {
  return 'Hello, world!';
} 