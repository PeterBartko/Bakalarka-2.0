<script setup lang="ts">
import { computed, onMounted, PropType, ref } from 'vue';
import Options from '@/components/zones/Options.vue';
import Timer from '@/components/zones/Timer.vue';
import moment from 'moment-with-locales-es6';
import { useUserStore, Zone } from '@/store/user';
import { i18n } from '@/lang';

const props = defineProps({
	zone: {
		type: Object as PropType<Zone>,
		required: true,
	},
});

const { t } = i18n.global;

const bg = ref();
const showOptions = ref(false);
const showCasovac = ref(false);
const showBtn = ref(false);
const show_inp = ref(false);
const mins = ref();
const dis = ref();
const secs = ref();
const interval = ref();
const url = ref(props.zone.photo);

const options = () => {
	if (!showOptions.value) {
		show_inp.value = false;
		showOptions.value = true;
	}
};

const userStore = useUserStore();

const spustenie = () => {
	if (!mins.value) {
		return;
	}

	userStore.zones = userStore.zones.map(z => z.id === props.zone.id ? ({ ...z, last_started: Date.now() }) : z);
	console.log(userStore.zones);
	userStore.saveToDB('data');

	showBtn.value = true;
	secs.value = mins.value * 60;
	time_print();
	secs.value--;
	interval.value = setInterval(() => {
		if (secs.value === mins.value * 60) {
			secs.value--;
		}

		time_print();
		if (secs.value === 0) {
			zastavenie();
		}

		secs.value--;
	}, 1000);
};

const time_print = () => {
	let min = Math.floor(secs.value / 60);
	const sec = Math.floor(((secs.value / 60) * 60) % 60);
	if (min < 10 && min > 0) {
		min = '0' + min;
	} else if (min === 0) {
		min = '';
	}

	dis.value = `${min}${min === 0 ? '' : ':'}${sec < 10 ? '0' + sec : sec}`;
};

const zastavenie = () => {
	showBtn.value = false;
	dis.value = '';
	clearInterval(interval.value);
};

const tmpURL = tmpurl => {
	url.value = tmpurl;
	if (!url.value) {
		setTimeout(() => {
			bg.value.style.background = randGBG();
		}, 50);
	}
};

const randGBG = () => {
	const randRange = (max: number, min: number) => Math.floor(Math.random() * (max - min + 1)) + min;
	return `linear-gradient(0deg, transparent 0%, hsl(${randRange(111, 128)},${randRange(40, 70)}%,${randRange(30, 60)}%) 60%)`;
};

onMounted(() => {
	if (!props.zone.photo) {
		bg.value.style.background = randGBG();
	}
});

const lastStarted = computed(() => props?.zone?.last_started > 0 ? moment(props?.zone?.last_started).locale(i18n.global.locale).fromNow() : t('zone.never'));
</script>

<template>
	<div class="px-2 transition-colors">
		<div class="bg-white dark:bg-dark_a w-full mb:w-[23rem] h-[17rem] rounded-md overflow-hidden shadow-md dark:shadow-[#111] dark:text-white relative">
			<div v-show="!showOptions && !showCasovac" class="w-full h-[60%]">
				<img v-if="url" :src="url" alt="" class="w-full h-[60%] object-cover absolute">
				<div v-else ref="bg" class="w-full h-full" />
				<div class="bg-zone dark:bg-zone-dark w-full h-full mix-blend-screen dark:mix-blend-darken" />
			</div>
			<header>
				<button v-show="!showOptions && !showCasovac" class="absolute top-1 right-1" @click="options">
					<img src="@/assets/icons/options.svg" alt="">
				</button>
			</header>
			<h2 v-show="!showOptions" class="font-bold mt-2 ml-1 text-2xl">
				{{ zone.nazov }}
			</h2>

			<Timer v-if="showCasovac" :zone="zone" @toggle-cas="showCasovac = false" />
			<Options v-if="showOptions" :zone="zone" @toggle-opt="showOptions = false" @tmpURL="tmpURL" />

			<span v-show="!showOptions && !showCasovac" class="pl-1 font-bold">
				{{ $t('zone.last') }} {{ lastStarted }}
			</span>

			<footer v-show="!showOptions && !showCasovac" class="flex items-center absolute bottom-[5px] px-[5px] w-full">
				<button v-show="!showBtn" class="btn py-1 px-2" @click="spustenie">
					{{ $t('zone.start') }}
				</button>
				<button v-show="showBtn" class="btn dark:bg-red-700 dark:hover:bg-red-600 bg-red-600 hover:bg-red-500 py-1 px-2" @click="zastavenie">
					{{ $t('zone.stop') }}
				</button>
				<input v-show="!showBtn" v-model="mins" type="number" min="1" max="180" class="border-2 border-solid dark:bg-dark_a dark:border-green-600 border-green-500 ml-2 indent-1 w-14 h-8 rounded-md">
				<p class="mx-2">
					{{ dis }}
				</p>
				<label for="cas">min</label>
				<button class="ml-auto btn bg-cyan-400 hover:bg-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 py-1 px-2" @click="showCasovac = !showCasovac">
					{{ $t('zone.scheduler') }}
				</button>
			</footer>
		</div>
	</div>
</template>
