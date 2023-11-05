import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },
      gridTemplateColumns: {
        'auto-fill': 'repeat(auto-fill, minmax(310px, 1fr))'
      },
      colors: {
        mariner: {
          50: '#ecfbff',
          100: '#d4f5ff',
          200: '#b3efff',
          300: '#7ee7ff',
          400: '#42d6ff',
          500: '#17b9ff',
          600: '#009bff',
          700: '#0082fc',
          800: '#0271dc',
          900: '#09599f',
          950: '#0b3660'
        }
      }
    }
  },
  plugins: []
}
export default config
