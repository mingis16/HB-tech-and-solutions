type SectionHeadingProps = {
  index: string;
  label: string;
  title: React.ReactNode;
  description?: React.ReactNode;
};

export function SectionHeading({ index, label, title, description }: SectionHeadingProps) {
  return (
    <div className="max-w-2xl">
      <p className="eyebrow">
        <span className="text-fg-subtle">{"//"}</span> {index} · {label}
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-base leading-relaxed text-fg-muted sm:text-lg">{description}</p>}
    </div>
  );
}
