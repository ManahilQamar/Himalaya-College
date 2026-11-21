import { Link } from 'react-router-dom';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import Logo from './Logo';
import Button from '../ui/Button';
import { NAV_LINKS, SITE, toTel, toWhatsApp } from '../../lib/siteConfig';
import { useSiteContact } from '../../hooks/useContent';

export default function Footer() {
  const c = useSiteContact();
  return (
    <footer className="bg-navy-900 text-navy-100">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.3fr]">
        <div>
          <Logo light />
          <p className="mt-5 max-w-sm text-navy-200">
            [ADD OFFICIAL COLLEGE TAGLINE] Quality education, modern technology and future-ready skills for every
            student.
          </p>
          <Button to="/admissions" className="mt-6">
            Express your interest
          </Button>
        </div>

        <nav aria-label="Footer">
          <h2 className="font-display text-xl text-white">Explore</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 md:grid-cols-1">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="tap hover:text-[#173B7A]">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-xl text-white">Contact</h2>
          <ul className="mt-4 space-y-4">
            <li className="flex gap-3">
              <MapPin size={20} className="mt-0.5 shrink-0 text-[#173B7A]" aria-hidden="true" />
              <span>
                {SITE.name}
                <br />
                {c.address}
              </span>
            </li>
            <li className="flex gap-3">
              <Phone size={20} className="mt-0.5 shrink-0 text-[#173B7A]" aria-hidden="true" />
              <span className="flex flex-col">
                {c.phones.map((p) => (
                  <a key={p} href={toTel(p)} className="tap hover:text-[#173B7A]">
                    {p}
                  </a>
                ))}
              </span>
            </li>
            <li className="flex gap-3">
              <MessageCircle size={20} className="mt-0.5 shrink-0 text-[#173B7A]" aria-hidden="true" />
              <a href={toWhatsApp(c.whatsapp)} target="_blank" rel="noreferrer" className="tap hover:text-[#173B7A]">
                WhatsApp: {c.whatsapp}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail size={20} className="mt-0.5 shrink-0 text-[#173B7A]" aria-hidden="true" />
              <a href={`mailto:${c.email}`} className="tap break-all hover:text-[#173B7A]">
                {c.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x py-5 text-sm text-navy-300">
          Â© {new Date().getFullYear()} {SITE.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}




