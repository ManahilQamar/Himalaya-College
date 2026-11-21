import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import Field from '../../components/ui/Field';
import Button from '../../components/ui/Button';
import { adminApi } from '../../lib/adminApi';
import { useAuth } from '../auth';
import { ConfirmDialog, useToast } from '../ui';

export default function Settings() {
  const { admin, logout } = useAuth();
  const toast = useToast();
  const [v, setV] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [confirmAll, setConfirmAll] = useState(false);
  const set = (k) => (e) => { setV({ ...v, [k]: e.target.value }); setErrors({ ...errors, [k]: undefined }); };

  const change = useMutation({
    mutationFn: () => adminApi.changePassword({ currentPassword: v.currentPassword, newPassword: v.newPassword }),
    onSuccess: () => { toast('Password changed. Your other sessions were signed out.'); setV({ currentPassword: '', newPassword: '', confirm: '' }); },
    onError: (err) => (err.errors ? setErrors(err.errors) : toast(err.message, 'error')),
  });

  const signOutEverywhere = useMutation({
    mutationFn: adminApi.logoutAll,
    onSuccess: () => logout(),
    onError: (err) => { setConfirmAll(false); toast(err.message, 'error'); },
  });

  const submit = (e) => {
    e.preventDefault();
    if (v.newPassword !== v.confirm) return setErrors({ confirm: 'The two passwords do not match.' });
    return change.mutate();
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl">Settings</h1>
      <section className="mt-6 rounded-xl border border-navy-100 bg-white p-6" aria-labelledby="acct">
        <h2 id="acct" className="text-2xl">Your account</h2>
        <p className="mt-2 text-navy-600">{admin?.name} · {admin?.email}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button variant="outline" onClick={logout}>Sign out</Button>
          <Button variant="ghost" onClick={() => setConfirmAll(true)}>Sign out of all devices</Button>
        </div>
        <p className="mt-3 text-sm text-navy-500">Use “all devices” if you signed in on a shared computer or lost a phone.</p>
      </section>

      <section className="mt-6 rounded-xl border border-navy-100 bg-white p-6" aria-labelledby="pw">
        <h2 id="pw" className="text-2xl">Change password</h2>
        <form onSubmit={submit} noValidate className="mt-4 space-y-4">
          <Field label="Current password" required type="password" autoComplete="current-password" value={v.currentPassword} onChange={set('currentPassword')} error={errors.currentPassword} />
          <Field label="New password" required type="password" autoComplete="new-password" value={v.newPassword} onChange={set('newPassword')} error={errors.newPassword} />
          <p className="-mt-2 text-sm text-navy-500">At least 10 characters. A few random words is a strong choice.</p>
          <Field label="Repeat new password" required type="password" autoComplete="new-password" value={v.confirm} onChange={set('confirm')} error={errors.confirm} />
          <Button type="submit" disabled={change.isPending || !v.currentPassword || !v.newPassword}>{change.isPending ? 'Saving…' : 'Change password'}</Button>
        </form>
      </section>
      <ConfirmDialog open={confirmAll} title="Sign out of all devices?" confirmLabel="Sign out everywhere"
        message="Every session, including this one, will be signed out. You will need to sign in again."
        busy={signOutEverywhere.isPending} onConfirm={() => signOutEverywhere.mutate()} onCancel={() => setConfirmAll(false)} />
    </div>
  );
}


