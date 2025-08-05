import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuoteService } from '../../services/quote.service';

@Component({
  selector: 'app-quote-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quote-results.html',
  styleUrls: ['./quote-results.scss']
})
export class QuoteResults implements OnInit {
  quote: any = null;
  errorMessage: string | null = null;
  finalQuote: number = 0;
  showDetails = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quoteService: QuoteService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];

      if (id === 'notfound') {
        this.errorMessage = 'Sorry, no matching quote found.';
        return;
      }

      this.quoteService.getQuoteById(id).subscribe({
        next: (quote) => {
          if (quote) {
            this.quote = quote;
            this.finalQuote = quote.quote;
            this.errorMessage = null;
          } else {
            this.errorMessage = 'Quote not found';
            this.router.navigate(['/quote-form']);
          }
        },
        error: (error) => {
          console.error('Error loading quote:', error);
          this.errorMessage = 'Failed to load quote';
          this.router.navigate(['/quote-form']);
        }
      });
    });
  }

  toggleDetails(): void {
    this.showDetails = !this.showDetails;
  }
}
