// ================================================================================================
// VEHICLE DATA SERVICE - The Database of Our Car Information System  
// ================================================================================================
// This service acts as our "car database" containing manufacturers, models, and their relationships.
// It provides the data that powers the cascading dropdowns in our quote form:
// 1. User selects vehicle type → Service filters manufacturers → Shows only relevant brands
// 2. User selects manufacturer → Service filters models → Shows only relevant models  
// This creates a smooth, logical flow that prevents impossible combinations (like "Honda F-150").

import { Injectable } from '@angular/core';                               // Angular decorator that enables dependency injection for this service
import { VehicleOption, VehicleMake } from '../pages/quote-form/quote-form'; // Import interfaces that define the structure of our vehicle data objects

@Injectable({                                                             // Tell Angular this is a service (helper class)
  providedIn: 'root'                                                    // Make this service available everywhere in the app
})
export class VehicleDataService {                                       // Main class that knows about cars and their types
  private vehicleMakes: VehicleMake[] = [                              // Big list of all car manufacturers and their models
    {                                                                     // Ford car company data
      id: 'ford',                                                       // Unique identifier for Ford
      name: 'Ford',                                                     // Display name for Ford
      models: [                                                         // List of all Ford car models
        { id: 'mustang', name: 'Mustang', types: ['coupe', 'convertible'] },           // Sports car, comes in 2-door or convertible
        { id: 'fusion', name: 'Fusion', types: ['sedan'] },                            // 4-door family car
        { id: 'f150', name: 'F-150', types: ['truck'] },                               // Popular pickup truck
        { id: 'f250', name: 'F-250', types: ['truck'] },                               // Bigger pickup truck
        { id: 'f350', name: 'F-350', types: ['truck'] },                               // Even bigger pickup truck
        { id: 'ranger', name: 'Ranger', types: ['truck'] },                            // Smaller pickup truck
        { id: 'explorer', name: 'Explorer', types: ['suv'] },                          // Family SUV
        { id: 'escape', name: 'Escape', types: ['suv'] },                              // Smaller SUV
        { id: 'bronco', name: 'Bronco', types: ['suv'] },                              // Off-road SUV
        { id: 'expedition', name: 'Expedition', types: ['suv'] },                      // Large family SUV
        { id: 'edge', name: 'Edge', types: ['suv'] },                                  // Mid-size SUV
        { id: 'maverick', name: 'Maverick', types: ['truck'] },                        // Compact pickup truck
        { id: 'transit', name: 'Transit', types: ['van'] }                             // Work van
      ]
    },
    {
      id: 'chevrolet',
      name: 'Chevrolet',
      models: [
        { id: 'camaro', name: 'Camaro', types: ['coupe', 'convertible'] },
        { id: 'malibu', name: 'Malibu', types: ['sedan'] },
        { id: 'silverado', name: 'Silverado 1500', types: ['truck'] },
        { id: 'silverado2500', name: 'Silverado 2500', types: ['truck'] },
        { id: 'silverado3500', name: 'Silverado 3500', types: ['truck'] },
        { id: 'colorado', name: 'Colorado', types: ['truck'] },
        { id: 'equinox', name: 'Equinox', types: ['suv'] },
        { id: 'tahoe', name: 'Tahoe', types: ['suv'] },
        { id: 'suburban', name: 'Suburban', types: ['suv'] },
        { id: 'traverse', name: 'Traverse', types: ['suv'] },
        { id: 'blazer', name: 'Blazer', types: ['suv'] },
        { id: 'trailblazer', name: 'Trailblazer', types: ['suv'] },
        { id: 'express', name: 'Express', types: ['van'] }
      ]
    },
    {
      id: 'toyota',
      name: 'Toyota',
      models: [
        { id: 'camry', name: 'Camry', types: ['sedan'] },
        { id: 'corolla', name: 'Corolla', types: ['sedan', 'hatchback'] },
        { id: 'gr86', name: 'GR86', types: ['coupe'] },
        { id: 'supra', name: 'Supra', types: ['coupe'] },
        { id: 'tacoma', name: 'Tacoma', types: ['truck'] },
        { id: 'tundra', name: 'Tundra', types: ['truck'] },
        { id: 'rav4', name: 'RAV4', types: ['suv'] },
        { id: 'highlander', name: 'Highlander', types: ['suv'] },
        { id: '4runner', name: '4Runner', types: ['suv'] },
        { id: 'sequoia', name: 'Sequoia', types: ['suv'] },
        { id: 'venza', name: 'Venza', types: ['suv'] },
        { id: 'sienna', name: 'Sienna', types: ['van'] }
      ]
    },
    {
      id: 'honda',
      name: 'Honda',
      models: [
        { id: 'civic', name: 'Civic', types: ['sedan', 'hatchback'] },
        { id: 'accord', name: 'Accord', types: ['sedan'] },
        { id: 'ridgeline', name: 'Ridgeline', types: ['truck'] },
        { id: 'cr-v', name: 'CR-V', types: ['suv'] },
        { id: 'hr-v', name: 'HR-V', types: ['suv'] },
        { id: 'pilot', name: 'Pilot', types: ['suv'] },
        { id: 'passport', name: 'Passport', types: ['suv'] },
        { id: 'odyssey', name: 'Odyssey', types: ['van'] }
      ]
    },
    {
      id: 'subaru',
      name: 'Subaru',
      models: [
        { id: 'impreza', name: 'Impreza', types: ['sedan', 'hatchback'] },
        { id: 'legacy', name: 'Legacy', types: ['sedan'] },
        { id: 'wrx', name: 'WRX', types: ['sedan'] },
        { id: 'brz', name: 'BRZ', types: ['coupe'] },
        { id: 'outback', name: 'Outback', types: ['wagon', 'suv'] },
        { id: 'forester', name: 'Forester', types: ['suv'] },
        { id: 'crosstrek', name: 'Crosstrek', types: ['suv'] },
        { id: 'ascent', name: 'Ascent', types: ['suv'] }
      ]
    },
    {
      id: 'mazda',
      name: 'Mazda',
      models: [
        { id: 'mazda3', name: 'Mazda3', types: ['sedan', 'hatchback'] },
        { id: 'mazda6', name: 'Mazda6', types: ['sedan'] },
        { id: 'mx5', name: 'MX-5 Miata', types: ['convertible'] },
        { id: 'cx3', name: 'CX-3', types: ['suv'] },
        { id: 'cx30', name: 'CX-30', types: ['suv'] },
        { id: 'cx5', name: 'CX-5', types: ['suv'] },
        { id: 'cx9', name: 'CX-9', types: ['suv'] },
        { id: 'cx90', name: 'CX-90', types: ['suv'] }
      ]
    },
    {
      id: 'volkswagen',
      name: 'Volkswagen',
      models: [
        { id: 'jetta', name: 'Jetta', types: ['sedan'] },
        { id: 'passat', name: 'Passat', types: ['sedan'] },
        { id: 'arteon', name: 'Arteon', types: ['sedan'] },
        { id: 'golf', name: 'Golf', types: ['hatchback'] },
        { id: 'gti', name: 'GTI', types: ['hatchback'] },
        { id: 'taos', name: 'Taos', types: ['suv'] },
        { id: 'tiguan', name: 'Tiguan', types: ['suv'] },
        { id: 'atlas', name: 'Atlas', types: ['suv'] },
        { id: 'atlascross', name: 'Atlas Cross Sport', types: ['suv'] }
      ]
    },
    {
      id: 'hyundai',
      name: 'Hyundai',
      models: [
        { id: 'elantra', name: 'Elantra', types: ['sedan'] },
        { id: 'sonata', name: 'Sonata', types: ['sedan'] },
        { id: 'venue', name: 'Venue', types: ['suv'] },
        { id: 'kona', name: 'Kona', types: ['suv'] },
        { id: 'tucson', name: 'Tucson', types: ['suv'] },
        { id: 'santafe', name: 'Santa Fe', types: ['suv'] },
        { id: 'palisade', name: 'Palisade', types: ['suv'] }
      ]
    },
    {
      id: 'kia',
      name: 'Kia',
      models: [
        { id: 'forte', name: 'Forte', types: ['sedan'] },
        { id: 'k5', name: 'K5', types: ['sedan'] },
        { id: 'stinger', name: 'Stinger', types: ['sedan'] },
        { id: 'soul', name: 'Soul', types: ['wagon'] },
        { id: 'seltos', name: 'Seltos', types: ['suv'] },
        { id: 'sportage', name: 'Sportage', types: ['suv'] },
        { id: 'sorento', name: 'Sorento', types: ['suv'] },
        { id: 'telluride', name: 'Telluride', types: ['suv'] },
        { id: 'carnival', name: 'Carnival', types: ['van'] }
      ]
    },
    {
      id: 'nissan',
      name: 'Nissan',
      models: [
        { id: 'versa', name: 'Versa', types: ['sedan'] },
        { id: 'sentra', name: 'Sentra', types: ['sedan'] },
        { id: 'altima', name: 'Altima', types: ['sedan'] },
        { id: 'maxima', name: 'Maxima', types: ['sedan'] },
        { id: 'z', name: 'Z', types: ['coupe'] },
        { id: 'kicks', name: 'Kicks', types: ['suv'] },
        { id: 'rogue', name: 'Rogue', types: ['suv'] },
        { id: 'murano', name: 'Murano', types: ['suv'] },
        { id: 'pathfinder', name: 'Pathfinder', types: ['suv'] },
        { id: 'armada', name: 'Armada', types: ['suv'] },
        { id: 'frontier', name: 'Frontier', types: ['truck'] },
        { id: 'titan', name: 'Titan', types: ['truck'] }
      ]
    },
    {
      id: 'ram',
      name: 'RAM',
      models: [
        { id: 'ram1500', name: 'RAM 1500', types: ['truck'] },
        { id: 'ram2500', name: 'RAM 2500', types: ['truck'] },
        { id: 'ram3500', name: 'RAM 3500', types: ['truck'] },
        { id: 'promaster', name: 'ProMaster', types: ['van'] },
        { id: 'promastercity', name: 'ProMaster City', types: ['van'] }
      ]
    }
  ];

