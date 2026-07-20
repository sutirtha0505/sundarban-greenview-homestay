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
import WhyStayWithUs from "@/components/WhyStayWithUs";


export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-background font-sans text-foreground">
      <Navbar />
      <HeroPage />
      <Trips />
      <Rooms />
      <About />
      <WhyStayWithUs/>
      <Activities />
      <Gallery />
      <Reviews />
      <SocialMedia />
      <Contact />
    </main>
  );
}
