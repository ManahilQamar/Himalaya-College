import { motion } from 'framer-motion';
import { useCollege } from '../../hooks/useContent';
import { MD as DEFAULT_MD } from '../../lib/homeContent';

export default function MDMessage() {
  const { data } = useCollege();
  const MD = data?.mdMessage ?? DEFAULT_MD;
  const initials = MD.name.replace(/^MD\s+/, '').split(' ').map((w) => w[0]).join('');
  return (
    <section className="section-y" aria-labelledby="md-heading">
      <div className="container-x">
        <h2 id="md-heading" className="text-3xl sm:text-4xl">Message from {MD.name}</h2>

        <motion.div
          className="mt-10 grid gap-10 lg:grid-cols-[20rem_1fr] lg:gap-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <figure>
            {MD.photo ? (
              <img src={MD.photo} alt={`${MD.name}, ${MD.designation}`} loading="lazy" className="aspect-[4/5] w-full rounded-xl object-cover" />
            ) : (
              <div
                className="relative flex aspect-[4/5] w-full max-w-xs items-center justify-center overflow-hidden rounded-xl bg-navy-800"
                role="img"
                aria-label="Photograph placeholder"
              >
                <span className="font-display text-7xl text-navy-300">{initials}</span>
                <span className="absolute bottom-3 left-3 rounded bg-navy-900/70 px-2 py-1 text-xs text-navy-100">
                  [ADD PHOTO]
                </span>
                <span className="absolute inset-x-0 bottom-0 h-1.5 bg-[#173B7A]" aria-hidden="true" />
              </div>
            )}
            <figcaption className="mt-4">
              <p className="font-display text-xl text-navy-900">{MD.name}</p>
              <p className="text-navy-500">{MD.designation}</p>
            </figcaption>
          </figure>

          <div>
            {MD.isPlaceholder && (
              <p className="mb-5 inline-block rounded-md border border-[#173B7A] bg-[#F8F9FC] px-3 py-1.5 text-sm text-navy-800">
                Placeholder text. Replace with the approved message from the admin panel.
              </p>
            )}
            <div className="space-y-4 text-lg text-navy-600">
              {MD.message.map((p) => <p key={p} className="max-w-prose">{p}</p>)}
            </div>
          </div>
        </motion.div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-xl bg-navy-100 md:grid-cols-3">
          {[
            ['Vision', MD.vision],
            ['Mission', MD.mission],
            ['Future goals', MD.goals],
          ].map(([title, text]) => (
            <div key={title} className="bg-paper p-7">
              <h3 className="text-2xl">{title}</h3>
              <p className="mt-3 text-navy-500">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


