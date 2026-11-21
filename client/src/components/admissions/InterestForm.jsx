import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { CheckCircle2 } from 'lucide-react';
import Field from '../ui/Field';
import Button from '../ui/Button';
import { ErrorState } from '../ui/QueryState';
import { api } from '../../lib/api';
import { usePrograms } from '../../hooks/useContent';
import { isEmail, isPhone } from '../../lib/validators';

const empty = { fullName: '', email: '', phone: '', city: '', preferredProgram: '', previousQualification: '', message: '', website: '' };

function validate(v) {
  const e = {};
  if (v.fullName.trim().length < 2) e.fullName = 'Enter your full name.';
  if (!isEmail(v.email)) e.email = 'Enter a valid email address.';
  if (!isPhone(v.phone)) e.phone = 'Enter a valid phone number, for example 0300-1234567.';
  if (v.city.trim().length < 2) e.city = 'Enter your city.';
  if (!v.preferredProgram) e.preferredProgram = 'Choose a program, or "Not sure yet".';
  if (v.previousQualification.trim().length < 2) e.previousQualification = 'Enter your previous qualification.';
  if (v.message.length > 1000) e.message = 'Keep your message under 1000 characters.';
  return e;
}

export default function InterestForm() {
  const [params] = useSearchParams();
  const programs = usePrograms();
  const [values, setValues] = useState(() => ({ ...empty, preferredProgram: params.get('program') || '' }));
  const [errors, setErrors] = useState({});
  const mutation = useMutation({ mutationFn: api.submitInterest });

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
      setTimeout(() => document.querySelector('#interest-form [aria-invalid="true"]')?.focus(), 0);
      return;
    }
    if (values.website) return; // honeypot: bots fill hidden fields
    mutation.mutate(values);
  };

  if (mutation.isSuccess) {
    return (
      <div role="status" className="rounded-xl border border-campus-500 bg-campus-50 p-8">
        <CheckCircle2 className="text-campus-600" size={36} aria-hidden="true" />
        <h3 className="mt-3 text-2xl">Thank you, {values.fullName.split(' ')[0]}.</h3>
        <p className="mt-2 max-w-prose text-navy-600">
          We have received your interest. This is not a confirmed admission. The admissions team will contact you
          with the next steps.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => { mutation.reset(); setValues(empty); }}>
          Submit another response
        </Button>
      </div>
    );
  }

  return (
    <form id="interest-form" onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      <Field label="Full name" required autoComplete="name" value={values.fullName} onChange={set('fullName')} error={errors.fullName} />
      <Field label="Email" required type="email" autoComplete="email" value={values.email} onChange={set('email')} error={errors.email} />
      <Field label="Phone number" required type="tel" autoComplete="tel" value={values.phone} onChange={set('phone')} error={errors.phone} placeholder="0300-1234567" />
      <Field label="City" required autoComplete="address-level2" value={values.city} onChange={set('city')} error={errors.city} />
      <Field label="Preferred program" required as="select" value={values.preferredProgram} onChange={set('preferredProgram')} error={errors.preferredProgram}>
        <option value="">Select a program</option>
        {(programs.data || []).map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
        <option value="not-sure">Not sure yet</option>
      </Field>
      <Field label="Previous qualification" required value={values.previousQualification} onChange={set('previousQualification')} error={errors.previousQualification} placeholder="For example: Matric, FSc" />
      <Field label="Message or questions" as="textarea" rows={4} className="sm:col-span-2" value={values.message} onChange={set('message')} error={errors.message} />

      {/* honeypot, hidden from people and screen readers */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>Website<input tabIndex={-1} autoComplete="off" value={values.website} onChange={set('website')} /></label>
      </div>

      {mutation.isError && (
        <div className="sm:col-span-2">
          <ErrorState title="We could not send your interest" text="Please try again in a moment, or contact the college by phone." />
        </div>
      )}
      <div className="sm:col-span-2">
        <Button type="submit" disabled={mutation.isPending} className="w-full sm:w-auto">
          {mutation.isPending ? 'Sending…' : 'Submit Interest'}
        </Button>
      </div>
    </form>
  );
}


