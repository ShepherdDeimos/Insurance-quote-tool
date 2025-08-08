// ================================================================================================
// QUOTE SERVICE - The Brain of Our Insurance Quote System
// ================================================================================================
// This service is the central nervous system that handles everything related to insurance quotes:
// 1. Receives form data from quote-form component
// 2. Runs complex calculations to determine monthly premium
// 3. Saves quotes to browser storage for later retrieval  
// 4. Provides quotes to results page and saved quotes page
// Think of this as the "business logic" layer between the UI and the data.

import { Injectable } from '@angular/core';                               // Angular decorator that makes this class a dependency-injectable service
import { Observable, of } from 'rxjs';                                  // RxJS tools: Observable for async data streams, of() to wrap values
import { QuoteData, QuoteResult } from '../models/quote.model';         // Our custom interfaces defining quote data structure

@Injectable({                                                             // Decorator telling Angular "this is a service that can be injected"
  providedIn: 'root'                                                    // Singleton pattern - one instance shared across entire app
})
export class QuoteService {                                             // Main service class containing all quote-related business logic
  // 🔑 STORAGE CONFIGURATION - Where we save quotes in the browser
  private readonly STORAGE_KEY = 'insurance_quotes';                   // localStorage key name for persisting quote data locally

  // ============================================================================================
  // DATA PERSISTENCE METHODS - Managing quote storage in browser's localStorage
  // ============================================================================================

  // 📥 RETRIEVE STORED QUOTES - Gets all previously saved quotes from browser storage
  // Called by: getAllQuotes(), getQuoteById(), submitQuote() to read existing data
  // Returns: Array of QuoteResult objects, or empty array if no quotes saved yet
  private getStoredQuotes(): QuoteResult[] {                             
    const storedQuotes = localStorage.getItem(this.STORAGE_KEY);        // localStorage.getItem() returns string or null
    return storedQuotes ? JSON.parse(storedQuotes) : [];               // Parse JSON string back to objects, fallback to empty array
    // Example returned data: [{ id: "123", data: {...}, quote: 87.50, date: "2025-08-08" }]
  }

  // ============================================================================================
  // PUBLIC API METHODS - The main functions other components call to work with quotes
  // ============================================================================================

  // 📝 SUBMIT NEW QUOTE - Main function called when user submits the quote form
  // Called by: QuoteForm component's onSubmit() method after form validation passes
  // Process: Calculate price → Save to storage → Return result for navigation to results page
  submitQuote(data: QuoteData): Observable<QuoteResult> {                
    // 🏗️ BUILD QUOTE RESULT OBJECT - Assemble all pieces of the completed quote
    const quoteResult: QuoteResult = {                                  
      id: Date.now().toString(),                                        // Unique ID: "1723123456789" (milliseconds since 1970, ensures uniqueness)
      data: data,                                                       // Snapshot: Complete copy of user's form input for future reference
      quote: this.calculateQuote(data),                                 // Price: Monthly premium calculated by our algorithm ($87.50)
      date: new Date().toISOString()                                    // Timestamp: "2025-08-08T14:30:25.123Z" for sorting and expiration
    };

    // 💾 PERSIST TO BROWSER STORAGE - Save this quote so user can view it later
    const quotes = this.getStoredQuotes();                              // Get array of existing quotes from localStorage
    quotes.push(quoteResult);                                           // Append our new quote to the end of the array
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(quotes));     // Convert array to JSON string and save to browser storage

