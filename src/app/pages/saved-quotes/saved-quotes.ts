import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-saved-quotes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './saved-quotes.html',
  styleUrls: ['./saved-quotes.scss']
})
export class SavedQuotesComponent implements OnInit {
  quotes: any[] = [];
  loading = false;
  error = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadQuotes();
  }

  loadQuotes(): void {
    this.loading = true;
    this.error = false;
    
    this.http.get<any[]>('http://localhost:3000/quotes')
      .subscribe({
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

  // Delte a quote by ID and remove from local Array
  deleteQuote(id: number): void {
    this.http.delete(`http://localhost:3000/quotes/${id}`)
      .subscribe({
        next: () => {
        // Filter out the deleted quote from the local array to update the UI  
          this.quotes = this.quotes.filter(quote => quote.id !== id);
        },
        error: (err) => console.error('Error deleting quote:', err)
      });
  }
}
