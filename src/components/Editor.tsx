import React, { useCallback, useRef, useState, useEffect } from 'react'
import { EditorProps, RichTextDocument, Range, Point } from '../core/types'
import { createDocument, isElement, isText, toggleMark, setBlock, doUndo, doRedo } from '../core/editor'
import { EditorContext } from '../context/EditorContext'
import { RenderElement } from './RenderElement'
import { RenderLeaf } from './RenderLeaf'
import { Toolbar } from './Toolbar'
import '../styles/editor.css'

function getPathFromNode(node: Node, root: HTMLElement): number[] | null {
  // Tìm data-path gần nhất
  let el = node instanceof HTMLElement ? node : node.parentElement
  while (el && el !== root) {
    const path = el.getAttribute && el.getAttribute('data-path')
    if (path) return path.split(',').map(Number)
    el = el.parentElement
  }
  return null
}

export const Editor: React.FC<EditorProps> = ({
  value: initialValue,
  onChange,
  placeholder = 'Start typing...',
  readOnly = false,
  className = '',
  style,
}) => {
  const [value, setValue] = useState<RichTextDocument>(initialValue || createDocument())
  const [selection, setSelection] = useState<Range | null>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const [history, setHistory] = useState<RichTextDocument[]>([])
  const [redoStack, setRedoStack] = useState<RichTextDocument[]>([])

  // Cập nhật value khi prop thay đổi
  useEffect(() => {
    if (initialValue) setValue(initialValue)
  }, [initialValue])

  // Mapping selection DOM -> JSON
  const saveSelection = useCallback(() => {
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0 || !editorRef.current) return
    const range = sel.getRangeAt(0)
    const anchorPath = getPathFromNode(range.startContainer.parentElement || range.startContainer as any, editorRef.current)
    const focusPath = getPathFromNode(range.endContainer.parentElement || range.endContainer as any, editorRef.current)
    if (anchorPath && focusPath) {
      setSelection({
        anchor: { path: anchorPath, offset: range.startOffset },
        focus: { path: focusPath, offset: range.endOffset }
      })
    }
  }, [])

  useEffect(() => {
    document.addEventListener('selectionchange', saveSelection)
    return () => document.removeEventListener('selectionchange', saveSelection)
  }, [saveSelection])

  const handleChange = useCallback((newValue: RichTextDocument) => {
    setValue(newValue)
    onChange?.(newValue)
  }, [onChange])

  // Xử lý insertText chuẩn
  const handleInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    if (readOnly || !selection) return
    // Chỉ xử lý block đầu tiên, text đầu tiên
    const { anchor } = selection
    const text = (e.target as HTMLDivElement).innerText
    const newDoc = [...value]
    if (newDoc[anchor.path[0]] && isElement(newDoc[anchor.path[0]])) {
      const block = newDoc[anchor.path[0]]
      if (block.children[anchor.path[1]] && isText(block.children[anchor.path[1]])) {
        (block.children[anchor.path[1]] as any).text = text
      }
    }
    handleChange(newDoc)
  }, [handleChange, readOnly, selection, value])

  // Xử lý toggle mark
  const handleMark = useCallback((mark: 'bold' | 'italic' | 'underline' | 'code') => {
    if (!selection) return
    const newDoc = toggleMark(value, selection, mark)
    handleChange(newDoc)
  }, [value, selection, handleChange])

  // Xử lý phím tắt
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'b' || e.key === 'B') {
        e.preventDefault(); handleMark('bold')
      } else if (e.key === 'i' || e.key === 'I') {
        e.preventDefault(); handleMark('italic')
      } else if (e.key === 'u' || e.key === 'U') {
        e.preventDefault(); handleMark('underline')
      } else if (e.key === '`') {
        e.preventDefault(); handleMark('code')
      }
    }
    // TODO: Xử lý Enter (insertParagraph), Backspace, Tab, ...
  }, [handleMark])

  // Xử lý setBlock
  const handleBlock = useCallback((block: 'heading' | 'paragraph' | 'blockquote' | 'bulleted-list' | 'numbered-list') => {
    if (!selection) return
    let extra = undefined
    if (block === 'heading') extra = { level: 2 }
    const newDoc = setBlock(value, selection.anchor.path, block, extra)
    setHistory(h => [...h, value])
    setRedoStack([])
    handleChange(newDoc)
  }, [value, selection, handleChange])

  // Undo/Redo chuẩn
  const handleUndo = useCallback(() => {
    const result = doUndo(history, redoStack, value)
    setHistory(result.history)
    setRedoStack(result.redoStack)
    handleChange(result.value)
  }, [history, redoStack, value, handleChange])

  const handleRedo = useCallback(() => {
    const result = doRedo(history, redoStack, value)
    setHistory(result.history)
    setRedoStack(result.redoStack)
    handleChange(result.value)
  }, [history, redoStack, value, handleChange])

  return (
    <EditorContext.Provider value={{ value, selection, setValue: handleChange }}>
      <Toolbar onMark={handleMark} onBlock={handleBlock} onUndo={handleUndo} onRedo={handleRedo} />
      <div
        ref={editorRef}
        className={`nextjs-editor ${className}`}
        style={style}
        contentEditable={!readOnly}
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        data-placeholder={placeholder}
      >
        {value.map((element, idx) =>
          isElement(element) ? (
            <RenderElement key={idx} element={element} attributes={{ 'data-path': `${idx}` }}>
              {element.children.map((child, cidx) =>
                isText(child) ? (
                  <RenderLeaf key={cidx} leaf={child} attributes={{ 'data-path': `${idx},${cidx}` }}>
                    {child.text}
                  </RenderLeaf>
                ) : null
              )}
            </RenderElement>
          ) : null
        )}
      </div>
    </EditorContext.Provider>
  )
} 