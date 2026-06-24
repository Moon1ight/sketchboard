import type { ElementInterface } from "../types"

// Создает ссылку и инициирует загрузку файла
const triggerDownload = (href: string, fileName: string) => {
    const link = document.createElement("a")
    link.href = href
    link.download = fileName

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

// Сохранить canvas в формате png
const saveCanvasToPng = (canvas: HTMLCanvasElement, userName: string) => {
    const fileName = `Изображение ${userName}.png`
    const dataUrl = canvas.toDataURL("image/png")

    triggerDownload(dataUrl, fileName)
}

// Сохранить canvas в формате JSON
const saveCanvasToJSON = (elements: ElementInterface[], userName: string) => {
    const fileName = `Изображение ${userName}.json`
    const json = JSON.stringify(elements, null, 2)

    const dataUrl = "data:text/json;charset=utf-8," + encodeURIComponent(json);

    triggerDownload(dataUrl, fileName)
}

export {
    saveCanvasToPng,
    saveCanvasToJSON
}