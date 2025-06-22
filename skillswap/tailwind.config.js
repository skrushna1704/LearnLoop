// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: [
      './pages/**/*.{ts,tsx}',
      './components/**/*.{ts,tsx}',
      './app/**/*.{ts,tsx}',
      './src/**/*.{ts,tsx}',
    ],
    prefix: "",
    theme: {
      container: {
        center: true,
        padding: "2rem",
        screens: {
          "2xl": "1400px",
        },
      },
      extend: {
        // Custom Color Palette for LearnLoop
        colors: {
          border: "hsl(var(--border))",
          input: "hsl(var(--input))",
          ring: "hsl(var(--ring))",
          background: "hsl(var(--background))",
          foreground: "hsl(var(--foreground))",
          
          // Primary Brand Colors
          primary: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',  // Main brand blue
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
            950: '#172554',
            DEFAULT: '#3b82f6',
            foreground: '#ffffff',
          },
          
          // Secondary Purple
          secondary: {
            50: '#faf5ff',
            100: '#f3e8ff',
            200: '#e9d5ff',
            300: '#d8b4fe',
            400: '#c084fc',
            500: '#a855f7',  // Main purple
            600: '#9333ea',
            700: '#7c3aed',
            800: '#6b21a8',
            900: '#581c87',
            950: '#3b0764',
            DEFAULT: '#a855f7',
            foreground: '#ffffff',
          },
          
          // Accent Colors
          accent: {
            50: '#ecfdf5',
            100: '#d1fae5',
            200: '#a7f3d0',
            300: '#6ee7b7',
            400: '#34d399',
            500: '#10b981',  // Success green
            600: '#059669',
            700: '#047857',
            800: '#065f46',
            900: '#064e3b',
            DEFAULT: '#10b981',
            foreground: '#ffffff',
          },
          
          // Status Colors
          success: {
            50: '#ecfdf5',
            500: '#10b981',
            600: '#059669',
            DEFAULT: '#10b981',
          },
          warning: {
            50: '#fffbeb',
            500: '#f59e0b',
            600: '#d97706',
            DEFAULT: '#f59e0b',
          },
          error: {
            50: '#fef2f2',
            500: '#ef4444',
            600: '#dc2626',
            DEFAULT: '#ef4444',
          },
          
          // Neutral Grays
          muted: {
            DEFAULT: "hsl(var(--muted))",
            foreground: "hsl(var(--muted-foreground))",
          },
          popover: {
            DEFAULT: "hsl(var(--popover))",
            foreground: "hsl(var(--popover-foreground))",
          },
          card: {
            DEFAULT: "hsl(var(--card))",
            foreground: "hsl(var(--card-foreground))",
          },
        },
        
        // Custom Border Radius
        borderRadius: {
          xl: "calc(var(--radius) + 4px)",
          lg: "var(--radius)",
          md: "calc(var(--radius) - 2px)",
          sm: "calc(var(--radius) - 4px)",
        },
        
        // Custom Fonts
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif'],
          display: ['Cal Sans', 'Inter', 'system-ui', 'sans-serif'],
          mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
        },
        
        // Custom Font Sizes
        fontSize: {
          '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
          'xs': ['0.75rem', { lineHeight: '1rem' }],
          'sm': ['0.875rem', { lineHeight: '1.25rem' }],
          'base': ['1rem', { lineHeight: '1.5rem' }],
          'lg': ['1.125rem', { lineHeight: '1.75rem' }],
          'xl': ['1.25rem', { lineHeight: '1.75rem' }],
          '2xl': ['1.5rem', { lineHeight: '2rem' }],
          '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
          '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
          '5xl': ['3rem', { lineHeight: '1' }],
          '6xl': ['3.75rem', { lineHeight: '1' }],
          '7xl': ['4.5rem', { lineHeight: '1' }],
          '8xl': ['6rem', { lineHeight: '1' }],
          '9xl': ['8rem', { lineHeight: '1' }],
        },
        
        // Custom Spacing
        spacing: {
          '18': '4.5rem',
          '88': '22rem',
          '128': '32rem',
          '144': '36rem',
        },
        
        // Custom Shadows
        boxShadow: {
          'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
          'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          'large': '0 10px 40px -10px rgba(0, 0, 0, 0.1), 0 20px 25px -5px rgba(0, 0, 0, 0.04)',
          'glow': '0 0 0 1px rgba(59, 130, 246, 0.1), 0 4px 16px rgba(59, 130, 246, 0.12)',
          'glow-lg': '0 0 0 1px rgba(59, 130, 246, 0.15), 0 8px 32px rgba(59, 130, 246, 0.15)',
        },
        
        // Custom Animations
        keyframes: {
          "accordion-down": {
            from: { height: "0" },
            to: { height: "var(--radix-accordion-content-height)" },
          },
          "accordion-up": {
            from: { height: "var(--radix-accordion-content-height)" },
            to: { height: "0" },
          },
          "fade-in": {
            from: { opacity: "0", transform: "translateY(10px)" },
            to: { opacity: "1", transform: "translateY(0)" },
          },
          "fade-in-up": {
            from: { opacity: "0", transform: "translateY(30px)" },
            to: { opacity: "1", transform: "translateY(0)" },
          },
          "slide-in-right": {
            from: { opacity: "0", transform: "translateX(30px)" },
            to: { opacity: "1", transform: "translateX(0)" },
          },
          "slide-in-left": {
            from: { opacity: "0", transform: "translateX(-30px)" },
            to: { opacity: "1", transform: "translateX(0)" },
          },
          "bounce-gentle": {
            "0%, 100%": { transform: "translateY(0)" },
            "50%": { transform: "translateY(-5px)" },
          },
          "pulse-glow": {
            "0%, 100%": { boxShadow: "0 0 0 0 rgba(59, 130, 246, 0.4)" },
            "70%": { boxShadow: "0 0 0 10px rgba(59, 130, 246, 0)" },
          },
          "gradient-shift": {
            "0%": { backgroundPosition: "0% 50%" },
            "50%": { backgroundPosition: "100% 50%" },
            "100%": { backgroundPosition: "0% 50%" },
          },
        },
        animation: {
          "accordion-down": "accordion-down 0.2s ease-out",
          "accordion-up": "accordion-up 0.2s ease-out",
          "fade-in": "fade-in 0.5s ease-out",
          "fade-in-up": "fade-in-up 0.6s ease-out",
          "slide-in-right": "slide-in-right 0.5s ease-out",
          "slide-in-left": "slide-in-left 0.5s ease-out",
          "bounce-gentle": "bounce-gentle 2s ease-in-out infinite",
          "pulse-glow": "pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          "gradient-shift": "gradient-shift 3s ease infinite",
        },
        
        // Background Images
        backgroundImage: {
          'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
          'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
          'gradient-brand': 'linear-gradient(135deg, #3b82f6 0%, #a855f7 100%)',
          'gradient-brand-subtle': 'linear-gradient(135deg, #eff6ff 0%, #faf5ff 100%)',
        },
        
        // Custom Grid Templates
        gridTemplateColumns: {
          'auto-fit-250': 'repeat(auto-fit, minmax(250px, 1fr))',
          'auto-fit-300': 'repeat(auto-fit, minmax(300px, 1fr))',
          'auto-fill-200': 'repeat(auto-fill, minmax(200px, 1fr))',
        },
      },
    },
    plugins: [
      require("tailwindcss-animate"),
      // Add more plugins as needed
    ],
  }