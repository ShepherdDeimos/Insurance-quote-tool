// ================================================================================================
// SAVED QUOTES COMPONENT - History Page Showing All Previously Calculated Insurance Quotes
// ================================================================================================
// This component displays a list of all quotes the user has previously calculated and saved.
// It's like a "quote history" or "my quotes" page where users can review past calculations.
// User Journey: Create Quote → Save → Navigate to THIS PAGE → View/Compare/Delete Historical Quotes
// Key Features: Lists all quotes, shows key details, allows deletion, handles loading states

// 🔗 ANGULAR IMPORTS - Core framework functionality
import { Component, OnInit } from '@angular/core';              // Component decorator and initialization lifecycle hook
import { CommonModule } from '@angular/common';                // Basic Angular directives (*ngIf, *ngFor) and pipes (date, currency)
import { RouterModule } from '@angular/router';                // Router directives for navigation links (<a routerLink="/path">)

// 🏢 APPLICATION IMPORTS - Business logic specific to our insurance app
import { QuoteService } from '../../services/quote.service';   // Service that retrieves all saved quotes from localStorage
import { QuoteResult } from '../../models/quote.model';        // Interface defining the structure of quote data

@Component({                                                    // Angular decorator that defines this as a UI component
  selector: 'app-saved-quotes',                                // HTML tag name: <app-saved-quotes></app-saved-quotes>
  standalone: true,                                            // Self-contained component (doesn't need NgModule)
  imports: [CommonModule, RouterModule],                       // Dependencies: *ngIf/*ngFor for template logic, routerLink for navigation
  templateUrl: './saved-quotes.html',                          // External HTML file containing the visual layout
  styleUrls: ['./saved-quotes.scss']                           // External SCSS file containing component-specific styles
})
export class SavedQuotesComponent implements OnInit {          // Main class implementing OnInit for component initialization
  // 📊 COMPONENT STATE - Data that controls what the user sees
  quotes: QuoteResult[] = [];                                  // Array of all saved quotes (empty until loaded from service)
  loading = false;                                             // Boolean controlling loading spinner visibility
  error = false;                                               // Boolean controlling error message visibility

  // 🔧 DEPENDENCY INJECTION - Service this component needs to function
  constructor(private quoteService: QuoteService) {}          // Inject QuoteService for accessing saved quote data

  // 🚀 COMPONENT INITIALIZATION - Runs automatically when component is created
  ngOnInit(): void {                                           // Lifecycle hook that executes after constructor finishes
    this.loadQuotes();                                         // Immediately start loading all saved quotes from localStorage
  }

  // 📥 LOAD QUOTES FROM STORAGE - Retrieves all previously saved insurance quotes
  loadQuotes(): void {                                         // Method to fetch and display all saved quotes
    this.loading = true;                                       // Show loading spinner to user
    this.error = false;                                        // Clear any previous error state
    
    this.quoteService.getAllQuotes().subscribe({              // Call service method to get all quotes from localStorage
        next: (data) => {                                      // SUCCESS callback - runs when quotes are successfully loaded
          this.quotes = data;                                  // Store the quote array in component property (updates template)
          this.loading = false;                                // Hide loading spinner (quotes are now displayed)
        },
        error: (err) => {                                      // ERROR callback - runs if something goes wrong during loading
          console.error('Error loading quotes:', err);         // Log technical error details to browser console
          this.error = true;                                   // Show error message in template
          this.loading = false;                                // Hide loading spinner
        }
      });
  }

  // 🔄 RETRY LOADING - Allows user to try loading quotes again if there was an error
  retryLoading(): void {                                       // Method bound to "Try Again" button in error state
    this.loadQuotes();                                         // Call loadQuotes() again to retry the operation
  }

  // 🗑️ DELETE QUOTE - Removes a specific quote from localStorage and updates the display
  deleteQuote(id: string): void {                              // Method to permanently delete a quote by its unique ID
    const STORAGE_KEY = 'insurance_quotes';                    // localStorage key where all quotes are stored
    const quotes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');  // Get current quotes array from browser storage
    const filteredQuotes = quotes.filter((quote: QuoteResult) => quote.id !== id);  // Create new array excluding the quote to delete
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredQuotes));  // Save the updated array back to localStorage
    // Update the local array to refresh the UI immediately without reloading
    this.quotes = this.quotes.filter(quote => quote.id !== id);  // Remove deleted quote from component's quotes array (triggers template update)
  }
}
