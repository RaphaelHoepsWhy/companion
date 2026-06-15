"use client"

import type { ComponentProps } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import AnimatedLabel from "@/components/companion/Companion/components/AnimatedLabel"
import { cn } from "@/utilities/ui"

type CompanionCtaProps = {
  isExpanded: boolean
  label: string
  linkProps: ComponentProps<typeof Link>
}

export default function CompanionCta({
  isExpanded,
  label,
  linkProps,
}: CompanionCtaProps) {
  return (
    <div className="h-full">
      <Link
        {...linkProps}
        tabIndex={isExpanded ? 0 : -1}
        className={cn(
          "group/letter-bounce group relative flex h-full cursor-pointer items-center gap-1 overflow-hidden rounded-full bg-white px-4 transition-colors duration-300 ease-out",
          linkProps.className,
        )}
      >
        <AnimatedLabel
          label={label}
          icon={
            <ArrowRight className="ml-1 size-4.5 translate-y-px -rotate-45 text-black transition-transform duration-500 ease-out group-hover:rotate-0" />
          }
          className="text-base leading-none tracking-[0.25px] whitespace-nowrap text-black"
        />
      </Link>
    </div>
  )
}
