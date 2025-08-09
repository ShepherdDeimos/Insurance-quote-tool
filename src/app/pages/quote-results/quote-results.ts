// ================================================================================================
// QUOTE RESULTS COMPONENT - The Success Page That Shows Calculated Insurance Premiums
// ================================================================================================
// This component displays the final insurance quote after user completes the form.
// It's the "destination" page that shows the calculated monthly premium and quote details.
// User Journey: Quote Form → Submit → Quote Calculation → THIS PAGE → Optional: Save Quote
// Key Features: Displays premium, shows calculation factors, allows return to form or save quote

// 🔗 ANGULAR & ROUTING IMPORTS - Core functionality for component and navigation
import { Component, OnInit } from '@angular/core';                  // Component decorator and lifecycle hook for initialization
import { ActivatedRoute, Router } from '@angular/router';          // Tools to read URL parameters and navigate between pages
import { CommonModule } from '@angular/common';                    // Basic Angular directives (*ngIf, *ngFor) and pipes (currency, date)

// 🏢 BUSINESS LOGIC IMPORTS - Services and models specific to our insurance app
import { QuoteService } from '../../services/quote.service';       // Service that retrieves saved quotes and calculates premiums
import { QuoteResult } from '../../models/quote.model';            // Interface defining the structure of a completed quote with price

@Component({                                                        // Angular decorator that defines this as a UI component
  selector: 'app-quote-results',                                   // HTML tag name: <app-quote-results></app-quote-results>
  standalone: true,                                                // Self-contained component (doesn't need NgModule)
  imports: [CommonModule],                                         // Dependencies: *ngIf for conditional display, | currency for price formatting
  templateUrl: './quote-results.html',                            // External HTML file containing the visual layout                             
})
export class QuoteResults implements OnInit {                      // Main class implementing OnInit for component initialization
  // 💾 COMPONENT STATE - Data that controls what the user sees
  quote: QuoteResult | null = null;                               // The complete quote data (null until loaded from service)
  errorMessage: string | null = null;                             // Error text to display if quote loading fails
  showDetails = false;                                             // Boolean controlling whether detailed breakdown is visible

  // 🔧 DEPENDENCY INJECTION - Services this component needs to function
  constructor(
    private route: ActivatedRoute,                                 // Reads URL parameters (quote ID from /quote-results?id=123456789)
    private router: Router,                                        // Programmatic navigation (redirect to form if quote not found)
    private quoteService: QuoteService                            // Business logic service for quote retrieval and calculations
  ) {}                                                             // Constructor automatically injects these services when component created

  // 🚀 COMPONENT INITIALIZATION - This method runs automatically after Angular creates the component
  ngOnInit(): void {                                               // Lifecycle hook that executes after constructor finishes and component is ready
    // 🔍 READ ID FROM URL PATH - Extract quote ID from route parameter (not query parameter)
    this.route.params.subscribe(params => {                       // Watch for changes in URL path parameters (like /quote-results/123456789)
      const id = params['id'];                                     // Extract the 'id' parameter from the URL path (/quote-results/VALUE becomes id = "VALUE")

      if (id === 'notfound') {                                     // Special case: if URL contains /quote-results/notfound
        this.errorMessage = 'Sorry, no matching quote found.';    // Display user-friendly error message in template
        return;                                                    // Exit early, don't try to load a quote
      }

      console.log('Loading quote with ID:', id);                  // DEBUG: Log which quote we're trying to load
      this.quoteService.getQuoteById(id).subscribe({              // Call service method to retrieve quote data from localStorage
        next: (quote) => {                                         // SUCCESS callback - runs if quote is found and loaded
          console.log('Quote loaded:', quote);                    // DEBUG: Log the loaded quote data
          if (quote) {                                             // Double-check that quote object actually contains data
            this.quote = quote;                                    // Store the quote data in component property (triggers template update)
            this.errorMessage = null;                              // Clear any previous error messages
          } else {                                                 // If getQuoteById returns null (quote doesn't exist)
            this.errorMessage = 'Quote not found';                // Set error message for template to display
            this.router.navigate(['/quote-form']);                // Redirect user back to form page (they can try again)
          }
        },
        error: (error) => {                                        // ERROR callback - runs if something goes wrong during loading
          console.error('Error loading quote:', error);           // Log technical error details to browser console (for developers)
          this.errorMessage = 'Failed to load quote';             // Set user-friendly error message for template
          this.router.navigate(['/quote-form']);                  // Redirect user back to form page to start over
        }
      });
    });
  }

  // 🔄 TOGGLE DETAILS VISIBILITY - Shows/hides detailed price breakdown section
  toggleDetails(): void {                                          // Method bound to "Show Details" button click in template
    this.showDetails = !this.showDetails;                         // Flip boolean value: false→true or true→false (controls *ngIf in template)
  }
}
