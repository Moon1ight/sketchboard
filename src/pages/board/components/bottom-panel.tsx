import { Button } from '../../../shared/components/Button/Button'
import { Redo2Icon, Undo2Icon, ZoomInIcon, ZoomOutIcon } from 'lucide-react';

interface BottomPanelProps {
    scale: number, 
    onUndo: () => void, 
    onRedo: () => void,
    onZoomIn: () => void, 
    onZoomOut: () => void, 
    onResetZoom: () => void
}

const BottomPanel = ({scale, onUndo, onRedo, onZoomIn, onZoomOut, onResetZoom}: BottomPanelProps) => {
    return (
         <div className='absolute z-2 p-1 bg-[#fff] rounded-lg bottom-3 left-3 flex' style={{boxShadow: '3px 3px 10px #00000030'}}>
            <Button variant="ghost" onClick={onZoomOut} size="sm" children={<ZoomOutIcon />}/>
            <div className='flex items-center'>
                {/* <Button variant="ghost" onClick={onResetZoom} size="sm" children={<Fullscreen />}/> */}
                <span className='text-sm' onClick={onResetZoom}>{new Intl.NumberFormat("en-GB", {style: "percent"}).format(scale)}</span>
            </div>
            <Button variant="ghost" onClick={onZoomIn} size="sm" children={<ZoomInIcon />}/>
            <Button variant="ghost" onClick={onUndo} size="sm" children={<Undo2Icon />}/>
            <Button variant="ghost" onClick={onRedo} size="sm" children={<Redo2Icon />}/>
        </div>
    );
}

export default BottomPanel;
