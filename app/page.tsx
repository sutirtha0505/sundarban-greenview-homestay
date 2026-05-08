import HeroPage from "@/components/hero";
import Navbar from "@/components/Navbar";
import Trips from "@/components/trips";
import Rooms from "@/components/rooms";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full bg-zinc-50 font-sans dark:bg-black">
      <Navbar />
      <HeroPage />
      <Trips />
      <Rooms />
    </main>
  );
}
