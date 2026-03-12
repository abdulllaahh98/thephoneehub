/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                navy: "#1A3A5C",
                orange: "#E84118",
            },
        },
    },
    plugins: [],
}
