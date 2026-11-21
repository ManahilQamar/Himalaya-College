import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { CheckCircle2 } from 'lucide-react';
import Field from '../ui/Field';
import Button from '../ui/Button';
import { ErrorState } from '../ui/QueryState';
import { api } from '../../lib/api';
import { isEmail, isPhone } from '../../lib/validators';

const empty = { name: '', email: '', phone: '', subject: '', message: '', website: '' };

function validate(v) {
  const e = {};
  if (v.name.trim().length < 2) e.name = 'Enter your name.';
  if (!isEmail(v.email)) e.email = 'Enter a valid email address.';
  if (!isPhone(v.phone)) e.phone = 'Enter a valid phone number, for example 0300-1234567.';
  if (v.subject.trim().length < 3) e.subject = 'Enter a subject.';
  if (v.message.trim().length < 10) e.message = 'Write a message of at least 10 characters.';
  else if (v.message.length > 2000) e.message = 'Keep your message under 2000 characters.';
  return e;
}

export default function ContactForm() {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState({});
  const mutation = useMutation({ mutationFn: api.submitContact });

  const set = (k) => (e) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      // wait for React to render the error state, then focus the first invalid field
      setTimeout(() => document.querySelector('#contact-form [aria-invalid="true"]')?.focus(), 0);
      return;
    }
    if (values.website) return; // honeypot: bots fill hidden fields
    mutation.mutate(values);
  };

  if (mutation.isSuccess) {
    return (
      <div role="status" className="rounded-xl border border-campus-500 bg-campus-50 p-8">
        <CheckCircle2 className="text-campus-600" size={36} aria-hidden="true" />
        <h3 className="mt-3 text-2xl">Thank you, {values.name.split(' ')[0]}.</h3>
        <p className="mt-2 max-w-prose text-navy-600">
          We have received your message. The college will reply to you by email or phone.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => { mutation.reset(); setValues(empty); }}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form id="contact-form" onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      <Field label="Name" required autoComplete="name" value={values.name} onChange={set('name')} error={errors.name} />
      <Field label="Email" required type="email" autoComplete="email" value={values.email} onChange={set('email')} error={errors.email} />
      <Field label="Phone" required type="tel" autoComplete="tel" value={values.phone} onChange={set('phone')} error={errors.phone} placeholder="0300-1234567" />
      <Field label="Subject" required value={values.subject} onChange={set('subject')} error={errors.subject} />
      <Field label="Message" required as="textarea" rows={5} className="sm:col-span-2" value={values.message} onChange={set('message')} error={errors.message} />

      {/* honeypot, hidden from people and screen readers */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>Website<input tabIndex={-1} autoComplete="off" value={values.website} onChange={set('website')} /></label>
      </div>

      {mutation.isError && (
        <div className="sm:col-span-2">
          <ErrorState title="We could not send your message" text="Please try again in a moment, or call the college." />
        </div>
      )}
      <div className="sm:col-span-2">
        <Button type="submit" disabled={mutation.isPending} className="w-full sm:w-auto">
          {mutation.isPending ? 'Sending…' : 'Send message'}
        </Button>
      </div>
    </form>
  );
}


