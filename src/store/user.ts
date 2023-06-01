import { defineStore } from 'pinia';
import {
	createUserWithEmailAndPassword,
	getAuth, GoogleAuthProvider, onAuthStateChanged,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut,
} from 'firebase/auth';
import { setDoc, doc, collection, getDoc } from 'firebase/firestore';
import { ref, getStorage, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db } from '@/firebase';

export type Zone = {
	photo?: string;
	id: string;
	nazov: string;
	img_name?: string;
	cas: {
		od: string;
		do: string;
	};
	sprinklers: Array<{
		nazov: string;
		id: string;
	}>;
	days: boolean[];
	last_started: number;
};

export type UserStore = {
	uid: string;
	userName: string;
	email: string;
	isLoggedIn: boolean;
	darkMode: boolean;
	zones: Zone[];
	city: string;
};
export const useUserStore = defineStore('user', {
	state: (): UserStore => ({
		uid: '',
		userName: '',
		email: '',
		isLoggedIn: false,

		darkMode: false,

		zones: [],
		city: 'Bratislava',
	}),

	getters: {
		getInitials: state => state.userName ? state.userName[0].toUpperCase() : undefined,
	},

	actions: {
		async getUserInfo() {
			onAuthStateChanged(getAuth(), async user => {
				if (user) {
					this.uid = user.uid;
					this.email = user.email!;
					this.isLoggedIn = true;
				} else {
					this.isLoggedIn = false;
				}

				if (user) {
					const zonesRef = doc(db, 'data', user.uid);
					const zonesSnap = await getDoc(zonesRef);

					const userRef = doc(db, 'users', user.uid);
					const userSnap = await getDoc(userRef);

					const userr = userSnap.data();
					this.userName = userr?.username;
					this.city = userr?.city;

					this.zones = !zonesSnap.data()?.zones ? [] : zonesSnap.data()?.zones;
				}
			});
		},
		async register({ email, password }: Record<'email' | 'password', string>) {
			const res = await createUserWithEmailAndPassword(getAuth(), email, password);
			this.email = res.user.email!;
			this.uid = res.user.uid;

			await setDoc(doc(collection(db, 'user'), this.uid), {
				city: 'Bratislava',
				email: this.email,
				username: this.userName,
			});
		},
		async login({ email, password }: Record<'email' | 'password', string>) {
			const res = await signInWithEmailAndPassword(getAuth(), email, password);
			this.email = res.user.email!;
			this.uid = res.user.uid;
		},
		async signInWithGoogle() {
			const res = await signInWithPopup(getAuth(), new GoogleAuthProvider());
			this.uid = res.user.uid;
			this.email = res.user.email!;
			this.userName = res.user.displayName!;

			await setDoc(doc(collection(db, 'users'), this.uid), {
				city: 'Bratislava',
				email: this.email,
				username: this.userName,
			});
		},
		signOut() {
			signOut(getAuth()).then(() => {
				this.isLoggedIn = false;
			}).catch(e => {
				console.error(e);
			});
		},
		toggleDarkMode() {
			this.darkMode = !this.darkMode;
			localStorage.darkMode = this.darkMode;
		},
		async saveToDB(path: 'users' | 'data', payload?: any) {
			await setDoc(doc(collection(db, path), this.uid), path === 'users' ? payload : { zones: this.zones }, { merge: true });
		},
		async saveImage(img: Record<string, string>, id: string) {
			try {
				const storageRef = ref(getStorage());
				const fileRef = ref(storageRef, `backgrounds/${img.name + id}`);

				await uploadBytes(fileRef, img);

				const photo = await getDownloadURL(fileRef);

				const zoneRef = doc(db, 'data', this.uid);
				await setDoc(zoneRef, { zones: this.zones.map(z => z.id === id ? ({ ...z, photo }) : z) });
			} catch (e) {
				console.error(e);
			}
		},
		async deleteImage(img_id: string) {
			try {
				const storageRef = ref(getStorage());
				const fileRef = ref(storageRef, `backgrounds/${img_id}`);

				await deleteObject(fileRef);

				const zoneRef = doc(db, 'data', this.uid);
				await setDoc(zoneRef, { zones: this.zones.map(z => z.id === img_id ? ({ ...z, photo: undefined }) : z) });
			} catch (e) {
				console.error(e);
			}
		},
	},
});
