import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-quote-results',                                   // Optional custom HTML tag name for this component
  standalone: true,                                                // This component stands alone (not part of a shared NgModule)
  imports: [CommonModule],                                         // Enables Angular features like *ngIf and *ngFor in the template
  templateUrl: './quote-results.html',                             // Connects to the HTML file where the layout lives
  styleUrls: ['./quote-results.scss']                              // Connects to the optional SCSS file for this component’s styling
})
export class QuoteResults {                                        // Main logic class for the quote results page
  quote: any = null;                                               // Will hold the quote data retrieved from the backend
  errorMessage: string | null = null;                              // Stores an error message to show the user if needed
  finalQuote: number = 0;                                          // Holds the final calculated quote amount (number)

  showDetails = false;                                             // Used to toggle the visibility of detailed breakdown in the UI

  constructor(
    private route: ActivatedRoute,                                 // Allows us to access query parameters in the URL (like ID)
    private http: HttpClient                                       // Allows us to send requests to the JSON Server (mock API)
  ) {}

  ngOnInit(): void {                                               // Lifecycle hook — runs once after the component is created
    this.route.queryParams.subscribe(params => {                   // Subscribes to the URL query params (e.g., ?id=5)
      const id = params['id'];                                     // Extracts the value of the 'id' parameter from the URL

      if (id === 'notfound') {                                     // Handle special case where the quote is intentionally not found
        console.log('Quote not found - triggering user error');    // Log this in the developer console
        this.errorMessage = 'Sorry, no matching quote found.';     // Set a user-friendly message to display
        return;                                                    // Stop here — don’t call the backend
      }

      this.http.get<any>(`http://localhost:3000/quotes/${id}`)     // Send GET request to JSON Server to fetch quote by ID(get users info from MOCK API)
        .subscribe({                                               // Listen for the response from the server
          next: (data) => {                                        // If request succeeds:
            this.quote = data;                                     // Store the received data in the `quote` variable
            this.errorMessage = null;                              // Clear any previous error message
            this.calculateQuote();                                 // Run the quote calculation based on the data
          },
          error: (err) => {                                        // If request fails:
            console.error('Failed to load quote:', err);           // Log the error in the browser console
            this.errorMessage = 'Loading quote failed...';         // Show a user-friendly error message in the UI
          }
        });
    });
  }

  calculateQuote(): void {                                         // Function that calculates the final premium
    const base = 100;                                              // Start with a base price of $100

    const age = this.quote.age;                                    // Get the driver's age
    const vehicleType = this.quote.vehicleType;                    // Get the vehicle type (e.g., car, SUV, truck)
    const vehicleYear = this.quote.vehicleYear;                    // Get the year of the vehicle
    const drivingHistory = this.quote.drivingHistory;              // Get the driving history (clean, minor, major)
    const coverageLevel = this.quote.coverageLevel;                // Get the selected coverage level

    const ageFactor = age < 25 ? 1.5 : 1.0;                         // Apply higher cost for drivers under 25

    let vehicleFactor = 1.0;                                       // Default cost multiplier for vehicle type
    switch (vehicleType.toLowerCase()) {                           // Adjust multiplier based on type
      case 'car': vehicleFactor = 1.0; break;                      // No change for cars
      case 'suv': vehicleFactor = 1.2; break;                      // SUVs cost 20% more
      case 'truck': vehicleFactor = 1.3; break;                    // Trucks cost 30% more
      default: vehicleFactor = 1.1;                                // All others get a slight increase
    }

    let yearFactor = 1.0;                                          // Multiplier for vehicle age
    if (vehicleYear >= 2020) {
      yearFactor = 1.2;                                            // New cars are more expensive
    } else if (vehicleYear >= 2010) {
      yearFactor = 1.0;                                            // No change for mid-aged cars
    } else {
      yearFactor = 0.9;                                            // Older cars are cheaper to insure
    }

    let historyFactor = 1.0;                                       // Default driving history factor
    switch (drivingHistory) {
      case 'clean': historyFactor = 1.0; break;                    // Clean record = no increase
      case 'minor': historyFactor = 1.2; break;                    // Minor violations increase cost
      case 'major': historyFactor = 1.5; break;                    // Major violations greatly increase cost
    }

    let coverageFactor = 1.0;                                      // Default coverage factor
    switch (coverageLevel) {
      case 'basic': coverageFactor = 1.0; break;                   // No extra cost for basic
      case 'standard': coverageFactor = 1.3; break;                // Standard coverage costs 30% more
      case 'premium': coverageFactor = 1.6; break;                 // Premium coverage costs 60% more
    }

    this.finalQuote =                                              // Calculate the final premium by multiplying all factors
      base * ageFactor * vehicleFactor * yearFactor *
      historyFactor * coverageFactor;

    this.quote.premium = this.finalQuote.toFixed(2);               // Round to 2 decimals and attach to the quote object for display
  }
}
