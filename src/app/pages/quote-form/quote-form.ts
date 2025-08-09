import { Component, OnInit } from '@angular/core';                          // Gets @Component decorator to mark class as Angular component + OnInit interface for ngOnInit() lifecycle method
import { CommonModule } from '@angular/common';                          // Gets *ngFor="let item of items", *ngIf="condition", | uppercase pipe for templates  
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';  // Gets this.fb.group() builder, FormGroup type, Validators.required/email rules
import { Router, RouterLink } from '@angular/router';                    // Gets this.router.navigate(['/path']) method + <a routerLink="/path"> directive
import { BehaviorSubject } from 'rxjs';                                  // Gets variable that remembers last value + notifies all subscribers when value changes
import { VehicleDataService } from '../../services/vehicle-data.service'; // Gets service with arrays of Ford/Honda/Toyota makes and Civic/Accord/F150 models
import { QuoteService } from '../../services/quote.service';             // Gets service that takes form data and returns calculated monthly premium price

export interface VehicleOption {                                           // TypeScript contract requiring objects like { id: "civic", name: "Civic", types: ["sedan", "hatchback"] }
  id: string;                                                           // Lowercase unique key "civic" that gets stored in this.quoteFormGroup.value.vehicleModel
  name: string;                                                         // User-friendly label "Civic" that appears in <select><option>Civic</option></select>
  types?: string[];                                                     // Optional array ["sedan", "hatchback"] showing which body styles available for filtering
}
                                        
export interface VehicleMake {                                          // TypeScript contract requiring objects like { id: "honda", name: "Honda", models: [...civicObj, ...accordObj] }
  id: string;                                                           // Lowercase unique key "honda" that gets stored in this.quoteFormGroup.value.vehicleMake  
  name: string;                                                         // User-friendly label "Honda" that appears in <select><option>Honda</option></select>
  models: VehicleOption[];                                              // Array containing all car models like [civicObject, accordObject, crvObject] manufactured by this brand
}

@Component({                                                               // Angular decorator function that transforms this TypeScript class into a reusable UI component
  selector: 'quote-form',                                               // Custom HTML element name - now you can write <quote-form></quote-form> in other templates
  templateUrl: './quote-form.html',                                     // File path to HTML template that defines what users see (forms, buttons, text)                                    
  standalone: true,                                                     // Makes component self-contained - doesn't need to be declared in NgModule imports array
  imports: [CommonModule, ReactiveFormsModule, RouterLink],             // Modules this component needs: *ngIf/*ngFor, reactive forms, navigation links
  //providers: [QuoteService]                                             // Services created fresh for each component instance - ensures data isolation
})
export class QuoteForm implements OnInit {                                  // Main TypeScript class that manages insurance quote form + implements OnInit for ngOnInit() method
  public quoteFormGroup!: FormGroup;                                         // Angular reactive FormGroup containing all input controls (firstName, email, vehicleType, etc.)
  public formProgress$ = new BehaviorSubject<number>(0);                // RxJS subject that emits percentage values 0-100 for progress bar display
  public Math = Math;                                                   // Exposes JavaScript Math object to template so HTML can use Math.round(progress)

  public vehicleTypes: VehicleOption[] = [                             // Hardcoded array of car type options that populate the "Vehicle Type" dropdown
    { id: 'sedan', name: 'Sedan' },                                    // 4-door family cars like Honda Accord, Toyota Camry
    { id: 'coupe', name: 'Coupe' },                                    // 2-door sporty cars like Honda Civic Si, Mustang  
    { id: 'suv', name: 'SUV' },                                        // Tall utility vehicles like Honda CR-V, Ford Explorer
    { id: 'truck', name: 'Truck' },                                    // Pickup trucks like Ford F-150, Chevy Silverado
    { id: 'van', name: 'Van/Minivan' },                                // Large passenger vehicles like Honda Odyssey, Toyota Sienna
    { id: 'wagon', name: 'Wagon' },                                    // Low long cars like Subaru Outback, Volvo V60
    { id: 'hatchback', name: 'Hatchback' },                            // Small cars with rear lift-up door like Honda Civic Hatch, VW Golf
    { id: 'convertible', name: 'Convertible' }                         // Cars with removable/foldable roof like Mazda Miata, Ford Mustang Convertible
  ];

