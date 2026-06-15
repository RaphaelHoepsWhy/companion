"use client"
import { animate, AnimatePresence, motion, useMotionValue } from "motion/react"
import type { ReactNode } from "react"
import { useRef } from "react"
import { cn } from "@/utilities/ui"
import { twEaseInOut } from "@/utilities/animation"

type AnimateWidthProps = {
  /**
   * Identifies the current content. When it changes, the component fades out the
   * old children, animates the width to fit the new children, then fades them in.
   * Drive the swap with this rather than relying on `children` identity, which is
   * a fresh object on every parent render.
   *
   * Swaps never interrupt each other: `AnimatePresence mode="wait"` finishes the
   * exit before mounting the next child, and mounts whatever the current key is —
   * so a key change mid-swap is picked up after, skipping intermediates.
   */
  childrenKey: string
  children: ReactNode
  className?: string
  /**
   * Scale the content shrinks to while faded out (growing back to 1 on fade-in).
   * Defaults to 0.96.
   */
  collapsedScale?: number
}

const FADE_DURATION = 0.18
// Exported so children (e.g. AnimatedLabel) can delay their own enter until the
// width resize is done, keeping the sequence fade-out → adjust width → appear.
export const WIDTH_DURATION = 0.22
const DEFAULT_COLLAPSED_SCALE = 0.96

export default function AnimateWidth({
  childrenKey,
  children,
  className,
  collapsedScale = DEFAULT_COLLAPSED_SCALE,
}: AnimateWidthProps) {
  // The container itself — read to capture the outgoing width before the swap.
  const containerRef = useRef<HTMLDivElement>(null)
  // Renders the incoming children (invisible, out of flow) so we can measure
  // their target width before they animate in.
  const measureGhostRef = useRef<HTMLDivElement>(null)
  // Container width. "auto" while idle (content-sized). During a swap it is
  // pinned to a number so it can animate from the outgoing width to the
  // incoming one in the gap between fade-out and fade-in.
  const widthMV = useMotionValue<number | string>("auto")
  // The container width captured at the moment a swap's exit begins (still the
  // old content's width), used as the resize animation's starting point.
  const outgoingWidthRef = useRef<number | null>(null)

  // Exit begins: freeze the container to the outgoing width so it holds steady
  // while the old child fades out (fixed number, not "auto" that would track
  // the about-to-change content). Only acts at rest (width "auto") — this also
  // fires on the enter, where width is mid-resize and must be left alone.
  function pinOutgoingWidth() {
    if (widthMV.get() !== "auto") return
    const w = containerRef.current?.offsetWidth
    if (w == null) return
    outgoingWidthRef.current = w
    widthMV.set(w)
  }

  // Old child fully gone (AnimatePresence mode="wait"): animate width from the
  // outgoing width to the incoming child's width. The new child mounts now but
  // its enter is delayed by WIDTH_DURATION, so the sequence stays:
  // fade out → adjust width → appear.
  function resizeToIncoming() {
    const target = measureGhostRef.current?.offsetWidth
    if (target == null) return
    if (outgoingWidthRef.current != null) widthMV.set(outgoingWidthRef.current)
    animate(widthMV, target, { duration: WIDTH_DURATION, ease: twEaseInOut })
  }

  return (
    <motion.div
      ref={containerRef}
      style={{ width: widthMV }}
      className={cn("relative inline-flex", className)}
    >
      {/* Measure ghost: renders the live children so we can read the incoming
          target width once the new child is about to mount. */}
      <div
        ref={measureGhostRef}
        aria-hidden
        className="pointer-events-none invisible absolute flex shrink-0"
      >
        {children}
      </div>
      <AnimatePresence
        mode="wait"
        initial={false}
        onExitComplete={resizeToIncoming}
      >
        <motion.div
          key={childrenKey}
          initial={{ opacity: 0, scale: collapsedScale }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: {
              duration: FADE_DURATION,
              ease: twEaseInOut,
              // Wait for the width resize (kicked off in onExitComplete) before
              // the new content appears.
              delay: WIDTH_DURATION,
            },
          }}
          exit={{
            opacity: 0,
            scale: collapsedScale,
            transition: {
              duration: FADE_DURATION,
              ease: twEaseInOut,
            },
          }}
          // Capture and pin the outgoing width as the exit starts. (Fires for
          // the enter too, but pinning to the live width then is a no-op.)
          onAnimationStart={pinOutgoingWidth}
          // Release width back to content-sized once the new content settled.
          onAnimationComplete={() => widthMV.set("auto")}
          className="flex shrink-0"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
