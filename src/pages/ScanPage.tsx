import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext, FoodEntry } from '@/context/AppContext';
import { ScanLine, Camera, Search, Coffee, UtensilsCrossed } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Expanded food & drink database
const foodDB: Record<string, Omit<FoodEntry, 'id' | 'date'>> = {
  // Frutas
  manzana: { name: 'Manzana', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4, servingSize: 182 },
  platano: { name: 'Plátano', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1, servingSize: 118 },
  naranja: { name: 'Naranja', calories: 62, protein: 1.2, carbs: 15, fat: 0.2, fiber: 3.1, servingSize: 131 },
  fresa: { name: 'Fresas', calories: 49, protein: 1, carbs: 12, fat: 0.5, fiber: 3, servingSize: 152 },
  uva: { name: 'Uvas', calories: 104, protein: 1.1, carbs: 27, fat: 0.2, fiber: 1.4, servingSize: 151 },
  sandia: { name: 'Sandía', calories: 86, protein: 1.7, carbs: 22, fat: 0.4, fiber: 1.1, servingSize: 286 },
  mango: { name: 'Mango', calories: 99, protein: 1.4, carbs: 25, fat: 0.6, fiber: 2.6, servingSize: 165 },
  pina: { name: 'Piña', calories: 82, protein: 0.9, carbs: 22, fat: 0.2, fiber: 2.3, servingSize: 165 },
  // Proteínas
  pollo: { name: 'Pechuga de pollo', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, servingSize: 100 },
  salmon: { name: 'Salmón', calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, servingSize: 100 },
  huevo: { name: 'Huevo', calories: 78, protein: 6, carbs: 0.6, fat: 5, fiber: 0, servingSize: 50 },
  atun: { name: 'Atún', calories: 132, protein: 29, carbs: 0, fat: 1, fiber: 0, servingSize: 100 },
  carne: { name: 'Carne de res', calories: 250, protein: 26, carbs: 0, fat: 15, fiber: 0, servingSize: 100 },
  tofu: { name: 'Tofu', calories: 76, protein: 8, carbs: 1.9, fat: 4.8, fiber: 0.3, servingSize: 100 },
  // Carbohidratos
  arroz: { name: 'Arroz blanco', calories: 206, protein: 4.3, carbs: 45, fat: 0.4, fiber: 0.6, servingSize: 158 },
  pasta: { name: 'Pasta cocida', calories: 220, protein: 8, carbs: 43, fat: 1.3, fiber: 2.5, servingSize: 140 },
  pan: { name: 'Pan integral', calories: 81, protein: 4, carbs: 14, fat: 1.1, fiber: 1.9, servingSize: 33 },
  avena: { name: 'Avena', calories: 154, protein: 5.3, carbs: 27, fat: 2.6, fiber: 4, servingSize: 40 },
  papa: { name: 'Papa', calories: 161, protein: 4.3, carbs: 37, fat: 0.2, fiber: 3.8, servingSize: 213 },
  tortilla: { name: 'Tortilla de maíz', calories: 52, protein: 1.4, carbs: 11, fat: 0.7, fiber: 1.5, servingSize: 24 },
  // Verduras
  brocoli: { name: 'Brócoli', calories: 55, protein: 3.7, carbs: 11, fat: 0.6, fiber: 5.1, servingSize: 156 },
  espinaca: { name: 'Espinaca', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, servingSize: 100 },
  zanahoria: { name: 'Zanahoria', calories: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8, servingSize: 100 },
  tomate: { name: 'Tomate', calories: 22, protein: 1.1, carbs: 4.8, fat: 0.2, fiber: 1.5, servingSize: 123 },
  aguacate: { name: 'Aguacate', calories: 240, protein: 3, carbs: 13, fat: 22, fiber: 10, servingSize: 150 },
  // Lácteos
  yogur: { name: 'Yogur natural', calories: 100, protein: 17, carbs: 6, fat: 0.7, fiber: 0, servingSize: 170 },
  leche: { name: 'Leche entera', calories: 149, protein: 8, carbs: 12, fat: 8, fiber: 0, servingSize: 244 },
  queso: { name: 'Queso cheddar', calories: 113, protein: 7, carbs: 0.4, fat: 9, fiber: 0, servingSize: 28 },
  // Snacks
  almendras: { name: 'Almendras', calories: 164, protein: 6, carbs: 6, fat: 14, fiber: 3.5, servingSize: 28 },
  granola: { name: 'Granola', calories: 210, protein: 5, carbs: 34, fat: 7, fiber: 3, servingSize: 50 },
  chocolate: { name: 'Chocolate oscuro', calories: 170, protein: 2.2, carbs: 13, fat: 12, fiber: 3.1, servingSize: 28 },
  // Comidas preparadas
  pizza: { name: 'Pizza margarita', calories: 266, protein: 11, carbs: 33, fat: 10, fiber: 2.3, servingSize: 107 },
  hamburguesa: { name: 'Hamburguesa', calories: 354, protein: 20, carbs: 29, fat: 17, fiber: 1.3, servingSize: 150 },
  tacos: { name: 'Tacos de carne', calories: 226, protein: 13, carbs: 20, fat: 10, fiber: 2, servingSize: 130 },
  sushi: { name: 'Sushi (6 pzas)', calories: 250, protein: 9, carbs: 38, fat: 7, fiber: 1, servingSize: 180 },
  ensalada: { name: 'Ensalada César', calories: 180, protein: 8, carbs: 10, fat: 12, fiber: 3, servingSize: 200 },
  burrito: { name: 'Burrito', calories: 350, protein: 15, carbs: 45, fat: 12, fiber: 4, servingSize: 200 },
  // Bebidas
  cafe: { name: 'Café negro', calories: 2, protein: 0.3, carbs: 0, fat: 0, fiber: 0, servingSize: 240 },
  'cafe-latte': { name: 'Café latte', calories: 190, protein: 10, carbs: 18, fat: 7, fiber: 0, servingSize: 360 },
  'te-verde': { name: 'Té verde', calories: 2, protein: 0, carbs: 0, fat: 0, fiber: 0, servingSize: 240 },
  'jugo-naranja': { name: 'Jugo de naranja', calories: 112, protein: 1.7, carbs: 26, fat: 0.5, fiber: 0.5, servingSize: 248 },
  'smoothie-frutas': { name: 'Smoothie de frutas', calories: 180, protein: 3, carbs: 40, fat: 1, fiber: 3, servingSize: 350 },
  'agua-mineral': { name: 'Agua mineral', calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, servingSize: 330 },
  'refresco-cola': { name: 'Refresco de cola', calories: 140, protein: 0, carbs: 39, fat: 0, fiber: 0, servingSize: 355 },
  cerveza: { name: 'Cerveza', calories: 153, protein: 1.6, carbs: 13, fat: 0, fiber: 0, servingSize: 355 },
  'vino-tinto': { name: 'Vino tinto', calories: 125, protein: 0.1, carbs: 4, fat: 0, fiber: 0, servingSize: 148 },
  'leche-almendra': { name: 'Leche de almendra', calories: 39, protein: 1, carbs: 3.4, fat: 2.5, fiber: 0.5, servingSize: 240 },
  'proteina-shake': { name: 'Batido de proteína', calories: 150, protein: 25, carbs: 8, fat: 2, fiber: 1, servingSize: 300 },
  horchata: { name: 'Horchata', calories: 156, protein: 0.8, carbs: 32, fat: 2.7, fiber: 0.4, servingSize: 240 },
};