  public availableModels: VehicleOption[] = [];                        // Dynamic array filled with car models like ["Civic", "Accord"] when user selects Honda + Sedan
  public filteredMakes: VehicleMake[] = [];                            // Dynamic array filled with manufacturers like ["Honda", "Toyota"] when user selects Sedan
  public currentYear = new Date().getFullYear();                       // JavaScript Date calculation giving current year number (2025) for form validation
  public isLoading = false;                                             // Boolean that shows/hides spinning wheel animation when submitting form to server
  public submitError: string | null = null;                             // Either null (no error) or string like "Failed to submit quote" to display error message
                            

  constructor(                                                             // Special method that runs when Angular creates new QuoteForm component instance
    private fb: FormBuilder,                                            // Injects FormBuilder service - provides this.fb.group() method to create reactive forms
    private router: Router,                                             // Injects Router service - provides this.router.navigate(['/path']) method for page navigation
    private vehicleDataService: VehicleDataService,                     // Injects our custom service containing Honda/Ford/Toyota data arrays
    private quoteService: QuoteService                                  // Injects our custom service with calculateQuote() method and localStorage functions
  ) {
    this.initForm();                                                    // Immediately calls our initForm() method to build the FormGroup with all input controls
  }

  ngOnInit() {                                                             // Angular lifecycle method that runs after constructor finishes and component DOM is ready
    // Don't show any makes until a type is selected
    this.filteredMakes = [];                                            // Set empty array so Honda/Ford/Toyota don't show until user picks Sedan/SUV/etc first
    this.setupFormValueChanges();                                       // Start watching form inputs for changes to trigger dynamic dropdown filtering
  }

