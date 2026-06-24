import { useEffect, useState } from "react"

// Хук нажатия клавиш
export const usePressedKeys = () => {
    const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set())

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            setPressedKeys(prevKeys => {
                const updatedKeys = new Set(prevKeys)
                updatedKeys.add(event.key)
                return updatedKeys
            })
        }
        
        const handleKeyUp = (event: KeyboardEvent) => {
            setPressedKeys(prevKeys => {
                const updatedKeys = new Set(prevKeys)
                updatedKeys.delete(event.key)
                return updatedKeys
            })
        }

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [])

    return pressedKeys
}