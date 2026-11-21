import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function Accordion({ items }) {
  const [open, setOpen] = useState(null);
  const base = useId();
  return (
    <div className="divide-y divide-navy-100 border-y border-navy-100">
      {items.map((it, i) => {
        const isOpen = open === i;
        const panelId = `${base}-p${i}`;
        return (
          <div key={it.q}>
            <h3>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 py-5 text-left font-display text-xl text-navy-900"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                {it.q}
                <ChevronDown className={`shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} size={22} aria-hidden="true" />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="max-w-prose pb-5 text-navy-500">{it.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}


