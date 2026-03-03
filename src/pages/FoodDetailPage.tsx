import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Wand2, Check, ArrowLeft } from 'lucide-react';

interface NutrientSliderProps {
  label: string;
  value: number;
  max: number;
  unit: string;
  colorClass: string;
  onChange: (v: number) => void;
}

const NutrientSlider = ({ label, value, max, unit, colorClass, onChange }: NutrientSliderProps) => (
  <div className="space-y-2">
    <div className="flex justify-between items-baseline">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</span>
      <span className="text-lg font-bold font-display">
        {value}<span className="text-xs text-muted-foreground ml-0.5">{unit}</span>
      </span>
    </div>
    <Slider
      value={[value]}
      max={max}
      step={1}
      onValueChange={([v]) => onChange(v)}
      className={colorClass}
    />
  </div>
);

const FoodDetailPage = () => {
  const { scannedFood, setScannedFood, addFoodEntry, profile } = useAppContext();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fat, setFat] = useState(0);
  const [fiber, setFiber] = useState(0);
  const [servingSize, setServingSize] = useState(0);

  useEffect(() => {
    if (!scannedFood) {
      navigate('/scan');
      return;
    }
    setName(scannedFood.name);
    setCalories(scannedFood.calories);
    setProtein(scannedFood.protein);
    setCarbs(scannedFood.carbs);
    setFat(scannedFood.fat);
    setFiber(scannedFood.fiber);
    setServingSize(scannedFood.servingSize);
  }, [scannedFood, navigate]);

  const handleAutoAdjust = () => {
    if (!scannedFood) return;
    let factor = 1;
    if (profile.goal === 'lose_weight') factor = 0.75;
    else if (profile.goal === 'gain_muscle') factor = 1.3;
    else if (profile.goal === 'improve_health') factor = 0.9;

    setCalories(Math.round(scannedFood.calories * factor));
    setProtein(Math.round(scannedFood.protein * (profile.goal === 'gain_muscle' ? 1.5 : factor)));
    setCarbs(Math.round(scannedFood.carbs * (profile.goal === 'lose_weight' ? 0.6 : factor)));
    setFat(Math.round(scannedFood.fat * factor));
    setFiber(Math.round(scannedFood.fiber * factor));
    setServingSize(Math.round(scannedFood.servingSize * factor));
  };

  const handleConfirm = () => {
    if (!scannedFood) return;
    addFoodEntry({
      id: scannedFood.id,
      name,
      calories,
      protein,
      carbs,
      fat,
      fiber,
      servingSize,
      date: new Date().toISOString().split('T')[0],
    });
    setScannedFood(null);
    navigate('/');
  };

  if (!scannedFood) return null;

  return (
    <div className="min-h-screen pb-20 px-5 pt-12 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-muted transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold font-display">Detalle del alimento</h1>
      </div>

      {/* Food name & calories hero */}
      <div className="glass-card rounded-2xl p-5 mb-4 animate-scale-in">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-bold font-display">{name}</h2>
          <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full font-medium">{servingSize}g</span>
        </div>
        <p className="text-4xl font-extrabold font-display text-primary">
          {calories} <span className="text-base text-muted-foreground font-normal">kcal</span>
        </p>
      </div>

      {/* Auto-adjust button */}
      <Button
        onClick={handleAutoAdjust}
        variant="outline"
        className="w-full rounded-xl gap-2 mb-4 border-primary/30 text-primary hover:bg-primary/5 hover:text-primary h-11 animate-slide-up"
      >
        <Wand2 size={16} />
        Auto-ajustar según tu objetivo
      </Button>

      {/* Nutrient sliders */}
      <div className="glass-card rounded-2xl p-5 mb-4 space-y-5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <h3 className="text-sm font-bold font-display">Ajusta los valores</h3>
        
        <NutrientSlider
          label="Calorías"
          value={calories}
          max={1200}
          unit="kcal"
          colorClass="slider-calories"
          onChange={setCalories}
        />
        <NutrientSlider
          label="Proteína"
          value={protein}
          max={100}
          unit="g"
          colorClass="slider-protein"
          onChange={setProtein}
        />
        <NutrientSlider
          label="Carbohidratos"
          value={carbs}
          max={150}
          unit="g"
          colorClass="slider-carbs"
          onChange={setCarbs}
        />
        <NutrientSlider
          label="Grasa"
          value={fat}
          max={80}
          unit="g"
          colorClass="slider-fat"
          onChange={setFat}
        />
        <NutrientSlider
          label="Fibra"
          value={fiber}
          max={30}
          unit="g"
          colorClass="slider-fiber"
          onChange={setFiber}
        />
        <NutrientSlider
          label="Porción"
          value={servingSize}
          max={500}
          unit="g"
          colorClass="slider-portion"
          onChange={setServingSize}
        />
      </div>

      {/* Confirm button */}
      <Button
        onClick={handleConfirm}
        className="w-full rounded-xl h-12 text-base font-semibold gap-2 animate-slide-up"
        style={{ animationDelay: '0.2s' }}
      >
        <Check size={18} />
        Confirmar y guardar
      </Button>
    </div>
  );
};

export default FoodDetailPage;
