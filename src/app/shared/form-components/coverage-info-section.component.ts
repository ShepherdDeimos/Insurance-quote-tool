// ================================================================================================
// COVERAGE INFO SECTION COMPONENT - Insurance Coverage Form Section
// ================================================================================================
// This component handles insurance coverage options and driving history inputs.
// It includes the interactive increment/decrement controls for accidents and violations.
//
// RESPONSIBILITY: Collect insurance coverage preferences and driving history
// INPUTS: FormGroup for reactive form binding
// OUTPUTS: Form value changes through reactive form system

import { Component, Input } from '@angular/core';                       // Angular component decorator and Input decorator
import { FormGroup, ReactiveFormsModule } from '@angular/forms';        // Reactive forms for form management
import { CommonModule } from '@angular/common';                         // Basic Angular directives and pipes

@Component({                                                             // Angular decorator that defines this as a UI component
  selector: 'app-coverage-info-section',                                // HTML tag: <app-coverage-info-section></app-coverage-info-section>
  standalone: true,                                                     // Self-contained component
  imports: [CommonModule, ReactiveFormsModule],                         // Dependencies: directives and reactive forms
  template: `
    <!-- Coverage Info Section: Container for insurance coverage information -->
    <div [formGroup]="parentForm" class="bg-gradient-to-br from-[#1a1f3c] via-[#2a2f5c] to-[#3a3f7c] rounded-lg p-6 shadow-lg transform hover:scale-[1.02] transition-all duration-300">
      <!-- Section Title: Gradient text heading -->
      <h2 class="text-xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
        Coverage & History
      </h2>
      
      <!-- Coverage Form Grid: Two column layout -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Driving History Column: Left side -->
        <div class="space-y-6">
          <!-- Accidents Counter -->
          <div>
            <label class="block text-sm font-medium mb-3 text-pink-300">Previous Accidents</label>
            <div class="flex items-center space-x-4">
              <!-- Decrement Button -->
              <button 
                type="button"
                (click)="decrementValue('accidents')"
                [disabled]="getFieldValue('accidents') <= 0"
                class="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 
                       hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center transition-all duration-200">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                </svg>
              </button>
              
              <!-- Counter Display -->
              <div class="flex-1 text-center">
                <div class="text-3xl font-bold text-white">{{ getFieldValue('accidents') }}</div>
                <div class="text-sm text-gray-400">accidents</div>
              </div>
              
              <!-- Increment Button -->
              <button 
                type="button"
                (click)="incrementValue('accidents')"
                [disabled]="getFieldValue('accidents') >= 10"
                class="w-12 h-12 rounded-full bg-green-500/20 border border-green-500/40 text-green-300 
                       hover:bg-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center transition-all duration-200">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
            <!-- Helper Text -->
            <p class="text-xs text-gray-400 mt-2 text-center">
              Including at-fault accidents in the past 5 years
            </p>
          </div>

          <!-- Violations Counter -->
          <div>
            <label class="block text-sm font-medium mb-3 text-pink-300">Traffic Violations</label>
            <div class="flex items-center space-x-4">
              <!-- Decrement Button -->
              <button 
                type="button"
                (click)="decrementValue('violations')"
                [disabled]="getFieldValue('violations') <= 0"
                class="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 
                       hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center transition-all duration-200">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                </svg>
              </button>
              
              <!-- Counter Display -->
              <div class="flex-1 text-center">
                <div class="text-3xl font-bold text-white">{{ getFieldValue('violations') }}</div>
                <div class="text-sm text-gray-400">violations</div>
              </div>
              
              <!-- Increment Button -->
              <button 
                type="button"
                (click)="incrementValue('violations')"
                [disabled]="getFieldValue('violations') >= 10"
                class="w-12 h-12 rounded-full bg-green-500/20 border border-green-500/40 text-green-300 
                       hover:bg-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center transition-all duration-200">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
            <!-- Helper Text -->
            <p class="text-xs text-gray-400 mt-2 text-center">
              Speeding tickets, moving violations, etc.
            </p>
          </div>
        </div>

        <!-- Coverage Options Column: Right side -->
        <div class="space-y-6">
          <!-- Coverage Level Dropdown -->
          <div>
            <label class="block text-sm font-medium mb-2 text-pink-300">Coverage Level *</label>
            <select 
              formControlName="coverageLevel"
              class="w-full px-4 py-3.5 text-lg bg-[#141830] border border-[#2d3748] rounded-md text-white
                     focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 focus:outline-none 
                     transition-all duration-300"
              [class.border-red-500]="parentForm.get('coverageLevel')?.invalid && parentForm.get('coverageLevel')?.touched">
              <option value="basic">Basic Coverage</option>
              <option value="standard">Standard Coverage</option>
              <option value="premium">Premium Coverage</option>
              <option value="comprehensive">Comprehensive Coverage</option>
            </select>
            <!-- Coverage Descriptions -->
            <div class="mt-2 text-sm text-gray-400">
              <div *ngIf="getStringFieldValue('coverageLevel') === 'basic'">
                • Liability only • State minimum requirements
              </div>
              <div *ngIf="getStringFieldValue('coverageLevel') === 'standard'">
                • Liability + Collision • Basic protection
              </div>
              <div *ngIf="getStringFieldValue('coverageLevel') === 'premium'">
                • Full coverage • Comprehensive protection
              </div>
              <div *ngIf="getStringFieldValue('coverageLevel') === 'comprehensive'">
                • Maximum coverage • All protections included
              </div>
            </div>
            <!-- Validation Error Message -->
            <div *ngIf="parentForm.get('coverageLevel')?.invalid && parentForm.get('coverageLevel')?.touched" 
                 class="text-red-400 text-sm mt-1">
              Please select a coverage level
            </div>
          </div>

          <!-- Driving History Dropdown -->
          <div>
            <label class="block text-sm font-medium mb-2 text-pink-300">Overall Driving History *</label>
            <select 
              formControlName="drivingHistory"
              class="w-full px-4 py-3.5 text-lg bg-[#141830] border border-[#2d3748] rounded-md text-white
                     focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 focus:outline-none 
                     transition-all duration-300"
              [class.border-red-500]="parentForm.get('drivingHistory')?.invalid && parentForm.get('drivingHistory')?.touched">
              <option value="clean">Clean Record</option>
              <option value="minor">Minor Issues</option>
              <option value="major">Major Issues</option>
              <option value="suspended">Previous Suspension</option>
            </select>
            <!-- History Descriptions -->
            <div class="mt-2 text-sm text-gray-400">
              <div *ngIf="getStringFieldValue('drivingHistory') === 'clean'">
                • No accidents or violations • Excellent driving record
              </div>
              <div *ngIf="getStringFieldValue('drivingHistory') === 'minor'">
                • Few minor violations • Generally good record
              </div>
              <div *ngIf="getStringFieldValue('drivingHistory') === 'major'">
                • Multiple violations or accidents • Higher risk
              </div>
              <div *ngIf="getStringFieldValue('drivingHistory') === 'suspended'">
                • Previous license suspension • High risk driver
              </div>
            </div>
            <!-- Validation Error Message -->
            <div *ngIf="parentForm.get('drivingHistory')?.invalid && parentForm.get('drivingHistory')?.touched" 
                 class="text-red-400 text-sm mt-1">
              Please select your driving history
            </div>
          </div>
        </div>
      </div>

      <!-- Information Panel: Important notes about coverage -->
      <div class="mt-8 p-6 bg-gradient-to-r from-pink-500/10 to-orange-500/10 border border-pink-500/20 rounded-lg">
        <h3 class="text-lg font-semibold text-pink-300 mb-3">📋 Coverage Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
          <div>
            <strong>Accidents & Violations:</strong> These directly affect your premium. 
            Be honest - insurance companies verify this information.
          </div>
          <div>
            <strong>Coverage Levels:</strong> Higher coverage means better protection 
            but higher premiums. Consider your vehicle value and financial situation.
          </div>
        </div>
      </div>
    </div>
  `
})
export class CoverageInfoSectionComponent {                              // Main component class
  @Input() parentForm!: FormGroup;                                      // Input: parent form group for reactive form binding

