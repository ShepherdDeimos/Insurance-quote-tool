import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-saved-quotes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './saved-quotes.html',
  styleUrls: ['./saved-quotes.scss']
})
export class SavedQuotesComponent implements OnInit {
  quotes: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:3000/quotes')
      .subscribe({
        next: (data) => this.quotes = data,
        error: (err) => console.error('Error loading quotes:', err)
      });
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
