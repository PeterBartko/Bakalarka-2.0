<template>
	<div class="h-6 w-full dark:text-white flex gap-[2px] leading-8 text-sm rounded-[.175rem]">
		<input ref="i1" type="number" name="i1" class="w-8 indent-[2px] rounded-[.175rem] dark:text-white dark:bg-zinc-500/30 text-[1rem]" @input="validate">.
		<input ref="i2" type="number" name="i2" class="w-8 indent-[2px] rounded-[.175rem] dark:text-white dark:bg-zinc-500/30 text-[1rem]" @input="validate">.
		<input ref="i3" type="number" name="i3" class="w-8 indent-[2px] rounded-[.175rem] dark:text-white dark:bg-zinc-500/30 text-[1rem]" @input="validate">.
		<input ref="i4" type="number" name="i4" class="w-8 indent-[2px] rounded-[.175rem] dark:text-white dark:bg-zinc-500/30 text-[1rem]" @input="validate">
	</div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';

const props = defineProps({
	clear: {
		type: String,
		required: true,
	},
	OGip: {
		type: String,
		default: '',
	},
});

const emit = defineEmits(['ip']);

const inp = ref();
const input = reactive({
	i1: null,
	i2: null,
	i3: null,
	i4: null,
});

watch(() => props.clear, () => {
	Object.keys(this.$refs).forEach(r => {
		this.input[r] = null;
		this.$refs[r].value = null;
	});
});

// props: ['clear', 'OGip'],
// emits: ['ip'],
// data() {
// 	return {
// 		input: {
// 			i1: null,
// 			i2: null,
// 			i3: null,
// 			i4: null,
// 		},
// 	};
// },
// watch: {
// 	clear() {
// 		Object.keys(this.$refs).forEach(r => {
// 			this.input[r] = null;
// 			this.$refs[r].value = null;
// 		});
// 	},
// },
// mounted() {
// 	if (this.OGip) {
// 		const octets = this.OGip.split('.');
// 		Object.keys(this.$refs).forEach(r => {
// 			const oct = octets.shift();
// 			this.$refs[r].value = oct;
// 			this.input[r] = oct;
// 		});
// 	}
// },
// methods: {
// 	validate(e) {
// 		let val = e.target.value;
// 		if (val > 255) {
// 			val = 255;
// 			e.target.value = 255;
// 		}
//
// 		if (val < 0) {
// 			val = 0;
// 			e.target.value = 0;
// 		}
//
// 		this.input[e.target.name] = val;
// 		if ((String(val)).length === 3) {
// 			const i = parseInt(e.target.name[1]) + 1;
// 			this.$refs[`i${i > 4 ? 4 : i}`].focus();
// 		}
//
// 		this.$emit('ip', this.input);
// 	},
// },
</script>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] {
  -moz-appearance: textfield;
}
</style>
