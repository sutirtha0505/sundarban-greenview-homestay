import Image from "next/image";

export default function SocialMedia() {
    return (
        <div className="w-full bg-[#FAFAFA] py-8 md:py-12 lg:py-16 px-4 md:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-2 mb-6">
                <div className="h-px w-16 md:w-32 bg-[#71A129]"></div>
                <h2 className="text-3xl text-center md:text-4xl lg:text-5xl font-serif">
                    <span className="text-[#71A129]">Find Us On</span> <span className="text-[#111111]">Social Media</span>
                </h2>
                <div className="h-px w-16 md:w-32 bg-[#71A129]"></div>
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