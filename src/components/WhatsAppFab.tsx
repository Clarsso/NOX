import React from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppFab: React.FC = () => {
  const phoneNumber = '526567450396'; // Reemplazar por tu número real de Juárez
  const defaultMsg = encodeURIComponent('¡Hola FIRMA STUDIO! Quisiera hacer una consulta sobre entregas y disponibilidad en Cd. Juárez.');

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${defaultMsg}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 left-5 z-40 bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 rounded-full shadow-2xl border border-emerald-400/30 flex items-center gap-2 group transition-all duration-300 active:scale-95"
      aria-label="Contacto directo por WhatsApp"
    >
      <MessageCircle className="w-5 h-5 fill-current" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 font-mono text-xs font-bold uppercase tracking-wider">
        Dudas por WhatsApp
      </span>
    </a>
  );
};