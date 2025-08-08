// ================================================================================================
// VEHICLE DATA MODELS - The Foundation of Our Car Insurance System
// ================================================================================================
// This file defines the core data structures that represent cars in our insurance application.
// Think of these as the "blueprints" that tell TypeScript exactly what car information looks like.
// These models ensure data consistency across our entire app - from dropdowns to calculations.

// 🚗 VEHICLE TYPE: Represents broad categories of vehicles (Sedan, SUV, Truck, etc.)
// Used in: Quote form dropdown, insurance calculation pricing, vehicle filtering
// Real examples: { id: "suv", name: "SUV" } becomes <option value="suv">SUV</option>
export interface VehicleType {
  id: string;        // Lowercase key used in code/forms/database: "sedan", "suv", "truck"
  name: string;      // User-friendly display text shown in dropdowns: "Sedan", "SUV", "Truck"
}

// 🏭 VEHICLE MAKE: Represents car manufacturers (Honda, Ford, Toyota, etc.)
// Used in: Dynamic filtering (only show Honda when user selects "sedan"), quote calculations
// Real examples: { id: "honda", name: "Honda", types: ["sedan", "suv"] }
export interface VehicleMake {
  id: string;        // Lowercase manufacturer key: "honda", "ford", "toyota" 
  name: string;      // Display name for dropdowns: "Honda", "Ford", "Toyota"
  types: string[];   // Which vehicle types this manufacturer makes: ["sedan", "suv", "truck"]
}

// 🚙 VEHICLE MODEL: Represents specific car models (Civic, F-150, Camry, etc.)
// Used in: Final dropdown after user selects type+make, insurance risk calculations
// Real examples: { id: "civic", name: "Civic", makeId: "honda", types: ["sedan", "hatchback"] }
export interface VehicleModel {
  id: string;        // Lowercase model key: "civic", "f150", "camry"
  name: string;      // Display name: "Civic", "F-150", "Camry" 
  makeId: string;    // Links to manufacturer: "honda", "ford", "toyota"
  types: string[];   // Which body styles this model comes in: ["sedan"] or ["sedan", "hatchback"]
  years: { start: number; end: number };  // Production years: { start: 1990, end: 2025 }
}

// ================================================================================================
// VEHICLE TYPE DATA - All Categories of Vehicles Available for Insurance
// ================================================================================================
// This array powers the first dropdown in our quote form. When users select a type,
// it filters which manufacturers appear next (only Honda/Toyota for sedan, only Ford/RAM for truck)

export const vehicleTypes: VehicleType[] = [
  { id: 'sedan', name: 'Sedan' },           // 4-door family cars: Honda Accord, Toyota Camry
  { id: 'suv', name: 'SUV' },               // Sport Utility Vehicles: Honda CR-V, Ford Explorer  
  { id: 'truck', name: 'Truck' },           // Pickup trucks: Ford F-150, Chevy Silverado
  { id: 'van', name: 'Van' },               // Cargo/passenger vans: Honda Odyssey, Ford Transit
  { id: 'coupe', name: 'Coupe' },           // 2-door sporty cars: Honda Civic Si, BMW 3-Series
  { id: 'wagon', name: 'Wagon' },           // Station wagons: Subaru Outback, Volvo V90
  { id: 'hatchback', name: 'Hatchback' },   // Cars with rear liftgate: Honda Civic Hatch, VW Golf
  { id: 'convertible', name: 'Convertible' }, // Cars with removable tops: Mazda Miata, BMW Z4
  { id: 'luxury', name: 'Luxury' },         // Premium vehicles: BMW 7-Series, Mercedes S-Class
];

// ================================================================================================
// VEHICLE MANUFACTURER DATA - All Car Brands and What Types They Make
// ================================================================================================
// This array powers the second dropdown. When user selects "sedan", only manufacturers 
// with "sedan" in their types array will appear (Honda, Toyota, Ford, etc.)
// When user selects "truck", only truck makers appear (Ford, Chevy, RAM, etc.)

