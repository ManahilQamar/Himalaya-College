// Each test file uses its own database so files can run in parallel.
const base = process.env.MONGODB_TEST_BASE || 'mongodb://127.0.0.1:27017';
export const testUri = (name) => `${base}/${name}`;
