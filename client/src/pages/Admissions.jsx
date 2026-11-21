import { Mail, MessageCircle, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from '../components/ui/Seo';
import PageHero from '../components/ui/PageHero';
import Button from '../components/ui/Button';
import Accordion from '../components/ui/Accordion';
import QueryState from '../components/ui/QueryState';
import PlaceholderBadge from '../components/ui/PlaceholderBadge';
import InterestForm from '../components/admissions/InterestForm';
import { useAdmissions, usePrograms, useSiteContact } from '../hooks/useContent';
import { toTel, toWhatsApp } from '../lib/siteConfig';

function InfoBlock({ title, children }) {
  return (
    <div className="border-t-2 border-[#173B7A] pt-4">
      <h3 className="text-xl">{title}</h3>
      <div className="mt-2 text-navy-500">{children}</div>
    </div>
  );
}

export default function Admissions() {
  const query = useAdmissions();
  const programs = usePrograms();
  const c = useSiteContact();
  return (
    <>
      <Seo
        title="Admissions"
        description="Admission process, eligibility, documents, fees and how to express your interest at Himalaya Degree College, Swabi."
        path="/admissions"
      />
      <PageHero title="Admissions" intro="Everything you need to know before you apply, and a simple way to tell us you are interested." />

      <QueryState query={query} skeletons={3}>
        {(a) => (
          <>
            <section className="section-y" aria-labelledby="why">
              <div className="container-x">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 id="why" className="text-3xl sm:text-4xl">Why choose us</h2>
                  {a.isPlaceholder && <PlaceholderBadge />}
                </div>
                <div className="mt-8 grid gap-8 md:grid-cols-3">
                  {a.whyChoose.map((w) => (
                    <div key={w.title}>
                      <h3 className="text-2xl">{w.title}</h3>
                      <p className="mt-2 text-navy-500">{w.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="bg-paper py-16 sm:py-20" aria-labelledby="process">
              <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
                <div>
                  <h2 id="process" className="text-3xl">Admission process</h2>
                  <ol className="mt-6 space-y-6">
                    {a.process.map((s, i) => (
                      <li key={s.title} className="flex gap-4">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-900 font-semibold text-[#173B7A]" aria-hidden="true">{i + 1}</span>
                        <div>
                          <h3 className="text-xl">{s.title}</h3>
                          <p className="text-navy-500">{s.text}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="grid gap-8 sm:grid-cols-2">
                  <InfoBlock title="Eligibility">{a.eligibility}</InfoBlock>
                  <InfoBlock title="Important dates">{a.importantDates}</InfoBlock>
                  <InfoBlock title="Required documents">
                    <ul className="list-disc space-y-1 pl-5">{a.documents.map((d, i) => <li key={i}>{d}</li>)}</ul>
                  </InfoBlock>
                  <InfoBlock title="Fee information">{a.fees}</InfoBlock>
                </div>
              </div>
            </section>

            <section className="section-y" aria-labelledby="programs">
              <div className="container-x">
                <h2 id="programs" className="text-3xl">Available programs</h2>
                <QueryState query={programs} skeletons={3} emptyTitle="No programs published yet">
                  {(list) => (
                    <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {list.map((p) => (
                        <li key={p.id}>
                          <Link to={`/disciplines/${p.slug}`} className="block rounded-lg border border-navy-100 px-5 py-4 font-display text-lg text-navy-900 transition hover:border-navy-300 hover:bg-paper">
                            {p.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </QueryState>
              </div>
            </section>

            <section id="interest" className="scroll-mt-32 bg-navy-900 py-16 text-white sm:py-24" aria-labelledby="interest-heading">
              <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.7fr] lg:gap-16">
                <div>
                  <h2 id="interest-heading" className="text-3xl text-white sm:text-4xl">Express Your Interest</h2>
                  <p className="mt-4 max-w-md text-navy-100">
                    Tell us about yourself and the program you want. Submitting this form does not confirm admission.
                    The admissions team will contact you with the next steps.
                  </p>
                  <h3 className="mt-10 text-xl text-white">Admission support</h3>
                  <ul className="mt-3 space-y-3 text-navy-100">
                    <li className="flex gap-3"><Phone size={18} className="mt-1 text-[#173B7A]" aria-hidden="true" /><a href={toTel(c.phones[0])} className="tap hover:text-[#173B7A]">{c.phones[0]}</a></li>
                    <li className="flex gap-3"><MessageCircle size={18} className="mt-1 text-[#173B7A]" aria-hidden="true" /><a href={toWhatsApp(c.whatsapp)} target="_blank" rel="noreferrer" className="tap hover:text-[#173B7A]">WhatsApp {c.whatsapp}</a></li>
                    <li className="flex gap-3"><Mail size={18} className="mt-1 text-[#173B7A]" aria-hidden="true" /><a href={`mailto:${c.email}`} className="tap break-all hover:text-[#173B7A]">{c.email}</a></li>
                  </ul>
                </div>
                <div className="rounded-xl bg-white p-6 text-ink sm:p-8">
                  <InterestForm />
                </div>
              </div>
            </section>

            <section className="section-y" aria-labelledby="faq">
              <div className="container-x max-w-3xl">
                <h2 id="faq" className="mb-6 text-3xl">Frequently asked questions</h2>
                <Accordion items={a.faqs} />
              </div>
            </section>
          </>
        )}
      </QueryState>
    </>
  );
}


