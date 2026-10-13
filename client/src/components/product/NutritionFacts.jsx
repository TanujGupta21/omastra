export default function NutritionFacts({ nutrition = {} }) {
  if (!nutrition || Object.keys(nutrition).length === 0) return null;

  const rows = [
    { label: 'Calories', value: nutrition.calories, unit: 'kcal' },
    { label: 'Protein', value: nutrition.protein, unit: 'g' },
    { label: 'Carbohydrates', value: nutrition.carbohydrates, unit: 'g' },
    { label: '  – of which sugars', value: nutrition.sugars, unit: 'g' },
    { label: 'Fat', value: nutrition.fat, unit: 'g' },
    { label: '  – of which saturates', value: nutrition.saturates, unit: 'g' },
    { label: 'Fibre', value: nutrition.fibre, unit: 'g' },
    { label: 'Sodium', value: nutrition.sodium, unit: 'mg' },
  ].filter((r) => r.value !== undefined && r.value !== null);

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden">
      <div className="bg-black px-4 py-3">
        <h4 className="text-white font-display text-base font-bold tracking-tight uppercase">Nutrition Facts</h4>
        {nutrition.servingSize && (
          <p className="text-gray-400 text-xs">Per serving ({nutrition.servingSize})</p>
        )}
      </div>
      <table className="w-full text-sm">
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.label}
              className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
            >
              <td className="px-4 py-2.5 text-gray-500">{row.label}</td>
              <td className="px-4 py-2.5 text-right font-semibold text-black">
                {row.value}
                {row.unit}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {nutrition.note && (
        <p className="px-4 py-3 text-xs text-gray-400 border-t border-gray-100">
          * {nutrition.note}
        </p>
      )}
    </div>
  );
}


