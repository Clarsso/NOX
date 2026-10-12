import type { Product } from '../types';

export const initialProducts: Product[] = [
  {
    id: 'c1',
    name: 'T-Shirt Heavyweight "HELLSTAR / FLAMES"',
    category: 'camisas',
    price: 650,
    description: 'Camisa 100% algodón de alto gramaje (240 GSM). Estampado serigráfico de alta densidad en frente y espalda. Corte oversize streetwear.',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=1000'
    ],
    badge: 'DROP EXCLUSIVO',
    stockStatus: 'pocas_piezas',
    hasVariants: true,
    variantLabel: 'Talla',
    variants: ['M', 'L', 'XL'],
  },
  {
    id: 'c2',
    name: 'T-Shirt "THE WORLD IS YOURS" Graphic',
    category: 'camisas',
    price: 600,
    description: 'Estampado gráfico frontal y trasero. Lavado vintage acid wash negro. Cuello reforzado y textura suave premium.',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=1000',
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000'
    ],
    badge: 'NUEVO',
    stockStatus: 'disponible',
    hasVariants: true,
    variantLabel: 'Talla',
    variants: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'p1',
    name: 'Fragancia Nicho "OBSIDIAN NIGHT" 100ml',
    category: 'perfumes',
    price: 1250,
    description: 'Notas de salida de bergamota e incienso, corazón de ámbar negro y fondo de madera de oud. Larga duración (10-12 hrs). Extrait de Parfum.',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=1000',
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=1000'
    ],
    badge: 'BESTSELLER',
    stockStatus: 'pocas_piezas',
    hasVariants: false,
  },
  {
    id: 'j1',
    name: 'Anillo Signet "CROMO FIRMA" Plata .925',
    category: 'joyeria',
    price: 850,
    description: 'Anillo de sello macizo en Plata de Ley .925 con grabado láser del monograma de marca. Acabado pulido espejo y resistencia total al agua.',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1000',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=1000'
    ],
    badge: 'PLATA .925',
    stockStatus: 'disponible',
    hasVariants: true,
    variantLabel: 'Medida / Talla',
    variants: ['7', '8', '9', '10', '11'],
  },
];