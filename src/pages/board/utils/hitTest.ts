import type { ElementInterface, ElementPosition, PointsInterface } from "../types"
import { distance } from "./index"

// Функция от зазеркаливания элемента, когда точки ломаются
const normalizeBounds = (x1: number, y1: number, x2: number, y2: number) => {
    const left= Math.min(x1, x2)
    const right = Math.max(x1, x2)

    const top = Math.min(y1, y2)
    const bottom = Math.max(y1, y2)

    return { left, right, top, bottom }
} 

// Вычисление ближайшей точки
export const nearPoint = (mouseX: number, mouseY: number, x1: number, y1: number, name: ElementPosition): ElementPosition | null => {
    return Math.abs(mouseX - x1) < 5 && Math.abs(mouseY - y1) < 5 ? name : null
}

// Проверка на нахождение внутри линии при клике

export const onLine = (x1: number, y1: number, x2: number, y2: number, mouseX: number, mouseY: number, maxDistance = 1): ElementPosition | null => {
    const a = {x: x1, y: y1}
    const b = {x: x2, y: y2}
    const c = {x: mouseX, y: mouseY}
    const offset = distance(a, b) - (distance(a, c) + distance(b, c))
    return  Math.abs(offset) < maxDistance ? "inside" : null
}

// Позиционирование внутри элемента
export const positionWithinElement = (mouseX: number, mouseY: number, element: ElementInterface): ElementPosition | null => {
    const {type, x1, x2, y1, y2} = element
    
    switch(type) {
        case "line": {
            const on = onLine(x1, y1, x2, y2, mouseX, mouseY)
            const start = nearPoint(mouseX, mouseY, x1, y1, "start")
            const end = nearPoint(mouseX, mouseY, x2, y2, "end")
            return start || end || on
        }
        
        case "rectangle":
        case "image":
        case "circle": {
            // Рассчитываем, нажал ли пользователь внутри нужной фигуры, между ее X и Y краями
            const bounds = normalizeBounds(x1, y1, x2, y2)

            const topLeft = nearPoint(mouseX, mouseY, bounds.left, bounds.top, "tl")
            const topRight = nearPoint(mouseX, mouseY, bounds.right, bounds.top, "tr")
            const bottomLeft = nearPoint(mouseX, mouseY, bounds.left, bounds.bottom, "bl")
            const bottomRight = nearPoint(mouseX, mouseY, bounds.right, bounds.bottom, "br")

            const inside = 
                mouseX >= bounds.left && 
                mouseX <= bounds.right && 
                mouseY >= bounds.top && 
                mouseY <= bounds.bottom 
                    ? "inside" 
                    : null
            
            return topLeft || topRight || bottomLeft || bottomRight || inside
        }

        case "pencil": {
            const betweenAnyPoint = element.points.some((point: PointsInterface, index: number) => {
                const nextPoint = element.points[index + 1]
                if (!nextPoint) return false
                return onLine(point.x, point.y, nextPoint.x, nextPoint.y, mouseX, mouseY, 5) != null
            })
            return betweenAnyPoint ? "inside" : null
        }

        case "text":
             return mouseX >= x1 && mouseX <= x2 && mouseY >= y1 && mouseY <= y2 ? "inside" : null

        default: 
            throw new Error(`Type not recognised: ${type}`)
    }
}

// Определяем вид курсора при наведении на фигуру
export const cursorForPosition = (position: ElementPosition) => {
    switch (position) {
        case "tl":
        case "br":
        case "start":
        case "end":
            return "nwse-resize"
        case "tr":
        case "bl":
            return "nesw-resize"
        default:
            return "move"
    }
}