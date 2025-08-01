import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  private apiUrl = 'http://localhost:3000/quotes'; // Mock API endpoint

  constructor(private http: HttpClient) {}

  // Submit form data (POST)
  submitQuote(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  // Optional: Get all quotes (GET)
  getQuotes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
