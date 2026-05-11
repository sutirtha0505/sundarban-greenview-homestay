import HeroPage from "@/components/hero";
import Navbar from "@/components/Navbar";
import Trips from "@/components/Trips";
import Rooms from "@/components/rooms";
import Gallery from "@/components/Gallery";
import About from "@/components/About";
import Activities from "@/components/Activities";
import SocialMedia from "@/components/SocialMedia";
import Reviews from "@/components/Reviews";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full bg-zinc-50 font-sans dark:bg-black">
      <Navbar />
      <HeroPage />
      <Trips />
      <Rooms />
      <About />
      <Activities />
      <Gallery />
      <Reviews />
      <SocialMedia />
    </main>
  );
}
