export interface QuoteData {
  age: number;
  vehicleType: 'car' | 'suv' | 'truck' | string;
  vehicleYear: number;
  accidents: number;
  violations: number;
  coverageLevel: 'basic' | 'standard' | 'full';
}

export interface QuoteResult {
  id: string;
  data: QuoteData;
  quote: number;
  date: string;
}
