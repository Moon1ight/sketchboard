import { Button } from '../../../shared/components/Button/Button'
import { Range } from '../../../shared/components/Range/Range';
import { BanIcon, BoldIcon, ItalicIcon, UnderlineIcon } from 'lucide-react';
import type { DrawingToolType, ElementInterface, ElementSettingsManager } from '../types';
import { FillStyleIcon } from './fill-styles';

const strokeColors = ['#000', '#e24949', '#a19aff', '#2ec5c5', '#5ec52e']
const fillColors = ['transparent', '#e24949', '#a19aff', '#2ec5c5', '#5ec52e']

const roughnessOptions = [0, 1, 3]

const fillStyleOptions = [
    {title: "Штрихи", style: "hachure"},
    {title: "Полная", style: "solid"},
]

interface IToolsOptions {
    tool: DrawingToolType,
    elementSettingManager: ElementSettingsManager,
    selectedElement: ElementInterface | null,
}

const ToolsOptions = ({tool, elementSettingManager, selectedElement}: IToolsOptions) => {
    const {elementSettings, updateSetting} = elementSettingManager
    const {roughness, stroke, fill, fillStyle, strokeWidth, opacity} = elementSettings

    const activeType = tool === "selection" ? selectedElement?.type : tool

    const hasFill = 
        activeType !== 'line' &&
        activeType !== 'pencil' &&
        activeType !== 'text' 

    const hasRoughness = 
        activeType !== 'pencil' &&
        activeType !== 'text'

    const handleFillChange = (value: string) => {
        updateSetting('fill', value)
        if (fillStyle === 'transparent') {
            updateSetting('fillStyle', "hachure")
        }
    }
    
    return (
        <div className='tools-options absolute z-2 pb-0 gap-2 flex flex-col bg-[#fff] rounded-lg left-3 top-20 w-50 overflow-hidden' style={{boxShadow: '3px 3px 10px #00000030'}}>
                <div className='px-2 py-1'>
                    <h4 className='font-bold mb-2 text-[#0f0f0f]'>Обводка</h4>
                    <div className='flex gap-3'>
                        {strokeColors.map(color => (
                            <div 
                                key={color} 
                                style={{backgroundColor: color}}
                                // size="sm"
                                className={`w-5 h-5 rounded cursor-pointer`}
                                onClick={() => updateSetting('stroke', color)}
                            ></div>
                        ))}
                        <input className="cursor-pointer rounded w-5 h-5 outline" type="color" value={stroke} onChange={e => {
                            updateSetting('stroke', e.target.value)
                        }} />
                    </div>
                </div>
                {hasFill && (
                    <>
                        <div className=' px-2 py-1'>
                            <h4 className='font-bold mb-1 text-[#0f0f0f]'>Фон</h4>
                            <div className='flex gap-3'>
                                {fillColors.map(fillColor => (
                                    <div 
                                        key={fillColor} 
                                        style={{backgroundColor: fillColor, border: `${fillColor === 'transparent' ? "1px solid #000": "none"}`}}
                                        className={`w-5 h-5 rounded cursor-pointer`}
                                        onClick={() => updateSetting('fill', fillColor)}
                                    ></div>
                                ))}
                                <input 
                                    className="cursor-pointer rounded w-5 h-5 outline" 
                                    type="color" 
                                    value={fill} 
                                    onChange={e => handleFillChange(e.target.value)} 
                                />
                            </div>
                        </div>
                        {fill !== "transparent" && (
                            <div>
                                <h4 className='font-bold mb-1 text-[#0f0f0f] px-2 py-1'>Стиль заливки</h4>
                                <div className='flex items-center gap-2 flex-wrap p-1'>
                                    {fillStyleOptions.map((btn) => (
                                        <Button 
                                            key={btn.style}
                                            variant={btn.style === fillStyle && fill !== "transparent" ? "icon" : 'ghost'}
                                            className='cursor-pointer gap-2' 
                                            size="sm" 
                                            onClick={() => {
                                                updateSetting('fillStyle', btn.style)
                                            }}
                                        >
                                            {<FillStyleIcon fillStyle={btn.style} />}
                                            {btn.title}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
                {hasRoughness && (
                    <div>
                        <h4 className='font-bold mb-1 text-[#0f0f0f] px-2 py-1'>Стиль линии</h4>
                        <div className='p-1'>
                            {roughnessOptions.map(el => (
                                <Button 
                                    key={el}
                                    variant={el === roughness ? "icon" : 'ghost'}
                                    className='cursor-pointer' 
                                    size="sm" 
                                    onClick={() => {
                                        updateSetting('roughness', el)
                                    }}
                                >
                                    {el}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
                {activeType !== 'text' && (
                    <div>
                        <h4 className='font-bold mb-1 text-[#0f0f0f] px-2 py-1'>Толщина линии</h4>
                        <div className="px-1 pt-1 pb-2">
                            <Range 
                                min="1"
                                max="10" 
                                step="1" 
                                value={strokeWidth} 
                                onChange={e => {
                                    updateSetting('strokeWidth', +e.target.value)
                                }} 
                            />
                        </div>
                    </div>
                )}
                {activeType === 'text' && (
                    <div className='px-2 py-1'>
                        <h4 className='font-bold mb-1 text-[#0f0f0f]'>Стиль текста</h4>
                        <div className="px-1 pt-1 pb-2">
                            <Button size="sm" variant='ghost'><BoldIcon /></Button>
                            <Button size="sm" variant='ghost'><ItalicIcon /></Button>
                            <Button size="sm" variant='ghost'><UnderlineIcon /></Button>
                        </div>
                        <h4 className='font-bold mb-1 text-[#0f0f0f]'>Размер текста</h4>
                        <div className="px-1 pt-1 pb-2">
                            <select>
                                <option>24px</option>
                                <option>30px</option>
                                <option>36px</option>
                                <option>42px</option>
                            </select>
                        </div>
                    </div>
                )}
                <div>
                    <h4 className='font-bold mb-1 text-[#0f0f0f] px-2 py-1'>Непрозрачность</h4>
                    <div className="px-1 pt-1 pb-2">
                        <Range 
                            min="0"
                            max="1" 
                            step="0.1" 
                            value={opacity} 
                            onChange={e => {
                                updateSetting('opacity', +e.target.value)
                            }} 
                        />
                    </div>
                </div>
        </div>
        
    );
}

export default ToolsOptions;
