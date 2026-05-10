import Image from "next/image";

export default function SocialMedia() {
    return (
        <div className="flex w-full h-screen flex-col items-center py-16 px-8 bg-[#FAFAFA]">
            <div className="flex items-center gap-2 mb-6">
                <div className="h-px w-16 md:w-32 bg-[#71A129]"></div>
                <h2 className="text-4xl md:text-5xl font-serif">
                    <span className="text-[#71A129]">Find Us On</span> <span className="text-[#111111]">Social Media</span>
                </h2>
                <div className="h-px w-16 md:w-32 bg-[#71A129]"></div>
            </div>
            <div className="flex w-full p-6 gap-6">
                <div className="w-1/2 rounded-2xl">
                    <iframe className="rounded-2xl w-full h-full" width="560" height="315" src="https://www.youtube.com/embed/1L0aiF4-gUU?si=fZ-0P_K_xnP7A3Q1" title="YouTube video player"  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"  allowFullScreen></iframe>
                </div>
                <div className="w-1/2 rounded-2xl">
                    <Image
                        src={"/images/social/image2.png"}
                        alt="Social Media"
                        width={1440}
                        height={1440}
                        className="w-full h-full object-cover rounded-2xl"
                    />
                </div>
            </div>
        </div>
    );
};