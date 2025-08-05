import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { QuoteData, QuoteResult } from '../models/quote.model';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  private readonly STORAGE_KEY = 'insurance_quotes';

  constructor() {
    // Initialize storage if needed
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
    }
  }

  private getStoredQuotes(): QuoteResult[] {
    const storedQuotes = localStorage.getItem(this.STORAGE_KEY);
    return storedQuotes ? JSON.parse(storedQuotes) : [];
  }

  getQuoteById(id: string): Observable<QuoteResult | null> {
    const quotes = this.getStoredQuotes();
    const quote = quotes.find(q => q.id === id);
    return of(quote || null);
  }

  async submitQuote(data: QuoteData): Promise<string> {
    try {
      const quoteAmount = this.calculateQuote(data);
      const quoteId = Date.now().toString();
      
      const quote: QuoteResult = {
        id: quoteId,
        data: data,
        quote: quoteAmount,
        date: new Date().toISOString()
      };

      // Save quote to local storage
      const existingQuotes = this.getStoredQuotes();
      existingQuotes.push(quote);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingQuotes));

      return quoteId;
    } catch (error) {
      console.error('Error submitting quote:', error);
      throw new Error('Failed to submit quote');
    }
  }

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
      case 'sedan': basePrice *= 1.0; break;     // Standard rate for sedans
      case 'suv': basePrice *= 1.15; break;      // SUVs have higher accident risk
      case 'truck': basePrice *= 1.2; break;     // Trucks have highest risk
      case 'van': basePrice *= 1.1; break;       // Vans have moderate risk
      default: basePrice *= 1.05;                // Unknown types small increase
    }

    // Driving history factor
    switch (data.drivingHistory) {
      case 'clean': basePrice *= 1.0; break;    // No change for clean record
      case 'minor': basePrice *= 1.25; break;   // 25% increase for minor violations
      case 'major': basePrice *= 1.5; break;    // 50% increase for major violations
    }

    // Coverage level factor
    switch (data.coverageLevel) {
      case 'basic': basePrice *= 1.0; break;    // Base price for basic coverage
      case 'standard': basePrice *= 1.2; break; // 20% increase for standard
      case 'full': basePrice *= 1.4; break;     // 40% increase for full coverage
    }

    return Math.round(basePrice); // Round to nearest dollar
  }
}
