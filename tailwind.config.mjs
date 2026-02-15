/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // High Contrast Standard Palette
                "primary": "#2563eb",   // Blue 600 - Standard Button/Link color
                "primary-dark": "#1d4ed8", // Blue 700 - Hover
                "secondary": "#f8fafc", // Slate 50 - Page Background
                "surface": "#ffffff",   // White - Card/Modal Background

                // Text Colors - HIGH CONTRAST
                "text-main": "#0f172a", // Slate 900 - Nearly Black
                "text-muted": "#475569", // Slate 600 - Dark Grey
                "text-inverse": "#ffffff", // White text on colored backgrounds

                // Sidebar
                "sidebar-bg": "#0f172a", // Slate 900 - Very Dark
                "sidebar-text": "#f1f5f9", // Slate 100 - Very Light
                "sidebar-hover": "#1e293b", // Slate 800

                // Borders
                "border-color": "#cbd5e1", // Slate 300 - Visible Borders
            },
            fontFamily: {
                "display": ["Inter", "sans-serif"]
            }
        },
    },
    plugins: [],
}
