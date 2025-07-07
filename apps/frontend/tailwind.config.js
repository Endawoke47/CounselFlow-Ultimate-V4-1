/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1440px", // CounselFlow max width
      },
    },
    extend: {
      colors: {
        // CounselFlow Official Color Palette
        primary: {
          DEFAULT: "#3C7B75",
          50: "#E8F5F4",
          100: "#D1EBE9",
          200: "#A3D7D3",
          300: "#75C3BD",
          400: "#479FA7",
          500: "#3C7B75",
          600: "#30625E",
          700: "#244A46",
          800: "#18312F",
          900: "#0C1917",
        },
        accent: {
          DEFAULT: "#A855F7",
          50: "#F3E8FF",
          100: "#E9D5FF",
          200: "#D8B4FE",
          300: "#C084FC",
          400: "#A855F7",
          500: "#9333EA",
          600: "#7C2D12",
          700: "#6B21A8",
          800: "#581C87",
          900: "#4C1D95",
        },
        background: "#FFFFFF",
        surface: "#F4F5F7",
        border: "#D0D4D9",
        text: "#1A1D23",
        
        // Semantic colors
        danger: "#EF4444",
        success: "#22C55E",
        warning: "#F59E0B",
        info: "#3B82F6",
        
        // Named colors for convenience
        "soft-white": "#FFFFFF",
        "light-gray": "#F4F5F7",
        "muted-gray": "#D0D4D9",
        "accent-purple": "#A855F7",
        "dark-navy": "#1A1D23",
        
        // Shadcn/ui compatibility
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#1A1D23",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#1A1D23",
        },
        secondary: {
          DEFAULT: "#F4F5F7",
          foreground: "#1A1D23",
        },
        muted: {
          DEFAULT: "#D0D4D9",
          foreground: "#1A1D23",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        input: "#FFFFFF",
        ring: "#3C7B75",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      backgroundImage: {
        'gradient-counsel': 'linear-gradient(135deg, #f0fdff 0%, #3C7B75 100%)',
        'gradient-legal': 'linear-gradient(135deg, #fafffe 0%, #26c6da 100%)',
        'gradient-professional': 'linear-gradient(135deg, #ffffff 0%, #3C7B75 50%, #0097a7 100%)',
        'gradient-teal': 'linear-gradient(135deg, #3C7B75 0%, #14b8a6 100%)',
        'gradient-purple': 'linear-gradient(135deg, #A855F7 0%, #9333ea 100%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'elevated': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lift': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'floating': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'counsel': '0 4px 6px -1px rgba(60, 123, 117, 0.1), 0 2px 4px -1px rgba(60, 123, 117, 0.06)',
        'counsel-lg': '0 10px 15px -3px rgba(60, 123, 117, 0.1), 0 4px 6px -2px rgba(60, 123, 117, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-ring': 'pulseRing 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'toast-in': 'toastIn 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 2s infinite',
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseRing: {
          '0%': { transform: 'scale(.8)', opacity: '1' },
          '40%': { transform: 'scale(1)', opacity: '.3' },
          '100%': { transform: 'scale(1.3)', opacity: '0' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        toastIn: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
        xl: "0.75rem",
        '2xl': "1rem",
        '3xl': "1.5rem",
      },
      gridTemplateColumns: {
        'main': '280px 1fr',
        'mobile': '1fr',
        '12': 'repeat(12, minmax(0, 1fr))',
      },
      maxWidth: {
        'app': '1440px',
      },
      spacing: {
        'gutter': '24px',
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
}