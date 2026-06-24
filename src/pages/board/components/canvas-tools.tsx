import { Button } from '../../../shared/components/Button/Button'
import { FileJsonIcon, FolderPlusIcon, ImageDownIcon, LogOutIcon, Trash2Icon } from 'lucide-react';
import React, { useRef } from 'react';
import { saveCanvasToJSON, saveCanvasToPng } from '../utils/saveHandlers';
import type { ElementInterface } from '../types';
import { loadElementsFromFile } from '../utils/loadElementsFromFile';
import { href, Link } from 'react-router-dom';
import { ROUTES } from '@/shared/model/routes';

interface CanvasToolsProps {
    elements: ElementInterface[],
    setElements: (elements: ElementInterface[]) => void,
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    userName: string
}

export const CanvasTools = ({elements, setElements, canvasRef, userName}: CanvasToolsProps) => {
    const uploadLocalJson = useRef<HTMLInputElement>(null)

    const fileUploadHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        try {
            const elements = await loadElementsFromFile(file)
            if (!elements) return
            setElements(elements)
        } catch (error) {
            alert(`Файл повреждён или имеет неверный формат: ${error}`)
            // Нужно будет как и ниже переделать на модальное окно, а не на alert
        }
    }

    const onUploadClickHandler = () => {
        uploadLocalJson.current?.click()
    }

    // На данный момент пока будет конфирм, в будущем нужно перенести это в модальное окно.
    const clearCanvasHandler = () => {
        const confirmed = confirm("Вы уверены, что хотите очистить полотно? ")
        if (!confirmed) return
        setElements([])
    }

    const savePngHandler = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        saveCanvasToPng(canvas, userName)
    }

    const saveJSONHandler = () => {
        saveCanvasToJSON(elements, userName)
    }

    return (
        <div className='absolute z-2 p-1 gap-1 flex bg-[#fff] rounded-lg top-3 right-3' style={{boxShadow: '3px 3px 10px #00000030'}}>
            <input
                ref={uploadLocalJson}
                id="json-file-input"
                type="file"
                accept=".json"
                onChange={fileUploadHandler}
                className='hidden'
            />
            {/* {errorLocalUpload && <div>{errorLocalUpload}</div>} */}
            <Button variant='ghost' size='sm' onClick={onUploadClickHandler}>
                <FolderPlusIcon />
            </Button>
            <Button variant='ghost' size='sm' onClick={saveJSONHandler}>
                <FileJsonIcon />
            </Button>
            <Button variant='ghost' size='sm' onClick={savePngHandler}>
                <ImageDownIcon />
            </Button> 
            <Button variant='ghost' size='sm' onClick={clearCanvasHandler} style={{color: 'red'}}>
                <Trash2Icon />
            </Button>
            <Button variant='ghost' size="sm">
                <Link to={href(ROUTES.BOARDS)}>
                    <LogOutIcon />
                </Link> 
            </Button>
        </div>
    );
}

