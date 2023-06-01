<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useUserStore, Zone } from '@/store/user';
import Sprinkler from '@/components/Sprinkler.vue';
import { i18n } from '@/lang';

const { t } = i18n.global;

const emit = defineEmits(['toggleNew']);

const userStore = useUserStore();

const newZone = reactive<Zone>({
	id: Math.random().toString(36).slice(2),
	nazov: t('zone.name'),
	sprinklers: [],
	last_started: 0,
	cas: { od: '', do: '' },
	days: [
		false,
		false,
		false,
		false,
		false,
		false,
		false,
	],
});

const close = () => {
	emit('toggleNew');
	newZone.sprinklers = [];
	newZone.nazov = t('zone.name');
};

const err = ref('');

const newSprinkler = reactive({
	nazov: '',
});

const add = () => {
	if (newZone.nazov && newZone.sprinklers.length) {
		userStore.zones.push(newZone);
		emit('toggleNew');
		userStore.saveToDB('data');
	} else {
		err.value = t('zone.err1');
	}
};

const addNewSprinkler = () => {
	if (newSprinkler.nazov) {
		newZone.sprinklers.push({
			nazov: newSprinkler.nazov,
			id: Math.random().toString(36).slice(2),
		});

		newSprinkler.nazov = '';
	} else {
		err.value = t('zone.err2');
	}
};

</script>

<template>
	<div class="bg-white dark:bg-dark_a mx-2 mb:w-[23rem] h-[17rem] rounded-md overflow-hidden shadow-md dark:shadow-[#111] dark:text-white relative">
		<div class="px-2 flex items-center">
			<img src="@/assets/icons/edit.svg" alt="" class="dark:invert mt-2">
			<input v-model="newZone.nazov" type="text" class="bg-transparent ml-1 mt-2 dark:placeholder:text-white text-2xl font-bold focus:ring-0 w-full py-0">
		</div>

		<section class="p-1">
			<div class="overflow-y-scroll max-h-28 scroll">
				<Sprinkler
					v-for="{ nazov, id } in newZone.sprinklers"
					:key="id"
					:data="{ nazov, id }"
				/>
			</div>
			<div class="bg-zinc-100 dark:bg-[#292929] mt-1 flex items-center py-1 text-2xl rounded-[.275rem] overflow-hidden select-none cursor-pointer leading-4">
				<div class="flex flex-col xs:flex-row w-full gap-2 px-1 dark:text-black">
					<input v-model="newSprinkler.nazov" type="text" placeholder="Názov" class="h-6 indent-2 w-full xs:w-[125%] text-sm rounded-[.175rem]">
					<!--					<div class="flex gap-2">-->
					<!--						<p class="xs:hidden leading-6 dark:text-white text-[1rem]">-->
					<!--							IP:-->
					<!--						</p>-->
					<!--						<InputIP :clear="pass" @ip="validateIP" />-->
					<button class="btn text-[1rem] py-0 h-[24px] rounded-[.175rem] px-2" @click="addNewSprinkler">
						{{ $t('zone.add') }}
					</button>
					<!--					</div>-->
				</div>
			</div>
		</section>

		<p class="mt-1 ml-2 text-red-600">
			{{ err }}
		</p>

		<div class="flex gap-2 px-1 absolute bottom-1">
			<button class="btn p-1 px-3" @click="add">
				{{ $t('zone.add') }}
			</button>
			<button class="btn red p-1 px-3" @click="close">
				{{ $t('zone.cancel') }}
			</button>
		</div>
	</div>
</template>
