## 📷 SketchBoard

![Иллюстрация к проекту](https://github.com/Moon1ight/sketchboard/blob/main/public/sketchboard-preview.jpg)

Графический редактор 

---

## Возможности

### Canvas
- Бесконечный canvas
- Zoom и перемещение по полотну
- Выбор элементов

### Инструменты
- Линия
- Прямоугольник
- Окружность
- Рисование
- Текст
- Изображение

### Редактирование
- Resize и перемещение элементов
- Кастомные обводка и заливка
- Разные стили обводки (ровная и "от руки")
- Разные стили заливки (полная и штрих)
- Управление непрозрачностью
- Поддержка горячих клавиш

### История 
- Undo/Redo (Snapshot Pattern. В будущем будет переход на Command Pattern.)

### Экспорт / Импорт
- Импорт сцены из JSON
- Экспорт сцены в JSON
- Экспорт сцены в изображение

---

## Технический стек

- React
- Typescript
- Canvas API
- rough.js
- Tailwind.css
- React-router-dom

---

## Установка

git clone https://github.com/Moon1ight/sketchboard.git

cd sketchboard

npm install

npm run dev

---

## Roadmap

- [ ] Совместное редактирование
- [ ] Поддержка слоёв
- [ ] Поддержка мобильных устройств
- [ ] Реализовать ctrl+c, ctrl+v
- [ ] Рефакторинг, особенно рефакторинг архитектуры