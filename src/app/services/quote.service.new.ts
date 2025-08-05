import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

interface QuoteData {
  age: number;
  vehicleType: string;
  vehicleYear: number;
  accidents: number;
  violations: number;
  coverageLevel: 'basic' | 'standard' | 'premium';
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
    let basePrice = 1000; // Base insurance price

    // Age factor
    if (data.age < 25) basePrice *= 1.3;
    if (data.age > 65) basePrice *= 1.2;

    // Vehicle age factor
    const currentYear = new Date().getFullYear();
    if (currentYear - data.vehicleYear > 10) basePrice *= 1.1;

    // Vehicle type factor
    switch (data.vehicleType?.toLowerCase()) {
      case 'sports': basePrice *= 1.4; break;
      case 'luxury': basePrice *= 1.3; break;
      case 'suv': basePrice *= 1.2; break;
      case 'truck': basePrice *= 1.15; break;
      default: break;
    }

    // Accident history factor
    if (data.accidents > 0) basePrice *= (1 + (data.accidents * 0.2));
    
    // Traffic violations factor
    if (data.violations > 0) basePrice *= (1 + (data.violations * 0.1));

    // Coverage level factor
    switch (data.coverageLevel) {
      case 'premium': basePrice *= 1.3; break;
      case 'standard': basePrice *= 1.15; break;
      default: break; // basic coverage uses base price
    }

    return Math.round(basePrice);
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
