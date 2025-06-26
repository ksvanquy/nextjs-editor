import React from 'react'
import type { RenderElementProps } from '../core/types'

export const RenderElement: React.FC<RenderElementProps> = ({ element, children, attributes }) => {
  switch (element.type) {
    case 'heading':
      return <h2 {...attributes}>{children}</h2>
    case 'blockquote':
      return <blockquote {...attributes}>{children}</blockquote>
    case 'list-item':
      return <li {...attributes}>{children}</li>
    default:
      return <p {...attributes}>{children}</p>
  }
} 