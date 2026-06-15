"use client"

import {
  ButtonHTMLAttributes,
  ComponentProps,
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import Link from "next/link"

// How long a scroll area must remain the centered area before the companion
// commits to showing it. Filters out areas the user fast-scrolls past so only
// the one they settle on takes over. See the activation effect.
const AREA_ACTIVATION_DEBOUNCE_MS = 100

export type CompanionViewState = "default" | "search"

export type CompanionVariant = "default" | "hidden"

export type CompanionCta = {
  label: string
  linkProps: ComponentProps<typeof Link>
}

export type CompanionIconButton = {
  label: string
  icon: ReactNode
  tooltipLabel?: string
  buttonProps?: ButtonHTMLAttributes<HTMLButtonElement>
}

export type CompanionAreaPayload = {
  cta?: CompanionCta
  iconButtons?: CompanionIconButton[]
}

type CompanionContextValue = {
  viewState: CompanionViewState
  setViewState: Dispatch<SetStateAction<CompanionViewState>>
  variant: CompanionVariant
  setVariant: Dispatch<SetStateAction<CompanionVariant>>
  cta?: CompanionCta
  iconButtons?: CompanionIconButton[]
  registerAreaPayload: (id: string, payload: CompanionAreaPayload) => void
  setAreaActive: (id: string, isActive: boolean) => void
  setDefaultCta: Dispatch<SetStateAction<CompanionCta | undefined>>
  setDefaultIconButtons: Dispatch<
    SetStateAction<CompanionIconButton[] | undefined>
  >
}

const defaultValue: CompanionContextValue = {
  viewState: "default",
  setViewState: () => {},
  variant: "hidden",
  setVariant: () => {},
  registerAreaPayload: () => {},
  setAreaActive: () => {},
  setDefaultCta: () => {},
  setDefaultIconButtons: () => {},
}

const CompanionContext = createContext<CompanionContextValue>(defaultValue)

export function useCompanionContext(): CompanionContextValue {
  return useContext(CompanionContext)
}

type CompanionContextProviderProps = {
  children: ReactNode
}

type ActiveArea = {
  id: string
  payload: CompanionAreaPayload
}

export default function CompanionContextProvider({
  children,
}: CompanionContextProviderProps) {
  const [viewState, setViewState] = useState<CompanionViewState>("default")
  const [variant, setVariant] = useState<CompanionVariant>("hidden")

  const [payloadsById, setPayloadsById] = useState<
    Record<string, CompanionAreaPayload>
  >({})
  // The area currently on the center line. At most one at a time (the scroll
  // areas use a -50% in-view margin → a single center line). Updates
  // immediately as the user scrolls; null when nothing is centered.
  const [activeId, setActiveId] = useState<string | null>(null)
  // The area we actually display. Debounced behind `activeId` so fast
  // scroll-throughs don't thrash it — null means "show the page default".
  const [committedId, setCommittedId] = useState<string | null>(null)

  const [defaultCta, setDefaultCta] = useState<CompanionCta | undefined>(
    undefined,
  )
  const [defaultIconButtons, setDefaultIconButtons] = useState<
    CompanionIconButton[] | undefined
  >(undefined)

  const registerAreaPayload = useCallback(function registerAreaPayload(
    id: string,
    payload: CompanionAreaPayload,
  ) {
    setPayloadsById((current) => ({ ...current, [id]: payload }))
  }, [])

  const setAreaActive = useCallback(function setAreaActive(
    id: string,
    isActive: boolean,
  ) {
    // Only one area is centered at a time. Setting active claims the slot;
    // clearing only releases it if this area still holds it (guards against a
    // late "leave" from the previous area arriving after the next one entered).
    setActiveId((current) => {
      if (isActive) return id
      return current === id ? null : current
    })
  }, [])

  // Debounce committing the active area: it must stay centered for
  // AREA_ACTIVATION_DEBOUNCE_MS before taking over, so areas the user scrolls
  // past never commit. While the timer is pending we keep showing the
  // previously committed area — no flicker mid-scroll. `activeId === null`
  // clears back to the page default (after the same debounce).
  useEffect(() => {
    if (activeId === committedId) return

    const timer = setTimeout(() => {
      setCommittedId(activeId)
    }, AREA_ACTIVATION_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [activeId, committedId])

  // cta and iconButtons always come from the same committed area, so they can
  // never desync.
  const activeArea: ActiveArea | undefined = useMemo(() => {
    if (committedId === null) return undefined
    return { id: committedId, payload: payloadsById[committedId] ?? {} }
  }, [committedId, payloadsById])

  return (
    <CompanionContext.Provider
      value={{
        viewState,
        setViewState,
        variant,
        setVariant,
        cta: activeArea?.payload.cta ?? defaultCta,
        iconButtons: activeArea?.payload.iconButtons ?? defaultIconButtons,
        registerAreaPayload,
        setAreaActive,
        setDefaultCta,
        setDefaultIconButtons,
      }}
    >
      {children}
    </CompanionContext.Provider>
  )
}
