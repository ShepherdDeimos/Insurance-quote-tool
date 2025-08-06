export interface VehicleType {
  id: string;
  name: string;
}

export interface VehicleMake {
  id: string;
  name: string;
  types: string[]; // Array of vehicle type IDs this make is available for
}

export interface VehicleModel {
  id: string;
  name: string;
  makeId: string;
  types: string[]; // Array of vehicle type IDs this model belongs to
  years: { start: number; end: number }; // Year range this model was manufactured
}

export const vehicleTypes: VehicleType[] = [
  { id: 'sedan', name: 'Sedan' },
  { id: 'suv', name: 'SUV' },
  { id: 'truck', name: 'Truck' },
  { id: 'van', name: 'Van' },
  { id: 'coupe', name: 'Coupe' },
  { id: 'wagon', name: 'Wagon' },
  { id: 'hatchback', name: 'Hatchback' },
  { id: 'convertible', name: 'Convertible' },
  { id: 'luxury', name: 'Luxury' },
];

export const vehicleMakes: VehicleMake[] = [
  // American
  { 
    id: 'chevrolet',
    name: 'Chevrolet',
    types: ['sedan', 'suv', 'truck', 'van']
  },
  {
    id: 'ford',
    name: 'Ford',
    types: ['sedan', 'suv', 'truck', 'van']
  },
  {
    id: 'dodge',
    name: 'Dodge',
    types: ['sedan', 'suv', 'truck', 'van']
  },
  {
    id: 'ram',
    name: 'RAM',
    types: ['truck', 'van']
  },
  {
    id: 'jeep',
    name: 'Jeep',
    types: ['suv']
  },
  {
    id: 'gmc',
    name: 'GMC',
    types: ['suv', 'truck']
  },
  
  // Japanese
  {
    id: 'toyota',
    name: 'Toyota',
    types: ['sedan', 'suv', 'truck', 'van', 'hatchback']
  },
  {
    id: 'honda',
    name: 'Honda',
    types: ['sedan', 'suv', 'van', 'hatchback']
  },
  {
    id: 'nissan',
    name: 'Nissan',
    types: ['sedan', 'suv', 'truck', 'van']
  },
  {
    id: 'mazda',
    name: 'Mazda',
    types: ['sedan', 'suv', 'hatchback']
  },
  {
    id: 'subaru',
    name: 'Subaru',
    types: ['sedan', 'suv', 'wagon']
  },
  
  // German
  {
    id: 'volkswagen',
    name: 'Volkswagen',
    types: ['sedan', 'suv', 'wagon', 'hatchback']
  },
  {
    id: 'bmw',
    name: 'BMW',
    types: ['sedan', 'suv', 'coupe', 'convertible', 'luxury']
  },
  {
    id: 'mercedes',
    name: 'Mercedes-Benz',
    types: ['sedan', 'suv', 'coupe', 'convertible', 'luxury', 'van']
  },
  {
    id: 'audi',
    name: 'Audi',
    types: ['sedan', 'suv', 'coupe', 'luxury']
  },
  
  // Korean
  {
    id: 'hyundai',
    name: 'Hyundai',
    types: ['sedan', 'suv', 'hatchback']
  },
  {
    id: 'kia',
    name: 'Kia',
    types: ['sedan', 'suv', 'van', 'hatchback']
  }
];

export const vehicleModels: VehicleModel[] = [
  // Chevrolet Models
  {
    id: 'silverado',
    name: 'Silverado',
    makeId: 'chevrolet',
    types: ['truck'],
    years: { start: 1999, end: 2025 }
  },
  {
    id: 'colorado',
    name: 'Colorado',
    makeId: 'chevrolet',
    types: ['truck'],
    years: { start: 2004, end: 2025 }
  },
  {
    id: 'malibu',
    name: 'Malibu',
    makeId: 'chevrolet',
    types: ['sedan'],
    years: { start: 1997, end: 2025 }
  },
  {
    id: 'equinox',
    name: 'Equinox',
    makeId: 'chevrolet',
    types: ['suv'],
    years: { start: 2005, end: 2025 }
  },

  // Ford Models
  {
    id: 'f150',
    name: 'F-150',
    makeId: 'ford',
    types: ['truck'],
    years: { start: 1990, end: 2025 }
  },
  {
    id: 'ranger',
    name: 'Ranger',
    makeId: 'ford',
    types: ['truck'],
    years: { start: 1990, end: 2025 }
  },
  {
    id: 'explorer',
    name: 'Explorer',
    makeId: 'ford',
    types: ['suv'],
    years: { start: 1991, end: 2025 }
  },
  {
    id: 'escape',
    name: 'Escape',
    makeId: 'ford',
    types: ['suv'],
    years: { start: 2001, end: 2025 }
  },

  // Toyota Models
  {
    id: 'camry',
    name: 'Camry',
    makeId: 'toyota',
    types: ['sedan'],
    years: { start: 1990, end: 2025 }
  },
  {
    id: 'corolla',
    name: 'Corolla',
    makeId: 'toyota',
    types: ['sedan', 'hatchback'],
    years: { start: 1990, end: 2025 }
  },
  {
    id: 'rav4',
    name: 'RAV4',
    makeId: 'toyota',
    types: ['suv'],
    years: { start: 1996, end: 2025 }
  },
  {
    id: 'tacoma',
    name: 'Tacoma',
    makeId: 'toyota',
    types: ['truck'],
    years: { start: 1995, end: 2025 }
  },

  // Honda Models
  {
    id: 'civic',
    name: 'Civic',
    makeId: 'honda',
    types: ['sedan', 'hatchback'],
    years: { start: 1990, end: 2025 }
  },
  {
    id: 'accord',
    name: 'Accord',
    makeId: 'honda',
    types: ['sedan'],
    years: { start: 1990, end: 2025 }
  },
  {
    id: 'cr-v',
    name: 'CR-V',
    makeId: 'honda',
    types: ['suv'],
    years: { start: 1997, end: 2025 }
  },
  {
    id: 'pilot',
    name: 'Pilot',
    makeId: 'honda',
    types: ['suv'],
    years: { start: 2003, end: 2025 }
  },

  // More models can be added...
];
