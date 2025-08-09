// ================================================================================================
// FORM SUBMIT SECTION COMPONENT - Quote Form Submission Handler
// ================================================================================================
// This component handles the final step of the quote form: submission, loading states,
// error handling, and success feedback. It's the action center of the form.
//
// RESPONSIBILITY: Manage form submission process and user feedback
// INPUTS: FormGroup for validation, loading state, error messages
// OUTPUTS: Submit event when user clicks submit button

import { Component, Input, Output, EventEmitter } from '@angular/core';  // Angular decorators and event handling
import { FormGroup, ReactiveFormsModule } from '@angular/forms';         // Reactive forms for validation
import { CommonModule } from '@angular/common';                          // Basic Angular directives
import { RouterLink } from '@angular/router';                            // Router link directive

@Component({                                                             // Angular decorator that defines this as a UI component
  selector: 'app-form-submit-section',                                   // HTML tag: <app-form-submit-section></app-form-submit-section>
  standalone: true,                                                      // Self-contained component
  imports: [CommonModule, ReactiveFormsModule, RouterLink],               // Dependencies: directives, reactive forms, and router
  template: `
    <!-- Submit Section: Container for form submission controls -->
    <div class="bg-gradient-to-br from-[#1a1f3c] via-[#2a2f5c] to-[#3a3f7c] rounded-lg p-6 shadow-lg transform hover:scale-[1.02] transition-all duration-300">
      
      <!-- Error Alert: Clean, concise display of missing fields -->
      <div *ngIf="(errorMessage || hasFormErrors()) && !isLoading" 
           class="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl backdrop-blur-sm">
        <div class="flex items-start space-x-3">
          <!-- Error Icon -->
          <svg class="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div class="flex-1">
            <!-- Custom error message if provided -->
            <div *ngIf="errorMessage" class="text-red-300 font-medium">{{ errorMessage }}</div>
            
            <!-- Concise missing fields list -->
            <div *ngIf="hasFormErrors() && !errorMessage" class="text-red-300 font-medium">
              Please complete: 
              <span class="text-red-200 font-normal">{{ getMissingFieldsList() }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Success Message: Show after successful submission -->
      <div *ngIf="showSuccessMessage" 
           class="mb-6 p-4 bg-green-500/20 border border-green-500/40 rounded-lg">
        <div class="flex items-center space-x-3">
          <!-- Success Icon -->
          <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <h3 class="text-green-300 font-semibold">Quote Generated Successfully!</h3>
            <p class="text-green-200 text-sm mt-1">Your insurance quote has been calculated and saved.</p>
          </div>
        </div>
      </div>

      <!-- Form Summary: Redesigned elegant overview before submission -->
      <div class="mb-8 relative overflow-hidden">
        <!-- Background gradient card -->
        <div class="bg-gradient-to-br from-[#141830] via-[#1a1f3c] to-[#1e2347] 
                    border border-[#2d3748]/60 rounded-2xl shadow-2xl backdrop-blur-sm">
          
          <!-- Header with animated gradient -->
          <div class="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 
                      border-b border-[#2d3748]/40 px-8 py-6">
            <div class="flex items-center space-x-3">
              <!-- Animated clipboard icon -->
              <div class="p-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg shadow-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 
                           bg-clip-text text-transparent">Quote Summary</h3>
                <p class="text-gray-400 text-sm mt-1">Review your information before getting your quote</p>
              </div>
            </div>
          </div>

          <!-- Content grid with improved styling -->
          <div class="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <!-- Personal Info Card -->
            <div class="group hover:transform hover:scale-105 transition-all duration-300">
              <div class="bg-gradient-to-br from-blue-500/5 to-blue-600/10 
                          border border-blue-500/20 rounded-xl p-6 h-full">
                <!-- Section header with icon -->
                <div class="flex items-center space-x-3 mb-4">
                  <div class="p-2 bg-blue-500/20 rounded-lg">
                    <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h4 class="font-semibold text-blue-300">Personal Information</h4>
                </div>
                
                <!-- Personal details -->
                <div class="space-y-3">
                  <div class="flex items-center space-x-2">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="text-white font-medium">{{ getFieldValue('firstName') }} {{ getFieldValue('lastName') }}</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M8 7V3a4 4 0 118 0v4m-4 0v14M8 7H3a4 4 0 00-4 4v9a4 4 0 004 4h14a4 4 0 004-4v-9a4 4 0 00-4-4h-5" />
                    </svg>
                    <span class="text-gray-300">Age: {{ getFieldValue('age') }}</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span class="text-gray-300">{{ getFieldValue('zipCode') }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Vehicle Info Card -->
            <div class="group hover:transform hover:scale-105 transition-all duration-300">
              <div class="bg-gradient-to-br from-purple-500/5 to-purple-600/10 
                          border border-purple-500/20 rounded-xl p-6 h-full">
                <!-- Section header with icon -->
                <div class="flex items-center space-x-3 mb-4">
                  <div class="p-2 bg-purple-500/20 rounded-lg">
                    <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M19 7.5v3.5a6 6 0 01-6 6h-2a6 6 0 01-6-6V7.5m4-3h8m-8 0v3h8V4.5m-8 0C8.5 3.672 9.172 3 10 3h4c.828 0 1.5.672 1.5 1.5z" />
                    </svg>
                  </div>
                  <h4 class="font-semibold text-purple-300">Vehicle Information</h4>
                </div>
                
                <!-- Vehicle details -->
                <div class="space-y-3">
                  <div class="flex items-center space-x-2">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span class="text-white font-medium">{{ getFieldValue('vehicleType') | titlecase }}</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span class="text-gray-300">{{ getFieldValue('vehicleMake') }} {{ getFieldValue('vehicleModel') }}</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M8 7V3a4 4 0 118 0v4m-4 0v14M8 7H3a4 4 0 00-4 4v9a4 4 0 004 4h14a4 4 0 004-4v-9a4 4 0 00-4-4h-5" />
                    </svg>
                    <span class="text-gray-300">{{ getFieldValue('vehicleYear') }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Coverage Info Card -->
            <div class="group hover:transform hover:scale-105 transition-all duration-300">
              <div class="bg-gradient-to-br from-pink-500/5 to-pink-600/10 
                          border border-pink-500/20 rounded-xl p-6 h-full">
                <!-- Section header with icon -->
                <div class="flex items-center space-x-3 mb-4">
                  <div class="p-2 bg-pink-500/20 rounded-lg">
                    <svg class="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h4 class="font-semibold text-pink-300">Coverage & History</h4>
                </div>
                
                <!-- Coverage details -->
                <div class="space-y-3">
                  <div class="flex items-center space-x-2">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    <span class="text-white font-medium">{{ getFieldValue('coverageLevel') | titlecase }} Coverage</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span class="text-gray-300">{{ getFieldValue('drivingHistory') | titlecase }} Record</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span class="text-gray-300">{{ getFieldValue('accidentCount') || 0 }} accidents, {{ getFieldValue('violationCount') || 0 }} violations</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom accent line -->
          <div class="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-60"></div>
        </div>
      </div>

      <!-- Submit Button Section -->
      <div class="text-center">
        <!-- Main Submit Button -->
        <button 
          type="submit"
          (click)="handleSubmit()"
          [disabled]="parentForm.invalid || isLoading"
          class="group relative inline-flex items-center justify-center px-12 py-4 text-lg font-semibold
                 bg-gradient-to-r from-blue-500 via-blue-600 to-purple-500 text-white rounded-lg
                 hover:from-blue-600 hover:to-purple-600 
                 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed
                 transform hover:scale-[1.02] disabled:scale-100 
                 transition-all duration-300 shadow-lg hover:shadow-xl
                 focus:outline-none focus:ring-4 focus:ring-blue-500/50
                 min-w-[200px]">
          
          <!-- Loading Spinner: Show during submission -->
          <svg *ngIf="isLoading" 
               class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
               fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
          
          <!-- Submit Icon: Show when not loading -->
          <svg *ngIf="!isLoading" 
               class="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-200" 
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          
          <!-- Button Text: Changes based on loading state -->
          <span *ngIf="!isLoading">Start Your Quote</span>
          <span *ngIf="isLoading">Calculating...</span>
        </button>

        <!-- Help Text: Guidance for users -->
        <p class="mt-4 text-sm text-gray-400">
          <span *ngIf="parentForm.invalid">Complete all required fields above to get your quote</span>
          <span *ngIf="parentForm.valid">Ready to generate your personalized insurance quote</span>
        </p>

        <!-- Security Notice -->
        <div class="mt-6 flex items-center justify-center space-x-2 text-xs text-gray-500">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Your information is secure and will not be shared</span>
        </div>

        <!-- View Saved Quotes Link -->
        <a routerLink="/saved-quotes" 
           class="mt-4 text-sm text-gray-400 hover:text-blue-400 transition-colors flex items-center justify-center">
          <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          View Saved Quotes
        </a>
      </div>
    </div>
  `
})
export class FormSubmitSectionComponent {                                // Main component class
  @Input() parentForm!: FormGroup;                                      // Input: parent form group for validation
  @Input() isLoading = false;                                           // Input: loading state from parent
  @Input() errorMessage = '';                                           // Input: error message from parent
  @Input() showSuccessMessage = false;                                  // Input: success state from parent
  @Output() submitForm = new EventEmitter<void>();                      // Output: emit when form should be submitted

