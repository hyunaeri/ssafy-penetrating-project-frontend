type PlaceholderPageProps = {
  title: string;
  description: string;
};

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-surface px-5 py-10">
      <h1 className="text-[22px] font-bold text-ink">{title}</h1>
      <p className="mt-2 text-[14px] text-muted">{description}</p>
    </div>
  );
}
