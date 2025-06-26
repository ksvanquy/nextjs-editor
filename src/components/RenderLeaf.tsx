import React from 'react'
import type { RenderLeafProps } from '../core/types'

export const RenderLeaf: React.FC<RenderLeafProps> = ({ leaf, children, attributes }) => {
  let style: React.CSSProperties = {}
  if (leaf.bold) style.fontWeight = 'bold'
  if (leaf.italic) style.fontStyle = 'italic'
  if (leaf.underline) style.textDecoration = 'underline'
  if (leaf.code) style.fontFamily = 'monospace'
  if (leaf.color) style.color = leaf.color
  return <span {...attributes} style={style}>{children}</span>
} 