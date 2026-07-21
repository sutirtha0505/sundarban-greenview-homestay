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
                        src="https://www.youtube.com/embed/cwsdTKoGv5U?si=BgyG-sKL-ifz_Upp"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                    ></iframe>
                </div>
                <div className="relative w-full rounded-2xl overflow-hidden min-h-[280px] md:min-h-[400px] lg:min-h-[500px] md:w-1/2">
                    <iframe
                        className="w-full min-h-[240px] md:min-h-[400px] lg:min-h-[500px]"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4051.733266196112!2d88.83728459999999!3d22.139594900000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0189f8a4923665%3A0xe956aa844bede1de!2sSUNDARBAN%20GREEN%20VIEW%20HOMESTAY!5e1!3m2!1sen!2sin!4v1784606481109!5m2!1sen!2sin"
                        title="Google Maps"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
        </div>
    );
}