  // 🔢 COUNTER CONTROL METHODS - Handle increment/decrement for accidents and violations
  incrementValue(field: 'accidents' | 'violations') {                   // Increase counter value
    const currentValue = this.getFieldValue(field);                     // Get current value
    if (currentValue < 10) {                                            // If below maximum
      this.parentForm.patchValue({ [field]: currentValue + 1 });       // Increment by 1
    }
  }

  decrementValue(field: 'accidents' | 'violations') {                   // Decrease counter value
    const currentValue = this.getFieldValue(field);                     // Get current value
    if (currentValue > 0) {                                             // If above minimum
      this.parentForm.patchValue({ [field]: currentValue - 1 });       // Decrement by 1
    }
  }

  getFieldValue(field: string): number {                                // Helper method to get form field value
    return this.parentForm.get(field)?.value || 0;                     // Return field value or 0 if undefined
  }

  getStringFieldValue(field: string): string {                          // Helper method to get string form field value
    return this.parentForm.get(field)?.value || '';                    // Return field value or empty string if undefined
  }

  // 🎯 COMPONENT PURPOSE:
  // - Collects insurance coverage preferences and driving history
  // - Provides interactive controls for accident/violation counts
  // - Shows helpful descriptions for each coverage level
  // - Validates that required coverage options are selected
  //
  // 📋 FIELDS MANAGED:
  // - accidents: Number counter (0-10) with increment/decrement buttons
  // - violations: Number counter (0-10) with increment/decrement buttons
  // - coverageLevel: Dropdown with Basic/Standard/Premium/Comprehensive options
  // - drivingHistory: Dropdown with Clean/Minor/Major/Suspended options
  //
  // 🎨 USER EXPERIENCE:
  // - Visual counter controls make it easy to input accident/violation counts
  // - Real-time descriptions help users understand coverage options
  // - Color-coded buttons provide clear visual feedback
  // - Helpful information panel explains the importance of accurate data
}
