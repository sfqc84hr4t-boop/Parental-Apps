/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Kindroots design system
        cream: "#FDFAF7",
        "card-warm": "#FFF4EC",
        "card-blush": "#FFF0F3",
        terracotta: "#E07A5F",
        "terracotta-dark": "#C4624A",
        sage: "#8BAF8B",
        "sage-light": "#B8D4B8",
        "text-primary": "#2D2A26",
        "text-muted": "#9E9690",
        "text-secondary": "#5C5854",
        "border-soft": "#EDE9E4",
        "border-warm": "#E8E0D8",
        lavender: "#C4B5D4",
        "lavender-light": "#EDE8F5",
        sky: "#A7C4F2",
        "sky-light": "#E5EEFB",
        mint: "#A8D5BA",
        "mint-light": "#E5F5EC",
        warning: "#F4A261",
        error: "#E63946",
        success: "#52B788",
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
        "4xl": "32px",
      },
      fontFamily: {
        sans: ["Nunito_400Regular"],
        "sans-medium": ["Nunito_500Medium"],
        "sans-semibold": ["Nunito_600SemiBold"],
        "sans-bold": ["Nunito_700Bold"],
        "sans-extrabold": ["Nunito_800ExtraBold"],
      },
      spacing: {
        18: "72px",
        22: "88px",
      },
    },
  },
  plugins: [],
};
