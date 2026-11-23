import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './layout/Logo';
import './PillNav.css';

export default function PillNav({
  items = [],
  baseColor = '#173B7A',
  pillColor = '#F8F9FC',
  hoveredPillTextColor = '#173B7A',
  pillTextColor = '#18212F',
  className = '',
  initialLoadAnimation = true,
}) {
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);
  const toggleRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    if (!initialLoadAnimation) return;

    const nav = navRef.current;
    if (!nav) return;

    nav.style.opacity = '0';
    nav.style.transform = 'translateY(-12px)';

    requestAnimationFrame(() => {
      nav.style.transition =
        'opacity 500ms ease, transform 500ms ease';
      nav.style.opacity = '1';
      nav.style.transform = 'translateY(0)';
    });
  }, [initialLoadAnimation]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const isItemActive = (item) => {
    if (item.end) {
      return pathname === item.to;
    }

    return (
      pathname === item.to ||
      pathname.startsWith(`${item.to}/`)
    );
  };

  return (
    <nav
      ref={navRef}
      className={`pill-nav ${className}`}
      style={{
        '--pill-base': baseColor,
        '--pill-color': pillColor,
        '--pill-text': pillTextColor,
        '--pill-hover-text': hoveredPillTextColor,
      }}
    >
      <div className="pill-nav__container">

        {/* Logo */}
        <div className="pill-nav__logo">
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <div className="pill-nav__desktop">
          <div className="pill-nav__links">
            {items.map((item) => {
              const active = isItemActive(item);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`pill-nav__item ${
                    active ? 'is-active' : ''
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <span>{item.label}</span>

                  {item.live && (
                    <span
                      className="pill-nav__live"
                      aria-label="New updates"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="pill-nav__actions">

          {/* Apply Button */}
          <Link
            to="/admissions"
            className="pill-nav__apply"
          >
            Apply now
          </Link>

          {/* Mobile Menu Button */}
          <button
            ref={toggleRef}
            type="button"
            className={`pill-nav__mobile-toggle ${
              open ? 'is-active' : ''
            }`}
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="pill-mobile-menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <>
          <div
            className="pill-nav__overlay"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          <div
            id="pill-mobile-menu"
            className="pill-nav__mobile-menu"
          >
            <div className="pill-nav__mobile-links">
              {items.map((item) => {
                const active = isItemActive(item);

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`pill-nav__mobile-item ${
                      active ? 'is-active' : ''
                    }`}
                    aria-current={active ? 'page' : undefined}
                    onClick={() => setOpen(false)}
                  >
                    <span>{item.label}</span>

                    {item.live && (
                      <span
                        className="pill-nav__live"
                        aria-label="New updates"
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            <Link
              to="/admissions"
              className="pill-nav__mobile-apply"
              onClick={() => setOpen(false)}
            >
              Apply for admission
            </Link>
          </div>
        </>
      )}
    </nav>
  );
}