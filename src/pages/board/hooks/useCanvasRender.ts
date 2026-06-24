import { useLayoutEffect } from "react"
import rough from "roughjs"
import { drawElement } from "../utils"
import type { CanvasState } from "./useCanvasState"
import type { ElementInterface } from "../types"

interface UseCanvasRenderProps {
  selectedElement: ElementInterface | null
  canvasState: CanvasState
  canvasRef: React.RefObject<HTMLCanvasElement | null>
}

export function useCanvasRender({ selectedElement, canvasState, canvasRef }: UseCanvasRenderProps) {
  const {action, elements, selectedElementId, scale, scaleOffset, panOffset} = canvasState
  
  useLayoutEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    const roughCanvas = rough.canvas(canvas)

    // clear
    context.clearRect(0, 0, canvas.width, canvas.height)

    // Цвет полотна
    context.fillStyle = "rgb(255, 255, 255)"
    context.fillRect(0, 0, canvas.width, canvas.height)

    context.save()

    context.translate(
      panOffset.x * scale - scaleOffset.x,
      panOffset.y * scale - scaleOffset.y
    )

    context.scale(scale, scale)

    // Отрисовка элементов
    elements.forEach((element) => {
      if (action === "writing" && selectedElementId === element.id) return
      drawElement(roughCanvas, context, element)
    })

    // Отрисовка рамки вокруг выбранного элемента
    if (selectedElementId) {
      drawSelectionBox(context, selectedElement)
    }

    context.restore()
  }, [elements, action, selectedElementId, panOffset, scale, scaleOffset])
}

function drawSelectionBox(context: CanvasRenderingContext2D, element: ElementInterface | null) {
  context.save()

  if (!element) return

  context.strokeStyle = "#6055ff"
  context.lineWidth = 5
  context.setLineDash([5, 5])

  const width = element.x2 - element.x1
  const height = element.y2 - element.y1

  context.strokeRect(element.x1, element.y1, width, height)

  context.restore()
}