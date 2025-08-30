import { Button as HeroButton } from "@heroui/button"
import { forwardRef } from "react"
import { tv } from "tailwind-variants"
import type { ButtonProps as HeroButtonProps } from "@heroui/button"

const button = tv({
  base: "font-medium transition-colors",
  variants: {
    variant: {
      default: "",
      destructive: "bg-danger text-danger-foreground hover:bg-danger/90",
      outline: "border border-divider bg-transparent hover:bg-default-100 hover:text-foreground",
      secondary: "bg-default-100 text-foreground hover:bg-default-200",
      ghost: "hover:bg-default-100 hover:text-foreground",
      link: "text-primary underline-offset-4 hover:underline",
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

export interface ButtonProps extends Omit<HeroButtonProps, 'variant' | 'size'> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    const heroVariant = variant === 'destructive' ? 'solid' : 
                       variant === 'outline' ? 'bordered' : 
                       variant === 'ghost' ? 'light' : 'solid'
    
    return (
      <HeroButton
        ref={ref}
        variant={heroVariant}
        className={button({ variant, size, className })}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, button }
