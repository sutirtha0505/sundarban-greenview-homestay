import HeroPage from "@/components/hero";
import Navbar from "@/components/Navbar";
import Trips from "@/components/Trips";
import Rooms from "@/components/rooms";
import Gallery from "@/components/Gallery";
import Reviews from "@/components/Reviews";
import About from "@/components/About";
import Activities from "@/components/Activities";
import SocialMedia from "@/components/SocialMedia";
import Contact from "@/components/Contact";

const whyStayCards = [
  {
    title: "Riverside location",
    description: "Wake up to river light, mangrove air, and quiet delta mornings.",
  },
  {
    title: "Home-cooked Bengali meals",
    description: "Fresh fish, village produce, and comforting meals made in-house.",
  },
  {
    title: "Licensed forest guides",
    description: "Travel deeper with local experts who know the rhythms of the forest.",
  },
  {
    title: "Family-run",
    description: "Stay with hosts who treat every visitor like part of the home.",
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-background font-sans text-foreground">
      <Navbar />
      <HeroPage />
      <Trips />
      <Rooms />
      <About />
      <section className="bg-[#FAFAFA] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[32px] border border-[#6DA003]/20 bg-white px-5 py-6 shadow-[0_10px_30px_rgba(109,160,3,0.08)] sm:px-8 sm:py-8">
          <div className="mb-6 flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-[#6DA003] sm:w-20" />
            <p className="text-[11px] uppercase tracking-[0.32em] text-[#6DA003]">Why stay with us</p>
            <span className="h-px w-12 bg-[#6DA003] sm:w-20" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {whyStayCards.map((card) => (
              <div key={card.title} className="rounded-[24px] border border-[#6DA003]/15 bg-[#FAFAFA] p-5">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#6DA003]/10 text-[#6DA003]">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M8 13l2.5 2.5L16 10" />
                  </svg>
                </div>
                <h3 className="text-[15px] font-semibold text-[#111111]">{card.title}</h3>
                <p className="mt-2 text-[13px] leading-6 text-[#666666]">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Activities />
      <Gallery />
      <Reviews />
      <SocialMedia />
      <Contact />
    </main>
  );
}
