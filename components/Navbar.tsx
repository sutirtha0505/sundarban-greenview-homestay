import Link from "next/link";
import Image from "next/image";
import { getStorageImageUrl } from "@/lib/supabase/storage";

export default function Navbar() {
  return (
    <nav className="fixed top-4 left-1/2 z-50 w-[calc(100%-1rem)] max-w-[1600px] -translate-x-1/2 rounded-full border border-white/30 bg-white/75 px-4 py-3 shadow-[0_10px_40px_rgba(17,17,17,0.08)] backdrop-blur-md transition-all duration-300 sm:top-6 sm:w-[95%] sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <Link href="#home" className="flex items-center">
          <Image
            src={getStorageImageUrl("/images/icons/sundarban-green-view-logo.png")}
            alt="Sundarban Green View Logo"
            width={65}
            height={65}
            className="object-contain drop-shadow-md"
          />
        </Link>

        <div className="hidden lg:flex items-center gap-6 text-[13px] font-semibold text-[#111111]">
          <Link href="#trips" className="transition-colors duration-300 hover:text-[#6DA003]">Our Trips</Link>
          <Link href="#rooms" className="transition-colors duration-300 hover:text-[#6DA003]">Rooms</Link>
          <Link href="#activities" className="transition-colors duration-300 hover:text-[#6DA003]">Activities</Link>
          <Link href="#about" className="transition-colors duration-300 hover:text-[#6DA003]">About</Link>
          <Link href="#reviews" className="transition-colors duration-300 hover:text-[#6DA003]">Reviews</Link>
          <Link href="#gallery" className="transition-colors duration-300 hover:text-[#6DA003]">Gallery</Link>
          <Link href="#contact" className="transition-colors duration-300 hover:text-[#6DA003]">Contact</Link>
        </div>

        <div>
          <Link href="/booking" className="inline-flex rounded-full border border-[#8FCE05] bg-[#6DA003] px-5 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(109,160,3,0.24)] transition-all hover:scale-105 hover:bg-[#5B8703] sm:px-7 sm:py-2.5">
            Book Now
          </Link>
        </div>
      </div>
    </nav>
  );
}