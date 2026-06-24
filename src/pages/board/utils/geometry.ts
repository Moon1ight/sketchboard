import type { PointsInterface } from "../types";

// Нужно для вычисления по Линиям, вроде
export const distance = (a: PointsInterface, b: PointsInterface): number => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))

// Вычисление радиуса (ВРОДЕ НИГДЕ НЕ ИСПОЛЬЗУЮ УЖЕ)
export const calculateRadius = (mouseX: number, mouseY: number, startX: number, startY: number): number => {
    const dx = mouseX - startX;
    const dy = mouseY - startY;
    return Math.sqrt(dx * dx + dy * dy);
}
