import rough from 'roughjs'
import getStroke from "perfect-freehand"
import type { RoughCanvas } from 'roughjs/bin/canvas'
import type { ElementInterface, ImageElement, PencilElement, TextElement } from "../types"

const generator = rough.generator()

// Функция отрисовки элементов на полотне
export const drawElement = (roughCanvas: RoughCanvas, context: CanvasRenderingContext2D, element: ElementInterface) => {
    // console.log('Ловлю цвет: ', element?.roughElement?.options?.stroke, ' : ', element.options?.stroke);
    switch(element.type) {
        case "line": {
            const roughElement = generator.line(
                element.x1,
                element.y1,
                element.x2,
                element.y2,
                element.options
            )
            // context.globalAlpha = element.options.opacity
            roughCanvas.draw(roughElement)
            break
        }
   
        case "rectangle": {
            const roughElement = generator.rectangle(
                element.x1,
                element.y1,
                element.x2 - element.x1,
                element.y2 - element.y1,
                element.options
            )
            context.save()
            context.globalAlpha = element.options.opacity

            roughCanvas.draw(roughElement)

            context.restore()
            break
        }

        case "circle": {
            const width = element.x2 - element.x1
            const height = element.y2 - element.y1

            const roughElement = generator.ellipse(
                element.x1 + width / 2,
                element.y1 + height / 2,
                Math.abs(width),
                Math.abs(height),
                element.options
            )

            roughCanvas.draw(roughElement)

            break
        }

        case "pencil":
            drawPencil(context, element)
            break

        case "text":
            drawText(context, element)
            break

        case "image": 
            context.save()
            context.globalAlpha = element.options.opacity

            drawImageElement(context, element)

            context.restore()
            break
    }
}

function drawPencil(context: CanvasRenderingContext2D, element: PencilElement) {
    const options = { 
        size: element.options.strokeWidth,
        thinning: 0.5,
        smoothing: 0.5,
        streamline: 0.5,
    }
    
    const stroke = getSvgPathfromStroke(getStroke(element.points, options))
    context.fillStyle = element.options.stroke
    context.fill(new Path2D(stroke))
}

function drawText(context: CanvasRenderingContext2D, element: TextElement) {
    context.textBaseline = "top"
    context.font = `${element.fontStyle} ${element.fontSize} sans-serif`
    context.fillStyle = element.options.stroke
    context.fillText(element.text, element.x1, element.y1)
}

function drawImageElement(context: CanvasRenderingContext2D, element: ImageElement) {
    const image = new Image()

    image.src = element.src

    context.drawImage(
        image,
        element.x1,
        element.y1,
        element.x2 - element.x1,
        element.y2 - element.y1
    )
}

function getSvgPathfromStroke(stroke: number[][]): string {
    if (!stroke.length) return ""

    const d = stroke.reduce(
        (acc, [x0, y0], i, arr) => {
            const [x1, y1] = arr[(i + 1) % arr.length]
            acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) /2)
            return acc
        },
        ["M", ...stroke[0], "Q"]
    )

    d.push("Z")
    return d.join(" ")
}