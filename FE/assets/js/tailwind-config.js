// Shared Tailwind CDN config (must be available BEFORE Tailwind CDN loads)
const __MUSICRS_TW_CONFIG__ = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#1db954",
        "background-light": "#f6f8f7",
        "background-dark": "#122017",
        "card-bg": "#12241b",
      },
      fontFamily: {
        display: ["Plus Jakarta Sans"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
    },
  },
};

// Tailwind CDN reads config from the global `tailwind` variable.
// Use `var` to guarantee a real global binding in browsers.
// eslint-disable-next-line no-var
var tailwind = { config: __MUSICRS_TW_CONFIG__ };
window.tailwind = tailwind;

