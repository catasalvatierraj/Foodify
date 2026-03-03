interface NutrientBarProps {
  label: string;
  value: number;
  max: number;
  unit?: string;
  colorClass: string;
}

const NutrientBar = ({ label, value, max, unit = 'g', colorClass }: NutrientBarProps) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-baseline">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <span className="text-sm font-semibold font-display">
          {value}<span className="text-xs text-muted-foreground ml-0.5">{unit}</span>
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`nutrient-bar ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default NutrientBar;
