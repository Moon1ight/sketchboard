import { cn } from '@/shared/utils/cn';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'outline' | 'ghost' | 'link' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  className?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonProps) {
  return (
    <button 
      className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-[#57a5c3] text-white hover:bg-[#4a8da6]': variant === 'primary',
            'border border-input bg-background hover:bg-accent hover:text-accent-foreground':
              variant === 'outline',
            'rounded-full hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
            'text-[#57a5c3] underline-offset-4 hover:underline': variant === 'link',
            'rounded-full bg-[#a19aff] border-0 hover:bg-[#a19aff] text-[#fff]':
              variant === 'icon',
            'h-9 px-3 text-sm': size === 'sm',
            'h-10 px-4 py-2': size === 'md',
            'h-11 px-8': size === 'lg',
            'h-12 w-12 p-0': size === 'icon',
          },
          className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
