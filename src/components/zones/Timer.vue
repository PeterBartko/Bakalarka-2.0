<script setup lang="ts">
import { PropType, reactive, ref } from 'vue';
import { useUserStore, Zone } from '@/store/user';
import { i18n } from '@/lang';

const { t } = i18n.global;

const emit = defineEmits(['toggleCas']);
const props = defineProps({
	zone: {
		type: Object as PropType<Zone>,
		required: true,
	},
});

const userStore = useUserStore();

const days = reactive([...props.zone.days]);
const cas = reactive({
	od: props.zone.cas.od,
	do: props.zone.cas.do,
});

const ps = ref([t('zone.days.mo'), t('zone.days.tu'), t('zone.days.we'), t('zone.days.th'), t('zone.days.fr'), t('zone.days.sa'), t('zone.days.su')]);
const err = ref('');

const check = (i: number) => {
	days[i] = !days[i];
};

const casovac_save = () => {
	const str = cas.od === '' || cas.do === '';
	if (str) {
		err.value = `Chýba ${str ? 'jeden čas' : ''}`;
		return;
	}

	if ((cas.od === '' || cas.do === '') || cas.od > cas.do) {
		const str = cas.od === '' || cas.do === '';
		const	viac = cas.od > cas.do;
		err.value = `${str ? 'Chýba jeden čas' : ''}
        ${str && viac ? 'a' : ''}
        ${viac ? 'do musí byť viac ako od' : ''}
        `;
		return;
	}

	emit('toggleCas', false);
	const zone = { ...props.zone };
	zone.days = days;
	zone.cas = cas;

	userStore.zones = userStore.zones.map(z => z.id === props.zone.id ? zone : z);
	userStore.saveToDB('data');
};
</script>

<template>
	<section class="p-2">
		<ul class="flex items-center w-full justify-between">
			<li v-for="(day, i) in days" :key="day" class="w-10 h-10 relative">
				<input type="checkbox" class="checkbox" :class="{checked: day}" @change="check(i)">
				<p class="absolute top-[7.8px] left-[10.7px] select-none pointer-events-none">
					{{ ps[i] }}
				</p>
			</li>
		</ul>

		<div class="mt-5 flex justify-around">
			<div class="text-center">
				<p>{{ $t('zone.from') }}</p>
				<input v-model="cas.od" type="time" class="rounded bg-zinc-200 dark:bg-zinc-600 dark:text-white">
			</div>
			<div class="text-center">
				<p>{{ $t('zone.to') }}</p>
				<input v-model="cas.do" type="time" class="rounded bg-zinc-200 dark:bg-zinc-600 dark:text-white">
			</div>
		</div>
	</section>

	<p class="mt-1 ml-2 text-red-600">
		{{ err }}
	</p>

	<footer class="flex items-center space-x-2 absolute bottom-[5px] px-[5px] w-full">
		<button class="btn py-1 px-2" @click="casovac_save">
			{{ $t('zone.save') }}
		</button>
		<button class="btn py-1 px-2 red" @click="emit('toggleCas')">
			{{ $t('zone.cancel') }}
		</button>
	</footer>
</template>
