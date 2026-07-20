import Image from "next/image";
import { Open_Sans } from "next/font/google";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

export default function About() {
    return (
        <section id="about" className="w-full bg-[#FAFAFA] py-8 scroll-mt-28">
            <div className="mx-auto w-full max-w-[1180px] px-4">

                {/* ─── MOBILE + TABLET LAYOUT (< lg) ─── */}
                <div className="flex flex-col gap-[4px] overflow-hidden rounded-[30px] lg:hidden">

                    {/* Top bento grid */}
                    <div className="h-[220px] md:h-[280px] grid grid-cols-[1fr_1fr_1fr] grid-rows-[1fr_1fr_1fr_1fr] gap-[4px]">
                        <div className="relative col-span-1 row-span-2 overflow-hidden">
                            <Image src="/images/gallery/image1.jpg" alt="" fill className="object-cover" />
                        </div>
                        <div className="relative col-span-2 row-span-2 overflow-hidden">
                            <Image src="/images/gallery/image2.jpg" alt="" fill className="object-cover" />
                        </div>
                        <div className="relative overflow-hidden">
                            <Image src="/images/gallery/image3.jpg" alt="" fill className="object-cover" />
                        </div>
                        <div className="relative col-span-2 overflow-hidden">
                            <Image src="/images/gallery/image4.jpg" alt="" fill className="object-cover" />
                        </div>
                        <div className="relative col-span-3 overflow-hidden">
                            <Image src="/images/gallery/image5.jpg" alt="" fill className="object-cover" />
                        </div>
                    </div>

                    {/* Center text card */}
                    <div className="flex flex-col items-center justify-center bg-white px-6 md:px-10 py-8 md:py-12 text-center">
                        <p className={`${openSans.className} text-[20px] md:text-[26px] leading-none text-[#858585]`}>
                            Welcoming you
                        </p>
                        <p className={`${openSans.className} mt-1 text-[20px] md:text-[26px] leading-none text-[#858585]`}>
                            at
                        </p>

                        <h1 className="mt-3 md:mt-4 font-serif text-[36px] md:text-[48px] leading-[1.1]">
                            <span className="text-[#6DA003]">GreenView</span>{" "}
                            <span className="text-[#0C0000]">HomeStay</span>
                        </h1>

                        <p className="mt-4 md:mt-5 max-w-[500px] md:max-w-[600px] text-[13px] md:text-[14px] leading-[1.65] md:leading-[1.7] text-[#858585]">
                            Discover the heart of Sundarban with a stay at Sundarban GreenView
                            Homestay, where nature&apos;s symphony meets authentic hospitality.
                            Nestled amidst lush greenery, our home away from home offers a serene
                            escape with the perfect blend of comfort and wilderness.
                        </p>

                        <p className="mt-3 md:mt-4 max-w-[500px] md:max-w-[600px] text-[13px] md:text-[14px] leading-[1.65] md:leading-[1.7] text-[#858585]">
                            Whether you&apos;re here for the thrilling jungle safaris,
                            birdwatching, or simply to unwind by the river, we&apos;re here to
                            make your journey unforgettable. Come, experience the magic of
                            Sundarban with us.
                        </p>

                        <button className="mt-6 md:mt-8 rounded-full bg-[#6DA003] px-10 md:px-12 py-2.5 md:py-3 font-serif text-[18px] md:text-[22px] leading-none text-white">
                            Read More
                        </button>
                    </div>

                    {/* Bottom bento grid */}
                    <div className="h-[220px] md:h-[280px] grid grid-cols-[1fr_1fr_1fr] grid-rows-[1fr_1fr_1fr_1fr] gap-[4px]">
                        <div className="relative col-span-3 overflow-hidden">
                            <Image src="/images/gallery/image10.jpg" alt="" fill className="object-cover" />
                        </div>
                        <div className="relative col-span-2 row-span-1 overflow-hidden">
                            <Image src="/images/gallery/image11.jpg" alt="" fill className="object-cover" />
                        </div>
                        <div className="relative col-span-1 row-span-2 overflow-hidden">
                            <Image src="/images/gallery/image12.jpg" alt="" fill className="object-cover" />
                        </div>
                        <div className="relative col-span-2 row-span-2 overflow-hidden">
                            <Image src="/images/gallery/image13.jpg" alt="" fill className="object-cover" />
                        </div>
                        <div className="relative overflow-hidden">
                            <Image src="/images/gallery/image14.jpg" alt="" fill className="object-cover" />
                        </div>
                    </div>
                </div>

                {/* ─── DESKTOP LAYOUT (lg+) ─── */}
                <div className="hidden lg:grid h-[840px] grid-cols-[1.02fr_1.55fr_1.08fr] gap-[4px] overflow-hidden rounded-[30px]">
                    {/* LEFT */}
                    <div className="grid h-full grid-cols-[1fr_1fr_1fr] grid-rows-[1fr_1fr_1fr_1fr] gap-[4px]">
                        <div className="relative col-span-1 row-span-2 overflow-hidden">
                            <Image src="/images/gallery/image1.jpg" alt="" fill className="object-cover" />
                        </div>
                        <div className="relative col-span-2 row-span-2 overflow-hidden">
                            <Image src="/images/gallery/image2.jpg" alt="" fill className="object-cover" />
                        </div>
                        <div className="relative overflow-hidden">
                            <Image src="/images/gallery/image3.jpg" alt="" fill className="object-cover" />
                        </div>
                        <div className="relative col-span-2 overflow-hidden">
                            <Image src="/images/gallery/image4.jpg" alt="" fill className="object-cover" />
                        </div>
                        <div className="relative col-span-3 overflow-hidden">
                            <Image src="/images/gallery/image5.jpg" alt="" fill className="object-cover" />
                        </div>
                    </div>

                    {/* CENTER */}
                    <div className="grid h-full grid-rows-[0.55fr_2.2fr_0.55fr] gap-[4px]">
                        <div className="grid h-full grid-cols-2 gap-[4px]">
                            <div className="relative overflow-hidden">
                                <Image src="/images/gallery/image6.jpg" alt="" fill className="object-cover" />
                            </div>
                            <div className="relative overflow-hidden">
                                <Image src="/images/gallery/image7.jpg" alt="" fill className="object-cover" />
                            </div>
                        </div>

                        <div className="flex h-full flex-col items-center justify-center bg-white px-8 text-center">
                            <p className={`${openSans.className} text-[30px] leading-none text-[#858585]`}>
                                Welcoming you
                            </p>
                            <p className={`${openSans.className} mt-1 text-[30px] leading-none text-[#858585]`}>
                                at
                            </p>

                            <h1 className="mt-5 font-serif text-[52px] leading-[1.05]">
                                <span className="text-[#6DA003]">GreenView</span>{" "}
                                <span className="text-[#0C0000]">HomeStay</span>
                            </h1>

                            <p className="mt-5 max-w-[610px] text-[14px] leading-7 text-[#858585]">
                                Discover the heart of Sundarban with a stay at Sundarban Green View
                                Homestay, where nature&apos;s symphony meets authentic hospitality.
                                Nestled amidst lush greenery, our home away from home offers a serene
                                escape with the perfect blend of comfort and wilderness.
                            </p>

                            <p className="mt-5 max-w-[610px] text-[14px] leading-7 text-[#858585]">
                                Whether you&apos;re here for the thrilling jungle safaris,
                                birdwatching, or simply to unwind by the river, we&apos;re here to
                                make your journey unforgettable. Come, experience the magic of
                                Sundarban with us.
                            </p>

                            <button className="mt-8 rounded-full bg-[#6DA003] px-12 py-3 font-serif text-[24px] leading-none text-white">
                                Read More
                            </button>
                        </div>

                        <div className="grid h-full grid-cols-2 gap-[4px]">
                            <div className="relative overflow-hidden">
                                <Image src="/images/gallery/image8.jpg" alt="" fill className="object-cover" />
                            </div>
                            <div className="relative overflow-hidden">
                                <Image src="/images/gallery/image9.jpg" alt="" fill className="object-cover" />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="grid h-full grid-cols-[1fr_1fr_1fr] grid-rows-[1fr_1fr_1fr_1fr] gap-[4px]">
                        <div className="relative col-span-3 overflow-hidden">
                            <Image src="/images/gallery/image10.jpg" alt="" fill className="object-cover" />
                        </div>
                        <div className="relative col-span-2 row-span-1 overflow-hidden">
                            <Image src="/images/gallery/image11.jpg" alt="" fill className="object-cover" />
                        </div>
                        <div className="relative col-span-1 row-span-2 overflow-hidden">
                            <Image src="/images/gallery/image12.jpg" alt="" fill className="object-cover" />
                        </div>
                        <div className="relative col-span-2 row-span-2 overflow-hidden">
                            <Image src="/images/gallery/image13.jpg" alt="" fill className="object-cover" />
                        </div>
                        <div className="relative overflow-hidden">
                            <Image src="/images/gallery/image14.jpg" alt="" fill className="object-cover" />
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}