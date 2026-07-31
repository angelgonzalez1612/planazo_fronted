export function ContactCta({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-4 flex w-full items-center justify-center rounded-[14px] bg-brand px-4 py-3.5 text-[15px] font-bold text-white"
    >
      {label}
    </a>
  );
}
