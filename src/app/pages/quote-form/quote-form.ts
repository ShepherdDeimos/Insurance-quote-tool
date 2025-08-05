// This file is responsible for collecting the user's input, calculating the quote, and sending the data to the backend
// Every Angular screen or widget is a component and we declaie it with @Component decorator

import { Component } from '@angular/core';                            // Declares this as an Angular component (UI logic and structure)
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; // Tools to build and manage reactive forms
import { Router } from '@angular/router';                            // Lets us navigate to different pages (e.g., /quote-results)
import { HttpClient } from '@angular/common/http';                   // Sends HTTP requests (e.g., POST to JSON Server)
import { CommonModule } from '@angular/common';                      // Allows use of *ngIf, *ngFor, etc. in the HTML template
import { RouterModule } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';                  // For reactive progress tracking
import { map, startWith } from 'rxjs/operators';                     // For transforming form values
@Component({
  selector: 'app-quote-form',                                        // Optional HTML tag for this component (not usually used directly)
  standalone: true,                                                  // Declares this component works independently without a module
  imports: [CommonModule, ReactiveFormsModule, RouterModule],                      // Brings in required features like form controls and directives
  templateUrl: './quote-form.html',                                  // Points to the HTML file that defines the visual structure
  styleUrls: ['./quote-form.scss']                                   // Links to the SCSS file for styling this page
})
export class QuoteForm {                                             // This is the main class that handles all logic for the quote form
  quoteForm: FormGroup;                                              // Holds all form inputs in a reactive FormGroup (like a container)
  formProgress$: Observable<number>;                                 // Tracks form completion progress (0-100%)
  currentYear = new Date().getFullYear();                           // Current year for vehicle year validation
  private readonly sections = {
    driverInfo: ['age', 'zip'],
    vehicleInfo: ['vehicleType', 'vehicleModel', 'vehicleYear'],
    coverageInfo: ['coverageLevel', 'drivingHistory']
  };

  constructor(
    private fb: FormBuilder,                                         // Helps us build the form quickly using a "form builder"
    private router: Router,                                          // Lets us navigate to other pages programmatically
    private http: HttpClient                                         // Lets us send form data to the backend via POST
  ) {
    this.quoteForm = this.fb.group({                                 // Define the structure and rules of the form
      age: ['', [Validators.required, Validators.min(16), Validators.max(100)]],           // Age is required and must be between 16–100
      zip: ['', [Validators.required, Validators.pattern('^\\d{5}$')]],                    // ZIP must be 5 digits only
      vehicleType: ['', Validators.required],                        // Required: car, truck, SUV, etc.
      vehicleModel: ['', Validators.required],                       // Required: e.g., Chevy Malibu
      vehicleYear: ['', [Validators.required, Validators.min(1990), Validators.max(new Date().getFullYear())]], // Year must be from 1990–current
      coverageLevel: ['', Validators.required],                      // Required: basic, standard, premium
      drivingHistory: ['', Validators.required]                      // Required: clean, minor, major
    });

    // Initialize progress tracking
    this.formProgress$ = this.quoteForm.valueChanges.pipe(
      startWith(this.quoteForm.value),
      map(formValue => {
        let completedFields = 0;
        let totalFields = 0;
        
        // Count completed fields in each section
        Object.values(this.sections).forEach(sectionFields => {
          sectionFields.forEach(field => {
            totalFields++;
            if (formValue[field] && this.quoteForm.get(field)?.valid) {
              completedFields++;
            }
          });
        });

        // Calculate percentage
        return Math.round((completedFields / totalFields) * 100);
      })
    );
  }

  onSubmit(): void {                                                 // This function runs when the user submits the form
    if (this.quoteForm.valid) {                                      // Make sure the form passes all validation rules
      const quoteData = this.quoteForm.value;                        // Grab all the form values as a single object

      quoteData.vehicleType = quoteData.vehicleType.toUpperCase();  // Normalize the vehicle type to uppercase (for consistency)

      const base = 100;                                              // Starting base premium ($100)
      const ageFactor = quoteData.age < 25 ? 1.5 : 1.0;              // Drivers under 25 pay 50% more

      let vehicleFactor = 1.0;                                       // Default multiplier for vehicle type
      switch (quoteData.vehicleType) {                               // Adjust multiplier based on the vehicle type
        case 'CAR': vehicleFactor = 1.0; break;                      // No increase for cars
        case 'TRUCK': vehicleFactor = 1.3; break;                    // Trucks cost 30% more
        case 'SUV': vehicleFactor = 1.2; break;                      // SUVs cost 20% more
        default: vehicleFactor = 1.1;                                // Slight increase for unknown or uncommon types
      }

      quoteData.monthlyRate =                                        // Calculate the final quote and store it as a new field
        base * ageFactor * vehicleFactor;

      this.http.post<any>('http://localhost:3000/quotes', quoteData).subscribe({ // User hits submit and data is POST to JSON Server (the users info) 
        next: (response) => {                                        // If the server responds successfully:
          const id = response.id;                                    // Get the ID of the saved quote from the response
          this.router.navigate(['/quote-results'], { queryParams: { id } }); // Navigate to the results page and pass the ID in the URL
        },
        error: (err) => {                                            // If something goes wrong with the POST request:
          console.error('Failed to create quote:', err);             // Log the error for developers
          this.router.navigate(['/quote-results'], { queryParams: { id: 'notfound' } }); // Navigate to results page with error ID
        }
      });
    }
  }
}
