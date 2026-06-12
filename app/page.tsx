import { Heart, ListFilter, Share2 } from "lucide-react"
import Companion from "@/components/companion/Companion/Companion"
import CompanionContextProvider, {
  type CompanionCta,
} from "@/components/companion/CompanionContextProvider"
import CompanionInitializer from "@/components/companion/CompanionInitializer"
import CompanionScrollArea from "@/components/companion/CompanionScrollArea"

export default function Page() {
  const ctaLearnMore: CompanionCta = {
    label: "Learn more",
    linkProps: { href: "/" },
  }

  const ctaExploreComponents: CompanionCta = {
    label: "Explore components",
    linkProps: { href: "/" },
  }

  return (
    <CompanionContextProvider>
      <CompanionInitializer />
      <main>
        <div className="mx-auto grid w-full max-w-500 grid-cols-12 gap-x-6 gap-y-0 px-6 pb-24">
          <div className="col-span-full flex h-screen items-center">
            <CompanionScrollArea className="w-full">
              <div className="flex h-[50vh] items-center justify-center rounded-lg border border-neutral-200 bg-neutral-100">
                <div className="flex flex-col gap-2 text-center">
                  <h2 className="text-lg font-medium">Scroll to explore</h2>
                  <p className="text-neutral-600">
                    The companion at the bottom adapts to the section closest to
                    the center of the viewport.
                  </p>
                </div>
              </div>
            </CompanionScrollArea>
          </div>

          <CompanionScrollArea
            cta={ctaLearnMore}
            className="col-span-full lg:col-span-9 lg:col-start-1"
          >
            <div className="mt-32 flex h-[50vh] items-center justify-center rounded-lg border border-neutral-200 bg-neutral-100">
              <div className="flex flex-col gap-2 text-center">
                <h2 className="text-lg font-medium">
                  Shows the &quot;Learn more&quot; CTA
                </h2>
              </div>
            </div>
          </CompanionScrollArea>

          <CompanionScrollArea
            cta={ctaExploreComponents}
            className="col-span-full lg:col-span-9 lg:col-start-4"
          >
            <div className="mt-32 flex h-[50vh] items-center justify-center rounded-lg border border-neutral-200 bg-neutral-100">
              <div className="flex flex-col gap-2 text-center">
                <h2 className="text-lg font-medium">
                  Shows the &quot;Explore components&quot; CTA
                </h2>
              </div>
            </div>
          </CompanionScrollArea>

          <CompanionScrollArea
            cta={ctaExploreComponents}
            iconButtons={[{ label: "Filter", icon: <ListFilter /> }]}
            className="col-span-full lg:col-span-9 lg:col-start-1"
          >
            <div className="mt-32 flex h-[50vh] items-center justify-center rounded-lg border border-neutral-200 bg-neutral-100">
              <div className="flex flex-col gap-2 text-center">
                <h2 className="text-lg font-medium">
                  Shows the &quot;Explore components&quot; CTA
                </h2>
                <h2 className="text-lg font-medium">and a filter icon</h2>
              </div>
            </div>
          </CompanionScrollArea>

          <CompanionScrollArea
            iconButtons={[
              { label: "Share", icon: <Share2 /> },
              { label: "Favorite", icon: <Heart /> },
            ]}
            className="col-span-full lg:col-span-9 lg:col-start-4"
          >
            <div className="mt-32 flex h-[50vh] items-center justify-center rounded-lg border border-neutral-200 bg-neutral-100">
              <div className="flex flex-col gap-2 text-center">
                <h2 className="text-lg font-medium">
                  Shows share &amp; favorite icons
                </h2>
              </div>
            </div>
          </CompanionScrollArea>

          <CompanionScrollArea
            cta={ctaLearnMore}
            iconButtons={[
              { label: "Share", icon: <Share2 /> },
              { label: "Favorite", icon: <Heart /> },
            ]}
            className="col-span-full lg:col-span-9 lg:col-start-1"
          >
            <div className="mt-32 flex h-[50vh] items-center justify-center rounded-lg border border-neutral-200 bg-neutral-100">
              <div className="flex flex-col gap-2 text-center">
                <h2 className="text-lg font-medium">
                  Shows the &quot;Learn more&quot; CTA
                </h2>
                <h2 className="text-lg font-medium">
                  and share &amp; favorite icons
                </h2>
              </div>
            </div>
          </CompanionScrollArea>
        </div>
      </main>

      <Companion />
    </CompanionContextProvider>
  )
}
