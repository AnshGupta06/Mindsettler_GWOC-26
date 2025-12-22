export default function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`py-32 px-24 ${className}`}>
      {children}
    </section>
  );
}
