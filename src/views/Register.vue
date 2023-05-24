<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/user';

const userStore = useUserStore();

const router = useRouter();

const credentials = reactive({
	username: '',
	email: '',
	password: '',
});

const createAccount = async () => {
	try {
		await userStore.register(credentials);
		await router.push({ name: 'Home' });
	} catch (e) {
		console.error(e);
	}
};

const googleSignIn = async () => {
	await userStore.signInWithGoogle();
	await router.push({ name: 'Home' });
};
</script>

<template>
	<div class="dark:bg-[#1f1f1f] dark:shadow-top flex flex-col pt-32 items-center h-[calc(100vh-50px)]">
		<h3 class="font-bold text-[3rem] mb:text-[4rem] bg-clip-text text-transparent bg-gradient-to-r dark:from-green-500 dark:to-green-300 from-green-500 to-green-400">
			{{ $t('register.register') }}
		</h3>
		<p class="text-zinc-400 dark:text-zinc-300 mb-14 text-lg">
			{{ $t('register.alreadyAccount') }}
			<router-link to="/login" class="dark:hover:text-green-200 hover:text-green-400 underline decoration-green-600">
				{{ $t('navbar.login') }}
			</router-link>
		</p>
		<form class="w-full p-2 mb:w-96">
			<div class="relative mb-8">
				<label for="username" class="label">{{ $t('register.name') }}</label>
				<img src="@/assets/icons/profile.svg" alt="username icon" class="absolute top-4 left-2">
				<input id="username" v-model="credentials.username" type="text" :placeholder="$t('register.enterName')" class="input">
			</div>
			<div class="relative mb-8">
				<label for="email" class="label">Email</label>
				<img src="@/assets/icons/email.svg" alt="email icon" class="absolute top-4 left-2">
				<input id="email" v-model="credentials.email" type="email" :placeholder="$t('register.enterEmail')" class="input">
			</div>
			<div class="relative">
				<label for="password" class="label">{{ $t('login.password') }}</label>
				<img src="@/assets/icons/lock.svg" alt="lock icon" class="absolute top-4 left-2">
				<input id="password" v-model="credentials.password" type="password" autocomplete="current-password" :placeholder="$t('register.enterPassword')" class="input">
			</div>
		</form>
		<div class="h-20 w-full gap-2 flex justify-center items-end">
			<button class="btn uppercase h-[44px]" @click="createAccount">
				{{ $t('about.createAccount') }}
			</button>
			<button class="flex items-center gap-1 rounded-md bg-white p-2" @click="googleSignIn">
				<img src="@/assets/icons/google.svg" alt="google icon" class="w-7">
				<span>{{ $t('register.signViaGoogle') }}</span>
			</button>
		</div>
	</div>
</template>

