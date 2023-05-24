import { createRouter, createWebHistory } from 'vue-router';
export default createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			name: 'About',
			component: async () => import('@/views/About.vue'),
		},
		{
			path: '/home',
			name: 'Home',
			component: async () => import('@/views/Home.vue'),
		},
		{
			path: '/register',
			name: 'Register',
			component: async () => import('@/views/Register.vue'),
		},
		{
			path: '/login',
			name: 'Login',
			component: async () => import('@/views/Login.vue'),
		},
		{
			path: '/forgotpassword',
			name: 'Forgot',
			component: async () => import('@/views/Forgot.vue'),
		},
	],
});

