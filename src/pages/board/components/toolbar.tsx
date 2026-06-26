import { Button } from '../../../shared/components/Button/Button'
import { BrushIcon, Circle, Image, MessageSquareMore, PenLineIcon, Pointer, RectangleHorizontal } from 'lucide-react';
import type { DrawingToolType, ElementInterface, ImageElement } from '../types';
import { useRef } from 'react';

import { v4 as uuidv4 } from "uuid";
import type { HistorySetState } from '../hooks/useHistory';

export type Tool = {
  title: DrawingToolType
  icon: React.ReactNode
}

const TOOLS: Tool[] = [
    {title: "selection", icon: <Pointer />},
    {title: "line", icon: <PenLineIcon />},
    {title: "rectangle", icon: <RectangleHorizontal />},
    {title: "circle", icon: <Circle />},
    {title: "pencil", icon: <BrushIcon />},
    {title: "text", icon: <MessageSquareMore />},
]

interface ToolbarProps {
    activeTool: DrawingToolType,
    onSelectTool: (tool: DrawingToolType) => void,
    setElements: HistorySetState<ElementInterface[]>
}

const Toolbar = ({
    activeTool,
    onSelectTool,
    setElements
}: ToolbarProps) => {
    const uploadImage = useRef<HTMLInputElement>(null)

    const uploadImageHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]

        if (!file) return
        
        const reader = new FileReader()

        reader.readAsDataURL(file)

        reader.onload = () => {
            const src = reader.result as string

            const image = new window.Image()

            const id = uuidv4()

            image.onload = () => {
                const element: ImageElement = {
                    id: id,
                    type: 'image',

                    x1: 100,
                    y1: 100,

                    x2: 100 + image.width,
                    y2: 100 + image.height,

                    src,

                    options: {
                        stroke: "#000",
                        fill: "transparent",
                        fillStyle: "solid",
                        strokeWidth: 1,
                        roughness: 0,
                        opacity: 1
                    }
                }

                setElements(prev => [...prev, element])
            }

            image.src = src
        }
    }

    const onUploadImageClickHandler = () => {
        uploadImage.current?.click()
    }

    return (
        <div className='absolute z-2 p-1 gap-2 flex bg-[#fff] rounded-lg left-3 top-3' style={{boxShadow: '3px 3px 10px #00000030'}}>
            {TOOLS.map((tool) => (
                <Button 
                    key={tool.title} 
                    size='sm'
                    variant={tool.title === activeTool ? "icon" : "ghost"}
                    onClick={() => {
                        onSelectTool(tool.title)
                    }}
                >
                    {tool.icon}
                </Button>
            ))}
            <input 
                ref={uploadImage}
                type='file' 
                accept="image/*" 
                onChange={uploadImageHandler}
                className='hidden' 
            />
            <Button 
                onClick={() => onUploadImageClickHandler()}
                size='sm'
                variant='ghost'
            >
                <Image />
            </Button>
        </div>
    );
}

export default Toolbar;
