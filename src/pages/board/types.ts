// import { Drawable } from "roughjs/bin/core"

export type DrawingElementType  = 'line' | 'rectangle' | 'circle' | 'pencil' | 'text' | 'image'
export type DrawingToolType = 'selection' | DrawingElementType

export type CanvasActionType = 'none' | 'resizing' | 'moving' | 'panning' | 'writing' | 'drawing' | 'selecting'
export type ElementPosition  = 'inside' | 'start' | 'end' | 'tl' | 'tr' |  'bl' | 'br' 

export type PointsInterface = {
  x: number, 
  y: number
}

export interface BaseElement {
  id: string
  type: DrawingElementType
  x1: number
  y1: number
  x2: number
  y2: number
  options: ElementSettingsInterface
}

// Фигуры Rough
export interface ShapeElement extends BaseElement {
  type: 'line' | 'rectangle' | 'circle'
}

// Карандаш
export interface PencilElement extends BaseElement {
  type: 'pencil'
  points: PointsInterface[]
}

// Текст
export interface TextElement extends BaseElement {
  type: 'text'
  text: string
  fontStyle: string
  fontSize: string
}

export interface ImageElement extends BaseElement {
  type: 'image'
  src: string
}

export type ElementInterface = ShapeElement | PencilElement | TextElement | ImageElement

export interface ElementSettingsInterface {
  roughness: number;
  stroke: string;
  fill: string;
  fillStyle: string;
  strokeWidth: number;
  opacity: number
  seed?: number
  // text?: string
}

export interface ElementSettingsManager {
  elementSettings: ElementSettingsInterface
  updateSetting: <K extends keyof ElementSettingsInterface>(
    key: K,
    value: ElementSettingsInterface[K]
  ) => void
  resetSettings: () => void
}

export interface CoordinatesInterface {
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  // offsetX: number,
  // offsetY: number,
}