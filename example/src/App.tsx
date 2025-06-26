import { useState } from 'react'
import { Editor, type RichTextDocument } from '../../src'
import './App.css'

const initialValue: RichTextDocument = [
  {
    type: 'heading',
    level: 2,
    children: [
      { text: 'Rich Text Editor Demo', bold: true }
    ]
  },
  {
    type: 'paragraph',
    children: [
      { text: 'Bạn có thể nhập văn bản, xuống dòng, và dữ liệu sẽ được tổ chức dạng JSON giống Slate.' }
    ]
  }
]

function App() {
  const [value, setValue] = useState<RichTextDocument>(initialValue)

  return (
    <div style={{ maxWidth: 700, margin: '40px auto' }}>
      <Editor value={value} onChange={setValue} />
      <h2>JSON Output</h2>
      <pre style={{ background: '#f5f5f5', padding: 16, borderRadius: 8, fontSize: 14 }}>
        {JSON.stringify(value, null, 2)}
      </pre>
    </div>
  )
}

export default App
