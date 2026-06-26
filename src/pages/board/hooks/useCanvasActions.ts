import { useCallback } from 'react';
import type { ElementInterface, ElementSettingsInterface, PointsInterface } from '../types';

interface UseCanvasActionProps {
    elements: ElementInterface[],
    setElements: (elements: ElementInterface[], overwrite?: boolean) => void,
    canvasRef: React.RefObject<HTMLCanvasElement | null>
}

type ElementUpdates = {
    x1?: number
    y1?: number
    x2?: number
    y2?: number

    options?: Partial<ElementSettingsInterface>

    text?: string
    points?: PointsInterface[]
}

export const useCanvasActions = ({
    elements,
    setElements,
    canvasRef,
}: UseCanvasActionProps) => {

    //=== Обновление элемента
    const updateElement = useCallback((
        id: string,
        updates: ElementUpdates
    ) => {
        const elementsCopy = [...elements]
        const elementIndex = elementsCopy.findIndex(el => el.id === id)

        const { options, ...restUpdates } = updates

        if (elementIndex === -1) return

        const element = elementsCopy[elementIndex]

        switch (element.type) {
            case 'line':
            case 'rectangle':
            case 'circle':
            case 'image':
                elementsCopy[elementIndex] = {
                    ...elementsCopy[elementIndex],
                    ...updates,
                    options: updates.options
                        ? { ...elementsCopy[elementIndex].options, ...updates.options }
                        : elementsCopy[elementIndex].options
                }
                break
            
            case 'pencil': 
                elementsCopy[elementIndex] = {
                    ...element, 
                    ...restUpdates,
                    options: options
                        ? {
                            ...element.options,
                            ...options
                        }
                        : element.options
                }
                break

            case 'text': {
                const ctx = canvasRef.current?.getContext("2d")
                if (!ctx) return

                const newText = updates.text ?? element.text

                ctx.font = "24px sans-serif"
                const textWidth = ctx.measureText(newText).width
                const textHeight = 24

                elementsCopy[elementIndex] = {
                    ...element,
                    ...restUpdates,
                    options: options
                        ? {
                            ...element.options,
                            ...options,
                        }
                        : element.options,
                    text: newText,
                    x2: element.x1 + textWidth,
                    y2: element.y1 + textHeight
                }
                break
            }

            default: {
                const _exhaustive: never = element
                return _exhaustive
            }
        }

        

        setElements(elementsCopy, true)
    }, [setElements])

    return {
        updateElement
    }
}