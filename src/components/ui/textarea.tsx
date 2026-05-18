import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // shape + glass
        "glass-input w-full min-h-[80px] rounded-[18px] border px-3.5 py-2.5",
        // text
        "text-sm text-white/82 placeholder:text-white/28",
        // spring
        "spring outline-none resize-none",
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

export { Textarea }
