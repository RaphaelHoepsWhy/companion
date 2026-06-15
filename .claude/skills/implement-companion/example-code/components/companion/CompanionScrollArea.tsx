"use client"

import { ReactNode, useEffect, useId, useRef } from "react"
import { useInView } from "motion/react"
import {
  type CompanionCta,
  type CompanionIconButton,
  useCompanionContext,
} from "@/components/companion/CompanionContextProvider"
import { cn } from "@/utilities/ui"

type CompanionScrollAnchorProps = {
  cta?: CompanionCta
  iconButtons?: CompanionIconButton[]
  children?: ReactNode
  className?: string
}

export default function CompanionScrollArea({
  cta,
  iconButtons,
  children,
  className,
}: CompanionScrollAnchorProps) {
  const ref = useRef<HTMLDivElement>(null)
  // A -50% margin top and bottom shrinks the viewport to a single center line,
  // so at most one scroll area is "centered" at any moment.
  const isAtCenter = useInView(ref, { margin: "-50% 0px -50% 0px" })
  const id = useId()
  const { registerAreaPayload, setAreaActive } = useCompanionContext()

  useEffect(() => {
    registerAreaPayload(id, { cta, iconButtons })
  }, [id, cta, iconButtons, registerAreaPayload])

  useEffect(() => {
    setAreaActive(id, isAtCenter)
    return () => setAreaActive(id, false)
  }, [id, isAtCenter, setAreaActive])

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  )
}
