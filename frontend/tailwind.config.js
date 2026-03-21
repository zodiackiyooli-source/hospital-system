/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#2563EB',
                    light: '#eff6ff',
                    dark: '#1d4ed8',
                },
                secondary: {
                    DEFAULT: '#14B8A6',
                    light: '#f0fdfa',
                    dark: '#0f766e',
                },
                success: '#22C55E',
                warning: '#F59E0B',
                danger: '#EF4444',
                surface: '#ffffff',
                background: '#F8FAFC',
            },

            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
