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
                // Premium Dark Theme Colors
                dark: {
                    'bg': '#000000',           // True black background
                    'surface': '#0a0a0a',      // Slightly lighter for main content areas
                    'card': '#111111',         // Cards - subtle lift from background
                    'card-hover': '#171717',   // Card hover state
                    'elevated': '#1a1a1a',     // Elevated elements like modals
                    'border': '#262626',       // Subtle borders
                    'border-hover': '#3f3f3f', // Border on hover
                    'muted': '#525252',        // Muted text
                    'text': '#fafafa',         // Primary text
                    'text-secondary': '#a3a3a3' // Secondary text
                },
                // Premium Card Gradients
                'card-red': { DEFAULT: '#ef4444', dark: '#dc2626' },
                'card-teal': { DEFAULT: '#14b8a6', dark: '#0d9488' },
                'card-orange': { DEFAULT: '#f97316', dark: '#ea580c' },
                'card-purple': { DEFAULT: '#8b5cf6', dark: '#7c3aed' },
                'card-blue': { DEFAULT: '#3b82f6', dark: '#2563eb' },
            },
            // Dark theme shadows
            boxShadow: {
                'dark-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
                'dark-md': '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.5)',
                'dark-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -4px rgba(0, 0, 0, 0.5)',
                'dark-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.7), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
                'dark-glow': '0 0 20px rgba(20, 184, 166, 0.15)', // Subtle primary glow
            }
        },
    },
    plugins: [],
}
