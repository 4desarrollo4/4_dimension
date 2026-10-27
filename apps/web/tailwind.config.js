/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{js,jsx}',
		'./components/**/*.{js,jsx}',
		'./app/**/*.{js,jsx}',
		'./src/**/*.{js,jsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			/*
				Escala tipográfica subida el 2026-10-20 (ADR-015).

				La dirección se quejó de que el texto «se ve borroso o muy pequeño»
				y la auditoría lo confirmó: 43 elementos —el 75 % del texto— estaban
				a 14 px o menos.

				En vez de reescribir 63 clases por el código, se redefine la escala
				aquí y sube todo de golpe. Los nombres de clase no cambian:

				  text-xs    12 → 13px   (eyebrows en versalitas)
				  text-sm    14 → 16px   (tarjetas, listas, pies)
				  text-base  16 → 18px   (cuerpo)
				  text-lg    18 → 20px
				  text-xl    20 → 22px

				De text-2xl en adelante se deja la escala de Tailwind: los titulares
				ya eran grandes y no son el problema.
			*/
			fontSize: {
				'xs': ['0.8125rem', { lineHeight: '1.15rem' }],
				'sm': ['1rem', { lineHeight: '1.5rem' }],
				'base': ['1.125rem', { lineHeight: '1.75rem' }],
				'lg': ['1.25rem', { lineHeight: '1.85rem' }],
				'xl': ['1.375rem', { lineHeight: '1.95rem' }],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				sidebar: {
					'DEFAULT': 'hsl(var(--sidebar-background))',
					'foreground': 'hsl(var(--sidebar-foreground))',
					'primary': 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					'accent': 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					'border': 'hsl(var(--sidebar-border))',
					'ring': 'hsl(var(--sidebar-ring))',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0',
					},
					to: {
						height: 'var(--radix-accordion-content-height)',
					},
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)',
					},
					to: {
						height: '0',
					},
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
		},
	},
	plugins: [],
};
