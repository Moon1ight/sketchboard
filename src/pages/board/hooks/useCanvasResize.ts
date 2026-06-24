import { RefObject, useLayoutEffect } from "react";

interface UseCanvasResizeProps {
    canvasRef: RefObject<HTMLCanvasElement | null>
}

export function useCanvasResize({canvasRef}: UseCanvasResizeProps) {
    useLayoutEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const parent = canvas.parentElement
        if (!parent) return

        const resizeObserver = new ResizeObserver(() => {
            canvas.width = parent.clientWidth
            canvas.height = parent.clientHeight
        })

        resizeObserver.observe(parent)

        canvas.width = parent.clientWidth
        canvas.height = parent.clientHeight

        return () => resizeObserver.disconnect()
    }, [])
}