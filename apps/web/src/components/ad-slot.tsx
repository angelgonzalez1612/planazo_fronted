export function AdSlot({
  size,
  className = "",
  dark = false,
}: {
  size: string;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`relative flex items-center justify-center rounded-2xl border border-dashed p-3.5 text-center text-xs font-semibold ${
        dark
          ? "border-border-dark bg-surface-dark text-ink-soft"
          : "border-[#E0D9D2] bg-[#FBF8F5] text-[#B5ADA6]"
      } ${className}`}
    >
      <span
        className={`absolute top-2 left-3 text-[10px] font-bold tracking-widest uppercase ${
          dark ? "text-[#4D453F]" : "text-[#C9C0B8]"
        }`}
      >
        Publicidad
      </span>
      Espacio publicitario · {size}
    </div>
  );
}
