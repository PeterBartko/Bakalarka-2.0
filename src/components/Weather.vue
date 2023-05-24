<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import { useUserStore } from '@/store/user';
import { vOnClickOutside } from '@vueuse/components';
import { i18n } from '@/lang';

const { t } = i18n.global;

const userStore = useUserStore();

const city = ref(userStore.city);
const svg = ref('');
const description = ref();
const forecast = ref([]);
const temp = ref();
const show = ref(false);

const word_map = reactive({
	Clear: t('weather.clear'),
	Clouds: t('weather.clouds'),
	Drizzle: t('weather.drizzle'),
	Fog: t('weather.fog'),
	Rain: t('weather.rain'),
	Snow: t('weather.snow'),
	Thunderstorm: t('weather.thunderstorm'),
});

watch(() => userStore.city, newCity => {
	city.value = newCity;
	fetchWeather();
});

const fetchWeather = async () => {
	if (userStore.city) {
		try {
			let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.value}&units=metric&appid=${import.meta.env.VITE_APP_WEATHER_KEY}`);
			const current = await res.json();

			const desc = current.weather[0].main;
			description.value = word_map[desc];
			temp.value = Math.round(current.main.temp * 10) / 10;
			svg.value = desc.toLowerCase() === 'mist' || desc.toLowerCase() === 'fog' ? 'fog' : desc.toLowerCase();

			const { lat, lon } = current.coord;
			res = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&appid=${import.meta.env.VITE_APP_WEATHER_KEY}`);
			const forecst = await res.json();
			forecast.value = forecst.daily.splice(1, 5).map(d => ({
				day: new Date(d.dt * 1000).toLocaleDateString('en', { weekday: 'long' }).toLowerCase().substring(0, 2),
				temp: Math.round(d.temp.day * 10) / 10,
				desc: d.weather[0].main,
				svg: d.weather[0].main.toLowerCase() === 'mist' || d.weather[0].main.toLowerCase() === 'fog' ? 'fog' : d.weather[0].main.toLowerCase(),
			}));
		} catch (err) {
			console.error(err);
		}
	}
};

const closeForecast = () => {
	show.value = false;
};

onMounted(() => fetchWeather());
</script>

<template>
	<div v-if="city" id="weather" v-on-click-outside="closeForecast" class="flex items-center flex-row-reverse gap-2 sm:flex-row cursor-pointer hover:bg-white/10 p-2 pr-0 rounded select-none" @click="show = !show">
		<div class="weather-wrap flex items-center">
			<p class="hidden sm:block">
				{{ description }}
			</p>
			<img class="h-[35px] w-[35px] dark:invert" :src="`./weather/${svg}.svg`" alt="">
		</div>
		<div class="weather-wrap flex items-center">
			<p>{{ temp }}°C</p>
			<img class="h-[35px] w-[35px] ml-[-6px] dark:invert hidden sm:block" :src="`./weather/therm.svg`" alt="thermometer">
		</div>

		<div v-show="show" id="forecast" class="dark:bg-dark bg-white gap-2 px-2 flex items-center z-10 rounded-b-md absolute left-1/2 -translate-x-1/2 top-[47px] sm:left-auto cursor-default">
			<div v-for="(d, i) in forecast" :key="i" class="w-1/5 h-full flex flex-col justify-between items-center py-3">
				<p class="font-bold text-green-600">
					{{ $t(`zone.days.${d.day}`) }}
				</p>
				<img class="h-[45px] w-[45px] dark:invert" :src="`./weather/${d.svg}.svg`" alt="">
				<p>{{ word_map[d.desc] }}</p>
				<p class="font-bold dark:text-yellow-100 text-yellow-500">
					{{ d.temp }}°C
				</p>
			</div>
		</div>
	</div>
</template>