  // 🚀 FORM SUBMISSION HANDLER - Emit event to parent component
  handleSubmit(): void {                                                // Handle submit button click
    if (this.parentForm.valid && !this.isLoading) {                    // If form is valid and not loading
      this.submitForm.emit();                                           // Emit submit event to parent
    } else {                                                            // If form is invalid
      this.markAllFieldsAsTouched();                                    // Show validation errors
      console.log('Form has validation errors:', this.getFormErrors()); // Debug log
    }
  }

  // 🔍 VALIDATION HELPERS - Check form state and show errors
  hasFormErrors(): boolean {                                            // Check if form has any validation errors
    return this.parentForm.invalid;                                     // Return true if invalid (removed touched requirement)
  }

  markAllFieldsAsTouched(): void {                                      // Mark all fields as touched to show errors
    this.parentForm.markAllAsTouched();                                 // Angular method to trigger validation display
  }

  getFieldValue(field: string): any {                                   // Helper method to get form field value
    return this.parentForm.get(field)?.value || '';                    // Return field value or empty string if undefined
  }

  // 📋 CONCISE ERROR DISPLAY - Get comma-separated list of missing fields
  getMissingFieldsList(): string {                                     // Method to create a clean list of missing fields
    const fieldLabels: { [key: string]: string } = {                   // Friendly field names for display
      firstName: 'First Name',
      lastName: 'Last Name', 
      email: 'Email',
      phone: 'Phone',
      age: 'Age',
      zipCode: 'ZIP Code',
      vehicleType: 'Vehicle Type',
      vehicleMake: 'Vehicle Make',
      vehicleModel: 'Vehicle Model', 
      vehicleYear: 'Vehicle Year',
      coverageLevel: 'Coverage Level',
      drivingHistory: 'Driving History'
    };
    
    const missingFields: string[] = [];                                 // Array to collect missing field names
    
    Object.keys(this.parentForm.controls).forEach(key => {             // Check each form control
      const control = this.parentForm.get(key);                        // Get the control
      if (control?.invalid && fieldLabels[key]) {                      // If invalid and has a friendly label
        missingFields.push(fieldLabels[key]);                          // Add friendly name to list
      }
    });
    
    return missingFields.join(', ');                                    // Return comma-separated list
  }