    // 🔄 RETURN OBSERVABLE - Wrap result in Observable for Angular async patterns
    return of(quoteResult);                                             // of() creates Observable that immediately emits the quote result
    // Note: Real app might call HTTP API here, Observable allows easy switching to real backend
  }

  // 🔍 FIND QUOTE BY ID - Retrieves a specific saved quote for the results page
  // Called by: QuoteResults component when user navigates to /quote-results?id=123456789
  // Usage: When user clicks "View Quote" from saved quotes list, or returns to recent quote
  getQuoteById(id: string): Observable<QuoteResult | null> {             
    const quotes = this.getStoredQuotes();                              // Load all saved quotes from browser storage
    const quote = quotes.find(q => q.id === id);                       // Array.find() searches for quote with matching ID
    return of(quote || null);                                           // Return found quote, or null if ID doesn't exist
    // Example: getQuoteById("1723123456789") returns QuoteResult or null
  }

  // 📋 GET ALL QUOTES - Retrieves complete list of saved quotes for the saved quotes page
  // Called by: SavedQuotes component to display user's quote history
  // Usage: Shows table/list of all previous quotes with dates, vehicles, and prices
  getAllQuotes(): Observable<QuoteResult[]> {                           
    const quotes = this.getStoredQuotes();                              // Load complete array from localStorage
    return of(quotes);                                                  // Return array wrapped in Observable for consistency
    // Example return: [{ id: "123", quote: 87.50 }, { id: "456", quote: 92.25 }]
  }

  // ============================================================================================
  // INSURANCE PRICING ALGORITHM - The Heart of Our Quote Calculation System
  // ============================================================================================
  // This method takes user input and applies real-world insurance risk factors to calculate
  // a monthly premium. Each factor reflects actual insurance industry practices and statistics.

  // 💰 CALCULATE QUOTE - Main pricing algorithm that determines monthly insurance premium
  // Called by: submitQuote() method to get the price for user's specific situation
  // Process: Start with base → Apply age factor → Vehicle factors → Driving history → Coverage level
  private calculateQuote(data: QuoteData): number {                       
    // 🏁 STARTING POINT - Base monthly premium before any risk adjustments
    let basePrice = 100;                                                // $100/month baseline (industry average for minimal coverage)
    
    // 👶👴 AGE RISK FACTOR - Different age groups have different accident rates (statistically proven)
    // Insurance industry data shows clear age-related risk patterns affecting pricing
    if (data.age < 25) {                                               // Young drivers (16-24): Highest risk group
      basePrice *= 1.25;                                              // +25% surcharge - inexperience + risk-taking behavior
      // Real reason: Teen drivers have 3x higher accident rate than adults
    } else if (data.age > 65) {                                        // Senior drivers (65+): Slightly higher risk
      basePrice *= 1.15;                                              // +15% surcharge - slower reflexes, vision/hearing changes
      // Real reason: Age-related physical changes affect driving ability
    }
    // Ages 25-65 pay base rate (no multiplier) - statistically safest drivers

    // 📅 VEHICLE AGE FACTOR - Newer cars cost more to repair, older cars have less value
    const currentYear = new Date().getFullYear();                       // Get current year (2025)
    const vehicleAge = currentYear - data.vehicleYear;                  // Calculate: 2025 - 2020 = 5 years old
    if (vehicleAge > 10) {                                             // Older vehicles (11+ years old)
      basePrice *= 0.85;                                              // -15% discount - cheaper parts, lower replacement value
      // Real reason: 2014 Honda Civic costs less to replace than 2024 model
    } else if (vehicleAge < 3) {                                       // Newer vehicles (0-2 years old)  
      basePrice *= 1.1;                                               // +10% surcharge - expensive OEM parts, higher theft target
      // Real reason: 2024 BMW headlight costs $2000, 2015 BMW headlight costs $500
    }
    // Vehicles 3-10 years old pay base rate (sweet spot for parts availability vs value)

    // 🚗 VEHICLE TYPE RISK FACTOR - Different vehicle types have different accident/theft/damage patterns
    switch (data.vehicleType?.toLowerCase()) {                          
      case 'sedan':                                                    // 4-door family cars (Honda Accord, Toyota Camry)
        basePrice *= 1.0;                                             // Base rate - average safety, moderate theft risk
        break;
      case 'suv':                                                      // Sport Utility Vehicles (Honda CR-V, Ford Explorer)
        basePrice *= 1.15;                                            // +15% surcharge - higher center of gravity = rollover risk
        break;
      case 'truck':                                                    // Pickup trucks (Ford F-150, Chevy Silverado)
        basePrice *= 1.2;                                             // +20% surcharge - heavier weight = more damage in crashes
        break;
      case 'van':                                                      // Passenger/cargo vans (Honda Odyssey, Ford Transit)
        basePrice *= 1.1;                                             // +10% surcharge - larger blind spots, harder to maneuver
        break;
      default:                                                         // Unknown/uncommon vehicle types
        basePrice *= 1.05;                                            // +5% surcharge - can't assess risk accurately
    }

    // 🚨 ACCIDENT HISTORY FACTOR - Past behavior predicts future risk (strongest indicator)
    if (data.accidents > 0) {                                          // Each at-fault accident in driving record
      basePrice *= (1 + (data.accidents * 0.2));                     // Each accident = +20% to premium
      // Real reason: Driver with 1 accident is 20% more likely to have another
      // Example: 2 accidents = 1 + (2 * 0.2) = 1.4 = +40% premium increase
    }
    
    // 🎫 TRAFFIC VIOLATIONS FACTOR - Tickets indicate risky driving behavior
    if (data.violations > 0) {                                         // Each moving violation (speeding, running lights, etc.)
      basePrice *= (1 + (data.violations * 0.1));                    // Each violation = +10% to premium  
      // Real reason: Drivers with tickets show pattern of rule-breaking/risk-taking
      // Example: 3 tickets = 1 + (3 * 0.1) = 1.3 = +30% premium increase
    }

    // 🛡️ COVERAGE LEVEL FACTOR - More protection costs more money
    switch (data.coverageLevel) {                                       
      case 'full':                                                     // Comprehensive + Collision + High Limits
        basePrice *= 1.35;                                            // +35% for maximum protection (covers theft, vandalism, etc.)
        break;
      case 'standard':                                                 // Liability + Basic Collision  
        basePrice *= 1.2;                                             // +20% for moderate protection (covers other people + your car)
        break;
      case 'basic':                                                    // Minimum Liability Only
        basePrice *= 1.0;                                             // Base rate - only covers damage you cause to others
        break;
      default:                                                         // Fallback if coverage level not specified
        basePrice *= 1.0;                                             // Default to basic pricing
    }

    // 🏆 SAFE DRIVER DISCOUNT - Reward for clean driving record
    if (data.accidents === 0 && data.violations === 0) {               // Perfect driving record (no accidents AND no tickets)
      basePrice *= 0.85;                                              // -15% good driver discount
      // Real reason: Insurance companies reward low-risk customers to retain them
    }

    // 🎯 FINAL PRICE CALCULATION - Apply business rules and return final monthly premium
    // Round to 2 decimal places and ensure minimum premium of $30
    return Math.max(Math.round(basePrice * 100) / 100, 30);            
    // Math.round(basePrice * 100) / 100 = rounds to 2 decimal places (87.456 becomes 87.46)
    // Math.max(..., 30) = ensures minimum $30/month (protects against extreme discounts)
    // Example calculation for 25yr old with 2020 Honda Civic, no accidents, basic coverage:
    // $100 * 1.0 (age) * 1.0 (vehicle age) * 1.0 (sedan) * 1.0 (no accidents) * 1.0 (basic) * 0.85 (safe) = $85.00/month
  }
}
