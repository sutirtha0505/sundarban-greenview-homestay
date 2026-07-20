type SectionHeadingProps = {
  eyebrow?: string;
  first: string;
  second: string;
  accentSide?: "left" | "right";
};

export default function SectionHeading({
  eyebrow,
  first,
  second,
  accentSide = "left",
}: SectionHeadingProps) {
  const accentClass = accentSide === "left" ? "text-[#6DA003]" : "text-[#111111]";
  const neutralClass = accentSide === "left" ? "text-[#111111]" : "text-[#6DA003]";

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      {eyebrow ? (
        <p className="text-[11px] uppercase tracking-[0.32em] text-[#6DA003]">{eyebrow}</p>
      ) : null}
      <div className="flex items-center justify-center gap-4 md:gap-6">
        <div className="h-px w-12 md:w-20 bg-[#6DA003]" />
        <h2 className="text-3xl md:text-5xl lg:text-[3.2rem] font-serif tracking-tight">
          <span className={accentClass}>{first}</span> <span className={neutralClass}>{second}</span>
        </h2>
        <div className="h-px w-12 md:w-20 bg-[#6DA003]" />
      </div>
    </div>
  );
}