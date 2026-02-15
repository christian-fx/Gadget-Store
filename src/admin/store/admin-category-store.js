import { db } from '../../api/firebase-config.js';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

const COLLECTION_NAME = 'categories';

export const AdminCategoryStore = {
    _categories: [],

    async init() {
        await this.fetchAll();
    },

    async fetchAll() {
        try {
            const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
            this._categories = [];
            querySnapshot.forEach((doc) => {
                this._categories.push({ id: doc.id, ...doc.data() });
            });
            return this._categories;
        } catch (error) {
            console.error("Error fetching categories: ", error);
            throw error;
        }
    },

    getAll() {
        return this._categories;
    },

    async add(categoryData) {
        try {
            const docRef = await addDoc(collection(db, COLLECTION_NAME), categoryData);
            const newCat = { id: docRef.id, ...categoryData };
            this._categories.push(newCat);
            return newCat;
        } catch (error) {
            console.error("Error adding category: ", error);
            throw error;
        }
    },

    async delete(id) {
        try {
            await deleteDoc(doc(db, COLLECTION_NAME, id));
            this._categories = this._categories.filter(c => c.id !== id);
        } catch (error) {
            console.error("Error deleting category: ", error);
            throw error;
        }
    }
};
