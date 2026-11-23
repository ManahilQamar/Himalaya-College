import { Link } from 'react-router-dom';
import SpecularButton from './SpecularButton';

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg px-8 py-3 text-[0.95rem] font-semibold transition-colors duration-200 [@media(pointer:coarse)]:min-h-11 disabled:cursor-not-allowed disabled:opacity-60';

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

export default function Button({
  variant = 'primary',
  to,
  href,
  className = '',
  children,
  ...props
}) {
  const cls = `${base} ${variants[variant]} ${className}`;

  // React Router link
  if (to) {
    return (
      <SpecularButton
        as={Link}
        to={to}
        className={cls}
        {...props}
      >
        {children}
      </SpecularButton>
    );
  }

  // Normal external link
  if (href) {
    return (
      <SpecularButton
        as="a"
        href={href}
        className={cls}
        {...props}
      >
        {children}
      </SpecularButton>
    );
  }

  // Normal button
  return (
    <SpecularButton
      className={cls}
      {...props}
    >
      {children}
    </SpecularButton>
  );
}