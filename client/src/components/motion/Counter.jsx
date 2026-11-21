import { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';

export default function Counter({ value, suffix = '', suffixClassName = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const reduced = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (value == null) return undefined;
    if (!inView || reduced) {
      if (reduced) setN(value);
      return undefined;
    }
    const controls = animate(0, value, { duration: 1.4, ease: 'easeOut', onUpdate: (v) => setN(Math.round(v)) });
    return () => controls.stop();
  }, [inView, reduced, value]);

  if (value == null) {
    return <span ref={ref} aria-label="Value not added yet">&mdash;</span>;
  }
  return (
    <span ref={ref}>
      {n.toLocaleString()}
      <span className={suffixClassName}>{suffix}</span>
    </span>
  );
}