const ScanPage = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { setScannedFood } = useAppContext();
  const navigate = useNavigate();

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const keys = Object.keys(foodDB);
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      const food = foodDB[randomKey];
      const entry: FoodEntry = {
        ...food,
        id: crypto.randomUUID(),
        date: new Date().toISOString().split('T')[0],
      };
      setScannedFood(entry);
      setIsScanning(false);
      navigate('/food-detail');
    }, 1500);
  };

  const handleSearch = (name: string) => {
    const key = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const food = foodDB[key];
    if (food) {
      const entry: FoodEntry = {
        ...food,
        id: crypto.randomUUID(),
        date: new Date().toISOString().split('T')[0],
      };
      setScannedFood(entry);
      navigate('/food-detail');
    }
  };

  const filteredFoods = Object.entries(foodDB).filter(([key, food]) =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-20 px-5 pt-12 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold font-display mb-6 animate-slide-up">Escanear alimento</h1>

      {/* Camera scan area */}
      <div className="animate-scale-in">
        <button
          onClick={handleScan}
          disabled={isScanning}
          className="w-full aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/5 to-accent/10 border-2 border-dashed border-primary/30 flex flex-col items-center justify-center gap-3 transition-all hover:border-primary/50 active:scale-[0.98] disabled:opacity-60"
        >
          {isScanning ? (
            <>
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-pulse-soft">
                <ScanLine size={32} className="text-primary" />
              </div>
              <p className="text-sm text-primary font-medium">Escaneando...</p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Camera size={32} className="text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground">Toca para escanear</p>
              <p className="text-xs text-muted-foreground">Cualquier alimento o bebida</p>
            </>
          )}
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground flex items-center gap-1.5">
          <UtensilsCrossed size={12} />
          o busca
          <Coffee size={12} />
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Search */}
      <div className="relative mb-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar comida o bebida..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 rounded-xl bg-card border-border"
        />
      </div>

      {/* Food list */}
      <div className="space-y-2 animate-slide-up max-h-[45vh] overflow-y-auto" style={{ animationDelay: '0.15s' }}>
        {(searchQuery ? filteredFoods : Object.entries(foodDB)).map(([key, food]) => (
          <button
            key={key}
            onClick={() => handleSearch(key)}
            className="w-full glass-card rounded-xl p-3 flex items-center justify-between text-left transition-all hover:bg-accent/50 active:scale-[0.98]"
          >
            <div>
              <p className="text-sm font-medium">{food.name}</p>
              <p className="text-xs text-muted-foreground">{food.servingSize}g por porción</p>
            </div>
            <p className="text-sm font-semibold font-display">{food.calories} <span className="text-xs text-muted-foreground">kcal</span></p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ScanPage;
