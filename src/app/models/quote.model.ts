export interface QuoteData {
  age: number;
  vehicleType: string;
  vehicleYear: number;
  accidents: number;
  violations: number;
  coverageLevel: 'basic' | 'standard' | 'premium';
}

export interface QuoteResult {
  id: string;
  data: QuoteData;
  quote: number;
  date: string;
}
