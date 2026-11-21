import Breadcrumbs from './Breadcrumbs';

// Compact navy header used on inner pages.
export default function PageHero({ title, intro, crumbs }) {
  return (
    <header className="relative isolate overflow-hidden bg-navy-900 text-white">
      <div
        className="absolute inset-0 -z-10 opacity-60"
        aria-hidden="true"
        style={{
          backgroundImage:
            'linear-gradient(rgba(143,163,209,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(143,163,209,.1) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse at 80% 20%, #000 0%, transparent 65%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 80% 20%, #000 0%, transparent 65%)',
        }}
      />
      <div className="container-x py-14 sm:py-20">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, ...(crumbs || [{ label: title }])]} />
        <h1 className="mt-5 max-w-3xl text-4xl text-white sm:text-5xl">{title}</h1>
        {intro && <p className="mt-4 max-w-2xl text-lg text-navy-100">{intro}</p>}
        <div className="mt-8 h-1 w-16 rounded-full bg-[#173B7A]" aria-hidden="true" />
      </div>
    </header>
  );
}


