import React from 'react'

interface ToolbarProps {
  onMark: (mark: 'bold' | 'italic' | 'underline' | 'code') => void
  onBlock: (block: 'heading' | 'paragraph' | 'blockquote' | 'bulleted-list' | 'numbered-list') => void
  onUndo: () => void
  onRedo: () => void
}

export const Toolbar: React.FC<ToolbarProps> = ({ onMark, onBlock, onUndo, onRedo }) => {
  return (
    <div style={{ borderBottom: '1px solid #eee', padding: 8, marginBottom: 8, display: 'flex', gap: 8 }}>
      <button type="button" onMouseDown={e => { e.preventDefault(); onMark('bold') }}><b>B</b></button>
      <button type="button" onMouseDown={e => { e.preventDefault(); onMark('italic') }}><i>I</i></button>
      <button type="button" onMouseDown={e => { e.preventDefault(); onMark('underline') }}><u>U</u></button>
      <button type="button" onMouseDown={e => { e.preventDefault(); onMark('code') }}>{'<>'}</button>
      <button type="button" onMouseDown={e => { e.preventDefault(); onBlock('heading') }}>H2</button>
      <button type="button" onMouseDown={e => { e.preventDefault(); onBlock('blockquote') }}>❝</button>
      <button type="button" onMouseDown={e => { e.preventDefault(); onBlock('bulleted-list') }}>• List</button>
      <button type="button" onMouseDown={e => { e.preventDefault(); onBlock('numbered-list') }}>1. List</button>
      <button type="button" onMouseDown={e => { e.preventDefault(); onUndo() }}>⎌ Undo</button>
      <button type="button" onMouseDown={e => { e.preventDefault(); onRedo() }}>⎌ Redo</button>
    </div>
  )
} 