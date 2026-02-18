import { db } from '../../api/firebase-config.js';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { AdminNotificationStore } from './admin-notification-store.js';

const COLLECTION_NAME = 'products';

export const AdminProductStore = {
    _products: [],
    _unsubscribe: null,
    _initialized: false,

    async init() {
        if (this._initialized) return;

        AdminNotificationStore.init();

        return new Promise((resolve, reject) => {
            this._unsubscribe = onSnapshot(collection(db, COLLECTION_NAME), (snapshot) => {
                const isInitialLoad = this._products.length === 0 && !this._initialized;

                snapshot.docChanges().forEach((change) => {
                    const product = { id: change.doc.id, ...change.doc.data() };

                    if (change.type === "added") {
                        if (!isInitialLoad) {
                            AdminNotificationStore.add(
                                'Product Added',
                                `${product.name} has been added to inventory.`,
                                'info'
                            );
                        }
                    }

                    if (change.type === "modified") {
                        // Check for low stock
                        if (product.stock < 10 && product.stock > 0) {
                            AdminNotificationStore.add(
                                'Low Stock Alert',
                                `${product.name} is running low (${product.stock} left).`,
                                'warning'
                            );
                        }
                        if (product.stock === 0) {
                            AdminNotificationStore.add(
                                'Out of Stock',
                                `${product.name} is now out of stock!`,
                                'error'
                            );
                        }
                    }
                });

                this._products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                this._initialized = true;
                resolve(this._products);
            }, (error) => {
                console.error("Error listening to products: ", error);
                reject(error);
            });
        });
    },

    getAll() {
        return this._products;
    },

    async add(productData) {
        try {
            const data = {
                ...productData,
                price: parseFloat(productData.price),
                stock: parseInt(productData.stock),
                createdAt: new Date().toISOString()
            };
            const docRef = await addDoc(collection(db, COLLECTION_NAME), data);
            return { id: docRef.id, ...data };
        } catch (error) {
            console.error("Error adding product: ", error);
            throw error;
        }
    },

    async update(id, updates) {
        try {
            const productRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(productRef, updates);
        } catch (error) {
            console.error("Error updating product: ", error);
            throw error;
        }
    },

    async delete(id) {
        try {
            await deleteDoc(doc(db, COLLECTION_NAME, id));
        } catch (error) {
            console.error("Error deleting product: ", error);
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
