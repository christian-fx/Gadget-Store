import { db } from '../../api/firebase-config.js';
import { collection, getDocs, doc, query, orderBy } from "firebase/firestore";

const COLLECTION_NAME = 'users';

export const AdminUserStore = {
    _users: [],

    async init() {
        await this.fetchAll();
    },

    async fetchAll() {
        try {
            const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
            // Note: If 'createdAt' index doesn't exist, this might fail initially. fallback to simple getDocs
            // const querySnapshot = await getDocs(q).catch(() => getDocs(collection(db, COLLECTION_NAME)));
            // Let's stick to simple getDocs for now to avoid index requirement issues immediately
            const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));

            this._users = [];
            querySnapshot.forEach((doc) => {
                this._users.push({ id: doc.id, ...doc.data() });
            });
            return this._users;
        } catch (error) {
            console.error("Error fetching users: ", error);
            // Fallback to empty if collection doesn't exist yet or permission denied
            this._users = [];
            throw error;
        }
    },

    getAll() {
        return this._users;
    }
};
