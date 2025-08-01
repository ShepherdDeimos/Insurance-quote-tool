// Angular core decorator used to define the component
import { Component } from '@angular/core'; // Component decorator for UI logic

import { ActivatedRoute } from '@angular/router'; // Allows us to read URL query parameters like ?id=123
import { HttpClient } from '@angular/common/http'; // Lets us make HTTP requests to APIs
import { CommonModule } from '@angular/common'; // Gives access to *ngIf, *ngFor, etc. for a standalone component

@Component({
  selector: 'app-quote-results', // The custom HTML tag used to insert this component (e.g., <app-quote-results>)
  standalone: true, // This component doesn't belong to an NgModule, it's self-contained
  imports: [CommonModule], // Imports common Angular directives like *ngIf into this standalone component
  templateUrl: './quote-results.html', // Links to the HTML file for this component's UI
  styleUrls: ['./quote-results.scss'] // Links to the SCSS file for styling this component
})
export class QuoteResults { // Defines the QuoteResults component class
  quote: any = null; // Holds the data for a single quote (populated from the API)
  errorMessage: string | null = null; // Stores a message to show if there's a problem loading the quote
  finalQuote: number = 0; // Will hold the calculated final premium value after quote logic runs

  showDetails = false; // Controls the visibility of detailed quote breakdown in the UI

  constructor(private route: ActivatedRoute, private http: HttpClient) {} // Injects ActivatedRoute to access query params and HttpClient to make API calls

  ngOnInit(): void { // Lifecycle hook that runs once after the component loads
    this.route.queryParams.subscribe(params => { // Watches for query parameters in the URL (e.g., ?id=1)
      const id = params['id']; // Extracts the value of the 'id' parameter from the URL

      if (id === 'notfound') { // If the ID is 'notfound', handle it as a special error case
        console.log('Quote not found - triggering user error message'); // Debug message in the console
        this.errorMessage = 'Sorry, no matching quote found.'; // Set the error message shown to the user
        return; // Exit early since we don't want to make an API call
      }

      this.http.get<any>(`http://localhost:3000/quotes/${id}`).subscribe({ // Make GET request to fetch quote data by ID
        next: (data) => { // This block runs if the request succeeds
          this.quote = data; // Store the received quote data into the quote variable
          this.errorMessage = null; // Clear any error messages
          this.calculateQuote(); // Call function to calculate the final quote premium
        },
        error: (err) => { // This block runs if the request fails
          console.error('Failed to load quote:', err); // Log the error in the browser console
          this.errorMessage = 'Loading quote data or something went wrong...'; // Display a user-friendly error message
        }
      });
    });
  }

  calculateQuote(): void { // Function to calculate the final insurance premium
    const base = 100; // Set a base premium value to start from

    const age = this.quote.age; // Get the driver's age from the quote data
    const vehicleType = this.quote.vehicleType; // Get the vehicle type (e.g., car, truck)
    const vehicleYear = this.quote.vehicleYear; // Get the vehicle's year
    const drivingHistory = this.quote.drivingHistory; // Get the driver's history (e.g., clean, minor, major)
    const coverageLevel = this.quote.coverageLevel; // Get the selected coverage level (e.g., basic, premium)

    const ageFactor = age < 25 ? 1.5 : 1.0; // Younger drivers under 25 pay more (1.5x)

    let vehicleFactor = 1.0; // Default multiplier for vehicle type
    switch (vehicleType.toLowerCase()) { // Normalize vehicle type to lowercase and decide factor
      case 'car': vehicleFactor = 1.0; break; // Cars have no increase
      case 'suv': vehicleFactor = 1.2; break; // SUVs cost 20% more
      case 'truck': vehicleFactor = 1.3; break; // Trucks cost 30% more
      default: vehicleFactor = 1.1; // All other types get a slight bump
    }

    let yearFactor = 1.0; // Default multiplier based on vehicle year
    if (vehicleYear >= 2020) {
      yearFactor = 1.2; // Newer cars are more expensive to insure
    } else if (vehicleYear >= 2010) {
      yearFactor = 1.0; // Mid-age vehicles are standard cost
    } else {
      yearFactor = 0.9; // Older cars are cheaper to insure
    }

    let historyFactor = 1.0; // Default driving history factor
    switch (drivingHistory) { // Adjust based on driving record
      case 'clean': historyFactor = 1.0; break; // No change for clean record
      case 'minor': historyFactor = 1.2; break; // Minor incidents increase cost
      case 'major': historyFactor = 1.5; break; // Major incidents greatly increase cost
    }

    let coverageFactor = 1.0; // Default multiplier for coverage level
    switch (coverageLevel) { // Adjust based on the selected coverage
      case 'basic': coverageFactor = 1.0; break; // No change for basic
      case 'standard': coverageFactor = 1.3; break; // Standard coverage is more expensive
      case 'premium': coverageFactor = 1.6; break; // Premium coverage is the most expensive
    }

    this.finalQuote = base * ageFactor * vehicleFactor * yearFactor * historyFactor * coverageFactor; // Multiply all factors to get the final premium
    this.quote.premium = this.finalQuote.toFixed(2); // Round to 2 decimal places and attach to the quote object
  }
}
