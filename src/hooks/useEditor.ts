import { useContext } from 'react'
import { EditorContext, EditorContextType } from '../context/EditorContext'

export function useEditor(): EditorContextType | undefined {
  return useContext(EditorContext)
} 