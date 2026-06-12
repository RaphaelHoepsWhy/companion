"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import CompanionDefaultView from "@/components/companion/Companion/CompanionDefaultView"
import CompanionSearchView from "@/components/companion/Companion/CompanionSearchView"
import { CompanionViewState } from "@/components/companion/CompanionContextProvider"
import { twEaseIn, twEaseInOut, twEaseOut } from "@/utilities/animation"

type CompanionViewSwitcherProps = {
  view: CompanionViewState
}

const fadeDuration = 0.15
const axisDuration = 0.13

export default function CompanionViewSwitcher({
  view,
}: CompanionViewSwitcherProps) {
  const [renderedView, setRenderedView] = useState(view)
  const [hasSwitchedView, setHasSwitchedView] = useState(false)
  const isSearch = renderedView === "search"
  const inSync = renderedView === view

  function onExitComplete() {
    setHasSwitchedView(true)
    setRenderedView(view)
  }

  return (
    <motion.div
      initial={false}
      animate={{
        width: isSearch ? "90vw" : "auto",
        height: isSearch ? "75vh" : "3.5rem",
      }}
      transition={{
        width: {
          duration: axisDuration,
          delay: isSearch ? 0 : axisDuration,
          ease: isSearch ? twEaseIn : twEaseOut,
        },
        height: {
          duration: axisDuration,
          delay: isSearch ? axisDuration : 0,
          ease: isSearch ? twEaseOut : twEaseIn,
        },
      }}
      className="max-h-[600px] max-w-[1000px] overflow-hidden"
    >
      <AnimatePresence
        initial={false}
        mode="wait"
        onExitComplete={onExitComplete}
      >
        {inSync && (
          <motion.div
            key={renderedView}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: { duration: fadeDuration, ease: twEaseInOut },
            }}
            transition={{
              duration: fadeDuration,
              ease: twEaseInOut,
              delay: hasSwitchedView ? axisDuration * 2 : 0,
            }}
            className="h-full w-full"
          >
            {isSearch ? <CompanionSearchView /> : <CompanionDefaultView />}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
