import { adjustElementCoordinates, adjustmentRequired, cursorForPosition, getElementAtPosition, resizedCoordinates } from "../utils"
import type { CanvasState, CanvasActions } from "./useCanvasState";
import type { ElementInterface, ElementSettingsManager, PointsInterface } from "../types";

import { v4 as uuidv4 } from "uuid";
import { createCanvasElement } from "../utils/createCanvasElement";

interface UseCanvasMouseHandlersProps {
    selectedElement: ElementInterface | null

    canvasState: CanvasState
    canvasActions: CanvasActions

    pressedKeys: Set<string>
    elementSettingManager: ElementSettingsManager
    updateElement: Function
}

export const useCanvasMouse = ({
    selectedElement,
    canvasState,
    canvasActions,
    pressedKeys,
    elementSettingManager,
    updateElement
}: UseCanvasMouseHandlersProps) => {    
    const {
        elements,
        selectedElementId,
        tool,
        action,
        panOffset,
        startPanMousePosition,
        scale,
        scaleOffset,
        interactionState
    } = canvasState

    const {
        setElements,
        setSelectedElementId,
        setAction,
        setPanOffset,
        setStartPanMousePosition,
        setInteractionState
    } = canvasActions

    // Нажатие мыши
    const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
        // Если пишем текст - выйти
        if (action === 'writing') return

        const {mouseX, mouseY} = getMouseCoordinates(event, panOffset, scale, scaleOffset)
        
        // Если нажали колесико мыши - перемещение по полотну
        if (event.button === 1 || pressedKeys.has("")) {
            setAction("panning")
            setStartPanMousePosition({x: mouseX, y: mouseY})
            return
        }

        if (tool === "selection") {
            // Если мы выбираем элемент setAction('moving')
            const element = getElementAtPosition(mouseX, mouseY, elements)
            if (element) {
                // Ниже при клике обновляем настройки для выбранного элемента, иначе выставятся дефолтные
                const {stroke, fill, fillStyle, roughness, strokeWidth, opacity} = element?.options
                elementSettingManager.updateSetting('stroke', stroke)
                elementSettingManager.updateSetting('fill', fill)
                elementSettingManager.updateSetting('fillStyle', fillStyle)
                elementSettingManager.updateSetting('roughness', roughness)
                elementSettingManager.updateSetting('strokeWidth', strokeWidth)
                elementSettingManager.updateSetting('opacity', opacity)

                // Редактирование при двойном клике на элемент
                // if (event.detail === 2) {
                //     handleElementDoubleClick(element);
                //     return;
                // }

                if (element.type === "pencil") {
                    const xOffsets = element.points.map(point => mouseX - point.x)
                    const yOffsets = element.points.map(point => mouseY - point.y)
                    setSelectedElementId(element.id)
                    setInteractionState({xOffsets: xOffsets, yOffsets: yOffsets})
                } else {
                    // offsetX нужен для того, чтобы при выборе элемента он не скакал, так как изначально высчитывается относительно его верхнего угла
                    const offsetX = mouseX - element.x1
                    const offsetY = mouseY - element.y1
                    setSelectedElementId(element.id)
                    setInteractionState({
                        offsetX: offsetX,
                        offsetY: offsetY,
                        position: element.position
                    })
                }
                setElements(prevState => prevState)

                // Проверяем, внутри элемента или нет. Внутри - двигаем, если нет - значит изменяем размер
                if (element.position === "inside") {
                    setAction('moving')
                } else {
                    setAction('resizing')
                }
            } else {
                setSelectedElementId(null)
            }
        } else {
            const elementOptions = elementSettingManager.elementSettings
            const id = uuidv4()
            const element = createCanvasElement({
                id, 
                x1: mouseX, 
                y1: mouseY, 
                x2: mouseX, 
                y2: mouseY, 
                type: tool, 
                elementOptions
            })
            setElements((prevState) => [...prevState, element])
            setSelectedElementId(element.id)
            
            setAction(tool === 'text' ? 'writing' : 'drawing')
        }    
    } 

    // Движение мыши
    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const {mouseX, mouseY} = getMouseCoordinates(event, panOffset, scale, scaleOffset)
        const target = event.target as HTMLCanvasElement
        target.style.cursor = 'default'

        if (action === "panning") {
            const deltaX = mouseX - startPanMousePosition.x
            const deltaY = mouseY - startPanMousePosition.y

            setPanOffset(prevState => ({
                x: prevState.x + deltaX,
                y: prevState.y + deltaY,
            }))
            
            target.style.cursor = 'grabbing'
            return
        }

        if (tool === "selection") {
            const element = getElementAtPosition(mouseX, mouseY, elements)
            target.style.cursor = element 
                ? cursorForPosition(element.position) 
                : "default"
        }
        
        if (action === 'drawing') {
            const index = elements.length - 1
            const element = elements[index]
            // const {x1, y1} = elements[index]
            // updateElement(index, x1, y1, mouseX, mouseY, tool)
            if (element.type === 'pencil') {
                updateElement(element.id, {
                    points: [...element.points, {x: mouseX, y: mouseY}]
                })
            } else {
                updateElement(element.id, {
                    x2: mouseX,
                    y2: mouseY
                })
            }
            
        } else if (action === "moving") {
            if (selectedElement?.type === "pencil") {
                const newPoints = selectedElement.points.map((_ , index: number) => ({
                    x:  mouseX - interactionState.xOffsets[index],
                    y:  mouseY - interactionState.yOffsets[index]
                }))
                updateElement(selectedElement.id, { points: newPoints })
            } else {
                const {id, x1, x2, y1, y2, type, options} = selectedElement
                const {offsetX, offsetY} = interactionState
                const width = x2 - x1
                const height = y2 - y1
                const newX1 = mouseX - offsetX
                const newY1 = mouseY - offsetY
                const options2 = type === 'text' ? {text: selectedElement?.text} : options
                // updateElement(id, newX1, newY1, newX1 + width, newY1 + height, type, options2)
                updateElement(id, {
                    x1: newX1,
                    y1: newY1,
                    x2: newX1 + width,
                    y2: newY1 + height
                })
            }
        } else if (action === "resizing") {
            const {id, type, options, ...coordinates} = selectedElement
            const { position } = interactionState
            const {x1, y1, x2, y2} = resizedCoordinates(mouseX, mouseY, position, coordinates)
            // updateElement(id, x1, y1, x2, y2, type, options)
            updateElement(id, {
                x1,
                y1,
                x2,
                y2
            })
        }
    } 

    // Отпускаем кнопку мыши
    const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const {mouseX, mouseY} = getMouseCoordinates(event, panOffset, scale, scaleOffset)
        if (selectedElement) {
            if (
                selectedElement.type === 'text' && 
                mouseX - interactionState.offsetX === selectedElement.x1 &&
                mouseY - interactionState.offsetY === selectedElement.y1
            ) {
                setAction('writing')
                return
            }

            const elementsCopy = [...elements]
            const elementIndex = elementsCopy.findIndex(el => el.id === selectedElement.id)

            if (elementIndex === -1) return

            const element = elementsCopy[elementIndex]
            
            // const index = selectedElement.id
            const {id, type} = element

            if ((action === "drawing" || action === "resizing") && adjustmentRequired(type)) {
                const {x1, y1, x2, y2} = adjustElementCoordinates(element)
                //  const {options} = selectedElement
                // updateElement(id, x1, y1, x2, y2, type, options)
                updateElement(id, { x1, y1, x2, y2 })
            }
        }

        if (action === 'writing') return

        setAction('none')
        // setSelectedElement(null)
    } 


    return {
        handleMouseDown,
        handleMouseMove,
        handleMouseUp
    }
}

// Если canvas полотно не на весь экран, то нужно отслеживать движения мыши относительно полотна, а не всего экрана. event.clientX не подходит, т.к. будет сдвиг, потому высчитываем новые координаты
// Так же вычитаем panOffset, который нужен нам для перемещения по полотну
// Проделываем махинации с переменными увеличения, иначе будет рисовать мимо

const getMouseCoordinates = (event: React.MouseEvent<HTMLCanvasElement>, panOffset: PointsInterface, scale: number, scaleOffset: PointsInterface) => {
    const canvas = document.getElementById('canvas')
    if (!canvas) {
        throw new Error('Canvas not found')
    }

    const canvasBound = canvas.getBoundingClientRect()
    const {clientX, clientY} = event

    const mouseX = (clientX - canvasBound.left - panOffset.x * scale + scaleOffset.x) / scale
    const mouseY = (clientY - canvasBound.top - panOffset.y * scale + scaleOffset.y) / scale

    return {mouseX, mouseY}
}