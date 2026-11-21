export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export function isPhone(v) {
  const digits = v.replace(/\D/g, '');
  return /^[\d\s+()-]+$/.test(v) && digits.length >= 10 && digits.length <= 15;
}


