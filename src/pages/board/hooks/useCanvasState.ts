import { useState,type Dispatch, type SetStateAction  } from "react"
import type { CanvasActionType, DrawingToolType, ElementInterface, ElementPosition, PointsInterface } from "../types";
import { useHistory, type HistorySetState } from "./useHistory";

interface IntetactionStateType {
    offsetX: number
    offsetY: number

    xOffsets: number[]
    yOffsets: number[]

    position: ElementPosition | null
}

export interface CanvasState {
    elements: ElementInterface[],
    selectedElementId: string | null
    tool: DrawingToolType,
    action: CanvasActionType,
    panOffset: PointsInterface,
    startPanMousePosition: PointsInterface,
    scale: number,
    scaleOffset: PointsInterface

    interactionState: IntetactionStateType
}

export interface CanvasActions {
    setElements: HistorySetState<ElementInterface[]>
    setSelectedElementId: Dispatch<SetStateAction<string | null>>
    setTool: (tool: DrawingToolType) => void
    setAction: (action: CanvasActionType) => void
    setPanOffset: Dispatch<SetStateAction<PointsInterface>>
    setStartPanMousePosition: Dispatch<SetStateAction<PointsInterface>>
    setScale: Dispatch<SetStateAction<number>>
    setScaleOffset: Dispatch<SetStateAction<PointsInterface>>
    undo: () => void
    redo: () => void

    setInteractionState: Dispatch<SetStateAction<IntetactionStateType>>
}

interface UseCanvasStateReturn {
    canvasState: CanvasState
    canvasActions: CanvasActions
}

export function useCanvasState(): UseCanvasStateReturn  {
    const [elements, setElements, undo, redo] = useHistory<ElementInterface[]>([])
    const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
    
    const [interactionState, setInteractionState] = useState<IntetactionStateType>({
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