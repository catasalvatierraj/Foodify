import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import NutrientBar from '@/components/NutrientBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Wand2, Check, ArrowLeft, Pencil } from 'lucide-react';

const FoodDetailPage = () => {
  const { scannedFood, setScannedFood, addFoodEntry, profile } = useAppContext();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);

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
    // Adjust based on user profile goal
    let factor = 1;
    if (profile.goal === 'lose_weight') factor = 0.75;
    else if (profile.goal === 'gain_muscle') factor = 1.3;
    else if (profile.goal === 'improve_health') factor = 0.9;

    setCalories(Math.round(calories * factor));
    setProtein(Math.round(protein * (profile.goal === 'gain_muscle' ? 1.5 : factor)));
    setCarbs(Math.round(carbs * (profile.goal === 'lose_weight' ? 0.6 : factor)));
    setFat(Math.round(fat * factor));
    setServingSize(Math.round(servingSize * factor));
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

      {/* Food name */}
      <div className="glass-card rounded-2xl p-5 mb-4 animate-scale-in">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-bold font-display">{name}</h2>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">{servingSize}g</span>
        </div>
        <p className="text-3xl font-bold font-display text-primary">
          {calories} <span className="text-base text-muted-foreground font-normal">kcal</span>
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 mb-4 animate-slide-up">
        <Button
          onClick={handleAutoAdjust}
          variant="outline"
          className="flex-1 rounded-xl gap-2 border-primary/20 text-primary hover:bg-primary/5 hover:text-primary"
        >
          <Wand2 size={16} />
          Auto-ajustar
        </Button>
        <Button
          onClick={() => setEditing(!editing)}
          variant="outline"
          className="flex-1 rounded-xl gap-2"
        >
          <Pencil size={16} />
          {editing ? 'Vista previa' : 'Editar manual'}
        </Button>
      </div>

      {/* Nutrients */}
      {editing ? (
        <div className="glass-card rounded-2xl p-5 mb-4 space-y-4 animate-scale-in">
          <h3 className="text-sm font-semibold font-display">Editar valores</h3>
          {[
            { label: 'Calorías (kcal)', value: calories, setter: setCalories },
            { label: 'Proteína (g)', value: protein, setter: setProtein },
            { label: 'Carbohidratos (g)', value: carbs, setter: setCarbs },
            { label: 'Grasa (g)', value: fat, setter: setFat },
            { label: 'Fibra (g)', value: fiber, setter: setFiber },
            { label: 'Porción (g)', value: servingSize, setter: setServingSize },
          ].map(({ label, value, setter }) => (
            <div key={label}>
              <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
              <Input
                type="number"
                value={value}
                onChange={e => setter(Number(e.target.value))}
                className="rounded-xl"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-5 mb-4 space-y-3 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-sm font-semibold font-display">Información nutricional</h3>
          <NutrientBar label="Proteína" value={protein} max={50} colorClass="bg-nutrient-protein" />
          <NutrientBar label="Carbohidratos" value={carbs} max={80} colorClass="bg-nutrient-carbs" />
          <NutrientBar label="Grasa" value={fat} max={30} colorClass="bg-nutrient-fat" />
          <NutrientBar label="Fibra" value={fiber} max={15} colorClass="bg-nutrient-fiber" />
        </div>
      )}

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
