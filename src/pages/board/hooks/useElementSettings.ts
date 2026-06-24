// Настройки элемента
import { useCallback, useState } from "react"
import type { ElementSettingsInterface, ElementSettingsManager } from "../types"

const DEFAULT_ELEMENT_SETTINGS: ElementSettingsInterface = {
    roughness: 1,
    stroke: "#000000",
    fill: "transparent",
    fillStyle: "solid",
    strokeWidth: 3,
    opacity: 1
}

export const useElementSettings = (initialSettings: Partial<ElementSettingsInterface> = {}): ElementSettingsManager => {
    const [elementSettings, setElementSettings] = useState<ElementSettingsInterface>({
        ...DEFAULT_ELEMENT_SETTINGS,
        ...initialSettings 
    })

    const updateSetting = useCallback(
        <K extends keyof ElementSettingsInterface>(
            key: K, 
            value: ElementSettingsInterface[K]
        ) => {
            setElementSettings(prev => ({
                ...prev, 
                [key]: value
            }))
    }, [])

    const resetSettings = useCallback(() => {
        setElementSettings(DEFAULT_ELEMENT_SETTINGS)
    }, [])
    
    return {
        elementSettings,
        updateSetting,
        resetSettings
    }
}