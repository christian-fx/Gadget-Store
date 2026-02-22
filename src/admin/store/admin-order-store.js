import { db } from '../../api/firebase-config.js';
import { collection, onSnapshot, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { AdminNotificationStore } from './admin-notification-store.js';

const COLLECTION_NAME = 'orders';

export const AdminOrderStore = {
    _orders: [],
    _unsubscribe: null,
    _initialized: false,
    _listeners: [],

    subscribe(callback) {
        this._listeners.push(callback);
        return () => {
            this._listeners = this._listeners.filter(cb => cb !== callback);
        };
    },

    _notifyListeners() {
        this._listeners.forEach(cb => cb(this._orders));
    },

    async init() {
        if (this._initialized) return;

        AdminNotificationStore.init(); // Ensure notifications are ready

        return new Promise((resolve, reject) => {
            const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));

            this._unsubscribe = onSnapshot(q, (snapshot) => {
                const isInitialLoad = this._orders.length === 0 && !this._initialized;

                snapshot.docChanges().forEach((change) => {
                    const order = { id: change.doc.id, ...change.doc.data() };

                    if (change.type === "added") {
                        if (!isInitialLoad) {
                            AdminNotificationStore.add(
                                'New Order Received',
                                `Order #${order.id.substring(0, 8).toUpperCase()} from ${order.customerName || 'Guest'}`,
                                'success'
                            );
                        }
                    }
                    if (change.type === "modified") {
                        // Optional: Notify on status change? Maybe too noisy for admin doing the change.
                    }
                });

                this._orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                this._initialized = true;
                this._notifyListeners();
                resolve(this._orders);
            }, (error) => {
                console.error("Error listening to orders: ", error);
                reject(error);
            });
        });
    },

    getAll() {
        return this._orders;
    },

    async update(id, updates) {
        try {
            const orderRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(orderRef, updates);
            // Listener will update local state automatically
        } catch (error) {
            console.error("Error updating order: ", error);
            throw error;
        }
    },

    stopListening() {
        if (this._unsubscribe) {
            this._unsubscribe();
            this._unsubscribe = null;
            this._initialized = false;
        }
    }
};
