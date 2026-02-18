import { db } from '../../api/firebase-config.js';
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { AdminNotificationStore } from './admin-notification-store.js';

const COLLECTION_NAME = 'users';

export const AdminUserStore = {
    _users: [],
    _unsubscribe: null,
    _initialized: false,

    async init() {
        if (this._initialized) return;

        AdminNotificationStore.init();

        return new Promise((resolve, reject) => {
            const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));

            this._unsubscribe = onSnapshot(q, (snapshot) => {
                const isInitialLoad = this._users.length === 0 && !this._initialized;

                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        if (!isInitialLoad) {
                            const user = change.doc.data();
                            AdminNotificationStore.add(
                                'New Customer',
                                `${user.name || 'A new user'} just signed up!`,
                                'success'
                            );
                        }
                    }
                });

                this._users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                this._initialized = true;
                resolve(this._users);
            }, (error) => {
                console.error("Error listening to users: ", error);
                // Fallback to empty if collection doesn't exist yet or permission denied
                this._users = [];
                reject(error);
            });
        });
    },

    getAll() {
        return this._users;
    },

    stopListening() {
        if (this._unsubscribe) {
            this._unsubscribe();
            this._unsubscribe = null;
            this._initialized = false;
        }
    }
};
