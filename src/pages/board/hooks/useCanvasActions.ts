import { useCallback } from 'react';
import type { ElementInterface } from '../types';

interface UseCanvasActionProps {
    elements: ElementInterface[],
    setElements: any,
    canvasRef: React.RefObject<HTMLCanvasElement | null>
}

export const useCanvasActions = ({
    elements,
    setElements,
    canvasRef,
}: UseCanvasActionProps) => {

    //=== Обновление элемента
    const updateElement = useCallback((
        id: string,
        updates: any
        // updates: Partial<ElementInterface>
    ) => {
        const elementsCopy = [...elements]
        const elementIndex = elementsCopy.findIndex(el => el.id === id)

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
                    ...updates
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
                    ...updates,
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