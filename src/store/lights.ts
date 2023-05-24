import { defineStore } from 'pinia';

export const useLightsStore = defineStore('lights', {
	state: () => ({
		red: false,
		green: false,
		blue: false,
	}),

	getters: {
		getQuery: state => `${state.red ? 'red' : '--'}${state.green ? 'green' : '--'}${state.blue ? 'blue' : '--'}`,
	},
});
