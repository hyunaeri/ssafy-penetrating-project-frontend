type AdminPageHeaderProps = {
  title: string;
  description?: string;
};

export function AdminPageHeader({ title, description }: AdminPageHeaderProps) {
  return (
    <header className="border-b border-line bg-white px-8 py-6">
      <h1 className="text-[24px] font-bold text-ink">{title}</h1>
      {description && (
        <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink/55">
          {description}
        </p>
      )}
    </header>
  );
}
