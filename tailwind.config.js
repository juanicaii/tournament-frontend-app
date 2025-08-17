/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
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
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Brand colors for dynamic theming
        brand: {
          primary: "hsl(var(--brand-primary, var(--primary)))",
          secondary: "hsl(var(--brand-secondary, var(--secondary)))",
          accent: "hsl(var(--brand-accent, var(--accent)))",
          success: "hsl(var(--brand-success, 142 76% 36%))",
          warning: "hsl(var(--brand-warning, 38 92% 50%))",
          error: "hsl(var(--brand-error, 0 84% 60%))",
          // Sport specific colors
          trophy: "hsl(var(--brand-sport-trophy, 45 93% 47%))",
          victory: "hsl(var(--brand-sport-victory, 142 76% 36%))",
          defeat: "hsl(var(--brand-sport-defeat, 0 84% 60%))",
          draw: "hsl(var(--brand-sport-draw, 43 74% 66%))",
          // Extended brand colors
          "extended-greenLight": "hsl(var(--brand-extended-greenLight, 145 40% 60%))",
          "extended-greenLighter": "hsl(var(--brand-extended-greenLighter, 145 40% 80%))",
          "extended-yellowLight": "hsl(var(--brand-extended-yellowLight, 54 100% 70%))",
          "extended-yellowLighter": "hsl(var(--brand-extended-yellowLighter, 54 100% 85%))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}