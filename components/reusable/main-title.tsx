export default function MainTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`text-[11.5px] font-semibold text-gray-400 uppercase tracking-wide ${className ?? ""}`}
    >
      {children}
    </p>
  );
}
