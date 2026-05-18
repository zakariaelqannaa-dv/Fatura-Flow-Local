import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Base — shared across all variants
  [
    "group/button inline-flex shrink-0 items-center justify-center gap-1.5",
    "border border-transparent bg-clip-padding",
    "text-sm font-medium whitespace-nowrap",
    "spring outline-none select-none",
    // focus ring
    "focus-visible:border-white/25 focus-visible:ring-3 focus-visible:ring-white/12",
    // press
    "active:scale-[0.96]",
    // disabled
    "disabled:pointer-events-none disabled:opacity-35",
    // aria-invalid
    "aria-invalid:border-red-500/50 aria-invalid:ring-3 aria-invalid:ring-red-500/20",
    // icon sizing
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-foreground text-background",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_2px_10px_rgba(0,0,0,0.1)]",
          "hover:bg-foreground/90",
          "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_6px_20px_rgba(255,255,255,0.05)]",
          "hover:-translate-y-px",
        ],
        outline: [
          "border-foreground/15 bg-transparent text-foreground/80",
          "hover:bg-foreground/[0.06] hover:text-foreground hover:border-foreground/25",
          "hover:shadow-[0_4px_16px_rgba(0,0,0,0.03)] dark:hover:shadow-[0_4px_16px_rgba(255,255,255,0.03)]",
        ],
        secondary: [
          "bg-foreground/[0.065] text-foreground/85 border-foreground/10",
          "hover:bg-foreground/10 hover:text-foreground",
        ],
        ghost: [
          "text-foreground/70 border-transparent",
          "hover:bg-foreground/[0.055] hover:text-foreground",
        ],
        destructive: [
          "bg-destructive text-destructive-foreground border-destructive/30",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_8px_rgba(0,0,0,0.05)]",
          "hover:bg-destructive/90 hover:text-destructive-foreground",
          "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_6px_20px_rgba(0,0,0,0.1)]",
          "hover:-translate-y-px",
        ],
        link: "text-foreground/70 underline-offset-4 hover:underline hover:text-foreground/90 border-transparent",
      },
      size: {
        default: "h-9 rounded-[18px] px-4",
        xs:      "h-6 rounded-xl px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm:      "h-8 rounded-[16px] px-3 text-[0.8rem] [&_svg:not([class*='size-'])]:size-3.5",
        lg:      "h-10 rounded-[20px] px-5 text-base",
        xl:      "h-12 rounded-[22px] px-6 text-base",
        icon:    "size-9 rounded-[18px]",
        "icon-xs": "size-6 rounded-[12px] [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 rounded-[16px]",
        "icon-lg": "size-10 rounded-[20px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
