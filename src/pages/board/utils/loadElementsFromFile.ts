import type { ElementInterface } from "../types"

export const loadElementsFromFile = async (file: File): Promise<ElementInterface[] | null> => {
    if (file.type !== "application/json") return null

    const text = await file.text()
    const parsed = JSON.parse(text)
    
    if (!Array.isArray(parsed)) return null

    return parsed
}