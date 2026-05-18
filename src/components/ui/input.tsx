import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        // shape
        "h-9 w-full min-w-0 rounded-[18px] border px-3.5 py-1",
        // glass
        "glass-input",
        // text
        "text-sm text-white/82 placeholder:text-white/28",
        // animation
        "spring outline-none",
        // file input
        "file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-white/70",
        // focus
        "focus-visible:glass-input-focus",
        // disabled
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-35",
        // invalid
        "aria-invalid:border-red-500/50 aria-invalid:ring-3 aria-invalid:ring-red-500/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
