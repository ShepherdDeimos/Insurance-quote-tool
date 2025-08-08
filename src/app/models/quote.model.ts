// ================================================================================================
// INSURANCE QUOTE DATA MODELS - The Heart of Our Quote Calculation System
// ================================================================================================
// These interfaces define the exact structure of data flowing through our insurance app.
// QuoteData = what we collect from users, QuoteResult = what we return with calculated price.
// Every form field, every calculation input, every saved quote follows these blueprints.

// 📋 QUOTE DATA: All information collected from the user's form submission
// This represents the raw input data that feeds into our insurance pricing algorithm.
// Used by: Quote form validation, price calculation engine, data storage
export interface QuoteData {
  // 👤 PERSONAL INFORMATION - Basic demographic data affecting insurance rates
  firstName: string;                      // Legal first name: "John" (required for policy creation)
  lastName: string;                       // Legal last name: "Smith" (required for policy creation)
  email: string;                          // Contact email: "john.smith@email.com" (for quotes, confirmations)
  phone: string;                          // 10-digit phone: "1234567890" (agent contact, claims)
  age: number;                            // Age in years: 25 (MAJOR pricing factor - young drivers cost more)
  zip: string;                            // ZIP code: "12345" (location affects rates - urban vs rural)

  // 🚗 VEHICLE INFORMATION - Car details that determine insurance risk and cost
  vehicleType: 'sedan' | 'suv' | 'truck' | 'van' | string;  // Body style affects crash risk: trucks rollover more
  vehicleMake: string;                    // Manufacturer: "honda" (reliability affects rates)
  vehicleModel: string;                   // Specific model: "civic" (some models stolen more, crash more)
  vehicleYear: number;                    // Model year: 2020 (newer = more expensive to fix, older = cheaper to insure)

  // 🚨 DRIVING HISTORY - Past behavior predicts future risk (biggest rate factors)
  accidents: number;                      // At-fault accidents count: 0-10 (each accident = ~20% rate increase)
  violations: number;                     // Traffic tickets count: 0-10 (each ticket = ~10% rate increase)
  drivingHistory: 'clean' | 'minor' | 'major';  // Overall record severity (affects eligibility + rates)

  // 🛡️ COVERAGE PREFERENCES - How much protection the customer wants to buy
  coverageLevel: 'basic' | 'standard' | 'full';  // More coverage = higher premiums but better protection
}

// 💰 QUOTE RESULT: The complete insurance quote with calculated price and metadata
// This represents what our system returns after processing a QuoteData submission.
// Used by: Results page display, quote storage, quote retrieval, quote comparison
export interface QuoteResult {
  // 🔑 IDENTIFICATION - Unique tracking for this specific quote
  id: string;                             // Unique identifier: "1723123456789" (timestamp-based, allows quote lookup)
  
  // 📊 QUOTE DATA - Snapshot of all user inputs at time of quote generation
  data: QuoteData;                        // Complete copy of form submission (preserves exact inputs for quote recreation)
  
  // 💵 CALCULATED PREMIUM - The final monthly insurance price based on all risk factors
  quote: number;                          // Monthly premium: 87.50 (result of complex calculation considering all factors)
  
  // 📅 METADATA - When this quote was created (for tracking, expiration, comparison)
  date: string;                           // ISO timestamp: "2025-08-08T10:30:00.000Z" (helps track quote freshness)
}
