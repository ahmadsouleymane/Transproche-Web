import { Info } from 'lucide-react';

const CountryNotice = () => {
  return (
    <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 flex items-start space-x-3">
      <Info className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm text-primary-800 font-medium">
          Service disponible au Niger uniquement
        </p>
        <p className="text-sm text-primary-700 mt-1">
          TRANSPROCHE dessert actuellement les principales villes du Niger : Niamey, Zinder, Maradi,
          Tahoua, Agadez, Dosso, Diffa, Tillabéri, Arlit et Birni N&apos;Konni.
        </p>
      </div>
    </div>
  );
};

export default CountryNotice;
