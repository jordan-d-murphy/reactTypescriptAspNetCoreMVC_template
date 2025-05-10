// // /** @type {import('tailwindcss').Config} */
// // // module.exports = {
// // //     darkMode: 'class', // required for toggling dark mode
// // //     content: [
// // //       "./index.html",
// // //       "./src/**/*.{js,ts,jsx,tsx}"
// // //     ],
// // //     theme: {
// // //       extend: {
// // //         keyframes: {
// // //           "pulse-border": {
// // //             "0%, 100%": { borderColor: "transparent !important", },
// // //             "50%": { borderColor: "#3b82f6 !important" }, // Tailwind's blue-500
// // //           },
// // //         },
// // //         animation: {
// // //           "pulse-border": "pulse-border 1.5s ease-in-out infinite",
// // //         },
// // //       },
// // //     },
// // //     plugins: [require("tailwindcss-animate")],
// // //   };
// //   module.exports = {
// //     darkMode: 'class',
// //     content: [
// //       "./index.html",
// //       "./src/**/*.{js,ts,jsx,tsx}"
// //     ],
// //     theme: {
// //       extend: {
// //         keyframes: {
// //           glow: {
// //             '0%, 100%': { boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.6)' }, // blue-500
// //             '50%': { boxShadow: '0 0 0 8px rgba(59, 130, 246, 0)' },
// //           },
// //         },
// //         animation: {
// //           glow: 'glow 1.5s ease-in-out infinite',
// //         },
// //       },
// //     },
// //     [require("tailwindcss-animate")],
// //   };

// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   darkMode: 'class',
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}"
//   ],
//   theme: {
//     extend: {
//       keyframes: {
//         glow: {
//           "0%, 100%": {
//             boxShadow: "0 0 0 0 rgba(59, 130, 246, 0.6)",
//           },
//           "50%": {
//             boxShadow: "0 0 0 8px rgba(59, 130, 246, 0)",
//           },
//         },
//       },
//       animation: {
//         glow: "glow 1.5s ease-in-out infinite",
//       },
//     },
//   },
//   plugins: [],
// };


/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      keyframes: {
        glow: {
          "0%, 100%": {
            boxShadow: "0 0 0 0 rgba(59, 130, 246, 0.6)",
          },
          "50%": {
            boxShadow: "0 0 0 8px rgba(59, 130, 246, 0)",
          },
        },
        "pulse-border": {
          "0%, 100%": {
            borderColor: "rgba(59, 130, 246, 0.7)",
          },
          "50%": {
            borderColor: "rgba(59, 130, 246, 0.3)",
          },
        }
      },
      animation: {
        glow: "glow 1.5s ease-in-out infinite",
        "pulse-border": "pulse-border 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};