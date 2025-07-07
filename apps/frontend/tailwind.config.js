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
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem", 
        md: "2rem",
        lg: "2rem",
        xl: "2rem",
        "2xl": "2rem"
      },
      screens: {
        sm: "640px",
        md: "768px", 
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px", // CounselFlow max width
      },
    },
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
      // Device-specific breakpoints
      'mobile': {'max': '767px'},
      'tablet': {'min': '768px', 'max': '1023px'},
      'desktop': {'min': '1024px'},
      'wide': {'min': '1440px'},
    },
    extend: {
      colors: {
        // Enhanced CounselFlow Teal/Turquoise Color Palette
        primary: {
          DEFAULT: "#14b8a6", // teal-500
          50: "#f0fdfa",
          100: "#ccfbf1", 
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
          950: "#042f2e",
        },
        secondary: {
          DEFAULT: "#06b6d4", // cyan-500
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc", 
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63",
          950: "#083344",
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
        // Responsive font sizes using clamp()
        'responsive-sm': 'clamp(0.875rem, 2vw, 1rem)',
        'responsive-base': 'clamp(1rem, 2.5vw, 1.125rem)',
        'responsive-lg': 'clamp(1.125rem, 3vw, 1.5rem)',
        'responsive-xl': 'clamp(1.25rem, 4vw, 2rem)',
        'responsive-2xl': 'clamp(1.5rem, 5vw, 3rem)',
        'responsive-3xl': 'clamp(1.875rem, 6vw, 4rem)',
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
        'mobile-slide-up': 'mobileSlideUp 0.4s ease-out',
        'touch-feedback': 'touchFeedback 0.1s ease-out',
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
        mobileSlideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        touchFeedback: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
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
        'touch': "0.75rem", // Optimized for touch interfaces
        'mobile': "0.5rem",
      },
      gridTemplateColumns: {
        'main': '280px 1fr',
        'mobile': '1fr',
        'tablet': 'repeat(2, 1fr)',
        'desktop': 'repeat(3, 1fr)',
        'wide': 'repeat(4, 1fr)',
        '12': 'repeat(12, minmax(0, 1fr))',
        'responsive': 'repeat(auto-fit, minmax(280px, 1fr))',
        'card-grid': 'repeat(auto-fill, minmax(300px, 1fr))',
      },
      flex: {
        '2': '2 2 0%',
        '3': '3 3 0%',
        '4': '4 4 0%',
      },
      maxWidth: {
        'app': '1440px',
        'container': '1200px',
        'content': '1024px',
        'mobile': '100%',
        'tablet': '768px',
        'desktop': '1024px',
      },
      spacing: {
        'gutter': '24px',
        '18': '4.5rem',
        '88': '22rem',
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      aspectRatio: {
        'auto': 'auto',
        'square': '1 / 1',
        'video': '16 / 9',
        'photo': '4 / 3',
        'wide': '21 / 9',
      },
    },
  },
  plugins: [],
}