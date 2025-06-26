import {
  RichText,
  Element,
  RichTextDocument,
  Point,
  Range
} from './types'

// Tạo document mặc định
export function createDocument(): RichTextDocument {
  return [
    {
      type: 'paragraph',
      children: [
        { text: '' }
      ]
    }
  ]
}

// Kiểm tra node là text
export function isText(node: Element | RichText): node is RichText {
  return typeof node === 'object' && 'text' in node
}

// Kiểm tra node là element
export function isElement(node: Element | RichText): node is Element {
  return typeof node === 'object' && 'type' in node && Array.isArray(node.children)
}

// Lấy node tại path
export function getNodeAtPath(doc: RichTextDocument, path: number[]): Element | RichText | null {
  let node: Element | RichText = doc[path[0]]
  for (let i = 1; i < path.length; i++) {
    if (isElement(node)) {
      node = node.children[path[i]]
    } else {
      return null
    }
  }
  return node
}

// Lấy text tại path
export function getTextAtPath(doc: RichTextDocument, path: number[]): string {
  const node = getNodeAtPath(doc, path)
  if (node && isText(node)) {
    return node.text
  }
  return ''
}

// Thêm text tại point
export function insertText(doc: RichTextDocument, point: Point, text: string): RichTextDocument {
  const newDoc = JSON.parse(JSON.stringify(doc)) as RichTextDocument
  const node = getNodeAtPath(newDoc, point.path)
  if (node && isText(node)) {
    const before = node.text.slice(0, point.offset)
    const after = node.text.slice(point.offset)
    node.text = before + text + after
  }
  return newDoc
}

// Xóa text trong range (chỉ hỗ trợ cùng 1 text node)
export function deleteText(doc: RichTextDocument, range: Range): RichTextDocument {
  const newDoc = JSON.parse(JSON.stringify(doc)) as RichTextDocument
  if (JSON.stringify(range.anchor.path) === JSON.stringify(range.focus.path)) {
    const node = getNodeAtPath(newDoc, range.anchor.path)
    if (node && isText(node)) {
      const before = node.text.slice(0, range.anchor.offset)
      const after = node.text.slice(range.focus.offset)
      node.text = before + after
    }
  }
  return newDoc
}

// Toggle mark (bold, italic, underline, code)
export function toggleMark(doc: RichTextDocument, range: Range, mark: 'bold' | 'italic' | 'underline' | 'code'): RichTextDocument {
  const newDoc = JSON.parse(JSON.stringify(doc)) as RichTextDocument
  if (JSON.stringify(range.anchor.path) === JSON.stringify(range.focus.path)) {
    const node = getNodeAtPath(newDoc, range.anchor.path)
    if (node && isText(node)) {
      node[mark] = !node[mark]
    }
  }
  return newDoc
}

// Tạo paragraph mới
export function createParagraph(): Element {
  return {
    type: 'paragraph',
    children: [{ text: '' }]
  }
}

// Split node tại point (chỉ hỗ trợ text node)
export function splitNode(doc: RichTextDocument, point: Point): RichTextDocument {
  const newDoc = JSON.parse(JSON.stringify(doc)) as RichTextDocument
  const node = getNodeAtPath(newDoc, point.path)
  if (node && isText(node)) {
    const before = node.text.slice(0, point.offset)
    const after = node.text.slice(point.offset)
    node.text = before
    const newText: RichText = { text: after }
    // Tìm parent element và chèn newText vào sau node hiện tại
    let parent: Element | undefined = undefined
    if (point.path.length > 1) {
      parent = getNodeAtPath(newDoc, point.path.slice(0, -1)) as Element
    }
    if (parent && isElement(parent)) {
      parent.children.splice(point.path[point.path.length - 1] + 1, 0, newText)
    }
  }
  return newDoc
}

// Đổi kiểu block (heading, paragraph, blockquote, list)
export function setBlock(doc: RichTextDocument, path: number[], type: string, extra?: any): RichTextDocument {
  const newDoc = JSON.parse(JSON.stringify(doc)) as RichTextDocument
  const block = newDoc[path[0]]
  if (block && typeof block === 'object') {
    block.type = type
    if (type === 'heading' && extra?.level) block.level = extra.level
    if (type === 'bulleted-list') block.listType = 'unordered'
    if (type === 'numbered-list') block.listType = 'ordered'
    if (type !== 'heading') delete block.level
    if (type !== 'bulleted-list' && type !== 'numbered-list') delete block.listType
  }
  return newDoc
}

// Undo/Redo chuẩn
export function doUndo(history: RichTextDocument[], redoStack: RichTextDocument[], current: RichTextDocument) {
  if (history.length === 0) return { value: current, history, redoStack }
  const prev = history[history.length - 1]
  return {
    value: prev,
    history: history.slice(0, -1),
    redoStack: [current, ...redoStack]
  }
}

export function doRedo(history: RichTextDocument[], redoStack: RichTextDocument[], current: RichTextDocument) {
  if (redoStack.length === 0) return { value: current, history, redoStack }
  const next = redoStack[0]
  return {
    value: next,
    history: [...history, current],
    redoStack: redoStack.slice(1)
  }
}
  