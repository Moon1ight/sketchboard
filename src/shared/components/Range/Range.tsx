import * as React from 'react';
import './styles.css'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Range = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, min = 0, max = 100, value = 0, ...props }, ref) => {
    
    const numericValue = Number(value) 
    const numericMin = Number(min) 
    const numericMax = Number(max) 

    const progress = ((numericValue - numericMin) / (numericMax - numericMin)) * 100

    return (
      <input
        type="range"
        className='custom-range-input'
        ref={ref}
        style={{background: `linear-gradient(to right, #a19aff ${progress}%, #d2d2d2 ${progress}%)`}}
        min={min}
        max={max}
        value={value}
        {...props}
      />
    );
  },
);

Range.displayName = 'Range';

export { Range };
