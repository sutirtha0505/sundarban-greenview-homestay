import CachedImage from "./CachedImage";
import { getStorageImageUrl } from "@/lib/supabase/storage";

const NAV_LINKS = [
    { href: "#trips", label: "Book your Trips" },
    { href: "#about", label: "About our Homestay" },
    { href: "#rooms", label: "Check The Premium Rooms" },
    { href: "#reviews", label: "What Our Customers think" },
    { href: "#activities", label: "Activities You'll never Forget" },
    { href: "#gallery", label: "Check our Gallery" },
];

const CONTACT_ITEMS = [
    {
        label: "Pakhiralay, West Bengal 743370",
        icon: (
            <>
                <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
            </>
        ),
    },
    {
        label: "+91 7679756846",
        icon: (
            <path d="M4 7.5C4 12.7 8.3 17 13.5 17h1a2 2 0 0 0 2-2v-1.1c0-.5-.3-.9-.8-1l-3.2-.8c-.4-.1-.8.1-1 .4l-.7 1c-.2.3-.6.4-.9.3A8.8 8.8 0 0 1 6.2 8.1c-.1-.3 0-.7.3-.9l1-.7c.3-.2.5-.6.4-1L7.1 3.3c-.1-.5-.5-.8-1-.8H5c-.6 0-1 .4-1 1v4Z" />
        ),
    },
    {
        label: "bideshmondal50@gmail.com",
        icon: (
            <>
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m4 7 8 6 8-6" />
            </>
        ),
    },
];

