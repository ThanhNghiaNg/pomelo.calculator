import * as React from 'react'
import { cn } from '@/lib/utils'

function Input({
  className,
  type,
  ...props
}: React.ComponentProps<'input'>) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Quan trọng: Thêm touch events để "đánh thức" bàn phím trên PWA standalone
  const handleTouchStart = (e: React.TouchEvent<HTMLInputElement>) => {
    // Ngăn hành vi mặc định một chút rồi focus lại → ép hiện bàn phím
    e.preventDefault()
    inputRef.current?.focus()
  }

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    // Đôi khi click không đủ → focus lại lần nữa
    inputRef.current?.focus()
  }

  return (
    <input
      ref={inputRef}
      type={type}
      data-slot="input"
      // Thêm các thuộc tính giúp hiện bàn phím tốt hơn
      autoComplete="off"
      inputMode={type === 'number' ? 'decimal' : type === 'tel' ? 'tel' : undefined}
      
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className,
      )}
      
      // Thêm 2 event này là "liều thuốc" chữa PWA không hiện bàn phím
      onTouchStart={handleTouchStart}
      onClick={handleClick}
      
      {...props}
    />
  )
}

export { Input }