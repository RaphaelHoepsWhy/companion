"use client"
import { motion } from "motion/react"
import type { ReactNode } from "react"
import { WIDTH_DURATION } from "@/components/companion/Companion/components/AnimateWidth"
import { cn } from "@/utilities/ui"
import { twEaseInOut } from "@/utilities/animation"

type AnimatedLabelProps = {
  label?: string
  icon?: ReactNode
  className?: string
}

const LETTER_DURATION = 0.12
const LETTER_STAGGER = 0.018

// Width and presence are owned by the surrounding AnimateWidth, which keys on
// the label and so mounts a fresh AnimatedLabel per change. This component only
// declares the enter animation — its letters (and icon) stagger in on mount. It
// sizes itself naturally via the in-flow ghost span; the visible letters are
// absolutely positioned on top.
export default function AnimatedLabel({
  label,
  icon,
  className,
}: AnimatedLabelProps) {
  const letters = (label ?? "").split("")

  return (
    <span className={cn("relative inline-flex items-center", className)}>
      {/* In-flow ghost: gives the label its natural width so layout is stable
          while the visible letters animate on top (absolutely positioned). */}
      <span
        aria-hidden
        className="pointer-events-none invisible inline-flex shrink-0 items-center gap-1"
      >
        <span className="inline-flex">
          {letters.map(function renderGhostLetter(letter, i) {
            return (
              <span
                key={i}
                className="whitespace-pre [text-box:trim-both_cap_alphabetic]"
              >
                {letter}
              </span>
            )
          })}
        </span>
        {icon}
      </span>
      <span
        aria-label={label}
        className="absolute inset-y-0 left-0 inline-flex -translate-y-px items-center gap-1"
      >
        <span className="inline-flex">
          {letters.map(function renderLetter(letter, i) {
            return (
              <span
                key={i}
                className="group-hover/letter-bounce:animate-letter-bounce pointer-events-none inline-block whitespace-pre [text-box:trim-both_cap_alphabetic]"
                style={{ animationDelay: `${i * 22}ms` }}
              >
                <motion.span
                  aria-hidden
                  initial={{ opacity: 0, y: 6 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: LETTER_DURATION,
                      ease: twEaseInOut,
                      // Wait for AnimateWidth's resize before staggering in.
                      delay: WIDTH_DURATION + i * LETTER_STAGGER,
                    },
                  }}
                  className="inline-block"
                >
                  {letter}
                </motion.span>
              </span>
            )
          })}
        </span>
        {icon && (
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                duration: LETTER_DURATION,
                ease: twEaseInOut,
                delay: WIDTH_DURATION + letters.length * LETTER_STAGGER,
              },
            }}
            className="inline-flex"
          >
            {icon}
          </motion.span>
        )}
      </span>
    </span>
  )
}
