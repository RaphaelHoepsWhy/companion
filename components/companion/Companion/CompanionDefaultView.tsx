"use client"

import { AnimatePresence, motion } from "motion/react"
import { Search } from "lucide-react"
import CompanionIconButton from "@/components/companion/Companion/components/CompanionIconButton"
import CompanionCta from "@/components/companion/Companion/components/CompanionCta"
import AnimateWidth from "@/components/companion/Companion/components/AnimateWidth"
import { useCompanionContext } from "@/components/companion/CompanionContextProvider"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { twEaseInOut } from "@/utilities/animation"

export default function CompanionDefaultView() {
  const { iconButtons, cta, setViewState } = useCompanionContext()
  const showFakeSearchInput = !iconButtons?.length && !cta

  function onSearchClick() {
    setViewState("search")
  }

  return (
    <div className="flex h-full items-center p-1 pl-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onSearchClick}
            aria-label="Search"
            className="group flex h-full w-12 cursor-pointer items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-inset disabled:cursor-default"
          >
            <Search
              size={18}
              className="text-neutral-200 transition-colors group-hover:text-white"
            />
          </button>
        </TooltipTrigger>
        <TooltipContent
          arrow={false}
          className="mb-1 flex h-7 items-center rounded-full border-[0.5px] border-white/25 bg-neutral-700 leading-0 text-white"
        >
          <span className="-mb-0.5 leading-7">Search</span>
        </TooltipContent>
      </Tooltip>

      <AnimatePresence initial={false}>
        {iconButtons?.map((iconButton) => (
          <motion.div
            key={iconButton.label}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{
              width: 0,
              opacity: 0,
              transition: {
                width: { duration: 0.3, ease: twEaseInOut },
                opacity: { duration: 0.12, ease: twEaseInOut },
              },
            }}
            transition={{ duration: 0.3, ease: twEaseInOut }}
            className="flex h-full shrink-0 overflow-clip [overflow-clip-margin:20px]"
          >
            <CompanionIconButton {...iconButton} />
          </motion.div>
        ))}
      </AnimatePresence>
      <AnimateWidth
        childrenKey={
          showFakeSearchInput ? "search" : cta ? `cta:${cta.label}` : "none"
        }
        className="h-full"
      >
        {showFakeSearchInput && (
          <div className="flex h-full shrink-0 overflow-clip rounded-full bg-neutral-500 [overflow-clip-margin:20px]">
            <div className="flex h-full rounded-full pl-4">
              <button
                onClick={onSearchClick}
                className="w-[180px] cursor-pointer rounded-full text-left text-base leading-none tracking-[0.5px] text-white outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-inset"
              >
                I&apos;m looking for...
              </button>
            </div>
          </div>
        )}
        {cta && (
          <CompanionCta
            isExpanded
            label={cta.label}
            linkProps={cta.linkProps}
          />
        )}
      </AnimateWidth>
    </div>
  )
}
