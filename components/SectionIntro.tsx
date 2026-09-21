import { Reveal } from "./Reveal";

export function SectionIntro({
  eyebrow,
  title,
  lead,
  className,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  className?: string;
}) {
  return (
    <Reveal className={className}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="display-lg mt-5 max-w-3xl">{title}</h2>
      {lead && <p className="lead mt-6 max-w-2xl">{lead}</p>}
    </Reveal>
  );
}
