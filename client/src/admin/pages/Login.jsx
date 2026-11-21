import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import Field from '../../components/ui/Field';
import Button from '../../components/ui/Button';
import Logo, { LogoMark } from '../../components/layout/Logo';
import { SITE } from '../../lib/siteConfig';
import { useAuth } from '../auth';

const FEATURES = [
  'Admission interests and contact messages',
  'Events and announcements',
  'Programs, campuses and services',
  'College information and the MD message',
];

export default function Login() {
  const { status, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (status === 'in') return <Navigate to={location.state?.from || '/admin'} replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(email, password);
      navigate(location.state?.from || '/admin', { replace: true });
    } catch (err) {
      setError(err.status === 401 || err.status === 429 || err.status === 400 ? err.message : 'Could not sign in. Check your connection and try again.');
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <aside aria-label="About the admin panel" className="relative isolate hidden overflow-hidden bg-navy-900 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div
          className="absolute inset-0 -z-10 opacity-60"
          aria-hidden="true"
          style={{
            backgroundImage: 'linear-gradient(rgba(143,163,209,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(143,163,209,.1) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage: 'radial-gradient(ellipse at 30% 30%, #000 0%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 30% 30%, #000 0%, transparent 70%)',
          }}
        />
        <Logo light />
        <div>
          <p className="font-display text-4xl font-bold leading-tight">Run the college website from one place.</p>
          <span className="mt-6 block h-1.5 w-20 rounded-full bg-[#173B7A]" aria-hidden="true" />
          <ul className="mt-8 space-y-3 text-lg text-navy-100">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-3">
                <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-[#173B7A]" aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-sm text-navy-200">Authorised staff only. Sign-ins and changes are recorded.</p>
        <svg className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-24 w-full text-navy-800" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
          <path fill="currentColor" d="M0 120V84l130-34 90 40 150-62 120 56 110-40 160 60 130-66 140 50 120-36 140 52 150-30V120z" />
        </svg>
      </aside>

      <main className="flex items-center justify-center bg-white px-5 py-12">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 lg:hidden">
            <LogoMark className="h-11 w-11" />
            <p className="font-display text-lg font-bold text-navy-900">{SITE.name}</p>
          </div>
          <h1 className="mt-8 text-3xl sm:text-4xl lg:mt-0">Sign in</h1>
          <p className="mt-2 text-navy-500">Use the email and password given to you by the college.</p>

          <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5">
            <Field label="Email" required type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
            <div>
              <Field label="Password" required type={show ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <label className="tap mt-2 gap-2 text-sm text-navy-600">
                <input type="checkbox" className="h-4 w-4 accent-blue-700" checked={show} onChange={(e) => setShow(e.target.checked)} />
                Show password
              </label>
            </div>
            {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
            <Button type="submit" className="w-full" disabled={busy || !email || !password}>{busy ? 'Signing in…' : 'Sign in'}</Button>
          </form>

          <Link to="/" className="tap mt-8 gap-2 text-sm font-semibold text-navy-700 hover:text-navy-900 hover:underline">
            <ArrowLeft size={16} aria-hidden="true" /> Back to the website
          </Link>
        </div>
      </main>
    </div>
  );
}


