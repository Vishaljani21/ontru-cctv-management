/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Inter"', 'sans-serif'],
                heading: ['"Inter"', 'sans-serif'],
            },
            colors: {
                primary: {
                    '50': '#f0fdfa', '100': '#ccfbf1', '200': '#99f6e4', '300': '#5eead4', '400': '#2dd4bf', '500': '#14b8a6', '600': '#0d9488', '700': '#0f766e', '800': '#115e59', '900': '#134e4a', '950': '#042f2e'
                },
                slate: {
                    '850': '#1e293b' // Custom dark slate
                },
                // Premium Card Gradients
                'card-red': { DEFAULT: '#ef4444', dark: '#dc2626' },
                'card-teal': { DEFAULT: '#14b8a6', dark: '#0d9488' },
                'card-orange': { DEFAULT: '#f97316', dark: '#ea580c' },
                'card-purple': { DEFAULT: '#8b5cf6', dark: '#7c3aed' },
                'card-blue': { DEFAULT: '#3b82f6', dark: '#2563eb' },
            }
        },
    },
    plugins: [],
}
