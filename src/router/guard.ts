import router from '@/router';
import { useUserStore } from '@/store/user';

router.beforeEach(async (to, from, next) => {
	const userStore = useUserStore();
	if (to.name === 'Home' && !userStore.isLoggedIn) {
		await router.replace('/');
	} else {
		next();
	}
});
