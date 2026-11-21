// Beyond length: blocks the passwords people actually guess first.
const WEAK_PARTS = ['password', 'passw0rd', 'qwerty', '123456', 'letmein', 'iloveyou', 'abc123', 'himalaya', 'swabi', 'admin123'];

export function passwordProblem(password, email = '') {
  if (password.length < 10) return 'Use at least 10 characters';
  const lower = password.toLowerCase();
  if (/^\d+$/.test(password)) return 'Add letters as well as numbers';
  if (/^(.)\1+$/.test(password)) return 'Do not repeat the same character';
  if (WEAK_PARTS.some((w) => lower.includes(w))) return 'This password is too easy to guess. Try a few unrelated words instead';
  const name = email.split('@')[0].toLowerCase();
  if (name.length >= 4 && lower.includes(name)) return 'The password should not contain your email name';
  return null;
}
