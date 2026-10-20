type Word = string | { text: string; className?: string };

/**
 * Headline whose words sit in clipping masks so ScrollStory can raise them
 * in sequence ([data-split]).
 */
export default function SplitHeading({ as: Tag = "h2", words, className }: { as?: "h1" | "h2" | "h3" | "p"; words: Word[]; className?: string }) {
  return (
    <Tag data-split className={className}>
      {words.map((w, i) => {
        const { text, className: wc } = typeof w === "string" ? { text: w, className: "" } : w;
        return (
          <span key={i} className="inline-block overflow-hidden pb-[0.08em] pt-[0.16em] align-bottom">
            <span className={`split-word inline-block ${wc ?? ""}`}>{text}</span>
            {i < words.length - 1 && " "}
          </span>
        );
      })}
    </Tag>
  );
}
