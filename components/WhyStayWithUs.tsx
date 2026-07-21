import CachedImage from "./CachedImage";
import Link from "next/link";
import SectionHeading from "./SectionHeading";
import { getStorageImageUrl } from "@/lib/supabase/storage";

const whyStayCards = [
  {
    title: "Riverside Location",
    description:
      "Wake up to river light, mangrove air, and quiet delta mornings right at the water's edge.",
    image: getStorageImageUrl("/images/Choose/RiversideLocation.jpg"),
    pill: "On the Matla River",
    href: "/about",
  },
  {
    title: "Home-cooked Bengali Meals",
    description:
      "Fresh fish, village produce, and comforting meals made in-house by the family every day.",
    image: getStorageImageUrl("/images/Choose/HomeCookedBengaliMeals.jpg"),
    pill: "Farm-to-table freshness",
    href: "/about",
  },
  {
    title: "Licensed Forest Guides",
    description:
      "Travel deeper with local experts who know the rhythms of the forest and the tides.",
    image: getStorageImageUrl("/images/Choose/LicensedForest Guides.jpg"),
    pill: "Govt. certified guides",
    href: "/about",
  },
  {
    title: "Family-Run",
    description:
      "Stay with hosts who treat every visitor like part of the home — because that's exactly what you are.",
    image: getStorageImageUrl("/images/Choose/FamilyRun.jpg"),
    pill: "3 generations of hospitality",
    href: "/about",
  },
];

export default function WhyStayWithUs() {
  return (
    <section id="why-stay" className="w-full bg-[#FAFAFA] py-12 md:py-20 scroll-mt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-8 md:mb-12 flex flex-col items-center gap-3">
          <SectionHeading first="Why Stay" second="With Us" />
          <p className="max-w-xl text-center text-[14px] leading-[1.75] text-[#666666]">
            Four reasons guests come back to Sundarban Greenview Homestay, year after year.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 md:gap-8">
          {whyStayCards.map((card) => (
            <div
              key={card.title}
              className="group bg-[#FFFFFF] border border-[#6DA003] rounded-[32px] p-4 shadow-[0_8px_30px_rgba(109,160,3,0.10)] hover:shadow-[0_12px_40px_rgba(109,160,3,0.16)] transition-shadow duration-300 flex flex-col h-full"
            >
              {/* Image */}
              <div className="relative w-full aspect-4/3 rounded-[24px] overflow-hidden bg-[#F5F5F5]">
                <CachedImage
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Pill — floats up out of the image */}
              <div className="flex justify-center -mt-4 relative z-10 mb-4">
                <div className="bg-[#FFFFFF] border border-[#555555] rounded-full px-4 py-1.5 text-[9px] md:text-[10px] text-[#111111] shadow-sm text-center max-w-full truncate">
                  {card.pill}
                </div>
              </div>

              {/* Content */}
              <div className="px-2 pb-2 grow flex flex-col">
                <h3 className="text-[15px] md:text-[16px] font-bold text-[#888888] leading-tight mb-3 line-clamp-2 min-h-10">
                  {card.title}
                </h3>

                <p className="text-[13px] leading-[1.7] text-[#666666] mb-5 grow">
                  {card.description}
                </p>

                {/* CTA Button — matches Trips card exactly */}
                <div className="mt-auto">
                  <Link
                    href={card.href}
                    className="w-full py-3 px-6 rounded-[24px] flex items-center justify-between text-base font-serif transition-colors border border-[#6DA003] bg-[#FFFFFF] text-[#6DA003] hover:bg-[#6DA003] hover:text-[#FFFFFF] group/btn"
                  >
                    Learn More
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-transform group-hover/btn:translate-x-1"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}