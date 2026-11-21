/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    // em-based breakpoints (same widths at default text size) so enlarged text switches to the mobile layout earlier
    screens: { sm: '40em', md: '48em', lg: '64em', xl: '80em', '2xl': '96em' },
    extend: {
      colors: {
        // Brand navy. 900 is exactly #0F1B3D. Lighter steps are used for text and borders (all AA on white where used as text).
        navy: {
          50: '#eff2fa',
          100: '#dde4f3',
          200: '#bcc8e6',
          300: '#8fa3d1',
          400: '#4a66a8',
          500: '#3f5ba3',
          600: '#2c4488',
          700: '#1f3366',
          800: '#172650',
          900: '#0F1B3D',
          950: '#0a1330',
        },

        // success / published states only (not part of the brand palette)
        campus: {
          50: '#eef7f0',
          500: '#3d8b5a',
          600: '#2f7048',
        },
        paper: '#f6f8fc',
        ink: '#141c36',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans Variable"', 'system-ui', 'sans-serif'],
        sans: ['"Public Sans Variable"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        lift: '0 18px 40px -16px rgba(15, 27, 61, 0.35)',
      },
      maxWidth: { page: '76rem' },
    },
  },
  plugins: [],
};

