import { useAppContext } from '@/context/AppContext';
import NutrientBar from '@/components/NutrientBar';
import { Flame, Apple, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const goalLabels: Record<string, string> = {
  maintain: 'Mantenerte en forma',
  lose_weight: 'Bajar de peso',
  gain_muscle: 'Ganar músculo',
  improve_health: 'Mejorar salud',
};

const HomePage = () => {
  const { profile, history } = useAppContext();
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];
  const todayEntries = history.filter(e => e.date === today);

  const totals = todayEntries.reduce(
    (acc, e) => ({
      calories: acc.calories + e.calories,
      protein: acc.protein + e.protein,
      carbs: acc.carbs + e.carbs,
      fat: acc.fat + e.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  // Simple daily targets based on goal
  const calorieTarget = profile.goal === 'lose_weight' ? 1800 : profile.goal === 'gain_muscle' ? 2800 : 2200;

  return (
    <div className="min-h-screen pb-20 px-5 pt-12 max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-8 animate-slide-up">
        <p className="text-muted-foreground text-sm">Hola,</p>
        <h1 className="text-2xl font-bold font-display text-foreground">{profile.name} 👋</h1>
        <div className="mt-1 flex items-center gap-1.5">
          <TrendingUp size={14} className="text-primary" />
          <span className="text-xs text-primary font-medium">{goalLabels[profile.goal]}</span>
        </div>
      </div>

      {/* Calories Card */}
      <div className="glass-card rounded-2xl p-5 mb-5 animate-scale-in">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Flame size={20} className="text-secondary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Calorías hoy</p>
              <p className="text-2xl font-bold font-display">{totals.calories}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Meta</p>
            <p className="text-lg font-semibold font-display text-muted-foreground">{calorieTarget}</p>
          </div>
        </div>

        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-700 ease-out"
            style={{ width: `${Math.min((totals.calories / calorieTarget) * 100, 100)}%` }}
          />
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5 text-right">
          {Math.max(calorieTarget - totals.calories, 0)} kcal restantes
        </p>
      </div>

      {/* Macros */}
      <div className="glass-card rounded-2xl p-5 mb-5 space-y-3 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <h3 className="text-sm font-semibold font-display text-foreground">Macronutrientes</h3>
        <NutrientBar label="Proteína" value={totals.protein} max={profile.goal === 'gain_muscle' ? 180 : 120} colorClass="bg-nutrient-protein" />
        <NutrientBar label="Carbohidratos" value={totals.carbs} max={250} colorClass="bg-nutrient-carbs" />
        <NutrientBar label="Grasa" value={totals.fat} max={70} colorClass="bg-nutrient-fat" />
      </div>

      {/* Recent entries */}
      <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold font-display text-foreground">Hoy</h3>
          <button onClick={() => navigate('/history')} className="text-xs text-primary font-medium">Ver todo</button>
        </div>

        {todayEntries.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center">
            <Apple size={32} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Aún no has registrado alimentos hoy</p>
            <button
              onClick={() => navigate('/scan')}
              className="mt-3 text-sm font-medium text-primary"
            >
              Escanear alimento →
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {todayEntries.slice(0, 3).map(entry => (
              <div key={entry.id} className="glass-card rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{entry.name}</p>
                  <p className="text-xs text-muted-foreground">{entry.servingSize}g</p>
                </div>
                <p className="text-sm font-semibold font-display">{entry.calories} <span className="text-xs text-muted-foreground">kcal</span></p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
