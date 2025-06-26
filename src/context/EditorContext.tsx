import React, { createContext, useContext } from 'react'
import { RichTextDocument, Range } from '../core/types'

export interface EditorContextType {
  value: RichTextDocument
  selection: Range | null
  setValue: (value: RichTextDocument) => void
}

export const EditorContext = createContext<EditorContextType | undefined>(undefined)

export function useEditor(): EditorContextType {
  const context = useContext(EditorContext)
  if (!context) {
    throw new Error('useEditor must be used within Editor component')
  }
  return context
} 