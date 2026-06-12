"use client"

import { useEffect, useRef } from "react"
import { AnimatePresence, motion } from "motion/react"
import CompanionViewSwitcher from "@/components/companion/Companion/CompanionViewSwitcher"
import {
  CompanionViewState,
  useCompanionContext,
} from "@/components/companion/CompanionContextProvider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { twEaseInOut } from "@/utilities/animation"
import { cn } from "@/utilities/ui"

type CompanionProps = {
  isInline?: boolean
  forceView?: CompanionViewState
}

const pillBorderRadius = 28

export default function Companion({
  isInline = false,
  forceView,
}: CompanionProps) {
  const { viewState, setViewState, variant } = useCompanionContext()
  const ref = useRef<HTMLDivElement>(null)
  const effectiveView = forceView ?? viewState

  useEffect(
    function trackClicksOutside() {
      if (forceView) return
      if (viewState !== "search") return

      function onMouseDown(event: MouseEvent) {
        if (ref.current?.contains(event.target as Node)) return
        setViewState("default")
      }

      document.addEventListener("mousedown", onMouseDown)
      return () => document.removeEventListener("mousedown", onMouseDown)
    },
    [forceView, viewState, setViewState],
  )

  return (
    <TooltipProvider delayDuration={1000}>
      <div
        className={cn(
          isInline
            ? "relative"
            : "fixed bottom-6 left-1/2 z-50 -translate-x-1/2",
        )}
      >
        <AnimatePresence initial={false}>
          {variant !== "hidden" && (
            <motion.div
              ref={ref}
              key="companion"
              initial={isInline ? false : { width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0 }}
              transition={{ duration: 0.18, ease: twEaseInOut }}
              style={{ borderRadius: pillBorderRadius }}
              className="relative bg-neutral-600 shadow-lg backdrop-blur-md"
            >
              <div
                className="overflow-hidden"
                style={{ borderRadius: pillBorderRadius }}
              >
                <motion.div
                  initial={isInline ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.25,
                    delay: 0.2,
                    ease: twEaseInOut,
                  }}
                >
                  <CompanionViewSwitcher view={effectiveView} />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  )
}
