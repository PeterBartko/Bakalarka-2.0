/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./index.html',
		'./src/**/*.{vue,js,ts,jsx,tsx}',
	],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				main: '#41e724',
				main_h: '#41e724b8',
				siva: '#ccc',
				dark: '#1b1b1b',
				dark_a: '#181818',
				main_d: '#52b23c',
			},
			animation: {
				fade: 'appear .15s',
				popup: 'pop .15s ease-in',
			},
			keyframes: {
				appear: {
					'0%': {
						transform: 'scale(.9)',
						opacity: 0.7,
					},
					'100%': {
						transform: 'scale(1.1)',
						opacity: 1,
					},
				},
				pop: {
					'0%': {
						transform: 'scaleY(0) scaleX(0)',
						opacity: 0.4,
					},
					'100%': {
						transform: 'scaleY(1) scaleX(1)',
						opacity: 1,
					},
				},
			},
			gridTemplateColumns: {
				af: 'repeat(auto-fit, minmax(368px, 1fr))',
			},
			boxShadow: {
				top: 'inset 0 7px 9px -5px #00000080',
			},
			screens: {
				mb: '415px',
				xs: '385px',
				ft: '530px',
			},
		},
	},
	plugins: [],
};

