"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getStorageImageUrl } from "@/lib/supabase/storage";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { name: "Our Trips", href: "#trips" },
    { name: "Rooms", href: "#rooms" },
    { name: "Activities", href: "#activities" },
    { name: "About", href: "#about" },
    { name: "Reviews", href: "#reviews" },
    { name: "Gallery", href: "#gallery" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <>
      <nav className="fixed top-4 left-1/2 z-[15] w-[calc(100%-1rem)] max-w-[1600px] -translate-x-1/2 rounded-full border border-white/40 bg-white/60 px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-xl saturate-150 transition-all duration-300 sm:top-6 sm:w-[95%] sm:px-6">
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

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6 text-[13px] font-semibold text-[#111111]">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="transition-colors duration-300 hover:text-[#6DA003]">
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/booking" className="hidden sm:inline-flex rounded-full border border-[#8FCE05] bg-[#6DA003] px-5 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(109,160,3,0.24)] transition-all hover:scale-105 hover:bg-[#5B8703] sm:px-7 sm:py-2.5">
              Book Now
            </Link>
            
            {/* Mobile Menu Toggle */}
            <button 
              className="flex lg:hidden items-center justify-center p-2 rounded-full bg-white/50 border border-white/40 backdrop-blur-md shadow-sm transition-transform active:scale-95 text-[#111111]"
              onClick={toggleMenu}
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Liquid Glass Overlay Menu */}
      <div 
        className={`fixed inset-0 z-[55] lg:hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Blur Backdrop */}
        <div 
          className="absolute inset-0 bg-black/10 backdrop-blur-2xl saturate-150 transition-opacity duration-500" 
          onClick={toggleMenu}
        ></div>
        
        {/* Glass Menu Card */}
        <div 
          className={`absolute top-24 left-1/2 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-3xl border border-white/50 bg-white/70 p-6 shadow-[0_30px_60px_rgba(0,0,0,0.15)] backdrop-blur-3xl transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
            isMenuOpen ? "translate-y-0 scale-100" : "-translate-y-10 scale-95"
          }`}
        >
          <div className="flex flex-col gap-4 text-center">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="text-lg font-medium text-gray-800 transition-colors hover:text-[#6DA003] py-2 border-b border-black/5 last:border-none"
                onClick={toggleMenu}
              >
                {link.name}
              </Link>
            ))}
            <Link 
              href="/booking" 
              className="mt-4 inline-flex justify-center rounded-full border border-[#8FCE05] bg-[#6DA003] px-6 py-3 text-base font-semibold text-white shadow-[0_10px_24px_rgba(109,160,3,0.3)] transition-all active:scale-95"
              onClick={toggleMenu}
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}