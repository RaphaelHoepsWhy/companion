"use client"

import { useEffect } from "react"
import {
  type CompanionCta,
  type CompanionIconButton,
  useCompanionContext,
} from "@/components/companion/CompanionContextProvider"

type CompanionPageSettingsProps = {
  cta?: CompanionCta
  iconButtons?: CompanionIconButton[]
}

export default function CompanionInitializer({
  cta,
  iconButtons,
}: CompanionPageSettingsProps) {
  const { setDefaultCta, setDefaultIconButtons, setVariant } =
    useCompanionContext()

  useEffect(() => {
    setDefaultCta(cta)
    setDefaultIconButtons(iconButtons)
    setVariant("default")
    return () => {
      setDefaultCta(undefined)
      setDefaultIconButtons(undefined)
      setVariant("hidden")
    }
  }, [cta, iconButtons, setDefaultCta, setDefaultIconButtons, setVariant])

  return null
}
