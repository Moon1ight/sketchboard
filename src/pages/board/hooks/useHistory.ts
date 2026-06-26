// Кастомные хуки
import { type SetStateAction, useState } from "react"

export type HistorySetState<T> = (
    action: SetStateAction<T>,
    overwrite?: boolean
) => void

const isUpdater = <T>(value: SetStateAction<T>): value is (prev: T) => T => typeof value === 'function'

// Хук для ведения истории, чтобы можно было делать Undo/Redo
export const useHistory = <T>(initialState: T) => {
    const [index, setIndex] = useState<number>(0)
    const [history, setHistory] = useState<T[]>([initialState])

    const setState: HistorySetState<T> = (action, overwrite = false) => {
        const newState = isUpdater(action) ? action(history[index]) : action
        if (overwrite) {
            const historyCopy = [...history]
            historyCopy[index] = newState
            setHistory(historyCopy)
        } else {
            const updatedState = [...history].slice(0, index + 1)
            setHistory([...updatedState, newState]) 
            setIndex(prevState => prevState + 1)
        }
    }

    const undo = () => index > 0 && setIndex(prevState => prevState - 1) 
    const redo = () => index < history.length -1 && setIndex(prevState => prevState + 1)

    return [history[index], setState, undo, redo]  as const
}