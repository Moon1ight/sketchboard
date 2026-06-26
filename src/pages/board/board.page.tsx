import {memo, useCallback, useEffect, useMemo, useRef} from 'react';

import type { DrawingToolType, ElementInterface } from './types';

import { useCanvasMouse } from './hooks/useCanvasMouse';
import { useCanvasRender } from './hooks/useCanvasRender';
import { useCanvasKeyboard } from './hooks/useCanvasKeyboard';
import { useCanvasState } from './hooks/useCanvasState';

import {CanvasTools} from './components/canvas-tools'
import ToolsOptions from './components/tools-options';
import { TextEditorOverlay } from './components/text-editor-overlay';
import BottomPanel from './components/bottom-panel';
import Toolbar from './components/toolbar';

import { usePressedKeys } from './hooks/usePressedKeys';
import { useElementSettings } from './hooks/useElementSettings';
import { useCanvasActions } from './hooks/useCanvasActions';
import { useCanvasResize } from './hooks/useCanvasResize';

const Editor = memo(() => {
    // const params = useParams<PathParams[typeof ROUTES.BOARD]>()
    // console.log('Routing params: ', params);
    const userName = 'Matthew'

    const { canvasState, canvasActions } = useCanvasState()
    
    const {
        elements,
        selectedElementId,
        tool,
        action,
        scale,
    } = canvasState

    const {
        setElements,
        setSelectedElementId,
        setTool,
        setAction,
        setScale,
        undo,
        redo
    } = canvasActions

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null)
    const pressedKeys = usePressedKeys()
    const elementSettingManager = useElementSettings()

    const selectedElement: ElementInterface | null = useMemo(() => {
        return elements.find(el => el.id === selectedElementId) ?? null
    }, [elements, selectedElementId])

    useCanvasResize({canvasRef})

    useCanvasRender({
        selectedElement,
        canvasState,
        canvasRef
    })

    const onZoom = useCallback((delta: number) => {
        setScale(prevState => Math.min(Math.max(prevState + delta, 0.1), 20))
    }, [])

    useCanvasKeyboard({
        canvasState,
        canvasActions,
        pressedKeys,
        onZoom,
    })

    useEffect(() => {
        if (action !== 'writing') return

        const id = requestAnimationFrame(() => {
            const textArea = textAreaRef.current
            if (!textArea) return

            textArea.focus()
            if (selectedElement && selectedElement.type === 'text') {
                textArea.value = selectedElement?.text ?? ''
            } else {
                textArea.value = ''
            }
        })

        return () => cancelAnimationFrame(id)
    }, [action, selectedElement])

    const { updateElement } = useCanvasActions({
        elements,
        setElements,
        canvasRef
    })
    
    // Обновление элемента при редактировании
    useEffect(() => {
        if (!selectedElementId) return
        if (tool !== 'selection') return
        if (action === 'drawing') return

        const elementOptions = elementSettingManager.elementSettings

        updateElement(selectedElementId, {
            options: elementOptions
        })
    }, [elementSettingManager.elementSettings, selectedElementId, tool, action])



    const {handleMouseDown, handleMouseMove, handleMouseUp} = useCanvasMouse({
        selectedElement,
        canvasState,
        canvasActions,
        pressedKeys,
        elementSettingManager,
        updateElement
    })

    const handleTextSubmit = useCallback((text: string) => {
        if (selectedElementId) {
            // const {id} = selectedElement
            setAction('none')
            setSelectedElementId(null)
            updateElement(selectedElementId, {text: text})
        }
    }, [selectedElementId, updateElement])

    return (
        <div className='relative overflow-hidden h-[100vh] w-[100%]'>
            {/* Панель с инструментами */}
            <Toolbar 
                activeTool={tool} 
                onSelectTool={(nextTool: DrawingToolType) => {
                    setSelectedElementId(null)
                    elementSettingManager.resetSettings()
                    setTool(nextTool)
                }}
                setElements={setElements}
            />
            {/* Опции инструментов */}
            {(tool !== 'selection' || selectedElement) && (
                <ToolsOptions 
                    tool={tool}
                    elementSettingManager={elementSettingManager}
                    selectedElement={selectedElement}
                />
            )}
            {/* Кнопки сохранения */}
            <CanvasTools 
                elements={elements} 
                setElements={setElements} 
                canvasRef={canvasRef} 
                userName={userName} 
            />
            {/* Нижняя панель инструментов */}
            <BottomPanel 
                scale={scale} 
                onUndo={undo}
                onRedo={redo}
                onZoomIn={() => onZoom(0.1)}
                onZoomOut={() => onZoom(-0.1)}
                onResetZoom={() => setScale(1)}
            />
            {/* Поле для ввода при выборе инструмента "ТЕКСТ" */}
            <TextEditorOverlay 
                selectedElement={selectedElement}
                canvasState={canvasState}
                textAreaRef={textAreaRef}
                onSubmit={handleTextSubmit}
                color={elementSettingManager.elementSettings.stroke}
            />
            {/* Полотно для рисования */}
            <canvas 
                ref={canvasRef}
                id="canvas" 
                style={{ position: "absolute", zIndex: 1}} 
                width={1900}
                height={1080}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
            </canvas>
        </div>
    );
})

export const Component = Editor
