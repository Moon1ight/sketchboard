import React from "react"
import type { CanvasState } from "../hooks/useCanvasState"
import type { ElementInterface } from "../types"

interface TextEditorOverlayProps {
  selectedElement: ElementInterface | null
  canvasState: CanvasState
  textAreaRef: React.RefObject<HTMLTextAreaElement | null>
  onSubmit: (text: string) => void
  color: string
}

export function TextEditorOverlay({ selectedElement, canvasState, textAreaRef, onSubmit, color }: TextEditorOverlayProps) {
  const {action, scale, panOffset, scaleOffset} = canvasState

  if (action !== "writing" || !selectedElement) {
    return null
  }

  const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    const nextFocusedElement = event.relatedTarget as HTMLElement | null

    if (nextFocusedElement?.closest(".tools-options")) {
      return
    }

    onSubmit(event.target.value)
  }

  return (
    <textarea
      ref={textAreaRef}
      onBlur={handleBlur}
      className="absolute z-2 border-0 outline-none overflow-hidden resize-none"
      style={{
        top:
          (selectedElement?.y1 - 7) * scale +
          panOffset.y * scale -
          scaleOffset.y,
        left:
          selectedElement?.x1 * scale +
          panOffset.x * scale -
          scaleOffset.x,
        fontSize: `${44 * scale}px`,
        fontFamily: "sans-serif",
        color
      }}
    />
  )
}
