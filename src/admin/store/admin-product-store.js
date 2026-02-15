import { db } from '../../api/firebase-config.js';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";

const COLLECTION_NAME = 'products';

export const AdminProductStore = {
    // State to hold loaded products (optional caching)
    _products: [],

    async init() {
        // Prepare any initial listeners if needed, for now just fetch
        await this.fetchAll();
    },

    async fetchAll() {
        try {
            const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
            this._products = [];
            querySnapshot.forEach((doc) => {
                this._products.push({ id: doc.id, ...doc.data() });
            });
            return this._products;
        } catch (error) {
            console.error("Error fetching products: ", error);
            throw error;
        }
    },

    getAll() {
        return this._products;
    },

    async add(productData) {
        try {
            // Ensure numerics
            const data = {
                ...productData,
                price: parseFloat(productData.price),
                stock: parseInt(productData.stock),
                createdAt: new Date().toISOString()
            };
            const docRef = await addDoc(collection(db, COLLECTION_NAME), data);
            const newProduct = { id: docRef.id, ...data };
            this._products.push(newProduct);
            return newProduct;
        } catch (error) {
            console.error("Error adding product: ", error);
            throw error;
        }
    },

    async update(id, updates) {
        try {
            const productRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(productRef, updates);

            // Update local state
            const index = this._products.findIndex(p => p.id === id);
            if (index !== -1) {
                this._products[index] = { ...this._products[index], ...updates };
            }
        } catch (error) {
            console.error("Error updating product: ", error);
            throw error;
        }
    },

    async delete(id) {
        try {
            await deleteDoc(doc(db, COLLECTION_NAME, id));
            this._products = this._products.filter(p => p.id !== id);
        } catch (error) {
            console.error("Error deleting product: ", error);
            throw error;
        }
    }
};
