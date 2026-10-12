export type Category = 'todas' | 'camisas' | 'perfumes' | 'joyeria';

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  costPrice?: number; // Visibilidad exclusiva Admin
  description: string;
  image: string;
  images: string[];
  badge?: string;
  stockStatus: 'disponible' | 'pocas_piezas' | 'agotado';
  hasVariants: boolean;
  variantLabel?: string;
  variants?: string[];
  // Inventario en tiempo real por talla
  variantStock?: Record<string, number>; // Ej. { "S": 1, "M": 3, "L": 0, "XL": 2 }
}
export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}
