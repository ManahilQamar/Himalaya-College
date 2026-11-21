import { Clock, ExternalLink, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import Seo from '../components/ui/Seo';
import PageHero from '../components/ui/PageHero';
import Button from '../components/ui/Button';
import ContactForm from '../components/contact/ContactForm';
import { SITE, toTel, toWhatsApp } from '../lib/siteConfig';
import { useSiteContact } from '../hooks/useContent';


function Channel({ icon: Icon, title, children }) {
  return (
    <div className="flex gap-4 border-b border-navy-100 py-5 first:pt-0">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-[#173B7A]">
        <Icon size={22} aria-hidden="true" />
      </span>
      <div>
        <h3 className="text-xl">{title}</h3>
        <div className="mt-1 text-navy-600">{children}</div>
      </div>
    </div>
  );
}

export default function Contact() {
  const c = useSiteContact();
  // Search link built from the address text only. No coordinates are guessed.
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${SITE.name}, ${c.address}`)}`;
  return (
    <>
      <Seo
        title="Contact us"
        description="Contact Himalaya Degree College, KSK, Razar, Swabi by phone, WhatsApp or email, or send a message online."
        path="/contact"
      />
      <PageHero title="Contact us" intro="Call, message or visit. We are happy to answer questions from students and parents." />

      <section className="section-y">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <div>
            <h2 className="mb-6 text-3xl">Get in touch</h2>
            <Channel icon={Phone} title="Phone">
              <ul className="space-y-0.5">
                {c.phones.map((p) => (
                  <li key={p}><a href={toTel(p)} className="tap hover:text-navy-900 hover:underline">{p}</a></li>
                ))}
              </ul>
            </Channel>
            <Channel icon={MessageCircle} title="WhatsApp">
              <a href={toWhatsApp(c.whatsapp)} target="_blank" rel="noreferrer" className="tap hover:text-navy-900 hover:underline">
                {c.whatsapp}<span className="sr-only"> (opens WhatsApp in a new tab)</span>
              </a>
            </Channel>
            <Channel icon={Mail} title="Email">
              <a href={`mailto:${c.email}`} className="tap break-all hover:text-navy-900 hover:underline">{c.email}</a>
            </Channel>
            <Channel icon={MapPin} title="Address">
              <p>{SITE.name}<br />{c.address}</p>
              <p className="mt-2 flex items-center gap-2 text-sm text-navy-500">
                <Clock size={16} aria-hidden="true" />Office hours: {c.officeHours}
              </p>
            </Channel>
          </div>

          <div className="self-start rounded-xl border border-navy-100 bg-paper p-6 sm:p-8">
            <h2 className="text-3xl">Send us a message</h2>
            <p className="mb-6 mt-2 text-navy-500">Fill in the form and the college will get back to you.</p>
            <ContactForm />
          </div>
        </div>
      </section>

      <section className="bg-paper py-16 sm:py-20" aria-labelledby="location-heading">
        <div className="container-x grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 id="location-heading" className="text-3xl sm:text-4xl">Find the college</h2>
            <p className="mt-4 max-w-md text-navy-500">{SITE.name}, {c.address}.</p>
            <Button href={mapsUrl} target="_blank" rel="noreferrer" className="mt-6">
              Open in Google Maps <ExternalLink size={16} aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </Button>
          </div>
          <div
            className="flex aspect-[16/9] items-center justify-center rounded-xl border border-dashed border-navy-300 bg-white p-6 text-center text-navy-500"
            role="img"
            aria-label="Map placeholder"
          >
            [ADD CONFIRMED MAP LOCATION] An embedded map will be added once the college confirms the exact position.
          </div>
        </div>
      </section>
    </>
  );
}


