"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const activities = [
    {
        title1: "Boat Safari through Narrow",
        title2: "Mangrove Creeks",
        guider: "with local guides",
        description:
            "Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat in id cursus mi....",
    },
    {
        title1: "Bird Watching in the",
        title2: "Forest",
        guider: "with bird experts",
        description:
            "Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat in id cursus mi....",
    },
    {
        title1: "Sunset",
        title2: "River Cruise",
        guider: "with river guides",
        description:
            "Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat in id cursus mi....",
    },
    {
        title1: "Tiger Zone",
        title2: "Exploration",
        guider: "with forest guides",
        description:
            "Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat in id cursus mi....",
    },
    {
        title1: "Village Life",
        title2: "Experience",
        guider: "with local hosts",
        description:
            "Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat in id cursus mi....",
    },
    {
        title1: "Mangrove Forest",
        title2: "Walk",
        guider: "with nature guides",
        description:
            "Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat in id cursus mi....",
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
        <section className="relative flex w-full py-16 bg-[#E1E1E1]" id="activities">
            <div className="w-full px-8 mx-auto flex gap-8 items-start">

                {/* ── LEFT: Text Slider ── */}
                <div className="flex flex-col w-1/2 px-8 py-4">
                    {/* Heading */}
                    <div className="flex flex-col items-center justify-center">
                        <h1 className="font-serif text-4xl md:text-5xl mb-3 leading-tight">
                            Activities You'll Never Forget
                        </h1>
                        <span className="block h-[2px] w-full bg-[#6DA003] mb-10" />
                    </div>

                    <div className="flex-1 min-h-[280px] mt-16" key={current}>
                        <div className="flex flex-col items-center justify-center">
                            <h2 className="text-4xl font-normal text-[#858585] leading-snug">
                                {activity.title1}{" "}
                            </h2>
                            <h2 className="text-5xl text-[#6DA003] font-normal">
                                {activity.title2}
                            </h2>
                        </div>

                        <p className="my-8 text-2xl italic text-[#FF9500] text-right pr-4">
                            {activity.guider}
                        </p>

                        <p className="my-16 text-xl text-[#858585] leading-[26px] text-center">
                            {activity.description}
                        </p>
                    </div>

                    <div className="flex gap-3 mt-16 justify-end">
                        <div className="flex gap-3">
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
                </div>

                <div
                    className="w-1/2 grid grid-cols-[1fr_1fr_1fr_1fr] grid-rows-[100px_50px_100px] gap-[5px] rounded-2xl overflow-hidden shrink-0">
                    <div
                        className="overflow-hidden col-span-1 rounded-tl-2xl">
                        <Image
                            src="/images/gallery/image15.jpg"
                            alt="Mangrove river"
                            width={400}
                            height={140}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div
                        className="overflow-hidden">
                        <Image
                            src="/images/gallery/image17.jpg"
                            alt="Kingfisher bird"
                            width={180}
                            height={285}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div
                        className="overflow-hidden">
                        <Image
                            src="/images/gallery/image16.jpg"
                            alt="Mangrove roots"
                            width={180}
                            height={140}
                            className="w-full h-full object-cover"
                        />
                    </div>


                    <div
                        className="overflow-hidden col-span-1 row-span-4 rounded-tr-2xl">
                        <Image
                            src="/images/gallery/image19.jpg"
                            alt="Aerial view boats"
                            width={180}
                            height={285}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div
                        className="overflow-hidden col-span-2 row-span-2">
                        <Image
                            src="/images/gallery/image18.jpg"
                            alt="Mangrove forest path"
                            width={300}
                            height={285}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div
                        className="overflow-hidden col-span-1 row-span-3">
                        <Image
                            src="/images/gallery/image9.jpg"
                            alt="Wooden boat"
                            width={180}
                            height={140}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div
                        className="overflow-hidden row-span-2">
                        <Image
                            src="/images/gallery/image10.jpg"
                            alt="River view from boat"
                            width={180}
                            height={140}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div
                        className="overflow-hidden">
                        <Image
                            src="/images/gallery/image11.jpg"
                            alt="Aerial greenery"
                            width={360}
                            height={140}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div
                        className="overflow-hidden rounded-bl-2xl">
                        <Image
                            src="/images/gallery/image6.jpg"
                            alt="Green river aerial"
                            width={360}
                            height={120}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div
                        className="overflow-hidden col-span-2 rounded-br-2xl">
                        <Image
                            src="/images/gallery/image7.jpg"
                            alt="Open water estuary"
                            width={360}
                            height={120}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
            <div>
                <Image
                    src="/images/gallery/kingFisher.png"
                    alt="bg-image"
                    width={300}
                    height={300}
                    className="absolute bottom-0 left-0 object-cover z-1"
                />
            </div>
        </section>
    );
}