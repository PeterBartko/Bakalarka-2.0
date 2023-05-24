import { createI18n } from 'vue-i18n';
import sk from './sk.json';
import en from './en.json';

export const i18n = createI18n({
	locale: 'sk',
	allowComposition: true,
	messages: { en, sk },
});
