<script setup lang="ts">
import { useUserStore } from '@/store/user';
import SelectCity from '@/components/SelectCity.vue';
import Weather from '@/components/Weather.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { i18n } from '@/lang';
import { vOnClickOutside } from '@vueuse/components';

const userStore = useUserStore();
const router = useRouter();

const popup = ref(false);
const select = ref(false);

const dropdown = () => {
	popup.value = !popup.value;
};

const handleSelect = () => {
	select.value = true;
	popup.value = false;
};

const closeDropDown = () => {
	popup.value = false;
};

const handleSignOut = () => {
	userStore.signOut();
	popup.value = false;
	router.push('/login');
};

const changeLang = (lang: 'sk' | 'en') => {
	i18n.global.locale = lang;
};
</script>

<template>
	<div class="flex justify-between bg-white transition-colors dark:bg-dark dark:text-white shadow-md mb:px-5 px-2 items-center h-[50px]">
		<div class="flex items-center">
			<img :src="`/favicon.svg`" alt="sprinkler logo" class="h-[35px]">
			<h1 class="text-[1.5rem]">
				Sprinkler
			</h1>
		</div>

		<div class="flex items-center space-x-2">
			<router-link v-if="!userStore.isLoggedIn" to="/login" class="bg-green-500 w-fit transition-colors p-1 dark:bg-green-600 dark:hover:bg-green-700 hover:bg-green-400 flex items-center gap-2 text-white mb:!pl-3 mb:!pr-4 mb:!py-2 rounded-md">
				<img src="../assets/icons/login.svg" alt="">
				<p class="hidden mb:block">
					{{ $t('navbar.login') }}
				</p>
			</router-link>

			<Weather v-if="userStore.isLoggedIn" />

			<div v-on-click-outside="closeDropDown" class="relative">
				<div v-show="userStore.isLoggedIn" id="avatar" ref="avatar" class="profile cursor-pointer bg-avatar" @click="dropdown">
					{{ userStore.getInitials }}
				</div>

				<div v-show="popup" id="dropdown" class="w-[94vw] bg-gray-100 dark:bg-dark rounded-md shadow-sm absolute top-[44px] right-0 mb:w-[200px] z-10 origin-top-right animate-popup">
					<div class="flex py-2">
						<div class="w-1/5 mb:w-1/3 center">
							<div ref="DDavatar" class="profile h-[2.8rem] w-[2.8rem] mb:h-10 mb:w-10 bg-avatar">
								{{ userStore.getInitials }}
							</div>
						</div>
						<div class="w-2/3">
							<p class="text-left truncate font-bold">
								{{ userStore.userName }}
							</p>
							<p class="text-left truncate text-sm">
								{{ userStore.email }}
							</p>
						</div>
					</div>
					<hr class="bg-white h-1">
					<div>
						<div class="flex items-center w-full py-2 space-x-2 pl-[1.1rem]">
							<label class="switch scale-[.8]">
								<input ref="inp_dark" :checked="userStore.darkMode" type="checkbox" @input="userStore.toggleDarkMode()">
								<span class="slider round" />
							</label>
							<p>{{ $t('navbar.darkmode') }}</p>
						</div>

						<el-dropdown trigger="click" class="w-full">
							<span class="!w-full flex item-center gap-2.5 py-2 pl-[1.4rem] text-black dark:text-white text-base hover:rounded-md hover:bg-green-200 dark:hover:bg-green-900">
								<img src="@/assets/icons/lang.png" alt="lang-change" class="invert h-[20px]">
								{{ $t('navbar.langChange') }}
							</span>
							<template #dropdown>
								<el-dropdown-menu class="!w-full">
									<el-dropdown-item class="w-full" @click="changeLang('sk')">
										<img src="@/assets/icons/sk.png" width="24" height="24" alt="lang-change" class="mr-2">
										<span>{{ $t('navbar.sk') }}</span>
									</el-dropdown-item>
									<el-dropdown-item class="w-full" @click="changeLang('en')">
										<img src="@/assets/icons/en.png" width="24" height="24" alt="lang-change" class="mr-2">
										<span>{{ $t('navbar.en') }}</span>
									</el-dropdown-item>
								</el-dropdown-menu>
							</template>
						</el-dropdown>
						<button class="flex items-center w-full py-2 hover:rounded-md hover:bg-green-200 space-x-2 pl-[1.3rem] dark:hover:bg-green-900" @click="handleSelect">
							<img src="@/assets/icons/settings.svg" alt="settings" class="dark:invert">
							<span>
								{{ $t('navbar.settings') }}
							</span>
						</button>
						<button class="flex items-center w-full py-2 hover:rounded-md hover:bg-green-200 dark:hover:bg-green-900 space-x-2 pl-[1.3rem]" @click="handleSignOut">
							<img src="@/assets/icons/signout.svg" alt="signout" class="dark:invert">
							<span>{{ $t('navbar.signout') }}</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	<SelectCity v-if="select" @close="select = false" />
</template>

<style>
.bg-avatar {
  @apply bg-[linear-gradient(303deg,_rgb(51,_240,_135),_rgb(125,_119,_249))];
}
</style>
