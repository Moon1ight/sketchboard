import type { CoordinatesInterface, ElementInterface, DrawingElementType, ElementPosition  } from "../types"
import { positionWithinElement } from "./index"

// Простая проверка на тип
export const adjustmentRequired = (type: DrawingElementType ) => type === 'line' || type === 'rectangle'

// Элемент под курсором?
export const getElementAtPosition = (mouseX: number, mouseY: number, elements: ElementInterface[]) => {
    for (const element of elements) {
        const position = positionWithinElement(mouseX, mouseY, element)
        if (position !== null) {
            return {
                ...element,
                position,
            }
        }
    }

  return null
}

// Элемент попадает в selection box?
// export const isElementInsideSelectionBox = (element: ElementInterface, box: SelectionBox) => {
//     const minX = Math.min(box.x1, box.x2)
//     const maxX= Math.max(box.x1, box.x2)

//     const minY= Math.min(box.y1, box.y2)
//     const maxY= Math.max(box.y1, box.y2)

//     return (
//         element.x1 >= minX &&
//         element.x2 <= maxX &&
//         element.y1 >= minY &&
//         element.y2 <= maxY
//     )
// }

export const adjustElementCoordinates = (element: ElementInterface) => {
    const { type, x1, y1, x2, y2 } = element

    if (type === 'rectangle') {
        return {
            x1: Math.min(x1, x2),
            y1: Math.min(y1, y2),
            x2: Math.max(x1, x2),
            y2: Math.max(y1, y2)
        }
    }

    if (x1 < x2 || (x1 === x2 && y1 < y2)) {
        return {x1, y1, x2, y2}
    }

    return {x1: x2, y1: y2, x2: x1, y2: y1}
}

export const resizedCoordinates = (mouseX: number, mouseY: number, position: ElementPosition | null, coordinates: CoordinatesInterface) => {
    const {x1, y1, x2, y2} = coordinates

    switch(position) {
        case "tl": 
        case "start":
            return {x1: mouseX, y1: mouseY, x2, y2}
        case "tr":
            return {x1, y1: mouseY, x2: mouseX, y2}
        case "bl":
            return {x1: mouseX, y1, x2, y2: mouseY}
        case "br":
        case "end":
            return {x1, y1, x2: mouseX, y2: mouseY}
        default: 
            return null
    }
}