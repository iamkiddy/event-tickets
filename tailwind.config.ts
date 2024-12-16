import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			primaryColor: '#4f46e5',
  			secondaryColor: '#db2777'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
		keyframes: {
			"caret-blink": {
				"0%,70%,100%": { opacity: "1" },
				"20%,50%": { opacity: "0" },
			},
      "shimmer": {
        "100%": {
          "transform": "translateX(100%)",
        },
      },
		},
		animation: {
			"caret-blink": "caret-blink 1.25s ease-out infinite",
		},
  	}
  },
  plugins: [require("tailwindcss-animate"), require('@tailwindcss/typography')],	
} satisfies Config;
