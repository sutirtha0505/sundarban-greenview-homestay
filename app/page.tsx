import HeroPage from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Trips from "@/components/Trips";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full bg-zinc-50 font-sans dark:bg-black">
      <Navbar />
      <HeroPage />
      <Trips />
    </main>
  );
}
