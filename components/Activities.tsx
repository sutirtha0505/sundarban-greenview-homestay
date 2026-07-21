"use client";

import CachedImage from "./CachedImage";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { getStorageImageUrl } from "@/lib/supabase/storage";

const activities = [
    {
        title1: "Boat Safari through Narrow",
        title2: "Mangrove Creeks",
        guider: "with local guides",
        description:
            "Drift through the mangrove creeks in a small boat with a local guide, watching the shoreline open and close around you as the river changes colour with the light.",
    },
    {
        title1: "Bird Watching in the",
        title2: "Forest",
        guider: "with bird experts",
        description:
            "Join our early-morning birding walks to spot kingfishers, herons, bee-eaters, and other delta birdlife before the heat settles in.",
    },
    {
        title1: "Sunset",
        title2: "River Cruise",
        guider: "with river guides",
        description:
            "Take a slow sunset cruise and watch the river turn gold while the mangroves settle into evening and the sky opens wide above the delta.",
    },
    {
        title1: "Tiger Zone",
        title2: "Exploration",
        guider: "with forest guides",
        description:
            "Explore the protected forest zones and watchtowers with a licensed guide, keeping an eye out for deer, crocodiles, and the quieter signs of the forest.",
    },
    {
        title1: "Village Life",
        title2: "Experience",
        guider: "with local hosts",
        description:
            "Spend time in the village, listen to Bonbibi Pala or folk songs, and see how daily life flows with the tides and the seasons.",
    },
    {
        title1: "Mangrove Forest",
        title2: "Walk",
        guider: "with nature guides",
        description:
            "Walk the edges of the mangrove forest with a naturalist guide and learn how these roots hold the delta together against salt and tide.",
    },
];

export default function Activities() {
    const [current, setCurrent] = useState(0);

    const prev = () =>
        setCurrent((c) => (c - 1 + activities.length) % activities.length);
    const next = () =>
        setCurrent((c) => (c + 1) % activities.length);

    const activity = activities[current];

    return (
        <section className="relative flex w-full py-10 md:py-14 lg:py-16 bg-[#E1E1E1] scroll-mt-28" id="activities">
            <div className="w-full px-4 md:px-6 lg:px-8 mx-auto flex flex-col-reverse gap-8 md:flex-row">

                {/* ── LEFT: Text Slider ── */}
                <div className="flex flex-col w-full md:w-1/2">
                    {/* Heading */}
                    <div className="mb-6 md:mb-10">
                        <SectionHeading first="Activities" second="You'll Never Forget" />
                    </div>

                    <div className="flex-1 min-h-[260px] md:min-h-[240px] lg:min-h-[280px] mt-4 md:mt-10 lg:mt-16" key={current}>
                        <div className="flex flex-col items-center justify-center">
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal text-[#666666] leading-snug">
                                {activity.title1}
                            </h2>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl text-[#6DA003] font-normal">
                                {activity.title2}
                            </h2>
                        </div>

                        <p className="my-4 md:my-6 lg:my-8 text-lg md:text-xl lg:text-2xl italic text-[#FF9500] text-right pr-4">
                            {activity.guider}
                        </p>

                        <p className="my-6 md:my-10 lg:my-16 text-base md:text-lg lg:text-xl text-[#666666] leading-[24px] md:leading-[26px] text-center">
                            {activity.description}
                        </p>
                    </div>

                    <div className="flex gap-3 mt-6 md:mt-10 lg:mt-16 justify-end">
                        <button
                            onClick={prev}
                            className="w-10 h-10 rounded-full border border-[#858585] flex items-center justify-center hover:bg-[#6DA003] hover:border-[#6DA003] hover:text-white transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={next}
                            className="w-10 h-10 rounded-full border border-[#858585] flex items-center justify-center hover:bg-[#6DA003] hover:border-[#6DA003] hover:text-white transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* ── RIGHT: Bento Grid ── */}
                <div className="w-full grid grid-cols-[1fr_1fr_1fr_1fr] grid-rows-[70px_35px_70px] gap-[4px] rounded-2xl overflow-hidden md:w-1/2 md:grid-rows-[80px_40px_80px] lg:grid-rows-[100px_50px_100px] md:gap-[5px] shrink-0">
                    <div className="overflow-hidden col-span-1 rounded-tl-2xl">
                        <CachedImage src={getStorageImageUrl("/images/gallery/image15.jpg")} alt="Mangrove river" width={400} height={140} className="w-full h-full object-cover" />
                    </div>
                    <div className="overflow-hidden">
                        <CachedImage src={getStorageImageUrl("/images/gallery/image17.jpg")} alt="Kingfisher bird" width={180} height={285} className="w-full h-full object-cover" />
                    </div>
                    <div className="overflow-hidden">
                        <CachedImage src={getStorageImageUrl("/images/gallery/image16.jpg")} alt="Mangrove roots" width={180} height={140} className="w-full h-full object-cover" />
                    </div>
                    <div className="overflow-hidden col-span-1 row-span-4 rounded-tr-2xl">
                        <CachedImage src={getStorageImageUrl("/images/gallery/image19.jpg")} alt="Aerial view boats" width={180} height={285} className="w-full h-full object-cover" />
                    </div>
                    <div className="overflow-hidden col-span-2 row-span-2">
                        <CachedImage src={getStorageImageUrl("/images/gallery/image18.jpg")} alt="Mangrove forest path" width={300} height={285} className="w-full h-full object-cover" />
                    </div>
                    <div className="overflow-hidden col-span-1 row-span-3">
                        <CachedImage src={getStorageImageUrl("/images/gallery/image9.jpg")} alt="Wooden boat" width={180} height={140} className="w-full h-full object-cover" />
                    </div>
                    <div className="overflow-hidden row-span-2">
                        <CachedImage src={getStorageImageUrl("/images/gallery/image10.jpg")} alt="River view from boat" width={180} height={140} className="w-full h-full object-cover" />
                    </div>
                    <div className="overflow-hidden">
                        <CachedImage src={getStorageImageUrl("/images/gallery/image11.jpg")} alt="Aerial greenery" width={360} height={140} className="w-full h-full object-cover" />
                    </div>
                    <div className="overflow-hidden rounded-bl-2xl">
                        <CachedImage src={getStorageImageUrl("/images/gallery/image6.jpg")} alt="Green river aerial" width={360} height={120} className="w-full h-full object-cover" />
                    </div>
                    <div className="overflow-hidden col-span-2 rounded-br-2xl">
                        <CachedImage src={getStorageImageUrl("/images/gallery/image7.jpg")} alt="Open water estuary" width={360} height={120} className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>

            <CachedImage
                src={getStorageImageUrl("/images/gallery/kingFisher.png")}
                alt="bg-image"
                width={300}
                height={300}
                className="absolute bottom-0 left-0 object-cover z-1 w-[160px] md:w-[300px]"
            />
        </section>
    );
}