<script setup lang="ts">
import { useUserStore } from '@/store/user';
import { ref } from 'vue';
import { cities } from '@/cities';
import { i18n } from '@/lang';

const { t } = i18n.global;

const userStore = useUserStore();
defineEmits(['close']);

const name_msg = ref('');
const username = ref('');
const picked = ref(userStore.city);
const save_name = () => {
	if (username.value) {
		userStore.saveToDB('users', { username: username.value });
		name_msg.value = t('selectCity.msg');
	}
};
</script>

<template>
	<div class="fixed inset-0 z-20 backdrop-blur-sm bg-black/50 grid place-items-center" @click.self="$emit('close')">
		<div class="w-[21rem] p-5 bg-white dark:bg-zinc-800 rounded-md relative">
			<label for="meno" class="dark:text-white text-center font-bold">{{ $t('selectCity.newName') }}</label>
			<div class="flex items-center gap-2 ">
				<input id="meno" v-model="username" type="text" :placeholder="userStore.userName" class="w-full indent-2 rounded-[3px] border border-siva border-solid focus:outline-main">
				<button class="bg-green-500 w-fit transition-colors dark:bg-green-600 dark:hover:bg-green-700 hover:bg-green-400 text-white rounded-[3px] h-[26px] px-2" @click="save_name">
					{{ $t('zone.save') }}
				</button>
			</div>
			<p class="text-white my-1">
				{{ name_msg }}
			</p>
			<img src="../assets/icons/close.svg" alt="close" class="absolute top-1 right-1 cursor-pointer hover:bg-zinc-400/80 rounded" @click="$emit('close')">
			<p class="dark:text-white text-center font-bold text-2xl">
				{{ $t('selectCity.chooseCity') }}
			</p>
			<p class="dark:text-white font-bold">
				{{ $t('selectCity.whereIrrigation') }}
			</p>
			<p class="dark:text-zinc-400 mb-3 font-bold">
				<span class="dark:text-white">{{ $t('selectCity.selected') }}</span> {{ picked }}
			</p>

			<el-select
				v-model="picked"
				class="w-full mx-auto"
				filterable
				default-first-option
				:placeholder="$t('selectCity.city')"
			>
				<el-option
					v-for="city in cities"
					:key="city"
					:label="city"
					:value="city"
				/>
			</el-select>
		</div>
	</div>
</template>
