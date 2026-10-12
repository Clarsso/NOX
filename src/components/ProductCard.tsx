import React, { useState, useEffect } from 'react';
import { Plus, Check, Share2, Ban } from 'lucide-react';
import type { Product } from '../types';
import { useCart } from '../store/useCart';
import { sortSizes } from '../utils/sortSizes';
import { isProductAvailable } from '../utils/stockHelpers';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onShowToast: (msg: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onQuickView, 
  onShowToast 
}) => {
  const addToCart = useCart((state) => state.addToCart);
  
  const productImages = product.images && product.images.length > 0 ? product.images : [product.image];
  const hasMultipleImages = productImages.length > 1;

  const hasTotalStock = isProductAvailable(product);

  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(
    product.hasVariants && product.variants?.length ? sortSizes(product.variants)[0] : undefined
  );
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!hasMultipleImages) return;
    const interval = setInterval(() => {
      setCurrentImgIndex((prevIndex) => (prevIndex + 1) % productImages.length);
    }, 3800);

    return () => clearInterval(interval);
  }, [hasMultipleImages, productImages.length]);

  const currentStockForVariant = selectedVariant && product.variantStock
    ? (product.variantStock[selectedVariant] ?? 0)
    : (hasTotalStock ? (product.variantStock?.['GENERAL'] ?? product.variantStock?.['Único'] ?? 1) : 0);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasTotalStock || currentStockForVariant <= 0) return;

    addToCart(product, selectedVariant);
    setAdded(true);
    onShowToast(`AÑADIDO: ${product.name} ${selectedVariant && selectedVariant !== 'GENERAL' ? `(${selectedVariant})` : ''}`);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareText = `¡Mira esta pieza de FIRMA STUDIO!: ${product.name} - $${product.price} MXN`;
    if (navigator.share) {
      navigator.share({ title: product.name, text: shareText, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${shareText} - ${window.location.href}`);
      onShowToast('¡ENLACE COPIADO AL PORTAPAPELES!');
    }
  };

  return (
    <div 
      onClick={() => onQuickView(product)}
      className={`group bg-[#141414] border border-zinc-800/80 hover:border-zinc-600 rounded-2xl overflow-hidden card-luxury active-card-press flex flex-col justify-between cursor-pointer transition-all duration-300 ${
        !hasTotalStock ? 'opacity-60 grayscale-[20%]' : ''
      }`}
    >
      <div>
        <div className="relative aspect-[3/4] w-full bg-[#0a0a0a] overflow-hidden">
          {productImages.map((img, idx) => (
            <img
              key={img}
              src={img}
              alt={product.name}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                idx === currentImgIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
              }`}
            />
          ))}

          {!hasTotalStock ? (
            <span className="absolute top-3 left-3 bg-rose-950/90 text-rose-300 backdrop-blur-md text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-rose-800/60 z-10 shadow-md">
              🚫 AGOTADO
            </span>
          ) : product.badge ? (
            <span className="absolute top-3 left-3 bg-[#0a0a0a]/90 backdrop-blur-md text-zinc-200 text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full border border-zinc-800 z-10 shadow-md">
              {product.badge}
            </span>
          ) : null}

          <button
            onClick={handleShare}
            className="absolute top-3 right-3 bg-[#0a0a0a]/80 hover:bg-zinc-800 backdrop-blur-md text-zinc-300 p-2 rounded-full border border-zinc-800/80 z-20 transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>

          {hasMultipleImages && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
              {productImages.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    i === currentImgIndex ? 'w-4 bg-white' : 'w-1 bg-white/40'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="p-5">
          <span className="text-[10px] font-mono tracking-[0.2em] text-zinc-500 uppercase block mb-1">
            {product.category}
          </span>
          
          <h3 className="font-mono font-bold text-zinc-100 text-base leading-snug group-hover:text-zinc-300 transition-colors uppercase">
            {product.name}
          </h3>
          
          <p className="text-zinc-400 text-xs mt-2 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {product.hasVariants && product.variants && product.variants.length > 0 && product.variants[0] !== 'GENERAL' ? (
            <div className="mt-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-1.5 font-mono text-[10px]">
                <span className="text-zinc-500 uppercase tracking-wider">
                  TALLA: <span className="text-white font-bold">{selectedVariant}</span>
                </span>

                {selectedVariant && product.variantStock && (
                  <>
                    {(product.variantStock[selectedVariant] ?? 0) <= 0 ? (
                      <span className="text-rose-400 font-bold uppercase">AGOTADA</span>
                    ) : (product.variantStock[selectedVariant] ?? 0) <= 2 ? (
                      <span className="text-amber-300 font-bold uppercase animate-pulse">
                        🔥 ¡ÚLTIMAS {product.variantStock[selectedVariant]} PIEZAS!
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-bold uppercase">DISPONIBLE</span>
                    )}
                  </>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {sortSizes(product.variants).map((v) => {
                  const isSelected = selectedVariant === v;
                  const qty = product.variantStock?.[v] ?? 0;
                  const isOut = qty <= 0;

                  return (
                    <button
                      key={v}
                      type="button"
                      disabled={isOut}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-3 py-1.5 text-xs rounded-lg font-mono transition-all border active:scale-95 ${
                        isOut
                          ? 'bg-zinc-950/50 text-zinc-600 border-zinc-900 line-through cursor-not-allowed'
                          : isSelected
                          ? 'bg-zinc-100 text-zinc-950 border-zinc-100 font-bold shadow-md'
                          : 'bg-[#0a0a0a] text-zinc-400 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="mt-4 font-mono text-xs">
              {(() => {
                const stockQty = product.variantStock?.['GENERAL'] ?? product.variantStock?.['Único'] ?? (hasTotalStock ? 5 : 0);
                return (
                  <div className="flex items-center justify-between bg-[#0a0a0a] border border-zinc-800/80 px-3 py-2 rounded-xl">
                    <span className="text-zinc-400 text-[11px]">DISPONIBILIDAD:</span>
                    {stockQty <= 0 ? (
                      <span className="text-rose-400 font-bold uppercase">AGOTADO</span>
                    ) : stockQty <= 2 ? (
                      <span className="text-amber-300 font-bold uppercase animate-pulse">🔥 ¡SOLO {stockQty} FRASCOS!</span>
                    ) : (
                      <span className="text-emerald-400 font-bold uppercase">{stockQty} EN STOCK</span>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>

      <div className="p-5 pt-0 flex items-center justify-between border-t border-zinc-800/40 mt-2">
        <div>
          <span className="text-[10px] text-zinc-500 font-mono block uppercase">PRECIO</span>
          <span className="font-mono text-base font-bold text-white">${product.price} <span className="text-xs font-normal text-zinc-500">MXN</span></span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!hasTotalStock || currentStockForVariant <= 0}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-mono text-xs font-bold tracking-wider uppercase transition-all active:scale-95 ${
            !hasTotalStock || currentStockForVariant <= 0
              ? 'bg-zinc-800/80 text-zinc-500 border border-zinc-700/50 cursor-not-allowed'
              : added
              ? 'bg-emerald-600 text-white'
              : 'bg-zinc-100 hover:bg-white text-zinc-950 shadow-md'
          }`}
        >
          {!hasTotalStock || currentStockForVariant <= 0 ? (
            <>
              <Ban className="w-3.5 h-3.5" />
              <span>AGOTADO</span>
            </>
          ) : added ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>LISTO</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>AGREGAR</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};