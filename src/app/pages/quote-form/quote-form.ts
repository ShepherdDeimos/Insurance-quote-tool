// This file is responsible for collecting the user's input, calculating the quote, and sending the data to the backend
// Every Angular screen or widget is a component and we declaie it with @Component decorator

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { QuoteService } from '../../services/quote.service';
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
    private fb: FormBuilder,
    private router: Router,
    private quoteService: QuoteService
  ) {
    this.quoteForm = this.fb.group({
      age: ['', [Validators.required, Validators.min(16), Validators.max(100)]],
      zip: ['', [Validators.required, Validators.pattern('^\\d{5}$')]],
      vehicleType: ['', Validators.required],
      vehicleModel: ['', Validators.required],
      vehicleYear: ['', [Validators.required, Validators.min(1990), Validators.max(this.currentYear)]],
      coverageLevel: ['basic', Validators.required],
      accidents: [0, [Validators.required, Validators.min(0)]],
      violations: [0, [Validators.required, Validators.min(0)]]
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

  onSubmit(): void {
    if (this.quoteForm.valid) {
      const quoteData = {
        ...this.quoteForm.value,
        accidents: Number(this.quoteForm.value.accidents),
        violations: Number(this.quoteForm.value.violations),
        age: Number(this.quoteForm.value.age),
        vehicleYear: Number(this.quoteForm.value.vehicleYear)
      };
      
      this.quoteService.submitQuote(quoteData).subscribe({
        next: (result) => {
          this.router.navigate(['/quote-results'], { queryParams: { id: result.id } });
        },
        error: (err) => {
          console.error('Failed to submit quote:', err);
          this.router.navigate(['/quote-results'], { queryParams: { id: 'notfound' } });
        }
      });
    }
  }
}