function ContactItem({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <div className="flex flex-col items-center gap-[14px]">
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-10 w-10 text-[#C9FF4A]"
            >
                {icon}
            </svg>
            <span className="text-[14px] md:text-[18px] text-center text-[#C9FF4A]">{label}</span>
        </div>
    );
}

function Field({
    id,
    label,
    type = "text",
    fullWidth = false,
}: {
    id: string;
    label: string;
    type?: string;
    fullWidth?: boolean;
}) {
    return (
        <div className={fullWidth ? "col-span-1 sm:col-span-2" : undefined}>
            <label
                htmlFor={id}
                className="mb-[8px] block text-[20px] md:text-[30px] leading-none text-[#F4EBDD]"
            >
                {label}
            </label>
            <input
                id={id}
                type={type}
                className="h-[52px] md:h-[72px] w-full rounded-full bg-white/70 px-[20px] md:px-[24px] text-[15px] md:text-[18px] text-[#222] outline-none"
            />
        </div>
    );
}

export default function Contact() {
    return (
        <div id="contact" className="min-h-screen w-full bg-[#878787] px-4 py-8 md:px-8 md:py-10 lg:px-[48px] lg:py-[42px] scroll-mt-28">
            <div className="mx-auto flex w-full max-w-[1600px] flex-col-reverse gap-10 lg:flex-row lg:gap-[72px]">

                {/* LEFT SIDE */}
                <div className="flex w-full flex-col lg:w-[39%] lg:min-w-[520px]">

                    {/* Image card */}
                    <div className="relative h-[440px] overflow-hidden rounded-[18px] sm:h-[540px] md:h-[620px] lg:h-[920px]">
                        <CachedImage
                            src={getStorageImageUrl("/images/gallery/image8.jpg")}
                            alt="Sundarban wildlife"
                            fill
                            sizes="(max-width: 1024px) 100vw, 39vw"
                            className="object-cover object-center"
                            priority
                        />

                        {/* Frosted glass overlay */}
                        <div className="absolute bottom-[18px] left-[50px] right-[50px] rounded-[34px] border border-white/10 bg-white/30 px-[28px] py-[26px] backdrop-blur-md">
                            <div className="flex flex-col items-center">
                                <CachedImage
                                    src={getStorageImageUrl("/images/icons/sundarban-green-view-logo.png")}
                                    alt="Greenview Homestay Logo"
                                    width={150}
                                    height={82}
                                    style={{ height: "auto" }}
                                    className="w-[132px] object-contain"
                                />

                                <p className="mt-[14px] text-center font-serif text-[18px] md:text-[22px] lg:text-[30px] leading-none text-[#C9FF4A]">
                                    Escape. Relax. Mangroves.
                                </p>

                                {/* Social icons */}
                                <div className="mt-[34px] flex items-center justify-center gap-[22px] text-[#4F4039]">
                                    <a href="https://www.facebook.com/profile.php?id=100089300530104" aria-label="Facebook">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-9 w-9">
                                            <path d="M17 2h-3a5 5 0 0 0-5 5v3H6v4h3v8h4v-8h3.2l.8-4H13V7a1 1 0 0 1 1-1h3V2Z" />
                                        </svg>
                                    </a>
                                    <a href="https://www.instagram.com/sundarban_green_view_homestay_" aria-label="Instagram">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-9 w-9">
                                            <rect x="3" y="3" width="18" height="18" rx="5" />
                                            <circle cx="12" cy="12" r="4.2" />
                                            <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
                                        </svg>
                                    </a>
                                    <a href="https://www.youtube.com/@bideshmondal9714" aria-label="YouTube">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-9 w-9">
                                            <rect x="3" y="6" width="18" height="12" rx="4" />
                                            <path d="M10 9.5 15 12l-5 2.5v-5Z" fill="currentColor" stroke="none" />
                                        </svg>
                                    </a>
                                    <a href="https://api.whatsapp.com/send?phone=917679756846&text=Hello" aria-label="WhatsApp">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-9 w-9">
                                            <path d="M20.5 12a8.5 8.5 0 0 1-12.9 7.3L4 20l.8-3.4A8.5 8.5 0 1 1 20.5 12Z" />
                                            <path d="M9.2 8.7c.2-.4.4-.4.7-.4h.5c.2 0 .4 0 .5.4l.8 2c.1.3.1.5-.1.7l-.6.8c.5 1 1.3 1.8 2.3 2.3l.8-.6c.2-.2.4-.2.7-.1l2 .8c.3.1.4.3.4.5v.5c0 .3 0 .5-.4.7-.7.5-1.5.8-2.3.8-3.6 0-6.6-3-6.6-6.6 0-.8.3-1.6.8-2.3Z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="mt-[20px] font-serif text-[16px] md:text-[22px] lg:text-[30px] leading-snug text-[#F4EBDD]">
                        CopyRight © 2025 <span className="text-[#C9FF4A]">GreenView Homestay</span>
                    </p>

                    <div className="mt-[44px] grid grid-cols-2 gap-x-[36px] gap-y-[22px]">
                        {NAV_LINKS.map(({ href, label }) => (
                            <a key={href + label} href={href} className="text-[13px] md:text-[15px] lg:text-[18px] leading-none text-[#D7FF4A]">
                                {label}
                            </a>
                        ))}
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="flex w-full flex-col lg:flex-1">
                    <div className="mx-auto w-full max-w-[920px]">

                        <h1 className="text-center font-serif text-[40px] leading-[0.95] text-[#F4EBDD] sm:text-[56px] md:text-[68px] lg:text-[86px]">
                            Plan Your <span className="text-[#C9FF4A]">Stay</span>
                        </h1>

                        <p className="mt-[18px] text-center text-[16px] leading-snug text-[#F4EBDD] md:text-[22px] lg:text-[30px] lg:leading-none">
                            Drop us a message or reach out directly - we&apos;ll get back within a day
                        </p>

                        {/* Contact info row */}
                        <div className="mt-[28px] border-t border-white/55 pt-[28px]">
                            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-center md:gap-[60px] lg:gap-[140px]">
                                {CONTACT_ITEMS.map(({ label, icon }) => (
                                    <ContactItem key={label} icon={icon} label={label} />
                                ))}
                            </div>
                        </div>

                        {/* Form */}
                        <div className="mt-[34px] border-t border-white/55 pt-[32px]">
                            <form className="grid grid-cols-1 gap-x-[24px] gap-y-[20px] sm:grid-cols-2">
                                <Field id="firstName" label="First Name" />
                                <Field id="lastName" label="Last Name" />
                                <Field id="email" label="E-Mail Address" type="email" fullWidth />
                                <Field id="phone" label="Phone No." type="tel" fullWidth />

                                <div className="col-span-1 sm:col-span-2">
                                    <label
                                        htmlFor="message"
                                        className="mb-[8px] block text-[20px] md:text-[30px] leading-none text-[#F4EBDD]"
                                    >
                                        Your Message
                                    </label>
                                    <textarea
                                        id="message"
                                        rows={4}
                                        className="h-[120px] md:h-[150px] w-full resize-none rounded-[28px] bg-white/70 px-[20px] md:px-[24px] py-[14px] md:py-[18px] text-[15px] md:text-[18px] text-[#222] outline-none"
                                    />
                                </div>

                                <div className="col-span-1 mt-[18px] sm:col-span-2">
                                    <button
                                        type="submit"
                                        className="flex h-[56px] md:h-[66px] lg:h-[78px] w-full items-center justify-between rounded-full bg-[#78A700] px-[22px] md:px-[28px] lg:px-[34px] text-left text-[18px] md:text-[24px] lg:text-[31px] font-serif text-[#F4EBDD]"
                                    >
                                        <span>Send Message</span>
                                        <span className="flex h-[34px] w-[34px] md:h-[40px] md:w-[40px] lg:h-[46px] lg:w-[46px] items-center justify-center rounded-full bg-[#D9D9D9] text-[#333]">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                                                <path d="M9 6l6 6-6 6" />
                                            </svg>
                                        </span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}