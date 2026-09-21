import { Reveal } from "./Reveal";

// Interior-page header. Includes top padding to clear the fixed navbar.
export function PageHero({
  eyebrow,
  title,
  intro,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
}) {
  const centered = align === "center";
  return (
    <header
      className={`shell pt-[132px] pb-14 md:pt-[168px] md:pb-20 ${
        centered ? "text-center" : ""
      }`}
    >
      <Reveal>
        <p className={`eyebrow ${centered ? "mx-auto" : ""}`}>{eyebrow}</p>
        <h1
          className={`display-lg mt-6 ${
            centered ? "mx-auto max-w-3xl" : "max-w-4xl"
          }`}
        >
          {title}
        </h1>
        {intro && (
          <p
            className={`lead mt-7 ${
              centered ? "mx-auto max-w-2xl" : "max-w-2xl"
            }`}
          >
            {intro}
          </p>
        )}
      </Reveal>
    </header>
  );
}
