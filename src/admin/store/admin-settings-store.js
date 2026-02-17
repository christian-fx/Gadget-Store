import { db } from '../../api/firebase-config.js';
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const COLLECTION_NAME = 'settings';
const DOC_ID = 'admin_profile'; // Single document for admin settings

export const AdminSettingsStore = {
    _settings: {
        firstName: 'Admin',
        lastName: 'User',
        email: 'akabuezechris432@gmail.com', // Default/Fixed
        storeName: 'Go Gadgets',
        currency: 'USD'
    },

    async init() {
        await this.fetchSettings();
    },

    async fetchSettings() {
        try {
            const docRef = doc(db, COLLECTION_NAME, DOC_ID);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                this._settings = { ...this._settings, ...docSnap.data() };
            } else {
                // Create initial document if it doesn't exist
                await setDoc(docRef, this._settings);
            }
            return this._settings;
        } catch (error) {
            console.error("Error fetching settings:", error);
            // Fallback to default if error
            return this._settings;
        }
    },

    getSettings() {
        return this._settings;
    },

    async updateProfile(updates) {
        try {
            const docRef = doc(db, COLLECTION_NAME, DOC_ID);
            // Ensure email is never updated from client side logic if we want to be strict,
            // but the UI will control it. 
            // We'll merge updates.
            await updateDoc(docRef, updates);
            this._settings = { ...this._settings, ...updates };
            return this._settings;
        } catch (error) {
            console.error("Error updating profile:", error);
            throw error;
        }
    },

    async updateStoreConfig(updates) {
        // Can use same update function, just semantic separation
        return this.updateProfile(updates);
    }
};
