/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'canopy-green': '#184C31', // Primary 900
        'sage-mist': '#8CAF95',    // Accent 400
        'lichen-veil': '#CBD6C4',  // Background Tint 200
        'sun-bark': '#E9B072',     // Highlight
        'cream-pulp': '#F5F0E7',   // Base Canvas
        primary: 'var(--color-canopy-green)',
        accent: 'var(--color-sage-mist)',
        highlight: 'var(--color-sun-bark)',
        canvas: 'var(--color-cream-pulp)',
        'background-tint': 'var(--color-lichen-veil)',
        'text-primary': 'var(--color-canopy-green)',
        'text-on-primary': 'var(--color-cream-pulp)',
        'text-accent': 'var(--color-sage-mist)',
        'text-muted': 'var(--color-canopy-green-muted)', 
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'], 
        heading: ['"IBM Plex Sans"', 'sans-serif'], 
        body: ['Inter', 'sans-serif'], 
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'interactive': '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)', 
      },
      borderRadius: {
        'card': '12px', 
        'button': '6px', 
      },
      lineHeight: {
        'airy': '1.65', 
      },
      keyframes: {
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        }
      },
      animation: {
        slideInRight: 'slideInRight 0.3s ease-out forwards',
        slideOutRight: 'slideOutRight 0.3s ease-out forwards',
        fadeIn: 'fadeIn 0.3s ease-out forwards',
        fadeOut: 'fadeOut 0.3s ease-out forwards',
      }
    }
  },
  plugins: [
    function({ addBase, theme }) {
      addBase({
        ':root': {
          '--color-canopy-green': theme('colors.canopy-green'),
          '--color-sage-mist': theme('colors.sage-mist'),
          '--color-lichen-veil': theme('colors.lichen-veil'),
          '--color-sun-bark': theme('colors.sun-bark'),
          '--color-cream-pulp': theme('colors.cream-pulp'),
          '--color-canopy-green-muted': 'rgba(24, 76, 49, 0.75)', 
        }
      })
    }
  ]
}