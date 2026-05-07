import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="fixed top-6 left-1/2 z-50 w-[95%] -translate-x-1/2 rounded-full border border-white/20 bg-white/10 px-6 py-3 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all duration-300">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/images/icons/sundarban-green-view-logo.png"
            alt="Sundarban Green View Logo"
            width={65}
            height={65}
            className="object-contain drop-shadow-md"
          />
        </div>

        {/* Navigation Links */}
        <div className="hidden lg:block">
          <ul className="flex items-center gap-8 text-sm font-medium text-white">
            <li className="cursor-pointer transition-colors duration-300 hover:text-[#C5FE4E]">Our Trips</li>
            <li className="cursor-pointer transition-colors duration-300 hover:text-[#C5FE4E]">Rooms</li>
            <li className="cursor-pointer transition-colors duration-300 hover:text-[#C5FE4E]">Activities</li>
            <li className="cursor-pointer transition-colors duration-300 hover:text-[#C5FE4E]">About</li>
            <li className="cursor-pointer transition-colors duration-300 hover:text-[#C5FE4E]">Reviews</li>
            <li className="cursor-pointer transition-colors duration-300 hover:text-[#C5FE4E]">Gallery</li>
            <li className="cursor-pointer transition-colors duration-300 hover:text-[#C5FE4E]">Contact</li>
          </ul>
        </div>

        {/* CTA Button */}
        <div>
          <button className="rounded-full bg-[#6DA003] px-7 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-[#5b8703] border border-[#8FCE05]">
            Book Now
          </button>
        </div>
      </div>
    </nav>
  );
}