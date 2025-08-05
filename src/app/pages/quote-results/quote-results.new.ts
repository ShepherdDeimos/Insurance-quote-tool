import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { QuoteService } from '../../services/quote.service';

@Component({
  selector: 'app-quote-results',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './quote-results.html',
  styleUrls: ['./quote-results.scss']
})
export class QuoteResults implements OnInit {
  quote: any = null;
  error: string | null = null;
  loading = true;
  showDetails = false;
  errorMessage: string | null = null;

  constructor(
    private quoteService: QuoteService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const quoteId = this.route.snapshot.paramMap.get('id');
    
    if (!quoteId) {
      this.error = 'Quote not found';
      this.loading = false;
      return;
    }

    this.quoteService.getQuoteById(quoteId).subscribe({
      next: (quote) => {
        if (quote) {
          this.quote = quote;
          this.loading = false;
        } else {
          this.error = 'Quote not found';
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Error fetching quote:', err);
        this.error = 'Failed to load quote details';
        this.loading = false;
      }
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  onGetNewQuote(): void {
    this.router.navigate(['/']);
  }

  toggleDetails(): void {
    this.showDetails = !this.showDetails;
  }
}
