"use client"

import { type CompanionIconButton as CompanionIconButtonType } from "@/components/companion/CompanionContextProvider"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type CompanionIconButtonProps = CompanionIconButtonType

export default function CompanionIconButton({
  label,
  icon,
  buttonProps,
}: CompanionIconButtonProps) {
  const button = (
    <button
      {...buttonProps}
      aria-label={label}
      className="group flex h-full w-12 cursor-pointer items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-inset"
    >
      <span className="flex text-neutral-300 transition-colors group-hover:text-white [&>svg]:size-4.5">
        {icon}
      </span>
    </button>
  )

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent
        arrow={false}
        className="mb-1 flex h-7 items-center rounded-full border-[0.5px] border-white/25 bg-neutral-700 leading-0 text-white"
      >
        <span className="-mb-0.5 leading-7">{label}</span>
      </TooltipContent>
    </Tooltip>
  )
}
