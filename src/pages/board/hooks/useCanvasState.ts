import { useState,type Dispatch, type SetStateAction  } from "react"
import type { CanvasActionType, DrawingToolType, ElementInterface, ElementPosition, PointsInterface } from "../types";
import { useHistory } from "./useHistory";

export interface CanvasState {
    elements: ElementInterface[],
    selectedElementId: string | null
    tool: DrawingToolType,
    action: CanvasActionType,
    panOffset: PointsInterface,
    startPanMousePosition: PointsInterface,
    scale: number,
    scaleOffset: PointsInterface

    interactionState: {
        offsetX: number
        offsetY: number

        xOffsets: number[]
        yOffsets: number[]

        position: ElementPosition | null
    }
}

export interface CanvasActions {
    setElements: Dispatch<SetStateAction<ElementInterface[]>>
    setSelectedElementId: Dispatch<SetStateAction<string | null>>
    setTool: (tool: DrawingToolType) => void
    setAction: (action: CanvasActionType) => void
    setPanOffset: Dispatch<SetStateAction<PointsInterface>>
    setStartPanMousePosition: Dispatch<SetStateAction<PointsInterface>>
    setScale: Dispatch<SetStateAction<number>>
    setScaleOffset: Dispatch<SetStateAction<PointsInterface>>
    undo: () => void
    redo: () => void

    setInteractionState: any
}

interface UseCanvasStateReturn {
    canvasState: CanvasState
    canvasActions: CanvasActions
}

export function useCanvasState(): UseCanvasStateReturn  {
    const [elements, setElements, undo, redo] = useHistory<ElementInterface[]>([])
    const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
    
    const [interactionState, setInteractionState] = useState({
        offsetX: 0,
        offsetY: 0,

        xOffsets: [],
        yOffsets: [],

        position: null
    })

    const [tool, setTool] = useState<DrawingToolType>("selection")
    const [action, setAction] = useState<CanvasActionType>("none")

    const [panOffset, setPanOffset] = useState<PointsInterface>({x: 0, y: 0})
    const [startPanMousePosition, setStartPanMousePosition] = useState<PointsInterface>({x: 0, y: 0})
    const [scale, setScale] = useState(1)
    const [scaleOffset, setScaleOffset] = useState<PointsInterface>({x: 0, y: 0})

    return {
        canvasState: {
            elements,
            selectedElementId,
            tool,
            action,
            panOffset,
            startPanMousePosition,
            scale,
            scaleOffset,
            interactionState
        },
        canvasActions: {
            setElements,
            setSelectedElementId,
            setTool,
            setAction,
            setPanOffset,
            setStartPanMousePosition,
            setScale,
            setScaleOffset,
            undo,
            redo,
            setInteractionState
        }
    }
}