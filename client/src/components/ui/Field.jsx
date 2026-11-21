import { useId } from 'react';

const inputCls =
  'w-full rounded-lg border bg-white px-4 py-3 text-ink placeholder:text-navy-400 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-blue-700';

// Accessible labelled field with inline error. `as` can be 'input' | 'select' | 'textarea'.
export default function Field({ label, error, required, as: Tag = 'input', children, className = '', ...props }) {
  const id = useId();
  const errId = `${id}-err`;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-navy-800">
        {label}
        {required && <span className="text-red-600" aria-hidden="true"> *</span>}
      </label>
      <Tag
        id={id}
        required={required}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errId : undefined}
        className={`${inputCls} ${error ? 'border-red-500' : 'border-navy-200'}`}
        {...props}
      >
        {children}
      </Tag>
      {error && <p id={errId} className="mt-1.5 text-sm text-red-700">{error}</p>}
    </div>
  );
}


