"use client"

import { motion, type Variants } from "motion/react"
import { ChevronDown, Search } from "lucide-react"
import { useCompanionContext } from "@/components/companion/CompanionContextProvider"
import { twEaseInOut } from "@/utilities/animation"
import { cn } from "@/utilities/ui"

const items = [
  "Getting started",
  "Scroll areas",
  "Size animations",
  "Icon buttons",
  "Search view",
]
const activeIndex = 0

const listVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.25 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: twEaseInOut },
  },
}

const dividerVariants: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: twEaseInOut },
  },
}

export default function CompanionSearchView() {
  const { setViewState } = useCompanionContext()

  function onClose() {
    setViewState("default")
  }

  return (
    <div className="relative size-full overflow-hidden">
      <div className="flex h-full w-full flex-col gap-6 p-6">
        <div className="flex items-center gap-3">
          <Search size={20} className="shrink-0 text-neutral-400" />
          <div className="flex h-12 flex-1 items-center rounded-full bg-neutral-400/60 px-5 focus-within:ring-2 focus-within:ring-white">
            <input
              type="text"
              autoFocus
              placeholder="I'm looking for..."
              className="h-full w-full bg-transparent text-base text-white outline-none placeholder:text-white/70"
            />
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex shrink-0 cursor-pointer items-center justify-center rounded-full bg-neutral-500 p-2 outline-none transition-colors hover:bg-neutral-600 focus-visible:ring-2 focus-visible:ring-white"
          >
            <ChevronDown size={21} className="text-white" />
          </button>
        </div>
        <motion.div
          className="flex flex-col gap-1.5 px-6 pt-3"
          initial="hidden"
          animate="visible"
          variants={listVariants}
        >
          {items.map(function renderItem(label, i) {
            return (
              <motion.div key={label} variants={itemVariants}>
                {i > 0 ? (
                  <motion.div
                    className="mb-1.5 h-px w-full origin-left bg-white/20"
                    variants={dividerVariants}
                  />
                ) : null}
                <p
                  className={cn("cursor-pointer text-base transition-colors", {
                    "text-white": i === activeIndex,
                    "text-white/50 hover:text-white": i !== activeIndex,
                  })}
                >
                  {label}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}
