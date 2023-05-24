import type { Component } from 'vue';
import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from '@/router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import '@/firebase';
import { i18n } from '@/lang';
import '@/router/guard';
import { createPinia } from 'pinia';

createApp(App as Component)
	.use(i18n)
	.use(router)
	.use(ElementPlus)
	.use(createPinia())
	.mount('#app');
