import {env} from "$env/dynamic/public";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { writable } from "svelte/store";

const firebaseConfig = {
  apiKey: env.PUBLIC_API_KEY,
  authDomain: env.PUBLIC_AUTH_DOMAIN,
  projectId: env.PUBLIC_PROJECT_ID,
  storageBucket: env.PUBLIC_STORAGE_BUCKET,
  messagingSenderId: env.PUBLIC_MESSAGING_SENDER_ID,
  appId: env.PUBLIC_APP_ID,
  measurementId: env.PUBLIC_MEASUREMENT_ID,
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();

function userStore() {
    let unsubscribe: () => void

    if(!auth || !globalThis.window) {
        console.warn("Auth is not initalized or not in browser")
        const {subscribe} = writable<User | null>(null)
        return {
            subscribe
        }
    }

    const {subscribe} = writable(auth?.currentUser ?? null, (set)=> {
        unsubscribe = onAuthStateChanged(auth, user => {
            set(user)
        })
        return () => unsubscribe()
    } )

    return {
        subscribe
    }
}

export const user = userStore()