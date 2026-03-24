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
        pastel: {
          pink: "#FFADAD",
          yellow: "#FFD6A5",
          green: "#CAFFBF",
          blue: "#9BF6FF",
          purple: "#BDB2FF",
        },
      },
      fontFamily: {
        arabic: ["Cairo", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
