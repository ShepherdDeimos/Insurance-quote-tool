export interface QuoteData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: number;
  vehicleType: 'sedan' | 'suv' | 'truck' | 'van' | string;
  vehicleMake: string;  // e.g., Ford, Chevrolet, Toyota
  vehicleModel: string; // e.g., F-150, Silverado, Camry
  vehicleYear: number;
  accidents: number;
  violations: number;
  coverageLevel: 'basic' | 'standard' | 'full';
  drivingHistory: 'clean' | 'minor' | 'major';
}

export interface QuoteResult {
  id: string;
  data: QuoteData;
  quote: number;
  date: string;
}
