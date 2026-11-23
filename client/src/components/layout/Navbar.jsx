import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from './Logo';
import AnnouncementBar from './AnnouncementBar';
import PillNav from '../PillNav';
import { NAV_LINKS } from '../../lib/siteConfig';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';

    const onKey = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
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

      <PillNav
        logo={null}
        logoAlt="Himalaya College"
        items={NAV_LINKS}
        baseColor="#173B7A"
        pillColor="#F8F9FC"
        pillTextColor="#18212F"
        hoveredPillTextColor="#173B7A"
        className="bg-white"
      />
    </div>
  );
}