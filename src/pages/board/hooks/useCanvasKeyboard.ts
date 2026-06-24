import { useEffect } from "react"
import type { ElementInterface } from "../types"
import type { CanvasState, CanvasActions } from "./useCanvasState"

interface UseCanvasKeyboardProps {
  canvasState: CanvasState,
  canvasActions: CanvasActions,
  pressedKeys: ReadonlySet<string>,
  onZoom: (delta: number) => void
}

export function useCanvasKeyboard({
  canvasState,
  canvasActions,
  pressedKeys,
  onZoom,
}: UseCanvasKeyboardProps) {
  const {selectedElementId} = canvasState
  const {redo, undo, setElements, setAction, setSelectedElementId, setPanOffset} = canvasActions
  
  // ---------- Keyboard ----------
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement

      // игнорируем ввод в инпутах / textarea
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return
      }

      const isCtrlOrMeta = event.ctrlKey || event.metaKey 

      // Undo
      if (isCtrlOrMeta && event.key === 'z' && !event.shiftKey) {
        event.preventDefault()
        undo()
        setSelectedElementId(null)
        setAction("none")
      }

      // Redo 
      if (
        (isCtrlOrMeta && event.key === 'z' && event.shiftKey) || 
        (event.ctrlKey && event.key === 'y')
      ) {
        event.preventDefault()
        redo()
      }

      // Delete
      if (event.key === "Delete" && selectedElementId) {
        event.preventDefault()

        setElements((prev: ElementInterface[]) =>
          prev.filter(el => el.id !== selectedElementId)
        )
        setSelectedElementId(null)
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [undo, redo, selectedElementId, setSelectedElementId, setElements])

  // ---------- Wheel (pan / zoom) ----------
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
        // Zoom
        const isCtrlOrMeta = pressedKeys.has("Meta") || pressedKeys.has("Control")
        
        if (isCtrlOrMeta) {
            event.preventDefault()
            onZoom(event.deltaY * -0.01)
            return
        }

        // Pan
        setPanOffset((prev: { x: number; y: number }) => ({
          x: prev.x - event.deltaX,
          y: prev.y - event.deltaY
        }))
    }

    document.addEventListener("wheel", handleWheel, { passive: false })

    return () => {
      document.removeEventListener("wheel", handleWheel)
    }
  }, [pressedKeys, onZoom, setPanOffset])
}
