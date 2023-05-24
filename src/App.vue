<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useUserStore } from '@/store/user';
import Footer from '@/components/Footer.vue';
import Navbar from '@/components/Navbar.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const userStore = useUserStore();

watch(() => userStore.isLoggedIn, isLogged => {
	if (isLogged) {
		router.push({ name: 'Home' });
	}
});

onMounted(() => {
	userStore.getUserInfo();

	if (localStorage.darkMode) {
		userStore.darkMode = localStorage.darkMode === 'true';
	}
});

const darkMode = computed(() => ({ dark: userStore.darkMode }));
</script>

<template>
	<main :class="darkMode">
		<Navbar />
		<router-view />
		<Footer />
	</main>
</template>
