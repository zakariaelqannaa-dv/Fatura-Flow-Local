import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "glass-input flex field-sizing-content min-h-16 w-full rounded-[14px] border px-2.5 py-2 text-base text-white/80 transition-all outline-none placeholder:text-white/30 focus-visible:glass-input-focus disabled:cursor-not-allowed disabled:opacity-40 aria-invalid:border-red-500/50 aria-invalid:ring-3 aria-invalid:ring-red-500/20 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
