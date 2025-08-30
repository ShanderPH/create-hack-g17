import { Input as HeroInput } from "@heroui/input"
import { forwardRef } from "react"
import { tv } from "tailwind-variants"
import type { InputProps as HeroInputProps } from "@heroui/input"

const input = tv({
  base: "flex h-10 w-full rounded-md border border-divider bg-content1 px-3 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-default-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  variants: {
    variant: {
      default: "",
      bordered: "border-2 border-divider",
      underlined: "border-0 border-b-2 border-divider rounded-none bg-transparent",
      faded: "bg-default-100",
    },
    size: {
      sm: "h-8 text-xs",
      md: "h-10 text-sm",
      lg: "h-12 text-base",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
})

export interface InputProps extends Omit<HeroInputProps, 'variant' | 'size'> {
  variant?: 'default' | 'bordered' | 'underlined' | 'faded'
  size?: 'sm' | 'md' | 'lg'
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, ...props }, ref) => {
    const heroVariant = variant === 'default' ? 'flat' : variant || 'flat'
    
    return (
      <HeroInput
        ref={ref}
        variant={heroVariant}
        size={size}
        className={input({ variant, size, className })}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input, input }
