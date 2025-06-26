// Rich Text Editor Types (theo chuẩn Slate)

// Text node (leaf)
export type RichText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
  color?: string;
  // ...các mark khác
};

// Element node (block/inline)
export type Element = {
  type: string; // 'paragraph', 'heading', 'list-item', ...
  children: (Element | RichText)[];
  // ...các thuộc tính mở rộng, ví dụ: level, listType
  level?: number;
  listType?: 'ordered' | 'unordered';
};

// Root document
export type RichTextDocument = Element[];

// Selection, Point, Range (giữ lại cho thao tác selection)
export interface Point {
  path: number[];
  offset: number;
}

export interface Range {
  anchor: Point;
  focus: Point;
}

// Editor state
export interface EditorState {
  value: RichTextDocument;
  selection: Range | null;
  history: {
    undos: RichTextDocument[];
    redos: RichTextDocument[];
  };
}

// Editor props
export interface EditorProps {
  value?: RichTextDocument;
  onChange?: (value: RichTextDocument) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

// Render props (giữ lại cho custom render)
export interface RenderElementProps {
  element: Element;
  children: React.ReactNode;
  attributes: Record<string, any>;
}

export interface RenderLeafProps {
  leaf: RichText;
  children: React.ReactNode;
  attributes: Record<string, any>;
} 