import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#12201b",
        moss: "#2f5d50",
        coral: "#e86f51",
        skyglass: "#e8f3f6"
      },
      boxShadow: {
        soft: "0 12px 30px rgba(18, 32, 27, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
