// ================================================================================================
// VEHICLE MODELS - Shared TypeScript Interfaces for Vehicle Data
// ================================================================================================
// These interfaces define the structure for vehicle-related data used throughout the application.
// They ensure type safety and provide clear contracts for vehicle data handling.

export interface VehicleOption {                                           // TypeScript contract requiring objects like { id: "civic", name: "Civic", types: ["sedan", "hatchback"] }
  id: string;                                                           // Lowercase unique key "civic" that gets stored in form values
  name: string;                                                         // User-friendly label "Civic" that appears in dropdowns
  types?: string[];                                                     // Optional array ["sedan", "hatchback"] showing which body styles available for filtering
}
                                        
export interface VehicleMake {                                          // TypeScript contract requiring objects like { id: "honda", name: "Honda", models: [...civicObj, ...accordObj] }
  id: string;                                                           // Lowercase unique key "honda" that gets stored in form values  
  name: string;                                                         // User-friendly label "Honda" that appears in dropdowns
  models: VehicleOption[];                                              // Array containing all car models like [civicObject, accordObject, crvObject] manufactured by this brand
}

// 🎯 PURPOSE:
// - Provides consistent data structure for vehicle information across the application
// - Ensures type safety when working with vehicle makes and models
// - Enables better IDE support with autocomplete and error checking
// - Makes the codebase more maintainable by centralizing vehicle data types
//
// 📋 USAGE:
// - Import these interfaces in any component or service that handles vehicle data
// - Use VehicleOption for individual car models (Civic, Accord, F-150, etc.)
// - Use VehicleMake for car manufacturers with their associated models
// - The 'types' property allows filtering models by vehicle type (sedan, SUV, etc.)
