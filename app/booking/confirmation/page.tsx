import Link from "next/link";

// In Next 16 `searchParams` is a Promise and must be awaited.
export default async function BookingConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; trip?: string }>;
}) {
  const { ref } = await searchParams;
  const reference = ref ?? "GVH-2846";

  return (
    <main className="min-h-screen bg-[#FAFAFA] px-4 py-28 text-[#111111] sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-3xl flex-col items-center rounded-[32px] border border-[#6DA003]/20 bg-white p-8 text-center shadow-[0_12px_40px_rgba(109,160,3,0.08)] sm:p-10">
        <p className="text-[11px] uppercase tracking-[0.28em] text-[#6DA003]">Booking confirmed</p>
        <h1 className="mt-4 text-4xl font-serif sm:text-5xl">Your reference number is {reference}</h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-[#666666] sm:text-base">
          We&apos;ve received your request and will follow up with payment and permit details. Please keep this reference number handy when you contact us.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="rounded-full border border-[#6DA003] px-5 py-3 text-sm font-semibold text-[#6DA003] transition-all hover:bg-[#6DA003] hover:text-white">
            Back to home
          </Link>
          <Link href="/trips" className="rounded-full border border-[#6DA003] px-5 py-3 text-sm font-semibold text-[#6DA003] transition-all hover:bg-[#6DA003] hover:text-white">
            Browse trips
          </Link>
        </div>
      </div>
    </main>
  );
}
