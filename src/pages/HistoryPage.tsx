import { useAppContext } from '@/context/AppContext';
import { Clock, Trash2 } from 'lucide-react';

const HistoryPage = () => {
  const { history } = useAppContext();

  // Group by date
  const grouped = history.reduce<Record<string, typeof history>>((acc, entry) => {
    if (!acc[entry.date]) acc[entry.date] = [];
    acc[entry.date].push(entry);
    return acc;
  }, {});

  const formatDate = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (dateStr === today) return 'Hoy';
    if (dateStr === yesterday) return 'Ayer';
    return new Date(dateStr).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' });
  };

  return (
    <div className="min-h-screen pb-20 px-5 pt-12 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold font-display mb-6 animate-slide-up">Historial</h1>

      {history.length === 0 ? (
        <div className="glass-card rounded-2xl p-10 text-center animate-scale-in">
          <Clock size={40} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Tu historial está vacío</p>
          <p className="text-xs text-muted-foreground mt-1">Los alimentos que registres aparecerán aquí</p>
        </div>
      ) : (
        <div className="space-y-6 animate-slide-up">
          {Object.entries(grouped).map(([date, entries]) => {
            const dayCalories = entries.reduce((sum, e) => sum + e.calories, 0);
            return (
              <div key={date}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold font-display capitalize">{formatDate(date)}</h3>
                  <span className="text-xs text-muted-foreground">{dayCalories} kcal total</span>
                </div>
                <div className="space-y-2">
                  {entries.map(entry => (
                    <div key={entry.id} className="glass-card rounded-xl p-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{entry.name}</p>
                        <p className="text-xs text-muted-foreground">
                          P: {entry.protein}g · C: {entry.carbs}g · G: {entry.fat}g · {entry.servingSize}g
                        </p>
                      </div>
                      <p className="text-sm font-semibold font-display whitespace-nowrap ml-2">
                        {entry.calories} <span className="text-xs text-muted-foreground">kcal</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