export const vehicleMakes: VehicleMake[] = [
  // 🇺🇸 AMERICAN MANUFACTURERS - Domestic brands known for trucks and large vehicles
  { 
    id: 'chevrolet',                       // Used in forms and database queries
    name: 'Chevrolet',                     // Displayed to users in dropdown
    types: ['sedan', 'suv', 'truck', 'van'] // Chevy makes: Malibu sedan, Equinox SUV, Silverado truck, Express van
  },
  {
    id: 'ford',                            // America's truck leader 
    name: 'Ford',                          // Famous for F-150 pickup trucks
    types: ['sedan', 'suv', 'truck', 'van'] // Ford makes: Fusion sedan, Explorer SUV, F-150 truck, Transit van
  },
  {
    id: 'dodge',                           // Performance and muscle cars
    name: 'Dodge',                         // Known for Charger, Challenger
    types: ['sedan', 'suv', 'truck', 'van'] // Dodge makes: Charger sedan, Durango SUV, Ram truck, Grand Caravan
  },
  {
    id: 'ram',                             // Truck-only brand (spun off from Dodge)
    name: 'RAM',                           // Heavy-duty pickup specialists
    types: ['truck', 'van']                // RAM only makes: Ram 1500/2500/3500 trucks, ProMaster vans
  },
  {
    id: 'jeep',                            // Off-road SUV specialists
    name: 'Jeep',                          // Trail-rated 4x4 vehicles
    types: ['suv']                         // Jeep only makes: Wrangler, Grand Cherokee, Compass SUVs
  },
  {
    id: 'gmc',                             // GM's premium truck division
    name: 'GMC',                           // "Professional Grade" trucks and SUVs
    types: ['suv', 'truck']                // GMC makes: Sierra truck, Yukon SUV, Acadia SUV
  },
  
  // 🇯🇵 JAPANESE MANUFACTURERS - Known for reliability, fuel efficiency, and quality
  {
    id: 'toyota',                          // World's most reliable car brand
    name: 'Toyota',                        // Famous for Camry, Corolla, Prius
    types: ['sedan', 'suv', 'truck', 'van', 'hatchback'] // Toyota makes everything: Camry sedan, RAV4 SUV, Tacoma truck
  },
  {
    id: 'honda',                           // Engineering excellence and efficiency
    name: 'Honda',                         // Famous for Civic, Accord, CR-V
    types: ['sedan', 'suv', 'van', 'hatchback'] // Honda makes: Accord sedan, CR-V SUV, Odyssey van, Civic hatchback
  },
  {
    id: 'nissan',                          // Innovative technology (first mass-market EV)
    name: 'Nissan',                        // Famous for Altima, Sentra, Leaf
    types: ['sedan', 'suv', 'truck', 'van'] // Nissan makes: Altima sedan, Rogue SUV, Frontier truck, NV200 van
  },
  {
    id: 'mazda',                           // "Zoom-Zoom" sporty driving dynamics
    name: 'Mazda',                         // Famous for Miata, CX-5, rotary engines
    types: ['sedan', 'suv', 'hatchback']  // Mazda makes: Mazda3 sedan, CX-5 SUV, Mazda3 hatchback
  },
  {
    id: 'subaru',                          // All-wheel drive specialists 
    name: 'Subaru',                        // Famous for Outback, Forester, WRX
    types: ['sedan', 'suv', 'wagon']      // Subaru makes: Legacy sedan, Forester SUV, Outback wagon
  },
  
  // 🇩🇪 GERMAN MANUFACTURERS - Premium engineering, luxury, and performance
  {
    id: 'volkswagen',                      // "The People's Car" - affordable German engineering
    name: 'Volkswagen',                    // Famous for Golf, Jetta, Beetle
    types: ['sedan', 'suv', 'wagon', 'hatchback'] // VW makes: Jetta sedan, Atlas SUV, Golf wagon, Golf hatchback
  },
  {
    id: 'bmw',                             // "The Ultimate Driving Machine" - luxury performance
    name: 'BMW',                           // Famous for 3-Series, X3, i3
    types: ['sedan', 'suv', 'coupe', 'convertible', 'luxury'] // BMW makes: 3-Series sedan, X3 SUV, 4-Series coupe
  },
  {
    id: 'mercedes',                        // "The Best or Nothing" - luxury pioneer
    name: 'Mercedes-Benz',                 // Famous for C-Class, E-Class, S-Class
    types: ['sedan', 'suv', 'coupe', 'convertible', 'luxury', 'van'] // Mercedes makes everything luxury + Sprinter vans
  },
  {
    id: 'audi',                            // "Vorsprung durch Technik" - technology leadership
    name: 'Audi',                          // Famous for A4, Q5, quattro AWD
    types: ['sedan', 'suv', 'coupe', 'luxury'] // Audi makes: A4 sedan, Q5 SUV, A5 coupe, all luxury-positioned
  },
  
  // 🇰🇷 KOREAN MANUFACTURERS - Value, warranty, and rapid quality improvement
  {
    id: 'hyundai',                         // Excellent warranty and value proposition
    name: 'Hyundai',                       // Famous for Elantra, Sonata, Santa Fe
    types: ['sedan', 'suv', 'hatchback']  // Hyundai makes: Elantra sedan, Tucson SUV, Veloster hatchback
  },
  {
    id: 'kia',                             // Hyundai's sister brand with sportier styling
    name: 'Kia',                           // Famous for Forte, Sorento, Soul
    types: ['sedan', 'suv', 'van', 'hatchback'] // Kia makes: Forte sedan, Sorento SUV, Carnival van, Soul wagon-thing
  }
];

