import { motion } from 'framer-motion';
import { useCollege } from '../../hooks/useContent';
import { MD as DEFAULT_MD } from '../../lib/homeContent';
import ProfileCard from '../ProfileCard';

export default function MDMessage() {
  const { data } = useCollege();
  const MD = data?.mdMessage ?? DEFAULT_MD;

  const message = [
'At Himalaya College of Science and Technology, we believe that quality education plays an important role in shaping a student’s future. Our aim is to provide a supportive and inspiring learning environment where students can build strong academic knowledge, develop confidence and character, and prepare themselves for higher education and successful careers. We encourage our students to learn with dedication, develop practical skills, and become responsible individuals who can contribute positively to their families, communities, and society.', ]
  const vision =
    'To become a leading institution that provides quality education, develops responsible individuals, and prepares students to meet the challenges of the modern world.';

  const mission =
    'To provide accessible and quality education through dedicated teaching, modern learning methods, technology, and strong moral values while encouraging creativity, discipline, and lifelong learning.';

  const goals =
    'Our goal is to continuously improve academic standards, introduce modern learning opportunities, strengthen technology and practical education, and provide students with the skills and confidence needed for higher education and successful careers.';

  return (
    <section className="section-y" aria-labelledby="md-heading">
      <div className="container-x">

        <h2 id="md-heading" className="text-3xl sm:text-4xl">
          Message from {MD.name}
        </h2>

        <motion.div
          className="mt-10 grid gap-10 lg:grid-cols-[20rem_1fr] lg:gap-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
        >

          {/* MD PROFILE CARD */}
          <figure className="flex justify-center lg:justify-start">
            <ProfileCard
              avatarUrl="/images/MD.png"
              name={MD.name}
              title={MD.designation}
              showUserInfo={false}
              theme="light"
              radius={20}
              holo={0.35}
              glare={0.3}
              tiltStrength={8}
              parallax={5}
              enableTilt={true}
              enableMobileTilt={false}
              intro={true}
            />
          </figure>

          {/* MESSAGE */}
          <div>
            <div className="space-y-4 text-2xl text-navy-600" style={{ fontFamily: 'Work Sans', lineHeight: 1.6 }}>
              {message.map((p) => (
                <p key={p} className="max-w-prose">
                  {p}
                </p>
              ))}
            </div>
          </div>

        </motion.div>

        {/* VISION / MISSION / FUTURE GOALS */}
        <div className="mt-14 grid gap-px overflow-hidden rounded-xl bg-navy-100 md:grid-cols-3">

          <div className="bg-paper p-7">
            <h3 className="text-2xl">
              Vision
            </h3>

            <p className="mt-3 text-navy-500">
              {vision}
            </p>
          </div>

          <div className="bg-paper p-7">
            <h3 className="text-2xl">
              Mission
            </h3>

            <p className="mt-3 text-navy-500">
              {mission}
            </p>
          </div>

          <div className="bg-paper p-7">
            <h3 className="text-2xl">
              Future Goals
            </h3>

            <p className="mt-3 text-navy-500">
              {goals}
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}