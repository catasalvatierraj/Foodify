import { useState } from 'react';
import { useAppContext, UserProfile } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Save, Target } from 'lucide-react';

const goals = [
  { key: 'maintain' as const, label: 'Mantenerme', emoji: '⚖️' },
  { key: 'lose_weight' as const, label: 'Bajar de peso', emoji: '🔥' },
  { key: 'gain_muscle' as const, label: 'Ganar músculo', emoji: '💪' },
  { key: 'improve_health' as const, label: 'Mejorar salud', emoji: '🌱' },
];

const sexOptions = [
  { key: 'male' as const, label: 'Masculino' },
  { key: 'female' as const, label: 'Femenino' },
  { key: 'other' as const, label: 'Otro' },
];

const ProfilePage = () => {
  const { profile, setProfile } = useAppContext();
  const [form, setForm] = useState<UserProfile>({ ...profile });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen pb-20 px-5 pt-12 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold font-display mb-6 animate-slide-up">Mi perfil</h1>

      {/* Avatar area */}
      <div className="flex flex-col items-center mb-6 animate-scale-in">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-2">
          <User size={36} className="text-primary" />
        </div>
        <p className="text-lg font-semibold font-display">{form.name}</p>
      </div>

      {/* Basic info */}
      <div className="glass-card rounded-2xl p-5 mb-4 space-y-4 animate-slide-up" style={{ animationDelay: '0.05s' }}>
        <h3 className="text-sm font-semibold font-display flex items-center gap-2">
          <User size={14} /> Información básica
        </h3>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Nombre</label>
          <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="rounded-xl" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Edad</label>
            <Input type="number" value={form.age} onChange={e => setForm({ ...form, age: Number(e.target.value) })} className="rounded-xl" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Sexo</label>
            <div className="flex gap-1">
              {sexOptions.map(s => (
                <button
                  key={s.key}
                  onClick={() => setForm({ ...form, sex: s.key })}
                  className={`flex-1 py-2 text-xs rounded-lg transition-all ${
                    form.sex === s.key
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Peso (kg)</label>
            <Input type="number" value={form.weight} onChange={e => setForm({ ...form, weight: Number(e.target.value) })} className="rounded-xl" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Estatura (cm)</label>
            <Input type="number" value={form.height} onChange={e => setForm({ ...form, height: Number(e.target.value) })} className="rounded-xl" />
          </div>
        </div>
      </div>

      {/* Goals */}
      <div className="glass-card rounded-2xl p-5 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <h3 className="text-sm font-semibold font-display flex items-center gap-2 mb-3">
          <Target size={14} /> Mi objetivo
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {goals.map(g => (
            <button
              key={g.key}
              onClick={() => setForm({ ...form, goal: g.key })}
              className={`p-3 rounded-xl text-left transition-all ${
                form.goal === g.key
                  ? 'bg-primary/10 border-2 border-primary'
                  : 'glass-card border-2 border-transparent'
              }`}
            >
              <span className="text-lg">{g.emoji}</span>
              <p className={`text-xs font-medium mt-1 ${form.goal === g.key ? 'text-primary' : 'text-foreground'}`}>
                {g.label}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Save */}
      <Button
        onClick={handleSave}
        className="w-full rounded-xl h-12 text-base font-semibold gap-2 animate-slide-up"
        style={{ animationDelay: '0.15s' }}
      >
        <Save size={18} />
        {saved ? '¡Guardado!' : 'Guardar cambios'}
      </Button>
    </div>
  );
};

export default ProfilePage;
