import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { NoxLogo } from './NoxLogo';
import { useCart } from '../store/useCart';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart, onOpenAdmin }) => {
  const getTotalItems = useCart((state) => state.getTotalItems);
  const totalItems = getTotalItems();

  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Espacio izquierdo para centrar el logo */}
        <div className="w-10" />

        {/* LOGO CENTRAL DE NOX (Funciona como acceso al Panel Admin al hacer clic) */}
        <button
          onClick={onOpenAdmin}
          className="flex items-center justify-center cursor-pointer group focus:outline-none py-2 px-4"
          title="Abrir Panel Admin"
        >
          <NoxLogo className="transition-opacity group-hover:opacity-80" />
        </button>

        {/* Botón Carrito */}
        <button
          onClick={onOpenCart}
          className="relative p-2 text-zinc-300 hover:text-white transition-colors"
          title="Ver Bolsa"
        >
          <ShoppingBag className="w-5 h-5" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-amber-200 text-zinc-950 font-mono text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0a0a0a]">
              {totalItems}
            </span>
          )}
        </button>

      </div>
    </header>
  );
};