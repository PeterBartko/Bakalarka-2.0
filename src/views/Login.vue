<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/user';

const router = useRouter();

const userStore = useUserStore();

const credentials = reactive({
	email: '',
	password: '',
});

const errorMsg = ref('');
const login = async () => {
	try {
		await userStore.login(credentials);
		await router.push({ name: 'Home' });
	} catch (e) {
		console.error(e);
		errorMsg.value = e.message;
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
			{{ $t('login.login') }}
		</h3>
		<p class="text-zinc-400 dark:text-zinc-300 mb-14 text-lg">
			{{ $t('login.noAccount') }}
			<router-link to="/register" class="dark:hover:text-green-200 hover:text-green-400 underline decoration-green-600">
				{{ $t('login.register') }}
			</router-link>
		</p>
		<form class="w-full p-2 mb:w-96">
			<div class="relative mb-8 text-green-200">
				<label for="email" class="label">Email</label>
				<img src="../assets/icons/email.svg" alt="email icon" class="absolute top-4 left-2">
				<input id="email" v-model="credentials.email" type="email" :placeholder="$t('register.enterEmail')" class="input">
			</div>
			<div class="relative text-green-200">
				<label for="password" class="label">{{ $t('login.password') }}</label>
				<img src="@/assets/icons/lock.svg" alt="lock icon" class="absolute top-4 left-2">
				<input id="password" v-model="credentials.password" type="password" autocomplete="current-password" :placeholder="$t('register.enterPassword')" class="input">
			</div>
			<p class="text-red-500 text-center">
				{{ errorMsg }}
			</p>
			<div class="h-20 w-full flex justify-center items-end relative">
				<div class="flex gap-2">
					<button class="btn uppercase" @click.prevent="login">
						{{ $t('navbar.login') }}
					</button>
					<button class="flex items-center gap-1 rounded-md bg-white p-2" @click.prevent="googleSignIn">
						<img src="../assets/icons/google.svg" alt="google icon" class="w-7">
						<p>{{ $t('login.logViaGoogle') }}</p>
					</button>
				</div>
				<router-link to="/forgotpassword" class="absolute top-0 right-0 text-zinc-500 mt-1">
					{{ $t('login.forgotPassword') }}
				</router-link>
			</div>
		</form>
	</div>
</template>

