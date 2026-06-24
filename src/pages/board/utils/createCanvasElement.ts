import type { BaseElement, ElementInterface, ElementSettingsInterface } from '../types';

type CreateCanvasElementProps = Pick<BaseElement, 'id' | 'x1' | 'y1' | 'x2' | 'y2' | 'type'> & {elementOptions: ElementSettingsInterface}

export const createCanvasElement = ({id, x1, y1, x2, y2, type, elementOptions}: CreateCanvasElementProps): ElementInterface => {
    const options = {...elementOptions}

    switch(type) {
        case "line":
        case "rectangle":   
        case "circle":
            return {
                id, 
                x1, 
                y1, 
                x2, 
                y2, 
                type, 
                options: {
                    ...options,
                    seed: Math.random() * 1000
                }
            }

        case "pencil":
            return {id, x1, y1, x2, y2, type, points: [{x: x1, y: y1}], options}
            
        case "text":
            return {id, type, x1, y1, x2, y2, text: "", fontStyle: "italic", fontSize: "34px", options}

        default: 
            throw new Error(`Type not recognised: ${type}`)
    }
}
