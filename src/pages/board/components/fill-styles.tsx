import './styles.css'

const HachureFillStyle = () => {
    return (
        <div className='fill-style hachure'>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
}

const SolidFillStyle = () => {
    return (
        <div className='fill-style solid'>
        </div>
    );
}

export const FillStyleIcon = ({fillStyle}: {fillStyle: string}) => {
    const getFillStyle = () => {
        switch (fillStyle) {
            case "hachure": 
                return <HachureFillStyle />
            case "solid": 
                return <SolidFillStyle />
            default:
                return '1'
        }
    }
    
    return (
        <>
            {getFillStyle()}
        </>
    )
}

