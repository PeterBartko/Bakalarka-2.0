<script setup lang="ts">
import { PropType, ref } from 'vue';
import { useLightsStore } from '@/store/lights';
import { Zone, useUserStore } from '@/store/user';

const emit = defineEmits(['updateSprinkler']);

const props = defineProps({
	data: {
		type: Object as PropType<Zone['sprinklers'][0]>,
		required: true,
	},
	zoneId: {
		type: String,
		default: null,
	},
});

const lightStore = useLightsStore();
const userStore = useUserStore();

const show_update = ref(false);
const newNazov = ref(props.data.nazov);

const cancel = () => {
	show_update.value = false;
	newNazov.value = props.data.nazov;
};

const remove = () => {
	userStore.zones = userStore.zones.map(z => z.id === props.zoneId ? ({ ...z, sprinklers: z.sprinklers.filter(s => s.id !== props.data?.id) }) : z);
	userStore.saveToDB('data');
	emit('updateSprinkler', { id: props.data?.id, nazov: '' }, true);
};

const update = () => {
	userStore.zones = userStore.zones.map(z => z.id === props.zoneId ? ({ ...z, sprinklers: z.sprinklers.map(s => s.id === props.data?.id ? ({ ...s, nazov: newNazov.value }) : s) }) : z);
	emit('updateSprinkler', { id: props.data?.id, nazov: newNazov.value }, false);
	show_update.value = false;
	userStore.saveToDB('data');
};

const handleLight = async () => {
	await fetch(`http://localhost/php-server?lights=${lightStore.getQuery}`);
};
</script>

<template>
	<div class="flex flex-col mr-1">
		<section v-show="!show_update" class="bg-zinc-100 dark:bg-[#292929] text-black dark:text-white shadow flex mb-2 items-center justify-between mb:h-8 px-1 rounded-[0.275rem]">
			<label class="switch scale-[.8] mr-2">
				<input ref="inp_dark" v-model="lightStore[props.data.id]" type="checkbox" @change="handleLight">
				<span class="slider round" />
			</label>
			<div class="flex flex-col mb:flex-row ml-2 mb:ml-0 w-full pl-1">
				<h3 class="truncate w-[233px] gap-2 mr-3">
					{{ data.nazov }}
				</h3>
				<!--				<h3 class="flex items-center w-[150px] gap-2">-->
				<!--					<p class="font-bold">-->
				<!--						IP:-->
				<!--					</p> {{ data.ip }}-->
				<!--				</h3>-->
			</div>
			<button v-show="zoneId" @click="show_update = !show_update">
				<img src="@/assets/icons/options.svg" alt="nastavenia" class="invert dark:invert-0">
			</button>
		</section>
		<section v-show="show_update" class="w-full mb-2 rounded-md flex flex-col bg-zinc-100 dark:bg-[#292929]">
			<div class="flex flex-col w-full p-1 xs:p-0 xs:w-[unset] xs:flex-row gap-2 m-1">
				<label for="newNazov">{{ $t('zone.name') }}</label>
				<input id="newNazov" v-model="newNazov" type="text" :placeholder="data.nazov" class="!w-full indent-2 dark:text-black rounded">
				<!--				<div class="flex gap-2">-->
				<!--					<p class="xs:hidden leading-6 dark:text-white text-[1rem]">-->
				<!--						IP:-->
				<!--					</p>-->
				<!--					<InputIP :o-gip="data.ip" @ip="validateIP" />-->
				<!--				</div>-->
			</div>
			<div class="w-full flex justify-between gap-1 p-1">
				<button class="btn p-1 px-2" @click="update">
					{{ $t('zone.save') }}
				</button>
				<button class="btn p-1 dark:bg-red-700 dark:hover:bg-red-600 bg-red-600 hover:bg-red-500" @click="cancel">
					{{ $t('zone.cancel') }}
				</button>
				<el-popconfirm :title="`${$t('zone.delete')} ${data.nazov} ?`" @confirm="remove">
					<template #reference>
						<button class="btn p-1 dark:bg-red-700 dark:hover:bg-red-600 bg-red-600 hover:bg-red-500 ml-auto">
							{{ $t('zone.delete') }}
						</button>
					</template>
				</el-popconfirm>
			</div>
		</section>
	</div>
</template>
