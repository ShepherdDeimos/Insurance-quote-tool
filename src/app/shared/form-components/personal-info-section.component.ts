// ================================================================================================
// PERSONAL INFO SECTION COMPONENT - Driver Information Form Section
// ================================================================================================
// This component handles all personal/driver information inputs in the insurance quote form.
// It's extracted from the main form to follow Single Responsibility Principle.
//
// RESPONSIBILITY: Collect and validate driver personal information
// INPUTS: FormGroup for reactive form binding
// OUTPUTS: Form value changes through reactive form system

import { Component, Input } from '@angular/core';                       // Angular component decorator and Input decorator
import { FormGroup, ReactiveFormsModule } from '@angular/forms';        // Reactive forms for form management
import { CommonModule } from '@angular/common';                         // Basic Angular directives and pipes

@Component({                                                             // Angular decorator that defines this as a UI component
  selector: 'app-personal-info-section',                                // HTML tag: <app-personal-info-section></app-personal-info-section>
  standalone: true,                                                     // Self-contained component
  imports: [CommonModule, ReactiveFormsModule],                         // Dependencies: directives and reactive forms
  template: `
    <!-- Personal Info Section: Container for driver information -->
    <div [formGroup]="parentForm" class="bg-gradient-to-br from-[#1a1f3c] via-[#2a2f5c] to-[#3a3f7c] rounded-lg p-8 shadow-lg transform hover:scale-[1.02] transition-all duration-300">
      <!-- Section Title: Gradient text heading -->
      <h2 class="text-2xl font-semibold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
        Driver Info
      </h2>
      
      <!-- Two Column Grid Layout: First Name and Last Name -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <!-- First Name Field -->
        <div>
          <label class="block text-sm font-medium mb-2 text-blue-300">First Name *</label>
          <input 
            type="text" 
            formControlName="firstName"
            class="w-full px-4 py-3.5 text-lg bg-[#141830] border border-[#2d3748] rounded-lg text-white
                   placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none 
                   transition-all duration-300 shadow-lg hover:shadow-xl"
            placeholder="Enter your first name"
            [class.border-red-500]="parentForm.get('firstName')?.invalid && parentForm.get('firstName')?.touched" />
          <!-- Validation Error Message -->
          <div *ngIf="parentForm.get('firstName')?.invalid && parentForm.get('firstName')?.touched" 
               class="text-red-400 text-sm mt-1">
            First name is required
          </div>
        </div>

        <!-- Last Name Field -->
        <div>
          <label class="block text-sm font-medium mb-2 text-blue-300">Last Name *</label>
          <input 
            type="text" 
            formControlName="lastName"
            class="w-full px-4 py-3.5 text-lg bg-[#141830] border border-[#2d3748] rounded-lg text-white
                   placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none 
                   transition-all duration-300 shadow-lg hover:shadow-xl"
            placeholder="Enter your last name"
            [class.border-red-500]="parentForm.get('lastName')?.invalid && parentForm.get('lastName')?.touched" />
          <!-- Validation Error Message -->
          <div *ngIf="parentForm.get('lastName')?.invalid && parentForm.get('lastName')?.touched" 
               class="text-red-400 text-sm mt-1">
            Last name is required
          </div>
        </div>
      </div>

      <!-- Two Column Grid Layout: Age and Email -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <!-- Age Field -->
        <div>
          <label class="block text-sm font-medium mb-2 text-blue-300">Age *</label>
          <input 
            type="number" 
            formControlName="age"
            min="16" 
            max="100"
            class="w-full px-4 py-3.5 text-lg bg-[#141830] border border-[#2d3748] rounded-lg text-white
                   placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none 
                   transition-all duration-300 shadow-lg hover:shadow-xl"
            placeholder="25"
            [class.border-red-500]="parentForm.get('age')?.invalid && parentForm.get('age')?.touched" />
          <!-- Validation Error Message -->
          <div *ngIf="parentForm.get('age')?.invalid && parentForm.get('age')?.touched" 
               class="text-red-400 text-sm mt-1">
            Age must be between 16 and 100
          </div>
        </div>

        <!-- Email Field -->
        <div>
          <label class="block text-sm font-medium mb-2 text-blue-300">Email Address *</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </span>
            <input 
              type="email" 
              formControlName="email"
              class="w-full pl-12 pr-4 py-3.5 text-lg bg-[#141830] border border-[#2d3748] rounded-lg text-white
                     placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none 
                     transition-all duration-300 shadow-lg hover:shadow-xl"
              placeholder="you@example.com"
              [class.border-red-500]="parentForm.get('email')?.invalid && parentForm.get('email')?.touched" />
          </div>
          <!-- Validation Error Message -->
          <div *ngIf="parentForm.get('email')?.invalid && parentForm.get('email')?.touched" 
               class="text-red-400 text-sm mt-1">
            <span *ngIf="parentForm.get('email')?.errors?.['required']">Email is required</span>
            <span *ngIf="parentForm.get('email')?.errors?.['email']">Please enter a valid email</span>
          </div>
        </div>
      </div>

      <!-- Two Column Grid Layout: Phone and ZIP Code -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Phone Field -->
        <div>
          <label class="block text-sm font-medium mb-2 text-blue-300">Phone Number *</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </span>
            <input 
              type="tel" 
              formControlName="phone"
              class="w-full pl-12 pr-4 py-3.5 text-lg bg-[#141830] border border-[#2d3748] rounded-lg text-white
                     placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none 
                     transition-all duration-300 shadow-lg hover:shadow-xl"
              placeholder="(555) 123-4567"
              [class.border-red-500]="parentForm.get('phone')?.invalid && parentForm.get('phone')?.touched" />
          </div>
          <!-- Validation Error Message -->
          <div *ngIf="parentForm.get('phone')?.invalid && parentForm.get('phone')?.touched" 
               class="text-red-400 text-sm mt-1">
            Phone number must be 10 digits
          </div>
        </div>

        <!-- ZIP Code Field -->
        <div>
          <label class="block text-sm font-medium mb-2 text-blue-300">ZIP Code *</label>
          <input 
            type="text" 
            formControlName="zipCode"
            class="w-full px-4 py-3.5 text-lg bg-[#141830] border border-[#2d3748] rounded-lg text-white
                   placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none 
                   transition-all duration-300 shadow-lg hover:shadow-xl"
            placeholder="12345"
            [class.border-red-500]="parentForm.get('zipCode')?.invalid && parentForm.get('zipCode')?.touched" />
          <!-- Validation Error Message -->
          <div *ngIf="parentForm.get('zipCode')?.invalid && parentForm.get('zipCode')?.touched" 
               class="text-red-400 text-sm mt-1">
            ZIP code must be 5 digits
          </div>
        </div>
      </div>
    </div>
  `
})

export class PersonalInfoSectionComponent {
  @Input() parentForm!: FormGroup;
}
