import type { Product } from '../types';

/**
 * Valida si un producto tiene existencia disponible en total.
 */
export const isProductAvailable = (product: Product): boolean => {
  if (product.variantStock) {
    let totalQty = 0;
    const stockMap = product.variantStock as Record<string, number>;
    for (const key in stockMap) {
      totalQty += Number(stockMap[key]) || 0;
    }
    return totalQty > 0;
  }
  
  return true;
};