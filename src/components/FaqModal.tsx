import React from 'react';
import { X, CreditCard, Banknote, MapPin, ShieldCheck, HelpCircle } from 'lucide-react';

interface FaqModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FaqModal: React.FC<FaqModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-[#141414] border border-zinc-800 rounded-2xl overflow-hidden max-w-lg w-full shadow-2xl z-10 p-6 space-y-6 text-zinc-200 font-sans max-h-[90vh] overflow-y-auto">
        
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-200" />
            <h3 className="font-mono font-bold text-base text-zinc-100 uppercase tracking-wider">
              ENTREGAS Y PAGOS
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-white rounded-full bg-zinc-900 border border-zinc-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Métodos de Pago */}
        <div className="space-y-3">
          <h4 className="font-mono text-xs font-bold text-zinc-400 uppercase tracking-wider">
            💳 Métodos de Pago Aceptados
          </h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0a0a0a] border border-zinc-800 p-3.5 rounded-xl flex items-start gap-3">
              <Banknote className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-mono font-bold text-xs text-white">Efectivo</p>
                <p className="text-[11px] text-zinc-500 mt-0.5">Pago físico al momento de recibir tu pedido en punto medio.</p>
              </div>
            </div>

            <div className="bg-[#0a0a0a] border border-zinc-800 p-3.5 rounded-xl flex items-start gap-3">
              <CreditCard className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-mono font-bold text-xs text-white">Transferencia</p>
                <p className="text-[11px] text-zinc-500 mt-0.5">SPEI inmediato (BBVA / Banamex / Nu) al entregar.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Logística Juárez */}
        <div className="space-y-3 pt-2 border-t border-zinc-800/80">
          <h4 className="font-mono text-xs font-bold text-zinc-400 uppercase tracking-wider">
            📍 Entregas en Cd. Juárez
          </h4>

          <div className="space-y-2 text-xs text-zinc-300">
            <div className="bg-[#0a0a0a] border border-zinc-800/60 p-3 rounded-xl">
              <p className="font-mono font-bold text-zinc-100 flex items-center gap-1.5 mb-1">
                <MapPin className="w-3.5 h-3.5 text-amber-200" /> 1. Puntos Medios Gratuitos
              </p>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                Plazas céntricas (Las Misiones, Sendero, Galerías Tec, S-Mart La Cuesta, etc.) sin costo.
              </p>
            </div>

            <div className="bg-[#0a0a0a] border border-zinc-800/60 p-3 rounded-xl">
              <p className="font-mono font-bold text-zinc-100 flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 2. Revisión al Entregar
              </p>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                Puedes checar la prenda o joyería antes de realizar tu pago para asegurarte de la talla y la calidad.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-zinc-100 hover:bg-white text-zinc-950 font-mono font-bold text-xs py-3 rounded-full uppercase tracking-wider transition-all"
        >
          ENTENDIDO
        </button>

      </div>
    </div>
  );
};