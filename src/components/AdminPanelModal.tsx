import React, { useState } from 'react';
import { 
  X, Plus, Trash2, Edit2, BarChart2, Package, Save, Lock, Upload, 
  Copy, Settings 
} from 'lucide-react';
import type { Product, Category } from '../types';
import { getAnalyticsData } from '../utils/analytics';
import { sortSizes } from '../utils/sortSizes';

interface AdminPanelModalProps {
  isOpen: boolean;
  products: Product[];
  onClose: () => void;
  onSaveProducts: (updatedProducts: Product[]) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  products,
  onClose,
  onSaveProducts,
}) => {
  if (!isOpen) return null;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const ADMIN_PASSWORD = 'FIRMA2026';

  const [activeTab, setActiveTab] = useState<'inventory' | 'analytics' | 'settings'>('inventory');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  const [announcementText, setAnnouncementText] = useState(
    () => localStorage.getItem('firma_announcement') || '🚨 ENTREGAS GRATUITAS EN PUNTOS MEDIOS DE CD. JUÁREZ'
  );

  const analytics = getAnalyticsData();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError(false);
      setPasswordInput('');
    } else {
      setPasswordError(true);
    }
  };

  const handleAddSize = (newSizeRaw: string) => {
    const newSize = newSizeRaw.trim().toUpperCase();
    if (!newSize) return;

    const currentVariants = editingProduct?.variants || [];
    const currentStock = editingProduct?.variantStock || {};

    if (!currentVariants.includes(newSize)) {
      const updatedVariants = sortSizes([...currentVariants, newSize]);
      setEditingProduct({
        ...editingProduct,
        variants: updatedVariants,
        variantStock: {
          ...currentStock,
          [newSize]: currentStock[newSize] ?? 1,
        },
      });
    }
  };

  const handleMultipleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const loadedImages: string[] = [];

    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          loadedImages.push(reader.result);
          if (loadedImages.length === fileArray.length) {
            const currentImages = editingProduct?.images || [];
            const allImages = [...currentImages, ...loadedImages];
            setEditingProduct({
              ...editingProduct,
              image: editingProduct?.image || allImages[0],
              images: allImages,
            });
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSetMainImage = (index: number) => {
    if (!editingProduct?.images) return;
    setEditingProduct({
      ...editingProduct,
      image: editingProduct.images[index],
    });
  };

  const handleRemoveImage = (indexToRemove: number) => {
    if (!editingProduct?.images) return;
    const updatedImages = editingProduct.images.filter((_, idx) => idx !== indexToRemove);
    setEditingProduct({
      ...editingProduct,
      image: updatedImages[0] || '',
      images: updatedImages,
    });
  };

  const handleDuplicateProduct = (productToDuplicate: Product) => {
    const duplicated: Product = {
      ...productToDuplicate,
      id: `p_${Date.now()}`,
      name: `${productToDuplicate.name} (COPIA)`,
    };
    onSaveProducts([duplicated, ...products]);
  };

  const handleSaveItem = () => {
    if (!editingProduct?.name || !editingProduct?.price) return;

    const finalImage = editingProduct.image || editingProduct.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518';
    const finalImages = editingProduct.images && editingProduct.images.length > 0 ? editingProduct.images : [finalImage];

    const isPerfume = editingProduct.category === 'perfumes';
    const orderedVariants = isPerfume ? ['GENERAL'] : sortSizes(editingProduct.variants || ['S', 'M', 'L', 'XL']);

    if (editingProduct.id) {
      const updated = products.map((p) =>
        p.id === editingProduct.id
          ? ({ ...p, ...editingProduct, image: finalImage, images: finalImages, variants: orderedVariants } as Product)
          : p
      );
      onSaveProducts(updated);
    } else {
      const newProduct: Product = {
        id: `p_${Date.now()}`,
        name: editingProduct.name || 'Nueva Pieza',
        category: (editingProduct.category as Category) || 'camisas',
        price: Number(editingProduct.price) || 0,
        costPrice: Number(editingProduct.costPrice) || 0,
        description: editingProduct.description || '',
        image: finalImage,
        images: finalImages,
        badge: editingProduct.badge || 'NUEVO DROP',
        stockStatus: (editingProduct.stockStatus as any) || 'disponible',
        hasVariants: !isPerfume,
        variantLabel: isPerfume ? 'Presentación' : 'Talla',
        variants: orderedVariants,
        variantStock: editingProduct.variantStock || (isPerfume ? { GENERAL: 5 } : { S: 2, M: 3, L: 2, XL: 1 })
      };
      onSaveProducts([newProduct, ...products]);
    }

    setEditingProduct(null);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('¿Seguro que deseas eliminar esta pieza del catálogo?')) {
      onSaveProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleSaveSettings = () => {
    localStorage.setItem('firma_announcement', announcementText);
    alert('¡Ajustes guardados correctamente!');
  };

  const totalValue = products.reduce((acc, p) => acc + p.price, 0);
  const totalCost = products.reduce((acc, p) => acc + (p.costPrice || 0), 0);
  const estimatedProfit = totalValue - totalCost;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />

      <div className="relative bg-[#141414] border border-zinc-800 rounded-2xl overflow-hidden max-w-4xl w-full shadow-2xl z-10 p-6 space-y-6 text-zinc-200 font-sans max-h-[90vh] overflow-y-auto">
        
        {!isAuthenticated ? (
          <div className="py-8 px-4 text-center space-y-6 max-w-sm mx-auto font-mono">
            <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center mx-auto text-amber-200">
              <Lock className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-bold text-base text-zinc-100 uppercase tracking-wider">PANEL ADMINISTRADOR</h3>
              <p className="text-xs text-zinc-500 mt-1">Ingresa la clave de acceso para gestionar inventario.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                placeholder="Contraseña del Admin"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-zinc-800 focus:border-zinc-500 rounded-xl px-4 py-3 text-sm text-center text-white focus:outline-none"
                autoFocus
              />

              {passwordError && (
                <p className="text-xs text-rose-500 font-bold">Contraseña incorrecta.</p>
              )}

              <button
                type="submit"
                className="w-full bg-zinc-100 hover:bg-white text-zinc-950 font-bold py-3 rounded-xl uppercase text-xs tracking-wider transition-all"
              >
                ENTRAR AL PANEL
              </button>
            </form>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2 font-mono">
                <Package className="w-5 h-5 text-amber-200" />
                <h3 className="font-bold text-base text-zinc-100 uppercase tracking-wider">
                  ADMINISTRACIÓN — NOX
                </h3>
              </div>
              <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-white rounded-full bg-zinc-900 border border-zinc-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="bg-[#0a0a0a] border border-zinc-800 p-3 rounded-xl">
                <span className="text-zinc-500 text-[10px] block uppercase">PIEZAS TOTALES</span>
                <span className="text-lg font-bold text-white">{products.length} Productos</span>
              </div>
              <div className="bg-[#0a0a0a] border border-zinc-800 p-3 rounded-xl">
                <span className="text-zinc-500 text-[10px] block uppercase">VALOR CATÁLOGO</span>
                <span className="text-lg font-bold text-emerald-400">${totalValue.toLocaleString()} MXN</span>
              </div>
              <div className="bg-[#0a0a0a] border border-zinc-800 p-3 rounded-xl">
                <span className="text-zinc-500 text-[10px] block uppercase">MARGEN ESTIMADO</span>
                <span className="text-lg font-bold text-amber-200">${estimatedProfit.toLocaleString()} MXN</span>
              </div>
            </div>

            <div className="flex gap-2 font-mono text-xs border-b border-zinc-800/80 pb-3 overflow-x-auto">
              <button
                onClick={() => setActiveTab('inventory')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all whitespace-nowrap ${
                  activeTab === 'inventory' ? 'bg-zinc-100 text-zinc-950 font-bold' : 'bg-[#0a0a0a] text-zinc-400 border-zinc-800'
                }`}
              >
                <Package className="w-4 h-4" /> INVENTARIO
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all whitespace-nowrap ${
                  activeTab === 'analytics' ? 'bg-zinc-100 text-zinc-950 font-bold' : 'bg-[#0a0a0a] text-zinc-400 border-zinc-800'
                }`}
              >
                <BarChart2 className="w-4 h-4" /> ANALÍTICAS
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all whitespace-nowrap ${
                  activeTab === 'settings' ? 'bg-zinc-100 text-zinc-950 font-bold' : 'bg-[#0a0a0a] text-zinc-400 border-zinc-800'
                }`}
              >
                <Settings className="w-4 h-4" /> AJUSTES
              </button>
            </div>

            {activeTab === 'inventory' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono text-zinc-400 uppercase">CATÁLOGO DE PRODUCTOS</span>
                  <button
                    onClick={() => setEditingProduct({ category: 'camisas', hasVariants: true, variants: ['S', 'M', 'L', 'XL'], variantStock: { S: 2, M: 3, L: 2, XL: 1 }, images: [] })}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs px-3.5 py-2 rounded-xl font-bold"
                  >
                    <Plus className="w-4 h-4" /> AGREGAR NUEVA PIEZA
                  </button>
                </div>

                {editingProduct && (
                  <div className="bg-[#0a0a0a] border border-zinc-700 p-4 rounded-xl space-y-4 font-mono text-xs">
                    <h4 className="text-amber-200 font-bold uppercase">{editingProduct.id ? 'EDITAR PIEZA' : 'NUEVA PIEZA'}</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Nombre del producto"
                        value={editingProduct.name || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        className="bg-[#141414] border border-zinc-800 p-2.5 rounded-lg text-white"
                      />
                      <input
                        type="number"
                        placeholder="Precio Venta ($ MXN)"
                        value={editingProduct.price || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                        className="bg-[#141414] border border-zinc-800 p-2.5 rounded-lg text-white"
                      />
                      <input
                        type="number"
                        placeholder="Costo Producción ($ MXN)"
                        value={editingProduct.costPrice || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, costPrice: Number(e.target.value) })}
                        className="bg-[#141414] border border-zinc-800 p-2.5 rounded-lg text-white"
                      />
                      <select
                        value={editingProduct.category || 'camisas'}
                        onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as Category })}
                        className="bg-[#141414] border border-zinc-800 p-2.5 rounded-lg text-white"
                      >
                        <option value="camisas">CAMISAS</option>
                        <option value="perfumes">PERFUMES</option>
                        <option value="joyeria">JOYERÍA</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Badge (ej. POCAS PIEZAS)"
                        value={editingProduct.badge || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                        className="bg-[#141414] border border-zinc-800 p-2.5 rounded-lg text-white"
                      />
                    </div>

                    {/* CONTROL DE INVENTARIO ADAPTATIVO */}
                    <div className="space-y-3 border-t border-zinc-800/80 pt-3 font-mono text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <label className="text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
                          📦 {editingProduct.category === 'perfumes' ? 'CONTROL DE UNIDADES (PERFUMES)' : 'UNIDADES Y STOCK POR TALLA'}
                        </label>

                        {editingProduct.category !== 'perfumes' && (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              id="newSizeInput"
                              placeholder="Ej. S, XXL, 11"
                              className="bg-[#141414] border border-zinc-800 px-2.5 py-1 rounded-lg text-xs text-white uppercase focus:outline-none focus:border-zinc-600 max-w-[120px]"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddSize(e.currentTarget.value);
                                  e.currentTarget.value = '';
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const input = document.getElementById('newSizeInput') as HTMLInputElement;
                                if (input) {
                                  handleAddSize(input.value);
                                  input.value = '';
                                }
                              }}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[11px]"
                            >
                              + AGREGAR TALLA
                            </button>
                          </div>
                        )}
                      </div>

                      {editingProduct.category === 'perfumes' ? (
                        <div className="bg-[#141414] p-4 rounded-xl border border-zinc-800 flex items-center justify-between">
                          <div>
                            <p className="font-bold text-white text-sm">Piezas Disponibles en Stock</p>
                            <p className="text-[10px] text-zinc-500">Frascos listos para entrega inmediata.</p>
                          </div>

                          <div className="flex items-center gap-3 bg-[#0a0a0a] border border-zinc-800 px-4 py-2 rounded-xl">
                            <button
                              type="button"
                              onClick={() => {
                                const currentStock = editingProduct.variantStock?.['GENERAL'] ?? editingProduct.variantStock?.['Único'] ?? 5;
                                const newQty = Math.max(0, currentStock - 1);
                                setEditingProduct({
                                  ...editingProduct,
                                  variants: ['GENERAL'],
                                  variantStock: { GENERAL: newQty }
                                });
                              }}
                              className="w-7 h-7 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-bold flex items-center justify-center text-sm"
                            >
                              -
                            </button>

                            <span className="font-bold text-amber-200 text-base w-8 text-center">
                              {editingProduct.variantStock?.['GENERAL'] ?? editingProduct.variantStock?.['Único'] ?? 5}
                            </span>

                            <button
                              type="button"
                              onClick={() => {
                                const currentStock = editingProduct.variantStock?.['GENERAL'] ?? editingProduct.variantStock?.['Único'] ?? 5;
                                const newQty = currentStock + 1;
                                setEditingProduct({
                                  ...editingProduct,
                                  variants: ['GENERAL'],
                                  variantStock: { GENERAL: newQty }
                                });
                              }}
                              className="w-7 h-7 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-bold flex items-center justify-center text-sm"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#141414] p-3 rounded-xl border border-zinc-800">
                          {sortSizes(editingProduct.variants || []).map((v) => {
                            const currentQty = editingProduct.variantStock?.[v] ?? 0;
                            return (
                              <div key={v} className="bg-[#0a0a0a] border border-zinc-800 p-2 rounded-lg flex flex-col justify-between gap-1">
                                <div className="flex justify-between items-center">
                                  <span className="font-bold text-white text-xs">{v}</span>
                                  <div className="flex items-center gap-1">
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${currentQty > 0 ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'}`}>
                                      {currentQty > 0 ? `${currentQty} disp.` : 'AGOTADA'}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updatedVariants = editingProduct.variants?.filter((item) => item !== v);
                                        const updatedStock = { ...(editingProduct.variantStock || {}) };
                                        delete updatedStock[v];
                                        setEditingProduct({
                                          ...editingProduct,
                                          variants: updatedVariants,
                                          variantStock: updatedStock,
                                        });
                                      }}
                                      className="text-zinc-500 hover:text-rose-400 p-0.5"
                                      title="Eliminar talla"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between gap-1 mt-1">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newStock = { ...(editingProduct.variantStock || {}), [v]: Math.max(0, currentQty - 1) };
                                      setEditingProduct({ ...editingProduct, variantStock: newStock });
                                    }}
                                    className="px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded font-bold"
                                  >
                                    -
                                  </button>
                                  <span className="font-bold text-amber-200">{currentQty}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newStock = { ...(editingProduct.variantStock || {}), [v]: currentQty + 1 };
                                      setEditingProduct({ ...editingProduct, variantStock: newStock });
                                    }}
                                    className="px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded font-bold"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* FOTOS */}
                    <div className="space-y-2 border-t border-zinc-800/80 pt-3">
                      <label className="block text-zinc-400 text-[11px] font-bold uppercase">
                        📷 FOTOS DESDE CÁMARA O GALERÍA
                      </label>

                      <div className="flex flex-wrap gap-2 items-center">
                        {editingProduct.images?.map((imgUrl, idx) => (
                          <div key={idx} className="relative w-20 h-24 rounded-lg overflow-hidden border border-zinc-800 group bg-black">
                            <img src={imgUrl} className="w-full h-full object-cover" alt="" />
                            {editingProduct.image === imgUrl && (
                              <span className="absolute bottom-1 left-1 bg-emerald-500 text-black text-[8px] font-bold px-1 rounded">PORTADA</span>
                            )}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-all">
                              <button
                                type="button"
                                onClick={() => handleSetMainImage(idx)}
                                className="text-[9px] bg-zinc-100 text-black px-1.5 py-0.5 rounded font-bold"
                              >
                                Portada
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(idx)}
                                className="text-[9px] bg-rose-600 text-white px-1.5 py-0.5 rounded"
                              >
                                Borrar
                              </button>
                            </div>
                          </div>
                        ))}

                        <label className="w-20 h-24 rounded-lg border-2 border-dashed border-zinc-700 hover:border-zinc-400 flex flex-col items-center justify-center cursor-pointer bg-[#141414] text-zinc-400 hover:text-white transition-all">
                          <Upload className="w-5 h-5 mb-1" />
                          <span className="text-[9px] font-bold">SUBIR</span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleMultipleImageUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    <textarea
                      placeholder="Descripción del producto..."
                      value={editingProduct.description || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      className="w-full bg-[#141414] border border-zinc-800 p-2.5 rounded-lg text-white"
                    />

                    <div className="flex gap-2 justify-end pt-2">
                      <button onClick={() => setEditingProduct(null)} className="px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-lg">Cancelar</button>
                      <button onClick={handleSaveItem} className="px-4 py-1.5 bg-zinc-100 text-zinc-950 font-bold rounded-lg flex items-center gap-1">
                        <Save className="w-3.5 h-3.5" /> Guardar Cambios
                      </button>
                    </div>
                  </div>
                )}

                <div className="overflow-x-auto border border-zinc-800 rounded-xl bg-[#0a0a0a]">
                  <table className="w-full text-left font-mono text-xs">
                    <thead className="bg-zinc-900 text-zinc-400 border-b border-zinc-800">
                      <tr>
                        <th className="p-3">PIEZA</th>
                        <th className="p-3">CATEGORÍA</th>
                        <th className="p-3">PRECIO / COSTO</th>
                        <th className="p-3 text-right">ACCIONES</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-zinc-900/50">
                          <td className="p-3 font-bold text-white flex items-center gap-2">
                            <img src={p.image} className="w-8 h-8 rounded object-cover border border-zinc-800" alt="" />
                            {p.name}
                          </td>
                          <td className="p-3 uppercase text-zinc-400">{p.category}</td>
                          <td className="p-3 font-bold text-emerald-400">
                            ${p.price} MXN {p.costPrice ? <span className="text-[10px] text-zinc-500 font-normal">(Costo: ${p.costPrice})</span> : ''}
                          </td>
                          <td className="p-3 text-right space-x-1.5">
                            <button onClick={() => handleDuplicateProduct(p)} title="Duplicar Drop" className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded">
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setEditingProduct(p)} title="Editar" className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded">
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleDeleteItem(p.id)} title="Eliminar" className="p-1.5 bg-rose-950 hover:bg-rose-900 text-rose-300 rounded">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-4 font-mono text-xs">
                <p className="text-zinc-400">Comportamiento de clientes en Juárez:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map((p) => {
                    const metric = analytics[p.id] || { views: 0, cartAdds: 0, orders: 0 };
                    return (
                      <div key={p.id} className="bg-[#0a0a0a] border border-zinc-800 p-4 rounded-xl space-y-2">
                        <div className="flex items-center gap-3">
                          <img src={p.image} className="w-10 h-12 object-cover rounded border border-zinc-800" alt="" />
                          <div>
                            <p className="font-bold text-white uppercase">{p.name}</p>
                            <p className="text-[10px] text-zinc-500">${p.price} MXN</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800/60 text-center">
                          <div className="bg-[#141414] p-2 rounded">
                            <span className="block text-zinc-500 text-[10px]">VISTAS</span>
                            <span className="font-bold text-amber-200 text-sm">{metric.views}</span>
                          </div>
                          <div className="bg-[#141414] p-2 rounded">
                            <span className="block text-zinc-500 text-[10px]">EN CARRITO</span>
                            <span className="font-bold text-emerald-400 text-sm">{metric.cartAdds}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-4 font-mono text-xs">
                <div>
                  <label className="block text-zinc-400 font-bold uppercase mb-2">
                    📢 TEXTO DEL ANUNCIO SUPERIOR
                  </label>
                  <input
                    type="text"
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-zinc-800 p-3 rounded-xl text-white focus:outline-none"
                    placeholder="Ej. 🚨 NUEVO DROP DISPONIBLE"
                  />
                </div>

                <button
                  onClick={handleSaveSettings}
                  className="bg-zinc-100 text-zinc-950 font-bold px-4 py-2.5 rounded-xl uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Guardar Ajustes
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};