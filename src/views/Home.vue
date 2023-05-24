<script setup lang="ts">
import { computed, ref } from 'vue';
import { useUserStore } from '@/store/user';
import Footer from '@/components/Footer.vue';
import New from '@/components/zones/New.vue';
import Zone from '@/components/zones/Zone.vue';

const userStore = useUserStore();

const showAdd = ref(false);

const empty = computed(() => !userStore.zones.length && !showAdd.value);
</script>

<template>
	<div class="w-full flex justify-end dark:bg-[#1f1f1f] dark:shadow-top">
		<button class="btn my-4 ml-auto mr-5" @click="showAdd = !showAdd">
			{{ $t('home.addZone') }}
		</button>
	</div>
	<div class="dark:bg-[#1f1f1f] h-[calc(100vh-122px)] relative w-full overflow-x-hidden mb:px-8 overflow-y-scroll hide-scroll justify-items-center justify-between gap-[4rem] flex flex-col mb:grid mb:grid-cols-af">
		<div v-if="empty" />
		<div v-if="empty" class="text-[2.3rem] w-[95%] ft:text-[3vw] font-bold text-zinc-200 dark:text-[#0f0f0f] absolute top-1/3 right-1/2 translate-x-1/2 -translate-y-1/2 text-center cursor-pointer" @click="showAdd = !showAdd">
			<p>{{ $t('home.noZone') }}</p>
			<p class="underline underline-offset-4 decoration-zinc-100 dark:decoration-[#141414]">
				{{ $t('home.addZone') }}
			</p>
		</div>
		<New v-if="showAdd" @toggle-new="showAdd = false" />
		<Zone
			v-for="(zone, i) in userStore.zones"
			:key="i"
			:zone="zone"
		/>
		<Footer />
	</div>
</template>
