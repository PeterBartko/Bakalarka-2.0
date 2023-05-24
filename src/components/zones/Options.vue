<script setup lang="ts">
import Sprinkler from '@/components/Sprinkler.vue';
import { reactive, ref } from 'vue';
import { useUserStore } from '@/store/user';

const emit = defineEmits(['toggleOpt', 'tmpURL']);

const props = defineProps({
	zone: {
		type: Object,
		required: true,
	},
});

const userStore = useUserStore();

const inp = ref();
const options = reactive({
	show_inp: false,
	sprinklers: [...props.zone.sprinklers],
	add_nazov: '',
	nzv: props.zone.nazov,
	i_nzv: props.zone.nazov,
	input: false,
	img: undefined,
	uploaded: false,
	file_name: '',
	err: '',
	clear: 0,
});

const photo = e => {
	options.img = e.target.files[0];
	options.file_name = e.target.files[0].name;
	options.uploaded = true;
};

const options_save = () => {
	const zone = { ...props.zone };
	if (options.uploaded) {
		userStore.saveImage(options.img, props.zone.id);
		options.uploaded = false;
		zone.img_name = options.img.name + props.zone.id;
	}

	zone.nazov = options.i_nzv;
	zone.sprinklers = options.sprinklers;
	userStore.zones = userStore.zones.map(z => z.id === props.zone.id ? ({ ...z, ...zone }) : z);
	if (options.img) {
		emit('tmpURL', URL.createObjectURL(options.img));
	}

	userStore.saveToDB('data');
	options_cacnel(true);
};

const options_cacnel = (saved: boolean) => {
	if (!saved) {
		saved = false;
	}

	emit('toggleOpt');
	options.i_nzv = '';
	if (!saved) {
		options.nzv = props.zone.nazov;
		options.sprinklers = [...props.zone.sprinklers];
	}

	options.add_nazov = '';
};

const toggle_h2 = () => {
	options.input = true;
	setTimeout(() => inp.value.focus(), 20);
};

const toggle_inp = () => {
	options.input = false;
	options.nzv = options.i_nzv;
};

const updateSprinkler = ({ id, nazov }: Record<string, string>, remove: boolean) => {
	if (remove) {
		options.sprinklers = options.sprinklers.filter(s => s.id !== id);
	} else {
		options.sprinklers = options.sprinklers.map(s => s.id === id ? ({ ...s, nazov }) : s);
	}

	console.log(options.sprinklers);
};

const add_new_sprinkler = () => {
	if (options.add_nazov === '') {
		const n = options.add_nazov === '';
		options.err = `Chýba ${n ? 'názov' : ''}`;
		return;
	}

	options.sprinklers.push({
		id: Math.random().toString(36).slice(2),
		nazov: options.add_nazov,
	});
	options.add_nazov = '';
	options.err = '';
	options.clear = new Date().getTime();
	options.show_inp = !options.show_inp;
};

const delete_photo = () => {
	userStore.deleteImage(props.zone.img_name);
	const zone = { ...props.zone };
	zone.photo = '';
	userStore.zones = userStore.zones.map(z => z.id === props.zone.id ? ({ ...z, photo: '' }) : z);
	userStore.saveToDB('data');
	emit('tmpURL', null);
	emit('toggleOpt');
};

const delete_zone = () => {
	userStore.zones = userStore.zones.filter(({ id }) => id !== props.zone.id);
	userStore.saveToDB('data');
};
</script>

<template>
	<div class="px-2 flex items-center">
		<img src="@/assets/icons/edit.svg" alt="" class="dark:invert mt-2">
		<h2 v-show="!options.input" ref="h2" class="font-bold mt-2 text-2xl" @click="toggle_h2">
			{{ options.nzv }}
		</h2>
		<input v-show="options.input" ref="inp" v-model="options.i_nzv" type="text" class="bg-transparent pl-0 dark:placeholder:text-white text-2xl font-bold focus:ring-0 mt-2 w-full py-0" @blur="toggle_inp">
	</div>

	<section class="px-2">
		<div class="overflow-y-scroll max-h-28 scroll">
			<Sprinkler
				v-for="{ nazov, id } in options.sprinklers"
				:key="id"
				:data="{ nazov, id }"
				:zone-id="zone.id"
				@update-sprinkler="updateSprinkler"
			/>
		</div>

		<div class="bg-zinc-100 dark:bg-[#292929] mt-1 flex items-center py-1 text-2xl rounded-[.275rem] overflow-hidden select-none cursor-pointer leading-4">
			<div v-show="!options.show_inp" class="dark:hover:!bg-[#333] w-full h-6 grid place-items-center" @click="options.show_inp = !options.show_inp">
				+
			</div>
			<div v-show="options.show_inp" class="flex flex-col xs:flex-row w-full gap-2 px-1 dark:text-black">
				<input v-model="options.add_nazov" type="text" placeholder="Názov" class="h-6 indent-2 w-full xs:w-[125%] text-sm rounded-[.175rem]">
				<div class="flex gap-2">
					<!--					<p class="xs:hidden leading-6 dark:text-white text-[1rem]">-->
					<!--						IP:-->
					<!--					</p>-->
					<!--					<InputIP :clear="clear" @ip="validateIP" />-->
					<button class="btn text-[1rem] py-0 h-[24px] rounded-[.175rem] px-2" @click="add_new_sprinkler">
						{{ $t('zone.save') }}
					</button>
				</div>
			</div>
		</div>
	</section>

	<p class="mt-1 ml-2 text-red-600">
		{{ options.err }}
	</p>

	<footer class="flex items-center space-x-2 absolute bottom-[5px] px-[5px] w-full">
		<button class="btn py-1 px-2" @click="options_save">
			{{ $t('zone.save') }}
		</button>
		<button class="btn py-1 px-2 red" @click="options_cacnel">
			{{ $t('zone.cancel') }}
		</button>
		<label v-show="!zone.photo" for="file" class="flex items-center btn py-1 px-1 cursor-pointer">
			<img src="@/assets/icons/upload.svg" alt="upload" class="invert">
			<span class="mr-1 select-none w-fit max-w-[7rem] truncate">{{ options.file_name === '' ? $t('zone.bg') : options.file_name }}</span>
		</label>
		<input id="file" type="file" accept=".png, .jpg, .jpeg" class="hidden" @input="photo">
		<button v-show="zone.photo" class="btn py-1 px-2 red flex items-center pl-1" @click="delete_photo">
			<img src="@/assets/icons/delete.svg" alt="">
			{{ $t('zone.bg') }}
		</button>
		<el-popconfirm :title="`${$t('zone.delete')} ${zone.nazov} ?`" @confirm="delete_zone">
			<template #reference>
				<button class="btn py-1 px-2 flex items-center pl-1 !ml-auto red">
					<img src="@/assets/icons/delete-f.svg" alt="">
					{{ $t('zone.zone2') }}
				</button>
			</template>
		</el-popconfirm>
	</footer>
</template>
