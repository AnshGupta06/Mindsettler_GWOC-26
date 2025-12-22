type PageHeaderProps = {
  title: string;
  subtitle?: string;
};

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24"> {/* Changed bg-primary/5 to bg-white */}
      <div className="container mx-auto px-4 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-pink-600 sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 max-w-2xl mx-auto text-lg leading-8 text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}