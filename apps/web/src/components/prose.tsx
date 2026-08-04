// Splits on blank lines so editorial copy can have real paragraphs without
// pulling in a markdown parser — this project has no CMS, so content is
// hand-written JSON, and \n\n is the simplest structure it needs.
export function Prose({ text, className = "" }: { text: string; className?: string }) {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      {paragraphs.map((paragraph, i) => (
        <p key={i} className={i === 0 ? className : `mt-3 ${className}`}>
          {paragraph}
        </p>
      ))}
    </>
  );
}
