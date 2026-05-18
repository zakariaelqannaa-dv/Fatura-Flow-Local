import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "glass-input h-8 w-full min-w-0 rounded-[14px] border px-2.5 py-1 text-base text-white/80 transition-all outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-white/70 placeholder:text-white/30 focus-visible:glass-input-focus disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40 aria-invalid:border-red-500/50 aria-invalid:ring-3 aria-invalid:ring-red-500/20 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
