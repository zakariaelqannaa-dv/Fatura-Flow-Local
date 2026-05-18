import * as React from "react"

import { cn } from "@/lib/utils"

function Card({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        // glass base
        "glass-panel group/card flex flex-col gap-4 overflow-hidden text-sm text-card-foreground",
        // radius
        "rounded-[28px]",
        // spacing
        "py-4",
        // animation
        "spring",
        "hover:-translate-y-0.5",
        "hover:shadow-[0_32px_80px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.16)]",
        // image rounding
        "has-[>img:first-child]:pt-0 *:[img:first-child]:rounded-[28px] *:[img:last-child]:rounded-[28px]",
        // footer padding removal
        "has-data-[slot=card-footer]:pb-0",
        // size sm
        "data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:rounded-[22px]",
        "data-[size=sm]:has-data-[slot=card-footer]:pb-0",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1",
        "rounded-t-[28px] px-5",
        "group-data-[size=sm]/card:px-4",
        "has-data-[slot=card-action]:grid-cols-[1fr_auto]",
        "has-data-[slot=card-description]:grid-rows-[auto_auto]",
        "[.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-heading text-sm leading-snug font-semibold text-white/82 tracking-tight",
        "group-data-[size=sm]/card:text-xs",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-white/42", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-5 group-data-[size=sm]/card:px-4", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center rounded-b-[28px] border-t border-white/[0.07]",
        "bg-white/[0.018] p-5",
        "group-data-[size=sm]/card:p-4 group-data-[size=sm]/card:rounded-b-[22px]",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
