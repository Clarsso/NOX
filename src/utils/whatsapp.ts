import type { CartItem } from '../types';

export const sendWhatsAppOrder = (
  items: CartItem[], 
  deliveryMethod: string = 'Entrega Local',
  notes: string = '',
  phoneNumber: string = '526567450396'
) => {
  if (items.length === 0) return;

  const itemsText = items.map((item) => {
    const variantInfo = item.selectedVariant ? ` (${item.product.variantLabel || 'Opción'}: ${item.selectedVariant})` : '';
    return `• ${item.quantity}x ${item.product.name}${variantInfo} - $${item.product.price * item.quantity} MXN`;
  }).join('\n');

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  let message = `¡Hola! Me interesa realizar el siguiente pedido desde su catálogo web:\n\n${itemsText}\n\n*Total Estimado:* $${total} MXN\n*Método de Entrega:* ${deliveryMethod}`;

  if (notes.trim()) {
    message += `\n*Notas/Especificaciones:* ${notes.trim()}`;
  }

  message += `\n\n¿Tienen disponibilidad para coordinar la entrega y el pago?`;

  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  
  window.open(url, '_blank');
};