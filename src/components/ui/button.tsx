import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[14px] border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-white/25 focus-visible:ring-3 focus-visible:ring-white/15 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-40 aria-invalid:border-red-500/50 aria-invalid:ring-3 aria-invalid:ring-red-500/20 dark:aria-invalid:border-red-500/50 dark:aria-invalid:ring-red-500/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-white/10 text-white/85 border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] hover:bg-white/15 hover:text-white/90",
        outline:
          "border-white/10 bg-transparent text-white/70 hover:bg-white/5 hover:text-white/85",
        secondary:
          "bg-white/6 text-white/75 hover:bg-white/10 hover:text-white/85",
        ghost:
          "text-white/50 hover:bg-white/5 hover:text-white/75",
        destructive:
          "bg-red-500/15 text-red-300 border-red-500/20 shadow-[inset_0_1px_0_rgba(239,68,68,0.15)] hover:bg-red-500/25 hover:text-red-200",
        link: "text-white/70 underline-offset-4 hover:underline hover:text-white/90",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[10px] px-2 text-xs in-data-[slot=button-group]:rounded-[10px] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[12px] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-[12px] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[10px] in-data-[slot=button-group]:rounded-[10px] [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[12px] in-data-[slot=button-group]:rounded-[12px]",
        "icon-lg": "size-9",
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
