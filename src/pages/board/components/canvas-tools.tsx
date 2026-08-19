import { Button } from '../../../shared/components/Button/Button'
import { FileJsonIcon, FolderPlusIcon, ImageDownIcon, LogOutIcon, MenuSquareIcon, Trash2Icon } from 'lucide-react';
import React, { useRef, useState } from 'react';
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
    const [isOpen, setIsOpen] = useState(false)

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

    const showCanvasTools = () => {
        setIsOpen(prev => !prev)
    }

    return (
        <div className='absolute z-2 p-1 gap-1 flex-col bg-[#fff] rounded-lg top-3 right-3' style={{boxShadow: '3px 3px 10px #00000030'}}>
            <Button variant='ghost' size={isOpen ? 'sm' : 'md'} onClick={showCanvasTools} className='justify-center gap-5 w-[100%]'>
                <MenuSquareIcon /> {isOpen ? 'Настройки' : 'Закрыть'}
            </Button>
            <div className={isOpen ? 'hidden' : 'flex flex-col gap-2'}>
                <hr/>
                <input
                    ref={uploadLocalJson}
                    id="json-file-input"
                    type="file"
                    accept=".json"
                    onChange={fileUploadHandler}
                    className='hidden'
                />
                {/* {errorLocalUpload && <div>{errorLocalUpload}</div>} */}
                <Button variant='ghost' size='md' onClick={onUploadClickHandler} className='justify-start gap-5'>
                    <FolderPlusIcon /> Загрузить набросок
                </Button>
                <Button variant='ghost' size='md' onClick={saveJSONHandler} className='justify-start gap-5'>
                    <FileJsonIcon /> Сохранить в JSON
                </Button>
                <Button variant='ghost' size='md' onClick={savePngHandler} className='justify-start gap-5'>
                    <ImageDownIcon /> Сохранить как картинку
                </Button> 
                <Button variant='ghost' size='md' onClick={clearCanvasHandler} className='justify-start gap-5' style={{color: 'red'}}>
                    <Trash2Icon /> Очистить полотно
                </Button>
                <hr/>
                <Button variant='ghost' size="md">
                    <Link to={href(ROUTES.BOARDS)} className='flex justify-start gap-2'>
                        <LogOutIcon /> Выход
                    </Link> 
                </Button>
            </div>
        </div>
    );
}

