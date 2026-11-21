import { Link } from 'react-router-dom';

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-[0.95rem] font-semibold transition-colors duration-200 [@media(pointer:coarse)]:min-h-11 disabled:cursor-not-allowed disabled:opacity-60';

const variants = {
  primary:
    'bg-[#173B7A] text-white hover:bg-[#173B7A] [&>svg]:text-white [&>svg]:stroke-white [&>svg]:fill-white',
  secondary:
    'bg-[#D6A84F] text-[#18212F] hover:bg-[#D6A84F] [&>svg]:text-[#18212F] [&>svg]:stroke-[#18212F] [&>svg]:fill-[#18212F]',
  outline:
    'border border-[#173B7A] text-[#173B7A] hover:bg-[#173B7A] hover:text-white [&>svg]:stroke-current [&>svg]:fill-current',
  outlineLight:
    'border border-white/60 text-white hover:bg-white hover:text-[#18212F]',
  ghost:
    'text-[#173B7A] hover:bg-[#F8F9FC]',
  danger:
    'bg-red-600 text-white hover:bg-red-700 [&>svg]:text-white [&>svg]:stroke-white [&>svg]:fill-white',
};

export default function Button({ variant = 'primary', to, href, className = '', children, ...props }) {
  const cls = `${base} ${variants[variant]} ${className}`;
  if (to) return <Link to={to} className={cls} {...props}>{children}</Link>;
  if (href) return <a href={href} className={cls} {...props}>{children}</a>;
  return <button className={cls} {...props}>{children}</button>;
}
