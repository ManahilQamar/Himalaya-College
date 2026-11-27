import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUp,
  Facebook,
  GraduationCap,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Youtube,
} from 'lucide-react';
import Logo from './Logo';
import { NAV_LINKS, SITE, toTel, toWhatsApp } from '../../lib/siteConfig';
import { useSiteContact } from '../../hooks/useContent';

// TODO: apne college ke real social links yahan daalein
const SOCIALS = [
  { label: 'Facebook', href: '#', Icon: Facebook },
  { label: 'Instagram', href: '#', Icon: Instagram },
  { label: 'YouTube', href: '#', Icon: Youtube },
];

const linkClass =
  'tap inline-flex items-center gap-2 text-navy-200 transition-all duration-200 hover:translate-x-1 hover:text-[#F5C451]';

export default function Footer() {
  const c = useSiteContact();

  return (
    <footer className="relative overflow-hidden bg-navy-900 text-navy-100">
      {/* Gold top accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-[#B8901F] via-[#F5D77A] to-[#B8901F]" />

      {/* Soft background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-[#F5C451]/5 blur-3xl"
      />

      {/* CTA card */}
      <div className="container-x pt-14">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.02] p-8 backdrop-blur md:flex-row md:items-center md:p-10">
          <div className="flex items-start gap-4">
            
            <div>
              <h2 className="font-display text-2xl text-white md:text-3xl">
                Admissions Open
              </h2>
              <p className="mt-1 max-w-xl text-navy-200">
                Apna future aaj hi shuru karein. Hamari team admission process mai aapki poori madad karegi.
              </p>
            </div>
          </div>
          <Link
            to="/admissions"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-[#F5C451] px-6 py-3 font-semibold text-navy-900 shadow-lg shadow-black/20 transition hover:bg-[#FFD875]"
          >
            Express your interest
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>

      {/* Main grid */}
      <div className="container-x grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1.3fr]">
        {/* Brand */}
        <div>
          <Logo light />
          <p className="mt-5 max-w-sm leading-relaxed text-navy-200">
            [ADD OFFICIAL COLLEGE TAGLINE] Quality education, modern technology and future-ready skills for every
            student.
          </p>

          <div className="mt-6 flex items-center gap-3">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-navy-100 transition hover:-translate-y-1 hover:border-[#F5C451] hover:bg-[#F5C451] hover:text-navy-900"
              >
                <Icon size={18} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        {/* Explore */}
        <nav aria-label="Footer">
          <h2 className="font-display text-xl text-white">Explore</h2>
          <span className="mt-2 block h-0.5 w-10 rounded bg-[#F5C451]" />
          <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 md:grid-cols-1">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className={linkClass}>
                  <ArrowRight size={14} className="text-[#F5C451]" aria-hidden="true" />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <div>
          <h2 className="font-display text-xl text-white">Contact Us</h2>
          <span className="mt-2 block h-0.5 w-10 rounded bg-[#F5C451]" />
          <ul className="mt-5 space-y-4">
            <li className="flex gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/5 text-[#F5C451]">
                <MapPin size={18} aria-hidden="true" />
              </span>
              <span className="text-navy-200">
                {SITE.name}
                <br />
                {c.address}
              </span>
            </li>
            <li className="flex gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/5 text-[#F5C451]">
                <Phone size={18} aria-hidden="true" />
              </span>
              <span className="flex flex-col text-navy-200">
                {c.phones.map((p) => (
                  <a key={p} href={toTel(p)} className="tap transition hover:text-[#F5C451]">
                    {p}
                  </a>
                ))}
              </span>
            </li>
            <li className="flex gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/5 text-[#F5C451]">
                <MessageCircle size={18} aria-hidden="true" />
              </span>
              <a
                href={toWhatsApp(c.whatsapp)}
                target="_blank"
                rel="noreferrer"
                className="tap self-center text-navy-200 transition hover:text-[#F5C451]"
              >
                WhatsApp: {c.whatsapp}
              </a>
            </li>
            <li className="flex gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/5 text-[#F5C451]">
                <Mail size={18} aria-hidden="true" />
              </span>
              <a
                href={`mailto:${c.email}`}
                className="tap self-center break-all text-navy-200 transition hover:text-[#F5C451]"
              >
                {c.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-5 text-sm text-navy-300 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1.5 transition hover:border-[#F5C451] hover:text-[#F5C451]"
          >
            Back to top
            <ArrowUp size={14} aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}