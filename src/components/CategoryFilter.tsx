import React from 'react';
import type { Category } from '../types';

interface CategoryFilterProps {
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
}

const categories: { id: Category; label: string; tag: string }[] = [
  { id: 'todas', label: 'TODAS LAS PIEZAS', tag: 'ALL' },
  { id: 'camisas', label: 'STREETWEAR & CAMISAS', tag: '01' },
  { id: 'perfumes', label: 'FRAGANCIAS NICHO', tag: '02' },
  { id: 'joyeria', label: 'JOYERÍA & ACCESORIOS', tag: '03' },
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex justify-start sm:justify-center gap-3 my-10 px-4 overflow-x-auto pb-2 no-scrollbar">
      {categories.map((cat) => {
        const isActive = selectedCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-5 py-2.5 rounded-full text-xs font-mono font-bold tracking-wider transition-all duration-300 whitespace-nowrap flex items-center gap-2 border ${
              isActive
                ? 'bg-zinc-100 text-zinc-950 border-zinc-100 shadow-md'
                : 'bg-[#141414] text-zinc-400 border-zinc-800/80 hover:border-zinc-600 hover:text-zinc-200'
            }`}
          >
            <span className={`text-[10px] px-1.5 py-0.5 rounded ${isActive ? 'bg-zinc-950 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
              {cat.tag}
            </span>
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
};