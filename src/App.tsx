import { useState, useEffect } from 'react';
import { ShoppingBag, Search, SlidersHorizontal, HelpCircle, CheckCircle2 } from 'lucide-react';
import { initialProducts } from './data/products';
import type { Product, Category } from './types';
import { ProductCard } from './components/ProductCard';
import { QuickViewModal } from './components/QuickViewModal';
import { CartDrawer } from './components/CartDrawer';
import { FaqModal } from './components/FaqModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { WhatsAppFab } from './components/WhatsAppFab';
import { NoxLogo } from './components/NoxLogo';
import { useCart } from './store/useCart';
import { trackEvent } from './utils/analytics';
import { subscribeToProducts, saveProductsToCloud } from './lib/firebase';
import { isProductAvailable } from './utils/stockHelpers';

export function App() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  
  const [selectedCategory, setSelectedCategory] = useState<Category>('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSize, setSelectedSize] = useState<string>('todas');
  const [priceFilter, setPriceFilter] = useState<'todos' | 'low' | 'mid' | 'high'>('todos');
  const [onlyDrops, setOnlyDrops] = useState<boolean>(false);

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [logoClickCount, setLogoClickCount] = useState(0);

  const getTotalItems = useCart((state) => state.getTotalItems);
  const totalCartItems = getTotalItems();

  useEffect(() => {
    const unsubscribe = subscribeToProducts((cloudProducts) => {
      if (cloudProducts && cloudProducts.length > 0) {
        setProducts(cloudProducts);
      }
    });
    return () => unsubscribe();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleLogoClick = () => {
    const newCount = logoClickCount + 1;
    if (newCount >= 3) {
      setIsAdminOpen(true);
      setLogoClickCount(0);
    } else {
      setLogoClickCount(newCount);
      setTimeout(() => setLogoClickCount(0), 2000);
    }
  };

  const handleSaveProducts = async (updated: Product[]) => {
    setProducts(updated);
    await saveProductsToCloud(updated);
    showToast('¡CATÁLOGOSINCRONIZADO EN LA NUBE!');
  };

  const handleOpenQuickView = (product: Product) => {
    trackEvent(product.id, 'view');
    setQuickViewProduct(product);
  };

  // Filtrado y Ordenamiento Automático (Agotados enviados al fondo del catálogo)
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (selectedCategory !== 'todas' && p.category !== selectedCategory) return false;
    if (onlyDrops && p.stockStatus !== 'pocas_piezas') return false;
    if (selectedSize !== 'todas' && (!p.variants || !p.variants.includes(selectedSize))) return false;

    if (priceFilter === 'low' && p.price > 700) return false;
    if (priceFilter === 'mid' && (p.price < 700 || p.price > 1000)) return false;
    if (priceFilter === 'high' && p.price < 1000) return false;

    return true;
  }).sort((a, b) => {
    const aAvailable = isProductAvailable(a);
    const bAvailable = isProductAvailable(b);
    
    if (aAvailable && !bAvailable) return -1;
    if (!aAvailable && bAvailable) return 1;
    return 0;
  });

  const categories: { id: Category; label: string }[] = [
    { id: 'todas', label: 'TODAS LAS PIEZAS' },
    { id: 'camisas', label: 'CAMISAS' },
    { id: 'perfumes', label: 'PERFUMES' },
    { id: 'joyeria', label: 'JOYERÍA' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans antialiased selection:bg-zinc-800 selection:text-white flex flex-col justify-between">
      
    {/* Notificación Flotante Inteligente en la parte Inferior */}
{toastMessage && (
  <div 
    onClick={() => setToastMessage(null)}
    className="fixed bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0 z-50 bg-zinc-100/95 text-zinc-950 font-mono text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-white cursor-pointer transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
  >
    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
    <span>{toastMessage}</span>
    <span className="text-[10px] text-zinc-400 ml-2 font-normal">(Toca para cerrar)</span>
  </div>
)}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            
            {/* LOGO NOX (Hazle 3 clics para abrir el panel admin) */}
            <div 
              onClick={handleLogoClick}
              className="cursor-pointer select-none flex items-center"
              title="NOX"
            >
              <NoxLogo className="h-29" />
            </div>

            <div className="flex-1 max-w-md hidden sm:block">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Buscar prendas, fragancias, plata..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#141414] text-zinc-200 placeholder-zinc-500 text-xs font-mono rounded-full pl-10 pr-4 py-2 border border-zinc-800 focus:outline-none focus:border-zinc-600 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFaqOpen(true)}
                className="hidden md:flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors bg-[#141414] px-3 py-1.5 rounded-full border border-zinc-800"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-200" />
                <span>Entregas & Pagos</span>
              </button>

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative bg-zinc-100 hover:bg-white text-zinc-950 p-2.5 rounded-full font-mono text-xs font-bold transition-all shadow-md flex items-center justify-center active:scale-95"
                aria-label="Ver bolsa"
              >
                <ShoppingBag className="w-4 h-4" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-500 text-zinc-950 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0a0a0a]">
                    {totalCartItems}
                  </span>
                )}
              </button>
            </div>

          </div>

          <div className="pb-3 sm:hidden">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Buscar en el catálogo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#141414] text-zinc-200 placeholder-zinc-500 text-xs font-mono rounded-full pl-10 pr-4 py-2 border border-zinc-800 focus:outline-none focus:border-zinc-600"
              />
            </div>
          </div>

        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 space-y-6">
        
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full font-mono text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-zinc-100 text-zinc-950 border-zinc-100 shadow-md'
                  : 'bg-[#141414] text-zinc-400 border-zinc-800/80 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-2.5 py-3 px-4 bg-[#121212] rounded-2xl border border-zinc-800/80 font-mono text-xs">
          <div className="flex items-center gap-1 text-zinc-500 text-[11px] uppercase mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Filtrar:</span>
          </div>

          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="bg-[#0a0a0a] text-zinc-300 border border-zinc-800 rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="todas">Todas las Tallas</option>
            <option value="S">Talla S</option>
            <option value="M">Talla M</option>
            <option value="L">Talla L</option>
            <option value="XL">Talla XL</option>
          </select>

          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value as any)}
            className="bg-[#0a0a0a] text-zinc-300 border border-zinc-800 rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="todos">Todos los Precios</option>
            <option value="low">Hasta $700 MXN</option>
            <option value="mid">$700 - $1,000 MXN</option>
            <option value="high">Más de $1,000 MXN</option>
          </select>

          <button
            onClick={() => setOnlyDrops(!onlyDrops)}
            className={`px-3 py-1.5 rounded-xl border font-bold transition-all ${
              onlyDrops
                ? 'bg-amber-400/10 text-amber-300 border-amber-500/50'
                : 'bg-[#0a0a0a] text-zinc-400 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            🔥 Solo Pocas Piezas
          </button>

          <button
            onClick={() => setIsFaqOpen(true)}
            className="ml-auto text-zinc-400 hover:text-white underline text-[11px] flex items-center gap-1 sm:hidden"
          >
            💳 Pagos y Envíos
          </button>
        </div>

        {/* Productos */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <p className="font-mono text-zinc-400 text-sm uppercase">No se encontraron piezas con esos filtros</p>
            <button
              onClick={() => {
                setSelectedCategory('todas');
                setSelectedSize('todas');
                setPriceFilter('todos');
                setOnlyDrops(false);
                setSearchQuery('');
              }}
              className="text-xs font-mono text-zinc-200 underline hover:text-white uppercase"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={handleOpenQuickView}
                onShowToast={showToast}
              />
            ))}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-[#0e0e0e] py-8 text-center text-zinc-500 font-mono text-xs">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="text-zinc-400 font-bold uppercase tracking-widest">NOX — CIUDAD JUÁREZ</p>
          <p className="text-[11px] text-zinc-600">Entregas coordinadas directas en puntos medios de Cd. Juárez.</p>
        </div>
      </footer>

      {/* Botón WhatsApp */}
      <WhatsAppFab />

      {/* Modales */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onShowToast={showToast}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        products={products}
        onUpdateProducts={(newProds) => setProducts(newProds)}
        onShowToast={showToast}
      />

      <FaqModal
        isOpen={isFaqOpen}
        onClose={() => setIsFaqOpen(false)}
      />

      <AdminPanelModal
        isOpen={isAdminOpen}
        products={products}
        onClose={() => setIsAdminOpen(false)}
        onSaveProducts={handleSaveProducts}
      />

    </div>
  );
}

export default App;