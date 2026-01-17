export const NIGER_CITIES = [
  'Niamey',
  'Zinder',
  'Maradi',
  'Tahoua',
  'Agadez',
  'Dosso',
  'Diffa',
  'Tillabéri',
  'Arlit',
  'Birni N\'Konni',
] as const;

export type NigerCity = typeof NIGER_CITIES[number];

export const isValidCity = (city: string): city is NigerCity => {
  return NIGER_CITIES.includes(city as NigerCity);
};
