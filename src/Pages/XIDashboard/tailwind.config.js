/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        white: "#fff",
        teal: {
          "100": "#228276",
          "200": "#046458",
          "300": "rgba(34, 130, 118, 0.1)",
        },
        darkslategray: {
          "100": "#4b4e51",
          "200": "#3d4043",
          "300": "#3b3e41",
          "400": "#313437",
          "500": "#333",
          "600": "rgba(61, 64, 67, 0.6)",
        },
        whitesmoke: "#eee",
        gray: {
          "100": "#fafafa",
          "200": "#888",
          "300": "#777",
          "400": "#202124",
          "500": "rgba(255, 255, 255, 0.4)",
          "600": "rgba(255, 255, 255, 0.1)",
          "700": "rgba(0, 0, 0, 0.04)",
          "800": "rgba(136, 136, 136, 0.4)",
          "900": "rgba(136, 136, 136, 0.7)",
          "1000": "rgba(255, 255, 255, 0.7)",
        },
        indianred: "#d6615a",
        gainsboro: "#e3e3e3",
        silver: "#bbb",
        mediumaquamarine: {
          "100": "#2db78d",
          "200": "#2bad89",
          "300": "rgba(45, 183, 141, 0.1)",
        },
        dimgray: "#636366",
        lightcoral: "#ec8989",
        yellowgreen: "#bcef51",
        black: "#000",
        brown: "#983430",
        mediumblue: "#0000c5",
        forestgreen: "#377e22",
        tomato: "#ea3323",
        darkslateblue: "#3b63b4",
        mediumturquoise: "#72d2c6",
        darkgray: "#a0a0a0",
      },
      fontFamily: {
        "sf-pro-display": "'SF Pro Display'",
        inherit: "inherit",
        "sf-pro": "'SF Pro'",
        "share-tech-mono": "'Share Tech Mono'",
      },
      borderRadius: {
        sm: "14px",
        "8xs": "5px",
        "3xs": "10px",
        "8xs-8": "4.8px",
        mini: "15px",
        smi: "13px",
        "10xs": "3px",
        "11xl": "30px",
      },
    },
    fontSize: {
      "5xs": "8px",
      "3xs": "10px",
      sm: "14px",
    },
  },
  corePlugins: {
    preflight: false,
  },
};
