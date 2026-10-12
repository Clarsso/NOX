import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import type { Product } from '../types';

// Tu configuración real de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBAg63yLIGXYgjqVgayC7q8fjHemrpZi6c",
  authDomain: "firma-studio.firebaseapp.com",
  databaseURL: "https://firma-studio-default-rtdb.firebaseio.com",
  projectId: "firma-studio",
  storageBucket: "firma-studio.firebasestorage.app",
  messagingSenderId: "155019286032",
  appId: "1:155019286032:web:64c7a7e1313903dd419c95"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

// Sincronización en tiempo real del catálogo para todos los clientes en Juárez
export const subscribeToProducts = (callback: (products: Product[]) => void) => {
  const productsRef = ref(db, 'products');
  return onValue(productsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const productList: Product[] = Array.isArray(data) ? data : Object.values(data);
      callback(productList);
    } else {
      callback([]);
    }
  });
};

// Guardar/Actualizar catálogo completo en la nube
export const saveProductsToCloud = async (products: Product[]) => {
  const productsRef = ref(db, 'products');
  await set(productsRef, products);
};