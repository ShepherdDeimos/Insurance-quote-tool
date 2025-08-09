// ================================================================================================
// PROGRESS BAR COMPONENT - Reusable Progress Tracking Display
// ================================================================================================
// This component displays form completion progress as a visual progress bar.
// It's extracted from the main form to be reusable and focused on one responsibility.
// 
// RESPONSIBILITY: Visual progress feedback
// INPUT: Progress percentage (0-100)
// OUTPUT: Animated progress bar with step indicators

import { Component, Input, OnInit, OnChanges } from '@angular/core';     // Angular component decorator, Input for receiving data, lifecycle hooks
import { CommonModule } from '@angular/common';                         // Basic Angular directives (*ngIf, *ngFor) and pipes

@Component({                                                             // Angular decorator that defines this as a UI component
  selector: 'app-progress-bar',                                         // HTML tag: <app-progress-bar></app-progress-bar>
  standalone: true,                                                     // Self-contained component
  imports: [CommonModule],                                              // Dependencies for template directives
  template: `
    <!-- Progress Bar Container: Full progress tracking section -->
    <div class="max-w-3xl mx-auto mb-12">
      <!-- Progress Steps: Visual indicators showing current step -->
      <div class="flex justify-between text-sm mb-3">
        <!-- Driver Info Step: First progress indicator -->
        <span class="text-blue-400 font-medium flex items-center"
              [class.text-opacity-50]="progress < 33">
          <span class="w-2 h-2 rounded-full bg-blue-400 mr-2"
                [class.animate-ping]="progress < 33"></span>
          Driver Info
          <!-- Checkmark: Shows when step is completed -->
          <svg *ngIf="progress >= 33" class="w-4 h-4 ml-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </span>
        
        <!-- Vehicle Info Step: Second progress indicator -->
        <span class="text-purple-400 font-medium flex items-center"
              [class.text-opacity-50]="progress < 66">
          <span class="w-2 h-2 rounded-full bg-purple-400 mr-2"
                [class.animate-ping]="progress >= 33 && progress < 66"></span>
          Vehicle Info
          <!-- Checkmark: Shows when step is completed -->
          <svg *ngIf="progress >= 66" class="w-4 h-4 ml-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </span>
        
        <!-- Coverage Step: Third progress indicator -->
        <span class="text-pink-400 font-medium flex items-center"
              [class.text-opacity-50]="progress < 100">
          <span class="w-2 h-2 rounded-full bg-pink-400 mr-2"
                [class.animate-ping]="progress >= 66 && progress < 100"></span>
          Coverage
          <!-- Checkmark: Shows when step is completed -->
          <svg *ngIf="progress >= 100" class="w-4 h-4 ml-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </span>
      </div>
      
      <!-- Progress Bar Track: Background track for the progress bar -->
      <div class="h-2 bg-[#1a1f3c] rounded-full p-[1px] backdrop-blur-sm bg-opacity-50 shadow-lg relative overflow-hidden">
        <!-- Background Animation: Subtle animated background -->
        <div class="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-pulse pointer-events-none"></div>
        
        <!-- Progress Bar Fill: Colored bar that grows from 0% to 100% -->
        <div class="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full 
                    transition-all duration-700 ease-out transform hover:scale-x-[1.02] hover:shadow-lg"
             [ngStyle]="{'width': progress + '%'}"
             [attr.data-progress]="progress">
          <!-- Shimmer Effect: Animated light reflection moving across the progress bar -->
          <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-shimmer pointer-events-none"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Shimmer animation for progress bar effect */
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    .animate-shimmer {
      animation: shimmer 2s infinite;
    }
  `]
})
export class ProgressBarComponent {                                    // Main component class
  @Input() progress: number = 0;                                        // Input property: receives progress percentage from parent component
  
  // 🎯 COMPONENT PURPOSE:
  // - Displays visual progress feedback to users
  // - Shows which section they're currently working on
  // - Provides motivation to complete the form
  // - Can be reused in other forms throughout the app
  //
  // 📊 PROGRESS CALCULATION:
  // - 0-32%: Driver Info step (blue, pulsing)
  // - 33-65%: Vehicle Info step (purple, pulsing) 
  // - 66-99%: Coverage step (pink, pulsing)
  // - 100%: Complete (all checkmarks shown)
}
