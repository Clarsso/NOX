import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, MessageCircle, AlertCircle, MapPin, Truck } from 'lucide-react';
import { useCart } from '../store/useCart';
import type { Product } from '../types';
import { saveProductsToCloud } from '../lib/firebase';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateProducts: (newProducts: Product[]) => void;
  onShowToast: (msg: string) => void;
}

// Tu lista exacta de puntos medios en Cd. Juárez
const DELIVERY_POINTS = [
  '📍 Plaza Las Misiones',
  '📍 Plaza Galerías Tec',
  '📍 Plaza Sendero',
  '📍 Centro Histórico',
  '📍 S-Mart La Cuesta',
  '📍 Parque Central',
  '📍 Walmart Villarreal Torres',
  '📍 Soriana Henequén',
  '📍 Bodega Aurrerá Jilotepec',
  '📍 Plaza Pinocelli',
  '📍 Plaza San Lorenzo',
  '📍 Plaza Juárez Mall',
  '📍 Plaza Bistro',
  '📍 S-Mart López Mateos',
  '📍 Plaza Río Grande Mall',
  '📍 Plaza Alameda Iglesias',
  '🚗 Otro punto medio a convenir',
];

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  products,
  onUpdateProducts,
  onShowToast,
}) => {
  const items = useCart((state) => state.items);
  const removeFromCart = useCart((state) => state.removeFromCart);
  const updateQuantity = useCart((state) => state.updateQuantity);
  const clearCart = useCart((state) => state.clearCart);
  const getTotalPrice = useCart((state) => state.getTotalPrice);

  const [deliveryType, setDeliveryType] = useState<'punto_medio' | 'domicilio'>('punto_medio');
  const [deliveryPoint, setDeliveryPoint] = useState<string>(DELIVERY_POINTS[0]);
  const [customAddress, setCustomAddress] = useState<string>('');

  if (!isOpen) return null;

  // Validación de inventario dinámico contra Firebase
  const hasInvalidStockItems = items.some((item) => {
    const liveProduct = products.find((p) => p.id === item.product.id);
    if (!liveProduct) return true;
    const variantKey = item.variant || 'GENERAL';
    const liveStockMap = (liveProduct.variantStock as Record<string, number>) || {};
    const liveStock = liveStockMap[variantKey] ?? 0;
    return item.quantity > liveStock || liveStock <= 0;
  });

  const handleCheckoutWhatsApp = async () => {
    if (items.length === 0 || hasInvalidStockItems) return;

    let updatedProductsList = [...products];

    items.forEach((cartItem) => {
      updatedProductsList = updatedProductsList.map((p) => {
        if (p.id === cartItem.product.id) {
          const variantKey = cartItem.variant || 'GENERAL';
          const stockMap = (p.variantStock as Record<string, number>) || { GENERAL: 5 };
          const currentVariantStock = { ...stockMap };
          
          const currentQty = currentVariantStock[variantKey] ?? 5;
          const newQty = Math.max(0, currentQty - cartItem.quantity);
          
          currentVariantStock[variantKey] = newQty;

          return {
            ...p,
            variantStock: currentVariantStock,
          };
        }
        return p;
      });
    });

    try {
      await saveProductsToCloud(updatedProductsList);
      onUpdateProducts(updatedProductsList);
    } catch (err) {
      console.error('Error al actualizar inventario en la nube:', err);
    }

    // Número real de Juárez (Lada 52 + 10 dígitos)
    const phoneNumber = '52656XXXXXXX'; 

    let message = '🔥 *NUEVO PEDIDO DESDE NOX* 🔥\n\n';

    items.forEach((item, index) => {
      message += `${index + 1}. *${item.product.name}*\n`;
      if (item.variant && item.variant !== 'GENERAL') {
        message += `   🔹 Talla/Variante: ${item.variant}\n`;
      }
      message += `   📦 Cantidad: ${item.quantity}\n`;
      message += `   💵 Subtotal: $${item.product.price * item.quantity} MXN\n\n`;
    });

    message += `💰 *SUBTOTAL PRODUCTOS: $${getTotalPrice()} MXN*\n\n`;

    if (deliveryType === 'punto_medio') {
      message += `📍 *TIPO DE ENTREGA:* Punto Medio\n`;
      message += `🏢 *LUGAR SELECCIONADO:* ${deliveryPoint}\n\n`;
      message += `¡Hola! Me interesa concretar este pedido. ¿En qué horario nos podemos ver?`;
    } else {
      message += `🚚 *TIPO DE ENTREGA:* A Domicilio *(Costo extra a cotizar)*\n`;
      message += `🏠 *COLONIA / DIRECCIÓN:* ${customAddress.trim() || 'Se acordará por chat'}\n\n`;
      message += `¡Hola! Me interesa concretar esta compra a domicilio. ¿Cuánto sería del envío a mi zona?`;
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    clearCart();
    onClose();
    onShowToast('¡TRANSACCIÓN COMPLETADA! INVENTARIO ACTUALIZADO');
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-[#141414] border-l border-zinc-800 h-full flex flex-col justify-between z-10 font-sans text-zinc-200">
        
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between font-mono">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-200" />
            <h3 className="font-bold text-sm tracking-wider text-white uppercase">TU BOLSA DE COMPRAS</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-white rounded-full bg-zinc-900 border border-zinc-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Listado de Productos */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-20 space-y-3 font-mono">
              <ShoppingBag className="w-12 h-12 text-zinc-700 mx-auto" />
              <p className="text-xs text-zinc-500 uppercase tracking-wider">Tu bolsa está vacía</p>
            </div>
          ) : (
            items.map((item, idx) => {
              const variantKey = item.variant || 'GENERAL';
              const liveProduct = products.find((p) => p.id === item.product.id);
              const liveStockMap = (liveProduct?.variantStock as Record<string, number>) || {};
              const liveMaxStock = liveStockMap[variantKey] ?? 0;
              const isExceeded = item.quantity > liveMaxStock;
              const isOut = liveMaxStock <= 0;

              return (
                <div key={`${item.product.id}-${item.variant || idx}`} className="bg-[#0a0a0a] border border-zinc-800/80 p-3 rounded-xl font-mono space-y-2">
                  <div className="flex gap-3">
                    <img src={item.product.image} alt={item.product.name} className="w-16 h-20 object-cover rounded-lg border border-zinc-800" />
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-white text-xs uppercase line-clamp-1">{item.product.name}</h4>
                          <button 
                            onClick={() => removeFromCart(item.product.id, item.variant)}
                            className="text-zinc-500 hover:text-rose-400 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {item.variant && item.variant !== 'GENERAL' && (
                          <span className="text-[10px] bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded border border-zinc-800 inline-block mt-1">
                            Talla: {item.variant}
                          </span>
                        )}
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <span className="font-bold text-emerald-400 text-xs">${item.product.price * item.quantity} MXN</span>

                        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variant, onShowToast)}
                            className="text-zinc-400 hover:text-white font-bold text-xs px-1"
                          >
                            -
                          </button>
                          <span className="text-white text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variant, onShowToast)}
                            disabled={item.quantity >= liveMaxStock}
                            className={`font-bold text-xs px-1 ${item.quantity >= liveMaxStock ? 'text-zinc-600 cursor-not-allowed' : 'text-zinc-400 hover:text-white'}`}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Avisos de inventario */}
                  {isOut ? (
                    <div className="flex items-center gap-1.5 bg-rose-950/40 border border-rose-900/50 px-2.5 py-1.5 rounded-lg text-rose-300 text-[10px]">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                      <span>Esta variante se ha agotado. Elimínala para continuar.</span>
                    </div>
                  ) : isExceeded ? (
                    <div className="flex items-center gap-1.5 bg-amber-950/40 border border-amber-900/50 px-2.5 py-1.5 rounded-lg text-amber-300 text-[10px]">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                      <span>Solo quedan {liveMaxStock} piezas disponibles en stock. Ajusta la cantidad.</span>
                    </div>
                  ) : null}
                </div>
              );
            })
          )}
        </div>

        {/* Footer con Selector de Modalidad de Entrega */}
        {items.length > 0 && (
          <div className="p-5 border-t border-zinc-800 bg-[#0e0e0e] space-y-4 font-mono">
            
            <div className="space-y-2">
              <label className="text-[11px] text-zinc-400 uppercase font-bold block">
                Método de Entrega en Cd. Juárez:
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryType('punto_medio')}
                  className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    deliveryType === 'punto_medio'
                      ? 'bg-amber-200/10 border-amber-200 text-amber-200'
                      : 'bg-[#141414] border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Punto Medio</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryType('domicilio')}
                  className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    deliveryType === 'domicilio'
                      ? 'bg-amber-200/10 border-amber-200 text-amber-200'
                      : 'bg-[#141414] border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>A Domicilio</span>
                </button>
              </div>

              {deliveryType === 'punto_medio' ? (
                <div className="pt-1">
                  <select
                    value={deliveryPoint}
                    onChange={(e) => setDeliveryPoint(e.target.value)}
                    className="w-full bg-[#141414] border border-zinc-800 text-zinc-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-amber-200/50 cursor-pointer"
                  >
                    {DELIVERY_POINTS.map((pt) => (
                      <option key={pt} value={pt}>
                        {pt}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="pt-1 space-y-1">
                  <input
                    type="text"
                    placeholder="Colonia / Fraccionamiento / Zona..."
                    value={customAddress}
                    onChange={(e) => setCustomAddress(e.target.value)}
                    className="w-full bg-[#141414] border border-zinc-800 text-zinc-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-amber-200/50"
                  />
                  <p className="text-[10px] text-amber-300/80 italic">
                    * El costo de envío se calculará por WhatsApp según tu zona.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center text-sm pt-1 border-t border-zinc-800/60">
              <span className="text-zinc-400 uppercase text-xs">Total Productos:</span>
              <span className="font-bold text-white text-base">${getTotalPrice()} <span className="text-xs text-zinc-500 font-normal">MXN</span></span>
            </div>

            <button
              onClick={handleCheckoutWhatsApp}
              disabled={hasInvalidStockItems}
              className={`w-full font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 uppercase text-xs tracking-wider transition-all shadow-lg active:scale-95 ${
                hasInvalidStockItems
                  ? 'bg-zinc-800 text-zinc-500 border border-zinc-700/50 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>{hasInvalidStockItems ? 'REVISA LAS CANTIDADES' : 'CONFIRMAR Y PEDIR POR WHATSAPP'}</span>
            </button>
            <p className="text-[10px] text-center text-zinc-500">Al confirmar, el stock se descontará automáticamente.</p>
          </div>
        )}

      </div>
    </div>
  );
};