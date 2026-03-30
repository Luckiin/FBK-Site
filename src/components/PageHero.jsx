export default function PageHero({ title, subtitle, breadcrumb }) {
  return (
    <section className="relative bg-dark-400 pt-32 pb-16 md:pt-36 md:pb-20 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-brand-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[200px] bg-gold-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {breadcrumb && (
          <div className="text-sm text-ink-500 mb-4 font-medium">
            <span className="hover:text-ink-300 transition cursor-pointer">Início</span>
            <span className="mx-2">/</span>
            <span className="text-brand-400">{breadcrumb}</span>
          </div>
        )}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-ink-100 mb-4">
          {title}
        </h1>
        <div className="gold-divider mb-4" />
        {subtitle && (
          <p className="text-lg text-ink-300 max-w-2xl leading-relaxed">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
