import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import AnnouncementBar from './AnnouncementBar';
import Button from '../ui/Button';
import { NAV_LINKS } from '../../lib/siteConfig';

const linkClass = ({ isActive }) =>
  `relative rounded-md px-3 py-2 text-[0.95rem] font-medium transition-colors ${
    isActive ? 'text-navy-900' : 'text-navy-500 hover:text-navy-900'
  }`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus(); // keyboard users land back on the menu button
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="sticky top-0 z-50 [@media(max-height:480px)]:relative">
      <AnnouncementBar />
      <header className={`bg-white transition-shadow ${scrolled ? 'shadow-lift' : 'border-b border-navy-100'}`}>
        <div className="container-x flex h-[4.5rem] items-center justify-between gap-4">
          <Logo />

          <nav aria-label="Main" className="hidden items-center gap-0.5 lg:flex">
            {NAV_LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
                {({ isActive }) => (
                  <>
                    {l.label}
                    {l.live && (
                      <span
                        className="absolute right-0.5 top-1.5 h-2 w-2 rounded-full bg-[#173B7A]"
                        aria-hidden="true"
                      />
                    )}
                    {isActive && (
                      <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded bg-[#173B7A]" aria-hidden="true" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <Button to="/admissions" className="hidden !px-5 !py-2.5 sm:inline-flex">
              Apply now
            </Button>
            <button
              type="button"
              ref={toggleRef}
              className="rounded-md p-2.5 text-navy-800 hover:bg-navy-50 lg:hidden"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="absolute inset-x-0 top-full h-screen bg-navy-900/50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <motion.nav
              id="mobile-menu"
              aria-label="Mobile"
              className="absolute inset-x-0 top-full max-h-[calc(100dvh-8rem)] overflow-y-auto border-t border-navy-100 bg-white px-5 pb-6 pt-3 shadow-lift lg:hidden"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <ul>
                {NAV_LINKS.map((l) => (
                  <li key={l.to}>
                    <NavLink
                      to={l.to}
                      end={l.end}
                      className={({ isActive }) =>
                        `flex items-center justify-between border-b border-navy-50 py-3.5 text-lg font-medium ${
                          isActive ? 'text-navy-900' : 'text-navy-500'
                        }`
                      }
                    >
                      {l.label}
                      {l.live && <span className="h-2 w-2 rounded-full bg-[#173B7A]" aria-label="New updates" />}
                    </NavLink>
                  </li>
                ))}
              </ul>
              <Button to="/admissions" className="mt-5 w-full">
                Apply for admission
              </Button>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}


