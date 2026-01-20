/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Futurepedia 밝은 테마 팔레트
                'hero-blue': '#5E7CE2',
                'hero-blue-dark': '#4A6BC7',
                'light-bg': '#F5F7FA',
                'white-surface': '#FFFFFF',
                'light-border': '#E5E7EB',
                'light-text': '#374151',
                'light-text-secondary': '#6B7280',

                primary: {
                    DEFAULT: '#5E7CE2',
                    hover: '#4A6BC7',
                    light: '#93A9FF',
                },

                success: '#10B981',
                warning: '#F59E0B',
                danger: '#EF4444',

                // 기존 호환성 유지
                navy: {
                    950: '#0F1117',
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
        },
    },
    plugins: [],
}
