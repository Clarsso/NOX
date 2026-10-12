import React, { useState } from 'react';
import { X, Check, Share2, Ban, ShoppingBag, AlertCircle } from 'lucide-react';
import type { Product } from '../types';
import { useCart } from '../store/useCart';
import { sortSizes } from '../utils/sortSizes';
import { isProductAvailable } from '../utils/stockHelpers';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onShowToast,
}) => {
  if (!product) return null;

  const addToCart = useCart((state) => state.addToCart);
  
  const productImages = product.images && product.images.length > 0 ? product.images : [product.image];
  const [activeImg, setActiveImg] = useState(productImages[0]);
  
  const hasTotalStock = isProductAvailable(product);
  
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(
    product.hasVariants && product.variants?.length ? sortSizes(product.variants)[0] : undefined
  );
  const [added, setAdded] = useState(false);

  // Stock actual de la variante seleccionada o stock general
  const currentStock = selectedVariant && product.variantStock
    ? (product.variantStock[selectedVariant] ?? 0)
    : (hasTotalStock ? (product.variantStock?.['GENERAL'] ?? product.variantStock?.['Único'] ?? 5) : 0);

  // Encontrar otras tallas disponibles si la seleccionada está agotada
  const availableAlternativeSizes = product.variants 
    ? sortSizes(product.variants).filter(v => v !== selectedVariant && (product.variantStock?.[v] ?? 0) > 0)
    : [];

  const handleAddToCart = () => {
    if (!hasTotalStock || currentStock <= 0) return;

    addToCart(product, selectedVariant, onShowToast);
    setAdded(true);
    onShowToast(`AÑADIDO: ${product.name} ${selectedVariant && selectedVariant !== 'GENERAL' ? `(${selectedVariant})` : ''}`);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  const handleShare = () => {
    const shareText = `¡Mira esta pieza de FIRMA STUDIO!: ${product.name} - $${product.price} MXN`;
    if (navigator.share) {
      navigator.share({ title: product.name, text: shareText, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${shareText} - ${window.location.href}`);
      onShowToast('¡ENLACE COPIADO AL PORTAPAPELES!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />

      <div className="relative bg-[#141414] border border-zinc-800 rounded-2xl overflow-hidden max-w-3xl w-full shadow-2xl z-10 grid grid-cols-1 md:grid-cols-2 text-zinc-200 font-sans max-h-[90vh] overflow-y-auto">
        
        <div className="absolute top-3 right-3 z-20 flex gap-2">
          <button 
            onClick={handleShare} 
            className="p-2 text-zinc-400 hover:text-white rounded-full bg-black/60 backdrop-blur-md border border-zinc-800"
            title="Compartir"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button 
            onClick={onClose} 
            className="p-2 text-zinc-400 hover:text-white rounded-full bg-black/60 backdrop-blur-md border border-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Galería de Imágenes */}
        <div className="bg-[#0a0a0a] p-4 flex flex-col justify-between">
          <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden border border-zinc-800">
            <img src={activeImg} alt={product.name} className="w-full h-full object-cover" />
            {!hasTotalStock && (
              <span className="absolute top-3 left-3 bg-rose-950/90 text-rose-300 text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-rose-800">
                🚫 AGOTADO
              </span>
            )}
          </div>

          {productImages.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {productImages.map((img) => (
                <button
                  key={img}
                  onClick={() => setActiveImg(img)}
                  className={`w-14 h-16 rounded-lg overflow-hidden border transition-all ${
                    activeImg === img ? 'border-white opacity-100 scale-105' : 'border-zinc-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Información y Compra */}
        <div className="p-6 flex flex-col justify-between space-y-6 font-mono">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{product.category}</span>
              <h3 className="text-xl font-bold text-white uppercase mt-1">{product.name}</h3>
              <p className="text-emerald-400 text-lg font-bold mt-1">${product.price} <span className="text-xs font-normal text-zinc-500">MXN</span></p>
            </div>

            <p className="text-zinc-400 text-xs font-sans leading-relaxed">
              {product.description}
            </p>

            {/* Selector de Tallas con Alertas Inteligentes */}
            {product.hasVariants && product.variants && product.variants.length > 0 && product.variants[0] !== 'GENERAL' ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500 uppercase">SELECCIONA TALLA:</span>
                  <span className="text-white font-bold">{selectedVariant}</span>
                </div>

                <div className="flex flex-wrap gap-2">
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
                        className={`px-3.5 py-2 text-xs rounded-xl transition-all border ${
                          isOut
                            ? 'bg-zinc-950 text-zinc-600 border-zinc-900 line-through cursor-not-allowed'
                            : isSelected
                            ? 'bg-zinc-100 text-zinc-950 border-zinc-100 font-bold shadow-md'
                            : 'bg-[#0a0a0a] text-zinc-400 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        {v} {qty <= 0 ? '(Agotada)' : `(${qty})`}
                      </button>
                    );
                  })}
                </div>

                {/* Aviso Inteligente según el Stock de la Talla Seleccionada */}
                {selectedVariant && (
                  <div className="pt-1">
                    {currentStock <= 0 ? (
                      <div className="bg-rose-950/40 border border-rose-900/60 p-3 rounded-xl text-rose-300 text-[11px] flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5 font-bold">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>La talla {selectedVariant} está agotada actualmente.</span>
                        </div>
                        {availableAlternativeSizes.length > 0 ? (
                          <p className="text-zinc-400">
                            👉 Te sugerimos revisar las tallas disponibles: <span className="text-white font-bold">{availableAlternativeSizes.join(', ')}</span>
                          </p>
                        ) : (
                          <p className="text-zinc-400">Esta pieza está agotada en todas sus tallas.</p>
                        )}
                      </div>
                    ) : currentStock <= 2 ? (
                      <div className="bg-amber-950/40 border border-amber-900/60 p-2.5 rounded-xl text-amber-300 text-[11px] flex items-center gap-2 animate-pulse">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>🔥 ¡Atención! Solo queda{currentStock === 1 ? ' 1 pieza' : `n ${currentStock} piezas`} en talla {selectedVariant}.</span>
                      </div>
                    ) : (
                      <div className="bg-emerald-950/30 border border-emerald-950 p-2 rounded-xl text-emerald-400 text-[11px] flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 shrink-0" />
                        <span>¡Disponible para entrega inmediata en Juárez! ({currentStock} pzas)</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-[#0a0a0a] border border-zinc-800 p-3 rounded-xl flex items-center justify-between text-xs">
                <span className="text-zinc-400">DISPONIBILIDAD:</span>
                {currentStock <= 0 ? (
                  <span className="text-rose-400 font-bold uppercase">AGOTADO</span>
                ) : currentStock <= 2 ? (
                  <span className="text-amber-300 font-bold uppercase animate-pulse">🔥 ¡ÚLTIMOS {currentStock} FRASCOS!</span>
                ) : (
                  <span className="text-emerald-400 font-bold uppercase">{currentStock} EN STOCK</span>
                )}
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!hasTotalStock || currentStock <= 0}
            className={`w-full py-3.5 rounded-xl font-bold uppercase text-xs tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${
              !hasTotalStock || currentStock <= 0
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50'
                : added
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-100 hover:bg-white text-zinc-950'
            }`}
          >
            {!hasTotalStock || currentStock <= 0 ? (
              <>
                <Ban className="w-4 h-4" />
                <span>TALLA / PIEZA AGOTADA</span>
              </>
            ) : added ? (
              <>
                <Check className="w-4 h-4" />
                <span>¡AGREGADO A LA BOLSA!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>AGREGAR A LA BOLSA • ${product.price} MXN</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};