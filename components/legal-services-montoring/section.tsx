// Card with a titled header, shared by the details sheet tabs.
export function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-5 py-4">
        <h3 className="text-[13px] font-semibold text-primary">{title}</h3>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

// Row of small uppercase labels with their values underneath.
export function Fields({
  fields,
  className,
}: {
  fields: { label: string; value: React.ReactNode }[];
  className?: string;
}) {
  return (
    <dl className={`grid grid-cols-2 gap-4 sm:grid-cols-4 ${className ?? ""}`}>
      {fields.map(({ label, value }) => (
        <div key={label}>
          <dt className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            {label}
          </dt>
          <dd className="mt-1 text-[13px] text-gray-800">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