  public getVehicleMakes() {                                              // Function to get all car manufacturers
    return this.vehicleMakes;                                           // Return the complete list of car brands
  }

  public getMakesByType(typeId: string): VehicleMake[] {                // Function to get car brands that make a specific type
    if (!typeId) return [];                                             // If no type selected, return empty list
    
    console.log('Getting makes for type:', typeId);                     // Log what type we're looking for
    // Create a deep copy of vehicle makes and filter them
    const filteredMakes = this.vehicleMakes                             // Start with all car brands
      .map(make => ({                                                   // For each brand, create a copy
        ...make,                                                        // Copy all brand info
        models: make.models.filter(model =>                             // Filter models to only include matching type
          model.types && model.types.includes(typeId)                  // Keep models that support this type
        )
      }))
      .filter(make => make.models.length > 0);                         // Only keep brands that have matching models
    
    console.log('Available manufacturers for', typeId + ':', filteredMakes.map(m => m.name));  // Log what we found
    return filteredMakes;                                               // Return the filtered list
  }

  public getModelsByMakeAndType(makeId: string, typeId: string): VehicleOption[] {  // Function to get models for specific brand and type
    if (!makeId || !typeId) return [];                                  // If missing info, return empty list

    console.log('Getting models for make:', makeId, 'and type:', typeId);  // Log what we're looking for
    const selectedMake = this.vehicleMakes.find(make => make.id === makeId);  // Find the selected car brand
    if (!selectedMake) return [];                                       // If brand not found, return empty list

    // Only return models that have the selected type
    const filteredModels = selectedMake.models.filter(model =>          // Filter the brand's models
      model.types && model.types.includes(typeId)                      // Keep only models that support this type
    );
    
    console.log('Filtered models for', selectedMake.name, 'of type', typeId + ':', filteredModels.map(m => m.name));  // Log results
    return filteredModels;                                              // Return the matching models
  }
}
