import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Building2, CalendarDays, MapPin, Phone, Sparkles } from 'lucide-react';
import Button from '../ui/Button';
import { HERO } from '../../lib/homeContent';

const GhostFibers = lazy(() => import('./GhostFibers'));

const container = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } };
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const QUICK_LINKS = [
  { to: '/events', icon: CalendarDays, title: 'Notices and events', text: 'Announcements, schedules, results' },
  { to: '/campuses', icon: Building2, title: 'Our campuses', text: 'Locations, facilities, coordinators' },
  { to: '/services', icon: Sparkles, title: 'Student services', text: 'Support from day one' },
  { to: '/contact', icon: Phone, title: 'Contact the college', text: 'Call, WhatsApp or visit' },
];

export default function Hero() {

  return (
    <section className="relative isolate overflow-hidden bg-navy-900 text-white">
      {/* Lightweight fallback for mobile / reduced motion / no WebGL: a faint grid */}
      <div
        className="absolute inset-0 -z-20 opacity-60"
        aria-hidden="true"
        style={{
          backgroundImage:
            'linear-gradient(rgba(143,163,209,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(143,163,209,.12) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse at 70% 40%, #000 0%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 70% 40%, #000 0%, transparent 70%)',
        }}
      />      <div className="absolute inset-0 -z-10">
        <Suspense fallback={null}>
          <GhostFibers
      glowColor="#173B7A"
      lineColor="#D6A84F"
      secondaryColor="#0B2450"
      gradient="depth"
      layers={3}
      waves={1}
      twist={1.2}
      threads={72}
      fiberStyle="dots"
      depthOfField={0.85}
      hoverEffect="focus"
      intro={true}
      mouseInteraction={true}
      brightness={0.7}
      glow={0.8}
      sparkle={0.5}
      particles={0.4}
    />
  </Suspense>
</div>
      {/* keeps text readable over the network */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-900 via-navy-900/85 to-transparent" aria-hidden="true" />

      <motion.div
        className="container-x relative grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.3fr_0.8fr] lg:gap-16 lg:py-32"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <div>
          <motion.p
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-navy-100"
          >
            <MapPin size={15} className="text-[#173B7A]" aria-hidden="true" />
            <span className="hidden sm:inline">{HERO.college} <span aria-hidden="true">·</span> </span>{HERO.location}
          </motion.p>
          <motion.h1 variants={item} className="mt-6 max-w-3xl text-4xl text-white sm:text-5xl lg:text-[3.5rem] lg:leading-[1.08]">
            {HERO.headline}
          </motion.h1>
          <motion.span variants={item} className="mt-6 block h-1.5 w-20 rounded-full bg-[#173B7A]" aria-hidden="true" />
          <motion.p variants={item} className="mt-6 max-w-xl text-lg text-navy-100">
            {HERO.text}
          </motion.p>
          <motion.div variants={item} className="mt-10 flex flex-wrap gap-3">
            <Button to="/admissions#interest">Apply for admission <ArrowRight size={18} aria-hidden="true" /></Button>
            <Button to="/disciplines" variant="outlineLight">Explore programs</Button>
          </motion.div>
        </div>

        <motion.nav variants={item} aria-label="Quick links" className="rounded-2xl bg-white p-3 text-navy-900 shadow-lift">
          <h2 className="px-3 pb-1 pt-3 font-sans text-sm font-semibold uppercase tracking-wider text-navy-500">Quick links</h2>
          <ul>
            {QUICK_LINKS.map(({ to, icon: Icon, title, text }) => (
              <li key={to}>
                <Link to={to} className="group flex items-center gap-4 rounded-xl px-3 py-3.5 transition-colors hover:bg-paper">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F8F9FC] text-[#173B7A]">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display font-bold">{title}</span>
                    <span className="block text-sm text-navy-500">{text}</span>
                  </span>
                  <ArrowRight size={18} className="ml-auto shrink-0 text-navy-300 transition group-hover:translate-x-0.5 group-hover:text-[#173B7A]" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </motion.nav>
      </motion.div>

      {/* Himalayan ridge line */}
      <svg
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-16 w-full text-navy-800 sm:h-24"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path fill="currentColor" d="M0 120V84l130-34 90 40 150-62 120 56 110-40 160 60 130-66 140 50 120-36 140 52 150-30V120z" />
      </svg>
    </section>
  );
}