  // 🔍 DEBUG HELPER - Get all form validation errors for debugging
  getFormErrors() {                                                     // Method to collect all validation errors
    let formErrors: any = {};                                           // Object to store field errors
    
    Object.keys(this.parentForm.controls).forEach(key => {             // Loop through all form controls
      const controlErrors = this.parentForm.get(key)?.errors;          // Get errors for this control
      if (controlErrors) {                                              // If there are errors
        formErrors[key] = controlErrors;                                // Add to our error collection
      }
    });
    
    return formErrors;                                                  // Return all errors found
  }

  // 🎯 COMPONENT PURPOSE:
  // - Provides the final submission interface for the quote form
  // - Shows comprehensive error messages and validation feedback
  // - Displays a summary of all form data before submission
  // - Handles loading states during quote calculation
  // - Shows success/error messages after submission attempts
  //
  // 📋 FEATURES:
  // - Detailed validation error list with specific field feedback
  // - Visual form summary showing user's inputs
  // - Loading spinner and disabled state during submission
  // - Success message display after successful quote generation
  // - Security notice to build user confidence
  //
  // 🎨 USER EXPERIENCE:
  // - Clear visual feedback for all form states (valid/invalid/loading/success/error)
  // - Helpful summary lets users review their information before submitting
  // - Animated submit button provides engaging interaction
  // - Comprehensive error messages guide users to fix issues
}
