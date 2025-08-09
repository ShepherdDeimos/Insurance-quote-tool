import { Component, OnInit } from '@angular/core';                          // Gets @Component decorator to mark class as Angular component + OnInit interface for ngOnInit() lifecycle method
import { CommonModule } from '@angular/common';                          // Gets *ngFor="let item of items", *ngIf="condition", | uppercase pipe for templates  
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';  // Gets this.fb.group() builder, FormGroup type, Validators.required/email rules + custom validator types
import { Router } from '@angular/router';                                // Gets this.router.navigate(['/path']) method for page navigation
import { BehaviorSubject } from 'rxjs';                                  // Gets variable that remembers last value + notifies all subscribers when value changes
import { QuoteService } from '../../services/quote.service';             // Gets service that takes form data and returns calculated monthly premium price

// Import our new child components
import { ProgressBarComponent } from '../../shared/form-components/progress-bar.component';           // Progress tracking component
import { PersonalInfoSectionComponent } from '../../shared/form-components/personal-info-section.component'; // Personal info form section
import { VehicleInfoSectionComponent } from '../../shared/form-components/vehicle-info-section.component';   // Vehicle selection section
import { CoverageInfoSectionComponent } from '../../shared/form-components/coverage-info-section.component'; // Coverage options section
import { FormSubmitSectionComponent } from '../../shared/form-components/form-submit-section.component';     // Submit button section

@Component({                                                               // Angular decorator function that transforms this TypeScript class into a reusable UI component
  selector: 'quote-form',                                               // Custom HTML element name - now you can write <quote-form></quote-form> in other templates
  templateUrl: './quote-form.html',                                     // File path to HTML template that defines what users see (forms, buttons, text)                                    
  standalone: true,                                                     // Makes component self-contained - doesn't need to be declared in NgModule imports array
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    // Import all our child components
    ProgressBarComponent,
    PersonalInfoSectionComponent,
    VehicleInfoSectionComponent,
    CoverageInfoSectionComponent,
    FormSubmitSectionComponent
  ],                                                                    // Modules and components this component needs
  //providers: [QuoteService]                                             // Services created fresh for each component instance - ensures data isolation
})
export class QuoteForm implements OnInit {                                  // Main TypeScript class that manages insurance quote form + implements OnInit for ngOnInit() method
  public quoteFormGroup!: FormGroup;                                         // Angular reactive FormGroup containing all input controls (firstName, email, vehicleType, etc.)
  public formProgress$ = new BehaviorSubject<number>(0);                // RxJS subject that emits percentage values 0-100 for progress bar display
  public isLoading = false;                                             // Boolean that shows/hides spinning wheel animation when submitting form to server
  public submitError: string | null = null;                             // Either null (no error) or string like "Failed to submit quote" to display error message
  
  // Track which sections user has interacted with
  private sectionsInteracted = {
    personal: false,
    vehicle: false, 
    coverage: false
  };

