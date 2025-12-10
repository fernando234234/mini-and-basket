import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-beige": "#FFF9F0",
        "brand-green": "#84C14A",
        "brand-green-dark": "#73A942",
        "brand-green-light": "#A8D97D",
        "brand-orange": "#F7941D",
        "brand-orange-dark": "#E8850A",
        "brand-orange-light": "#FFAD4D",
        "brand-dark": "#333333",
        "brand-gray": "#555555",
        "brand-gray-light": "#888888",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        display: ["Poppins", "sans-serif"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
        "display-sm": ["2rem", { lineHeight: "2.5rem", fontWeight: "800" }],
        "display-md": ["3rem", { lineHeight: "3.5rem", fontWeight: "800" }],
        "display-lg": ["4rem", { lineHeight: "4.5rem", fontWeight: "800" }],
        "display-xl": ["5rem", { lineHeight: "5.5rem", fontWeight: "800" }],
      },
      boxShadow: {
        subtle: "0 4px 15px rgba(0, 0, 0, 0.05)",
        strong: "0 8px 25px rgba(0, 0, 0, 0.1)",
        glow: "0 0 20px rgba(247, 148, 29, 0.3)",
        "glow-green": "0 0 20px rgba(132, 193, 74, 0.3)",
        "glow-orange": "0 0 20px rgba(247, 148, 29, 0.3)",
        "inner-glow": "inset 0 0 20px rgba(247, 148, 29, 0.1)",
        "3d": "0 10px 30px rgba(0, 0, 0, 0.1), 0 1px 8px rgba(0, 0, 0, 0.05)",
        "3d-hover": "0 20px 40px rgba(0, 0, 0, 0.15), 0 5px 15px rgba(0, 0, 0, 0.08)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-brand": "linear-gradient(135deg, #84C14A 0%, #F7941D 100%)",
        "gradient-brand-reverse": "linear-gradient(135deg, #F7941D 0%, #84C14A 100%)",
        "gradient-dark": "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%)",
        "mesh-gradient": "radial-gradient(at 40% 20%, #84C14A33 0%, transparent 50%), radial-gradient(at 80% 0%, #F7941D33 0%, transparent 50%), radial-gradient(at 0% 50%, #84C14A22 0%, transparent 50%)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "fade-in-up": "fadeInUp 0.5s ease-out",
        "fade-in-down": "fadeInDown 0.5s ease-out",
        "slide-in-left": "slideInLeft 0.5s ease-out",
        "slide-in-right": "slideInRight 0.5s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "spin-slow": "spin 20s linear infinite",
        "spin-slow-reverse": "spinReverse 25s linear infinite",
        "float": "float 4s ease-in-out infinite",
        "float-delayed": "floatDelayed 5s ease-in-out infinite 1s",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "bounce-subtle": "bounceSubtle 2s ease-in-out infinite",
        "basketball-bounce": "basketballBounce 1.5s infinite",
        "gradient": "gradient 4s ease infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        spinReverse: {
          "0%": { transform: "rotate(360deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-10px) rotate(2deg)" },
        },
        floatDelayed: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-15px) rotate(-2deg)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 5px rgba(247, 148, 29, 0.4)" },
          "50%": { boxShadow: "0 0 20px rgba(247, 148, 29, 0.8), 0 0 30px rgba(247, 148, 29, 0.4)" },
        },
        bounceSubtle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        basketballBounce: {
          "0%, 100%": { transform: "translateY(0) scaleY(1)" },
          "50%": { transform: "translateY(-25px) scaleY(1)" },
          "90%": { transform: "translateY(0) scaleY(0.95)" },
        },
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      transitionDuration: {
        "400": "400ms",
        "600": "600ms",
        "800": "800ms",
        "900": "900ms",
      },
      transitionTimingFunction: {
        "bounce-in": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "smooth-out": "cubic-bezier(0.23, 1, 0.32, 1)",
      },
      scale: {
        "102": "1.02",
        "103": "1.03",
        "98": "0.98",
      },
      zIndex: {
        "60": "60",
        "70": "70",
        "80": "80",
        "90": "90",
        "100": "100",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
export default config;