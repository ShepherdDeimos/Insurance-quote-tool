// This file is responsible for collecting the users input, calculates quote and sends data to the server

import { Component } from '@angular/core'; // Making a new piece of the app forms page or UI section
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; // Builds Forms fast, group that holds users info, forms react when people type 
import { Router } from '@angular/router'; // Takes you to different pages when form is done
import { HttpClient } from '@angular/common/http'; // mailman for your frontend and backend (JSON server port 3000)
import { CommonModule } from '@angular/common'; // Common Angular building blocks

@Component({
  selector: 'app-quote-form', // What tag name I’ll use in HTML
  standalone: true, // Working alone
  imports: [CommonModule, ReactiveFormsModule], // importing tools
  templateUrl: './quote-form.html', // Look at this HTML file for my look 
  styleUrls: ['./quote-form.scss'] // Look at this SCSS file for my clothes
})

export class QuoteForm { // Real action happens, teach the form how to act
  quoteForm: FormGroup; // Forms backpack and holds: age, zip, vehicleType

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient) { // SETUP zone
    this.quoteForm = this.fb.group({ // Creates the actual form and inside {} structure of form
      age: ['', [Validators.required, Validators.min(16), Validators.max(100)]], // Must be between 16–100
      zip: ['', [Validators.required, Validators.pattern('^\\d{5}$')]], // Must be a 5-digit number
      vehicleType: ['', Validators.required],
      vehicleModel: ['', Validators.required],
      vehicleYear: ['', [Validators.required, Validators.min(1990), Validators.max(new Date().getFullYear())]], // From 1990 to this year
      coverageLevel: ['', Validators.required],
      drivingHistory: ['', Validators.required]
    });
  }

  onSubmit(): void { // When user hits Get Quote Button
    if (this.quoteForm.valid) {
      const quoteData = this.quoteForm.value; // Grab user form data
      quoteData.vehicleType = quoteData.vehicleType.toUpperCase(); // Normalize vehicle type
      const base = 100; // Base cost
      const ageFactor = quoteData.age < 25 ? 1.5 : 1.0; // Young drivers pay more
      let vehicleFactor = 1.0;

      switch (quoteData.vehicleType) {
        case 'CAR':
          vehicleFactor = 1.0;
          break;
        case 'TRUCK':
          vehicleFactor = 1.3;
          break;
        case 'SUV':
          vehicleFactor = 1.2;
          break;
        default:
          vehicleFactor = 1.1;
      }

      quoteData.monthlyRate = base * ageFactor * vehicleFactor; // Final calculation

      this.http.post<any>('http://localhost:3000/quotes', quoteData).subscribe({
        next: (response) => {
          const id = response.id;
          this.router.navigate(['/quote-results'], { queryParams: { id } });
        },
        error: (err) => {
          console.error('Failed to create quote:', err);
          this.router.navigate(['/quote-results'], { queryParams: { id: 'notfound' } });
        }
      });
    }
  }
}
