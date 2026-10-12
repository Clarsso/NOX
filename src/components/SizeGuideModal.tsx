import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';
import type { Category } from '../types';

interface SizeGuideModalProps {
  isOpen: boolean;
  category: Category;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, category, onClose }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'camisas' | 'joyeria'>(
    category === 'joyeria' ? 'joyeria' : 'camisas'
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-[#141414] border border-zinc-800 rounded-2xl overflow-hidden max-w-lg w-full shadow-2xl z-10 p-6 space-y-5 text-zinc-200 font-sans max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-amber-200" />
            <h3 className="font-mono font-bold text-base text-zinc-100 uppercase tracking-wider">
              GUÍA DE TALLAS Y MEDIDAS
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-full bg-zinc-900 border border-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-zinc-800/80 pb-3 font-mono text-xs">
          <button
            onClick={() => setActiveTab('camisas')}
            className={`px-4 py-2 rounded-xl border transition-all ${
              activeTab === 'camisas'
                ? 'bg-zinc-100 text-zinc-950 border-zinc-100 font-bold'
                : 'bg-[#0a0a0a] text-zinc-400 border-zinc-800'
            }`}
          >
            CAMISAS OVERSIZE
          </button>
          <button
            onClick={() => setActiveTab('joyeria')}
            className={`px-4 py-2 rounded-xl border transition-all ${
              activeTab === 'joyeria'
                ? 'bg-zinc-100 text-zinc-950 border-zinc-100 font-bold'
                : 'bg-[#0a0a0a] text-zinc-400 border-zinc-800'
            }`}
          >
            ANILLOS Y CADENAS
          </button>
        </div>

        {/* Camisas */}
        {activeTab === 'camisas' && (
          <div className="space-y-4">
            <p className="text-xs text-zinc-400 leading-relaxed">
              Corte <span className="text-white font-bold">Streetwear Oversize</span> con hombro caído.
            </p>

            <div className="overflow-x-auto border border-zinc-800 rounded-xl bg-[#0a0a0a]">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-zinc-900/80 text-zinc-400 border-b border-zinc-800">
                  <tr>
                    <th className="p-3">TALLA</th>
                    <th className="p-3">ANCHO (PECHO)</th>
                    <th className="p-3">LARGO TOTAL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                  <tr><td className="p-3 font-bold text-white">S</td><td className="p-3">56 cm</td><td className="p-3">72 cm</td></tr>
                  <tr><td className="p-3 font-bold text-white">M</td><td className="p-3">59 cm</td><td className="p-3">75 cm</td></tr>
                  <tr><td className="p-3 font-bold text-white">L</td><td className="p-3">62 cm</td><td className="p-3">78 cm</td></tr>
                  <tr><td className="p-3 font-bold text-white">XL</td><td className="p-3">65 cm</td><td className="p-3">81 cm</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Anillos */}
        {activeTab === 'joyeria' && (
          <div className="space-y-4">
            <p className="text-xs text-zinc-400 leading-relaxed">
              Medida de la circunferencia interna en milímetros.
            </p>

            <div className="overflow-x-auto border border-zinc-800 rounded-xl bg-[#0a0a0a]">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-zinc-900/80 text-zinc-400 border-b border-zinc-800">
                  <tr>
                    <th className="p-3">TALLA</th>
                    <th className="p-3">CIRCUNFERENCIA</th>
                    <th className="p-3">DIÁMETRO INT.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                  <tr><td className="p-3 font-bold text-white">7</td><td className="p-3">54 mm</td><td className="p-3">17.3 mm</td></tr>
                  <tr><td className="p-3 font-bold text-white">8</td><td className="p-3">57 mm</td><td className="p-3">18.1 mm</td></tr>
                  <tr><td className="p-3 font-bold text-white">9</td><td className="p-3">60 mm</td><td className="p-3">18.9 mm</td></tr>
                  <tr><td className="p-3 font-bold text-white">10</td><td className="p-3">62 mm</td><td className="p-3">19.8 mm</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

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