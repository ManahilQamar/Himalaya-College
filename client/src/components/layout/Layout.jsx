import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return undefined; // an effect may only return a cleanup function
    }
    // lazy pages and API data render after navigation, so wait until the anchor exists
    let tries = 0;
    const timer = setInterval(() => {
      const target = document.querySelector(hash);
      if (target || ++tries > 30) {
        clearInterval(timer);
        target?.scrollIntoView();
      }
    }, 100);
    return () => clearInterval(timer);
  }, [pathname, hash]);
  return null;
}

export default function Layout() {
  const { pathname } = useLocation();
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <ScrollToTop />
      <Navbar />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          id="main"
          key={pathname}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="min-h-[60vh]"
        >
          <Suspense fallback={<div className="container-x py-24 text-navy-400">Loading…</div>}>
            <Outlet />
          </Suspense>
        </motion.main>
      </AnimatePresence>
      <Footer />
    </>
  );
}