// ================================================================================================
// VEHICLE MODEL DATA - Specific Car Models Available for Insurance Quotes
// ================================================================================================
// This array powers the third dropdown. After user selects Type (sedan) + Make (Honda),
// only Honda models that come as sedans will appear (Accord, Civic sedan).
// The years data helps validate that someone can't select a 2030 Honda Civic.

export const vehicleModels: VehicleModel[] = [
  // 🚗 CHEVROLET MODELS - America's most popular truck brand, family vehicles
  {
    id: 'silverado',                       // Database/form identifier  
    name: 'Silverado',                     // What users see in dropdown
    makeId: 'chevrolet',                   // Links this model to Chevrolet manufacturer
    types: ['truck'],                      // Only comes as pickup truck body style
    years: { start: 1999, end: 2025 }     // Available from 1999-2025 (validates user can't pick 1990 Silverado)
  },
  {
    id: 'colorado',                        // Chevy's smaller/midsize pickup truck
    name: 'Colorado',                      // More fuel efficient than Silverado
    makeId: 'chevrolet',                   // Belongs to Chevrolet brand
    types: ['truck'],                      // Only available as pickup truck
    years: { start: 2004, end: 2025 }     // Colorado started in 2004, still made today
  },
  {
    id: 'malibu',                          // Chevy's midsize family sedan
    name: 'Malibu',                        // Competes with Honda Accord, Toyota Camry
    makeId: 'chevrolet',                   // Chevrolet sedan offering
    types: ['sedan'],                      // Only comes as 4-door sedan
    years: { start: 1997, end: 2025 }     // Long-running model, multiple generations
  },
  {
    id: 'equinox',                         // Chevy's compact SUV for families
    name: 'Equinox',                       // Competes with Honda CR-V, Toyota RAV4
    makeId: 'chevrolet',                   // Chevrolet SUV offering
    types: ['suv'],                        // Only comes as SUV body style
    years: { start: 2005, end: 2025 }     // Introduced in 2005, still current
  },

  // 🚛 FORD MODELS - America's truck leader, "Built Ford Tough"
  {
    id: 'f150',                            // America's best-selling truck for 40+ years
    name: 'F-150',                         // Full-size pickup, workhorse of America
    makeId: 'ford',                        // Ford's flagship truck model
    types: ['truck'],                      // Only available as pickup truck
    years: { start: 1990, end: 2025 }     // Been around forever, constantly updated
  },
  {
    id: 'ranger',                          // Ford's smaller, more efficient pickup
    name: 'Ranger',                        // Midsize truck, returned to US in 2019
    makeId: 'ford',                        // Ford's compact truck offering
    types: ['truck'],                      // Only comes as pickup truck
    years: { start: 1990, end: 2025 }     // Classic truck, had gap but now back
  },
  {
    id: 'explorer',                        // Ford's popular 3-row family SUV
    name: 'Explorer',                      // Seats 7, great for large families
    makeId: 'ford',                        // Ford's midsize SUV
    types: ['suv'],                        // Only available as SUV
    years: { start: 1991, end: 2025 }     // Launched early 90s, still popular today
  },
  {
    id: 'escape',                          // Ford's compact SUV, fuel efficient
    name: 'Escape',                        // Competes with Honda CR-V, Toyota RAV4
    makeId: 'ford',                        // Ford's smaller SUV option
    types: ['suv'],                        // Only comes as compact SUV
    years: { start: 2001, end: 2025 }     // Introduced 2001, multiple redesigns
  },

  // 🌟 TOYOTA MODELS - World's most reliable brand, excellent resale value
  {
    id: 'camry',                           // America's best-selling sedan for years
    name: 'Camry',                         // Reliable family transportation
    makeId: 'toyota',                      // Toyota's midsize sedan flagship
    types: ['sedan'],                      // Only available as 4-door sedan
    years: { start: 1990, end: 2025 }     // Decades of proven reliability
  },
  {
    id: 'corolla',                         // World's best-selling car nameplate ever
    name: 'Corolla',                       // Compact, efficient, affordable
    makeId: 'toyota',                      // Toyota's entry-level car
    types: ['sedan', 'hatchback'],        // Comes as both sedan and hatchback versions
    years: { start: 1990, end: 2025 }     // Been around forever, constantly refined
  },
  {
    id: 'rav4',                            // Pioneered the compact SUV segment
    name: 'RAV4',                          // "Recreational Activity Vehicle 4-wheel drive"
    makeId: 'toyota',                      // Toyota's compact SUV leader
    types: ['suv'],                        // Only comes as compact SUV
    years: { start: 1996, end: 2025 }     // Started the small SUV craze in mid-90s
  },
  {
    id: 'tacoma',                          // Most reliable midsize pickup truck
    name: 'Tacoma',                        // Perfect for weekend adventures
    makeId: 'toyota',                      // Toyota's only truck offering in US
    types: ['truck'],                      // Only available as pickup truck
    years: { start: 1995, end: 2025 }     // Launched mid-90s, holds value extremely well
  },

  // 🔧 HONDA MODELS - Engineering excellence, practical innovation
  {
    id: 'civic',                           // One of the most successful compact cars ever
    name: 'Civic',                         // Young person's first car, tuner favorite
    makeId: 'honda',                       // Honda's compact car cornerstone
    types: ['sedan', 'hatchback'],        // Available as both sedan and sporty hatchback
    years: { start: 1990, end: 2025 }     // Continuously improved for decades
  },
  {
    id: 'accord',                          // Perennial Car of the Year winner
    name: 'Accord',                        // Midsize sedan benchmark for quality
    makeId: 'honda',                       // Honda's family sedan flagship
    types: ['sedan'],                      // Only comes as 4-door sedan
    years: { start: 1990, end: 2025 }     // Consistent quality leader for 30+ years
  },
  {
    id: 'cr-v',                            // Compact SUV that defined the segment
    name: 'CR-V',                          // "Comfortable Runabout Vehicle"
    makeId: 'honda',                       // Honda's best-selling SUV
    types: ['suv'],                        // Only available as compact SUV
    years: { start: 1997, end: 2025 }     // Launched late 90s, incredibly reliable
  },
  {
    id: 'pilot',                           // Honda's largest SUV, seats 8 people
    name: 'Pilot',                         // 3-row family hauler with Honda reliability
    makeId: 'honda',                       // Honda's midsize/large SUV
    types: ['suv'],                        // Only comes as 3-row SUV
    years: { start: 2003, end: 2025 }     // Introduced 2003, great for large families
  },

  // 📝 NOTE: More models can be added here following the same pattern.
  // Each model needs: unique id, display name, manufacturer link, body types, production years.
  // This data drives the entire vehicle selection process in our insurance quote form.
];
