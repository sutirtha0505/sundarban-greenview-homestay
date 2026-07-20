import Image from "next/image";
import SectionHeading from "./SectionHeading";

export default function SocialMedia() {
    return (
        <div className="w-full bg-[#FAFAFA] py-8 md:py-12 lg:py-16 px-4 md:px-6 lg:px-8 scroll-mt-28">
            <div className="mb-6">
                <SectionHeading first="Find Us On" second="Social Media" />
            </div>
            <div className="flex w-full flex-col gap-6 md:flex-row">
                <div className="w-full rounded-2xl overflow-hidden md:w-1/2">
                    <iframe
                        className="w-full min-h-[240px] md:min-h-[400px] lg:min-h-[500px]"
                        src="https://www.youtube.com/embed/1L0aiF4-gUU?si=fZ-0P_K_xnP7A3Q1"
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                    ></iframe>
                </div>
                <div className="relative w-full rounded-2xl overflow-hidden min-h-[280px] md:min-h-[400px] lg:min-h-[500px] md:w-1/2">
                    <Image
                        src="/images/social/image2.png"
                        alt="Social Media"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                    />
                </div>
            </div>
        </div>
    );
}