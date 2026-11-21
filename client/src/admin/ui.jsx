import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { CheckCircle2, X, XCircle } from 'lucide-react';
import Button from '../components/ui/Button';

// ---- Modal built on the native <dialog>: focus trap, Escape key and backdrop come for free ----
export function Modal({ open, title, onClose, children, wide = false }) {
  const ref = useRef(null);
  useEffect(() => {
    const d = ref.current;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      aria-labelledby="modal-title"
      onCancel={(e) => { e.preventDefault(); onClose(); }}
      onMouseDown={(e) => e.target === ref.current && onClose()}
      className={`m-auto w-[calc(100%-1.5rem)] rounded-xl p-0 shadow-lift backdrop:bg-navy-900/50 ${wide ? 'max-w-4xl' : 'max-w-lg'}`}
    >
      {open && (
        <div className="flex max-h-[90vh] flex-col">
          <div className="flex items-center justify-between border-b border-navy-100 px-6 py-4">
            <h2 id="modal-title" className="text-2xl">{title}</h2>
            <button type="button" onClick={onClose} aria-label="Close" className="rounded-md p-1.5 text-navy-500 hover:bg-navy-50">
              <X size={22} />
            </button>
          </div>
          <div className="overflow-y-auto px-6 py-5">{children}</div>
        </div>
      )}
    </dialog>
  );
}

export function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', busy, onConfirm, onCancel }) {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <p className="text-navy-600">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button variant="danger" disabled={busy} onClick={onConfirm}>{busy ? 'Working…' : confirmLabel}</Button>
      </div>
    </Modal>
  );
}

// ---- Toasts ----
const ToastContext = createContext(() => {});
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const notify = useCallback((message, type = 'success') => setToast({ message, type, id: Date.now() }), []);
  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(t);
  }, [toast]);
  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex justify-center px-4">
        {toast && (
          <div className={`pointer-events-auto flex items-center gap-2 rounded-lg px-4 py-3 text-white shadow-lift ${toast.type === 'error' ? 'bg-red-700' : 'bg-navy-900'}`}>
            {toast.type === 'error' ? <XCircle size={20} aria-hidden="true" /> : <CheckCircle2 size={20} className="text-[#173B7A]" aria-hidden="true" />}
            {toast.message}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}

export function Badge({ children, tone = 'gray' }) {
  const tones = {
    gray: 'bg-navy-50 text-navy-600 border-navy-200',
    gold: 'bg-[#D6A84F] text-[#18212F] border-[#D6A84F]',
    green: 'bg-campus-50 text-campus-600 border-campus-500',
    red: 'bg-red-50 text-red-700 border-red-300',
  };
  return <span className={`inline-block rounded border px-2 py-0.5 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}

// Accessible on/off switch used for Published
export function Switch({ checked, onChange, label, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full after:absolute after:-inset-2.5 after:content-[''] transition-colors disabled:opacity-50 ${checked ? 'bg-campus-500' : 'bg-navy-200'}`}
    >
      <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : ''}`} />
    </button>
  );
}