  private initForm() {                                                     // Private method that builds the reactive form with all input fields and validation rules
    this.quoteFormGroup = this.fb.group({                                    // FormBuilder.group() creates FormGroup object from configuration object
      // Personal Information
      firstName: ['', [Validators.required]],                           // Text input starts empty, becomes invalid if user leaves blank
      lastName: ['', [Validators.required]],                            // Text input starts empty, becomes invalid if user leaves blank
      email: ['', [Validators.required, Validators.email]],             // Text input starts empty, validates for required + email format like "user@domain.com"
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],  // Text input validates for exactly 10 consecutive digits like "1234567890"
      age: ['', [Validators.required, Validators.min(16), Validators.max(100)]],  // Number input validates for required + between 16-100 inclusive
      zip: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],     // Text input validates for exactly 5 consecutive digits like "12345"
      
      // Vehicle Information
      vehicleType: ['', [Validators.required]],                         // Dropdown starts empty, must select from sedan/suv/truck/etc options
      vehicleMake: ['', [Validators.required]],                         // Dropdown starts empty, must select from honda/ford/toyota/etc options
      vehicleModel: ['', [Validators.required]],                        // Dropdown starts empty, must select from civic/f150/camry/etc options
      vehicleYear: ['', [Validators.required, Validators.min(1990), Validators.max(this.currentYear + 1)]],  // Number input between 1990 and 2026 (next year)
      
      // Coverage Information
      accidents: [0, [Validators.required, Validators.min(0), Validators.max(10)]],     // FormControl starting at 0 with 0-10 range validation
      violations: [0, [Validators.required, Validators.min(0), Validators.max(10)]],    // FormControl starting at 0 with 0-10 range validation
      coverageLevel: ['basic', [Validators.required]],                  // FormControl with 'basic' default value and required validator
      drivingHistory: ['clean', [Validators.required]]                  // FormControl with 'clean' default value and required validator
    });
  }

  private setupFormValueChanges() {                                       // Function to watch for changes in the form
    // Watch for vehicle type changes
    this.quoteFormGroup.get('vehicleType')?.valueChanges.subscribe(type => { // When car type changes (sedan, SUV, etc.)
      console.log('Vehicle type changed:', type);                       // Show what type was selected (for debugging)
      this.filterMakesByType(type);                                     // Update the list of car brands
      this.quoteFormGroup.patchValue({ vehicleMake: '', vehicleModel: '' }, { emitEvent: false });  // Clear brand and model
      this.availableModels = []; // Reset models when type changes      // Clear the model list too
    });

    // Watch for vehicle make changes
    this.quoteFormGroup.get('vehicleMake')?.valueChanges.subscribe(makeId => {  // When car brand changes (Honda, Ford, etc.)
      console.log('Vehicle make changed:', makeId);                     // Show what brand was selected
      const selectedType = this.quoteFormGroup.get('vehicleType')?.value;    // Get the currently selected car type
      console.log('Current vehicle type:', selectedType);               // Show the current type
      this.filterModelsByMakeAndType(makeId);                           // Update the list of car models
      this.quoteFormGroup.patchValue({ vehicleModel: '' }, { emitEvent: false });  // Clear the model selection
    });

    // Update progress as form is filled
    this.quoteFormGroup.valueChanges.subscribe(() => {                       // Every time any field changes
      this.updateFormProgress();                                        // Update the progress bar
    });
  }

  private filterMakesByType(typeId: string) {                             // Function to show only car brands that make the selected type
    if (!typeId) {                                                      // If no type is selected
      this.filteredMakes = [];                                          // Show no brands
      return;                                                           // Stop here
    }
    
    // Get all makes that have models of the selected type
    this.filteredMakes = this.vehicleDataService.getMakesByType(typeId);  // Ask the service for matching brands
    console.log('Available makes for type', typeId, ':', this.filteredMakes.map(m => m.name));  // Show what we found
  }

  private filterModelsByMakeAndType(makeId: string) {                     // Function to show car models for selected brand and type
    if (!makeId) {                                                      // If no brand is selected
      this.availableModels = [];                                        // Show no models
      return;                                                           // Stop here
    }

    const selectedType = this.quoteFormGroup.get('vehicleType')?.value;      // Get the selected car type
    if (!selectedType) {                                                // If no type is selected
      this.availableModels = [];                                        // Show no models
      return;                                                           // Stop here
    }

    // Get all models for the make that include the selected type
    this.availableModels = this.vehicleDataService.getModelsByMakeAndType(makeId, selectedType);  // Ask service for matching models
    console.log('Available models for', makeId, 'of type', selectedType, ':', this.availableModels.map(m => m.name));  // Show what we found
  }

  private updateFormProgress() {                                           // Function to calculate how much of the form is filled
    const requiredFields = [                                            // List of all fields that must be filled
      'firstName', 'lastName', 'email', 'phone', 'age', 'zip',          // Personal info fields
      'vehicleType', 'vehicleMake', 'vehicleModel', 'vehicleYear',       // Vehicle info fields
      'coverageLevel', 'drivingHistory'  // Coverage info               // Coverage info fields
    ];
    
    const filledFields = requiredFields.filter(field =>                 // Count fields that are filled and valid
      this.quoteFormGroup.get(field)?.value !== '' &&                       // Field has a value AND
      this.quoteFormGroup.get(field)?.valid                                  // Field passes all validation rules
    );

    const progress = (filledFields.length / requiredFields.length) * 100;  // Calculate percentage (filled ÷ total × 100)
    this.formProgress$.next(progress);                                  // Update the progress bar
  }

  incrementValue(field: 'accidents' | 'violations') {                     // Function to increase accident or violation count
    const currentValue = this.quoteFormGroup.get(field)?.value || 0;        // Get current number (or 0 if empty)
    if (currentValue < 10) {                                            // If less than 10 (our maximum)
      this.quoteFormGroup.patchValue({ [field]: currentValue + 1 });        // Add 1 to the current number
    }
  }

  decrementValue(field: 'accidents' | 'violations') {                   // Function to decrease accident or violation count
    const currentValue = this.quoteFormGroup.get(field)?.value || 0;        // Get current number (or 0 if empty)
    if (currentValue > 0) {                                             // If greater than 0 (can't go negative)
      this.quoteFormGroup.patchValue({ [field]: currentValue - 1 });        // Subtract 1 from the current number
    }
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

