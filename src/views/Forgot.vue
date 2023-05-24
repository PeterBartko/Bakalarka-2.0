<template>
	<div class="dark:bg-[#1f1f1f] dark:shadow-top flex flex-col pt-32 items-center h-[calc(100vh-50px)]">
		<h3 class="font-bold text-[3rem] sm:text-[4rem] bg-clip-text text-transparent bg-gradient-to-r dark:from-green-500 dark:to-green-300 from-green-500 to-green-400">
			{{ $t('login.forgotPassword') }}
		</h3>
		<p class="text-zinc-400 dark:text-zinc-300 mb-14 text-lg">
			{{ $t('forgot.enterEmailOr') }}
			<router-link to="/login" class="dark:hover:text-green-200 hover:text-green-400 underline decoration-green-600">
				{{ $t('forgot.login') }}
			</router-link>
		</p>
		<form class="w-full p-2 mb:w-96">
			<div class="relative mb-8">
				<label for="email" class="label">Email</label>
				<img src="@/assets/icons/email.svg" alt="email icon" class="absolute top-4 left-2">
				<input id="email" v-model="email" type="email" :placeholder="$t('forgot.enterEmail')" class="input">
			</div>
			<p class="-mt-4 h-4 mb-4 break-words text-yellow-400 dark:text-yellow-200">
				{{ msg }}
			</p>
			<div class="w-full flex justify-center">
				<button class="btn" @click.prevent="resetPassword">
					{{ $t('forgot.reset') }}
				</button>
			</div>
		</form>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { i18n } from '@/lang';

const { t } = i18n.global;

const email = ref('');
const msg = ref('');
const	resetPassword = () => {
	sendPasswordResetEmail(getAuth(), email.value).then(() => {
		msg.value = t('forgot.msg');
	}).catch(err => {
		msg.value = err;
	});
};
</script>
