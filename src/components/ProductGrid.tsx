import React from 'react';
import type { Product } from '../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onQuickView: (product: Product) => void;
  onShowToast: (msg: string) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onQuickView, onShowToast }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-20 px-4 bg-[#181818] border border-dashed border-zinc-800 max-w-lg mx-auto my-12 font-mono">
        <p className="text-zinc-300 font-bold text-sm">// NO SE ENCONTRARON PRODUCTOS</p>
        <p className="text-zinc-500 text-xs mt-2">Prueba cambiando la categoría o modificando el término de búsqueda.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onQuickView={onQuickView}
            onShowToast={onShowToast}
          />
        ))}
      </div>
    </div>
  );
};