  // 📱 CUSTOM PHONE VALIDATOR - Allows dashes but requires exactly 10 digits
  private phoneValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;                                    // Skip validation if empty (required validator handles that)
    const digitsOnly = control.value.replace(/[^0-9]/g, '');           // Strip all non-digit characters (dashes, spaces, etc.)
    if (digitsOnly.length !== 10) {                                    // Must be exactly 10 digits after stripping
      return { 'phoneInvalid': true };                                 // Return validation error
    }
    return null;                                                       // Valid phone number
  }
                            

  constructor(                                                             // Special method that runs when Angular creates new QuoteForm component instance
    private fb: FormBuilder,                                            // Injects FormBuilder service - provides this.fb.group() method to create reactive forms
    private router: Router,                                             // Injects Router service - provides this.router.navigate(['/path']) method for page navigation
    private quoteService: QuoteService                                  // Injects our custom service with calculateQuote() method and localStorage functions
  ) {
    this.initForm();                                                    // Immediately calls our initForm() method to build the FormGroup with all input controls
  }

  ngOnInit() {                                                             // Angular lifecycle method that runs after constructor finishes and component DOM is ready
    this.initForm();                                                      // Set up the form with all fields and validation rules
    this.setupFormValueChanges();                                       // Start watching form inputs for changes to update progress bar
    this.updateFormProgress();                                          // Calculate initial progress
    console.log('Form initialized, progress initialized');             // DEBUG: Confirm initialization
  }

  private initForm() {                                                     // Private method that builds the reactive form with all input fields and validation rules
    this.quoteFormGroup = this.fb.group({                                    // FormBuilder.group() creates FormGroup object from configuration object
      // Personal Information
      firstName: ['', [Validators.required]],                           // Text input starts empty, becomes invalid if user leaves blank
      lastName: ['', [Validators.required]],                            // Text input starts empty, becomes invalid if user leaves blank
      email: ['', [Validators.required, Validators.email]],             // Text input starts empty, validates for required + email format like "user@domain.com"
      phone: ['', [Validators.required, this.phoneValidator.bind(this)]],  // Custom validator accepts 814-598-1890 format (strips dashes, validates 10 digits)
      age: ['', [Validators.required, Validators.min(16), Validators.max(100)]],  // Number input validates for required + between 16-100 inclusive
      zipCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],     // Text input validates for exactly 5 consecutive digits like "12345"
      
      // Vehicle Information  
      vehicleType: ['', [Validators.required]],                         // Dropdown starts empty, must select from sedan/suv/truck/etc options
      vehicleMake: ['', [Validators.required]],                         // Dropdown starts empty, must select from honda/ford/toyota/etc options
      vehicleModel: ['', [Validators.required]],                        // Dropdown starts empty, must select from civic/f150/camry/etc options
      vehicleYear: ['', [Validators.required, Validators.min(1990), Validators.max(new Date().getFullYear() + 1)]],  // Number input between 1990 and next year
      
      // Coverage Information
      accidents: [0, [Validators.required, Validators.min(0), Validators.max(10)]],     // FormControl starting at 0 with 0-10 range validation
      violations: [0, [Validators.required, Validators.min(0), Validators.max(10)]],    // FormControl starting at 0 with 0-10 range validation
      coverageLevel: ['basic', [Validators.required]],                  // FormControl with 'basic' default value and required validator
      drivingHistory: ['clean', [Validators.required]]                  // FormControl with 'clean' default value and required validator
    });
  }

  private setupFormValueChanges() {                                       // Function to watch for changes in the form and update progress
    // Update progress as form is filled
    this.quoteFormGroup.valueChanges.subscribe(() => {                       // Every time any field changes
      this.updateFormProgress();                                        // Update the progress bar
    });
    
    // Track user interaction with specific sections
    const personalFields = ['firstName', 'lastName', 'age', 'email', 'phone', 'zipCode'];
    const vehicleFields = ['vehicleType', 'vehicleMake', 'vehicleModel', 'vehicleYear'];
    const coverageFields = ['coverageLevel', 'drivingHistory'];
    
    // Mark personal section as interacted when any personal field changes
    personalFields.forEach(field => {
      this.quoteFormGroup.get(field)?.valueChanges.subscribe(() => {
        this.sectionsInteracted.personal = true;
      });
    });
    
    // Mark vehicle section as interacted when any vehicle field changes  
    vehicleFields.forEach(field => {
      this.quoteFormGroup.get(field)?.valueChanges.subscribe(() => {
        this.sectionsInteracted.vehicle = true;
      });
    });
    
    // Mark coverage section as interacted when any coverage field changes
    coverageFields.forEach(field => {
      this.quoteFormGroup.get(field)?.valueChanges.subscribe(() => {
        this.sectionsInteracted.coverage = true;
      });
    });
  }

  private updateFormProgress() {                                           // Function to calculate step-based progress through form sections
    // Define form sections as logical steps
    const formSections = {
      personalInfo: ['firstName', 'lastName', 'age', 'email', 'phone', 'zipCode'],     // Step 1: Personal Information (6 fields)
      vehicleInfo: ['vehicleType', 'vehicleMake', 'vehicleModel', 'vehicleYear'],       // Step 2: Vehicle Information (4 fields)  
      coverageInfo: ['coverageLevel', 'drivingHistory']                                 // Step 3: Coverage & Driving History (2 fields)
    };
    
    // Check completion of each section (must be valid AND user interacted)
    const personalComplete = this.isSectionComplete(formSections.personalInfo, 'personal');
    const vehicleComplete = this.isSectionComplete(formSections.vehicleInfo, 'vehicle');          
    const coverageComplete = this.isSectionComplete(formSections.coverageInfo, 'coverage');        
    
    // Calculate step-based progress (33% per completed section)
    let progress = 0;
    if (personalComplete) progress += 33.33;                            // Step 1 complete = 33%
    if (vehicleComplete) progress += 33.33;                             // Step 2 complete = 66% 
    if (coverageComplete) progress += 33.34;                            // Step 3 complete = 100%
    
    console.log('Step Progress:', { 
      personal: personalComplete, 
      vehicle: vehicleComplete, 
      coverage: coverageComplete, 
      interactions: this.sectionsInteracted,
      progress,
      formProgress$Value: this.formProgress$.value
    }); // DEBUG
    this.formProgress$.next(Math.round(progress));                      // Update progress bar with rounded percentage
    console.log('Progress updated to:', Math.round(progress));         // DEBUG: Confirm progress update
  }

  private isSectionComplete(fields: string[], sectionName: 'personal' | 'vehicle' | 'coverage'): boolean {
    // Section must be interacted with AND all fields must be valid
    const hasInteracted = this.sectionsInteracted[sectionName];
    const allFieldsValid = fields.every(field => {                      
      const control = this.quoteFormGroup.get(field);
      const value = control?.value;
      return control?.valid && value !== '' && value !== null;          // Valid non-empty values
    });
    
    return hasInteracted && allFieldsValid;                             // Both conditions must be true
  }

  onSubmit() {                                                             // Function that runs when user clicks submit button
    console.log('Form submitted!');                                    // DEBUG: Log that submit was triggered
    console.log('Form valid:', this.quoteFormGroup.valid);                  // DEBUG: Check if form passes validation
    console.log('Form errors:', this.getFormValidationErrors());       // DEBUG: Show any validation errors
    console.log('Form value:', this.quoteFormGroup.value);                  // DEBUG: Show current form data
    
    if (this.quoteFormGroup.valid) {                                         // If all form fields are filled correctly
      this.isLoading = true;                                            // Show loading spinner
      this.submitError = null;                                          // Clear any previous error messages

      this.quoteService.submitQuote(this.quoteFormGroup.value).subscribe({   // Send form data to quote service
        next: (result) => {                                             // If submission succeeds
          console.log('Quote created successfully:', result);           // DEBUG: Log successful quote creation
          this.isLoading = false;                                       // Hide loading spinner
          this.router.navigate(['/quote-results', result.id]);          // Go to results page with ID in URL path (not query params)
        },
        error: (error) => {                                             // If submission fails
          console.error('Quote submission error:', error);              // Log error to console for debugging
          this.submitError = 'Failed to submit quote. Please try again.';  // Show user-friendly error message
          this.isLoading = false;                                       // Hide loading spinner
        }
      });
    } else {
      console.log('Form is invalid, cannot submit');                   // DEBUG: Log why submission was blocked
      this.markFormGroupTouched();                                     // Show validation errors on all fields
    }
  }

  // 🔍 DEBUG HELPER - Get all form validation errors for debugging
  getFormValidationErrors() {                                          // Method to collect all validation errors
    let formErrors: any = {};                                          // Object to store field errors
    
    Object.keys(this.quoteFormGroup.controls).forEach(key => {             // Loop through all form controls
      const controlErrors = this.quoteFormGroup.get(key)?.errors;          // Get errors for this control
      if (controlErrors) {                                             // If there are errors
        formErrors[key] = controlErrors;                               // Add to our error collection
      }
    });
    
    return formErrors;                                                 // Return all errors found
  }

  // 🎯 VALIDATION HELPER - Mark all fields as touched to show validation errors
  markFormGroupTouched() {                                             // Method to trigger validation display
    Object.keys(this.quoteFormGroup.controls).forEach(key => {             // Loop through all form controls
      this.quoteFormGroup.get(key)?.markAsTouched();                       // Mark each field as touched (shows errors)
    });
  }
}

