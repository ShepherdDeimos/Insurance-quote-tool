import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { QuoteService } from '../../services/quote.service';
import { QuoteResult } from '../../models/quote.model';

@Component({
  selector: 'app-saved-quotes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './saved-quotes.html',
  styleUrls: ['./saved-quotes.scss']
})
export class SavedQuotesComponent implements OnInit {
  quotes: QuoteResult[] = [];
  loading = false;
  error = false;

  constructor(private quoteService: QuoteService) {}

  ngOnInit(): void {
    this.loadQuotes();
  }

  loadQuotes(): void {
    this.loading = true;
    this.error = false;
    
    this.quoteService.getAllQuotes().subscribe({
        next: (data) => {
          this.quotes = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading quotes:', err);
          this.error = true;
          this.loading = false;
        }
      });
  }

  retryLoading(): void {
    this.loadQuotes();
  }

  // Delete a quote by ID and remove from local storage
  deleteQuote(id: string): void {
    const STORAGE_KEY = 'insurance_quotes';
    const quotes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const filteredQuotes = quotes.filter((quote: QuoteResult) => quote.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredQuotes));
    // Update the local array to refresh the UI
    this.quotes = this.quotes.filter(quote => quote.id !== id);
  }
}
