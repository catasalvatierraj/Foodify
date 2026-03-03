import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext, FoodEntry } from '@/context/AppContext';
import { ScanLine, Camera, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Simulated food database
const foodDB: Record<string, Omit<FoodEntry, 'id' | 'date'>> = {
  manzana: { name: 'Manzana', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4, servingSize: 182 },
  platano: { name: 'Plátano', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1, servingSize: 118 },
  arroz: { name: 'Arroz blanco', calories: 206, protein: 4.3, carbs: 45, fat: 0.4, fiber: 0.6, servingSize: 158 },
  pollo: { name: 'Pechuga de pollo', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, servingSize: 100 },
  huevo: { name: 'Huevo', calories: 78, protein: 6, carbs: 0.6, fat: 5, fiber: 0, servingSize: 50 },
  avena: { name: 'Avena', calories: 154, protein: 5.3, carbs: 27, fat: 2.6, fiber: 4, servingSize: 40 },
  salmon: { name: 'Salmón', calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, servingSize: 100 },
  brocoli: { name: 'Brócoli', calories: 55, protein: 3.7, carbs: 11, fat: 0.6, fiber: 5.1, servingSize: 156 },
  pasta: { name: 'Pasta cocida', calories: 220, protein: 8, carbs: 43, fat: 1.3, fiber: 2.5, servingSize: 140 },
  yogur: { name: 'Yogur natural', calories: 100, protein: 17, carbs: 6, fat: 0.7, fiber: 0, servingSize: 170 },
};

const ScanPage = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { setScannedFood } = useAppContext();
  const navigate = useNavigate();

  const handleScan = () => {
    setIsScanning(true);
    // Simulate scan delay
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
          className="w-full aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-dashed border-primary/30 flex flex-col items-center justify-center gap-3 transition-all hover:border-primary/50 active:scale-[0.98] disabled:opacity-60"
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
              <p className="text-sm font-medium text-foreground">Toca para escanear tu alimento</p>
              <p className="text-xs text-muted-foreground">Apunta la cámara al código de barras o al alimento</p>
            </>
          )}
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground">o busca manualmente</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Search */}
      <div className="relative mb-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar alimento..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 rounded-xl bg-card border-border"
        />
      </div>

      {/* Food list */}
      <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.15s' }}>
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
