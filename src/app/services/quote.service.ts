import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

interface QuoteData {
  age: number;
  vehicleType: 'car' | 'suv' | 'truck' | string;
  vehicleYear: number;
  accidents: number;
  violations: number;
  coverageLevel: 'basic' | 'standard' | 'full';
}

interface QuoteResult {
  id: string;
  data: QuoteData;
  quote: number;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  private readonly STORAGE_KEY = 'insurance_quotes';

  private calculateQuote(data: QuoteData): number {
    let basePrice = 100; // Base monthly insurance price starts at $100

    // Age factor (16-24: +25%, 25-65: normal, 65+: +15%)
    if (data.age < 25) basePrice *= 1.25;
    else if (data.age > 65) basePrice *= 1.15;

    // Vehicle age factor
    const currentYear = new Date().getFullYear();
    const vehicleAge = currentYear - data.vehicleYear;
    if (vehicleAge > 10) basePrice *= 0.85; // Older cars get 15% discount
    else if (vehicleAge < 3) basePrice *= 1.1; // Newer cars cost more to insure

    // Vehicle type factor
    switch (data.vehicleType?.toLowerCase()) {
      case 'car': basePrice *= 1.0; break;       // Standard rate for cars
      case 'suv': basePrice *= 1.15; break;      // SUVs have higher accident risk
      case 'truck': basePrice *= 1.2; break;     // Trucks have highest risk
      default: basePrice *= 1.05;                // Unknown types small increase
    }

    // Accident history factor (each accident adds 20%)
    if (data.accidents > 0) basePrice *= (1 + (data.accidents * 0.2));
    
    // Traffic violations factor (each violation adds 10%)
    if (data.violations > 0) basePrice *= (1 + (data.violations * 0.1));

    // Coverage level factor
    switch (data.coverageLevel) {
      case 'full': basePrice *= 1.35; break;     // Full coverage adds 35%
      case 'standard': basePrice *= 1.2; break;  // Standard adds 20%
      case 'basic': basePrice *= 1.0; break;     // Basic coverage uses base price
      default: basePrice *= 1.0;                 // Default to basic if not specified
    }

    // Apply safe driver discount (if no accidents and violations)
    if (data.accidents === 0 && data.violations === 0) {
      basePrice *= 0.85; // 15% discount for safe drivers
    }

    // Round to 2 decimal places and ensure minimum premium of $30
    return Math.max(Math.round(basePrice * 100) / 100, 30);
  }
  

  submitQuote(data: QuoteData): Observable<QuoteResult> {
    const quoteResult: QuoteResult = {
      id: Date.now().toString(),
      data: data,
      quote: this.calculateQuote(data),
      date: new Date().toISOString()
    };

    // Store in localStorage
    const quotes: QuoteResult[] = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    quotes.push(quoteResult);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(quotes));

    return of(quoteResult);
  }

  getQuoteById(id: string): Observable<QuoteResult | null> {
    const quotes: QuoteResult[] = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    const quote = quotes.find(q => q.id === id);
    return of(quote || null);
  }

  getAllQuotes(): Observable<QuoteResult[]> {
    const quotes: QuoteResult[] = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    return of(quotes);
  }
}
