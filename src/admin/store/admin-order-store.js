import { db } from '../../api/firebase-config.js';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";

const COLLECTION_NAME = 'orders';

export const AdminOrderStore = {
    _orders: [],

    async init() {
        await this.fetchAll();
    },

    async fetchAll() {
        try {
            const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            this._orders = [];
            querySnapshot.forEach((doc) => {
                this._orders.push({ id: doc.id, ...doc.data() });
            });
            return this._orders;
        } catch (error) {
            console.error("Error fetching orders: ", error);
            throw error;
        }
    },

    getAll() {
        return this._orders;
    },

    async updateStatus(id, newStatus) {
        try {
            const orderRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(orderRef, { status: newStatus });

            // Update local state
            const index = this._orders.findIndex(o => o.id === id);
            if (index !== -1) {
                this._orders[index].status = newStatus;
            }
        } catch (error) {
            console.error("Error updating order status: ", error);
            throw error;
        }
    }
};
