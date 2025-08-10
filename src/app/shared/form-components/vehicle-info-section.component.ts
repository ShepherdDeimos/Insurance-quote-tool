// ================================================================================================
// VEHICLE INFO SECTION COMPONENT - Car Information Form Section
// ================================================================================================
// This component handles all vehicle-related inputs with cascading dropdown functionality.
// It manages the complex logic of Type → Make → Model filtering that's central to the app.
//
// RESPONSIBILITY: Collect and validate vehicle information with smart filtering
// INPUTS: FormGroup, vehicle data arrays
// OUTPUTS: Form value changes, filtered dropdown options

import { Component, Input, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';    // Angular component lifecycle and decorators
import { FormGroup, ReactiveFormsModule } from '@angular/forms';        // Reactive forms for form management
import { CommonModule } from '@angular/common';                         // Basic Angular directives and pipes
import { Subscription } from 'rxjs';                                    // RxJS for managing subscriptions
import { VehicleDataService } from '../../services/vehicle-data.service'; // Service with vehicle data
import { VehicleOption, VehicleMake } from '../../models/vehicle.model'; // Import vehicle data interfaces

@Component({                                                             // Angular decorator that defines this as a UI component
  selector: 'app-vehicle-info-section',                                 // HTML tag: <app-vehicle-info-section></app-vehicle-info-section>
  standalone: true,                                                     // Self-contained component
  imports: [CommonModule, ReactiveFormsModule],                         // Dependencies: directives and reactive forms
  template: `
    <!-- Vehicle Info Section: Container for car information -->
    <div [formGroup]="parentForm" class="bg-gradient-to-br from-[#1a1f3c] via-[#2a2f5c] to-[#3a3f7c] rounded-lg p-6 shadow-lg transform hover:scale-[1.02] transition-all duration-300">
      <!-- Section Title: Purple gradient heading for vehicle information -->
      <h2 class="text-xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">Vehicle Info</h2>
      
      <!-- Vehicle Form Grid: Four column layout for natural left-to-right flow -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Vehicle Type Dropdown -->
        <div>
          <label class="block text-sm font-medium mb-2 text-purple-300">Vehicle Type *</label>
          <select 
            formControlName="vehicleType"
            class="w-full px-4 py-3.5 text-lg bg-[#141830] border border-[#2d3748] rounded-lg text-white
                   focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none 
                   transition-all duration-300 shadow-lg hover:shadow-xl
                   [&>option]:bg-[#141830] [&>option]:text-white [&>option]:border-none"
            [class.border-red-500]="parentForm.get('vehicleType')?.invalid && parentForm.get('vehicleType')?.touched">
            <option value="" class="bg-[#141830] text-white">Select type</option>
            <option *ngFor="let type of vehicleTypes" [value]="type.id" class="bg-[#141830] text-white">
              {{ type.name }}
            </option>
          </select>
          <!-- Validation Error Message -->
          <div *ngIf="parentForm.get('vehicleType')?.invalid && parentForm.get('vehicleType')?.touched" 
               class="text-red-400 text-sm mt-1">
            Select vehicle type
          </div>
        </div>

        <!-- Vehicle Make Dropdown -->
        <div>
          <label class="block text-sm font-medium mb-2 text-purple-300">Vehicle Make *</label>
          <select 
            formControlName="vehicleMake"
            class="w-full px-4 py-3.5 text-lg bg-[#141830] border border-[#2d3748] rounded-lg text-white
                   focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none 
                   transition-all duration-300 shadow-lg hover:shadow-xl
                   [&>option]:bg-[#141830] [&>option]:text-white [&>option]:border-none"
            [class.border-red-500]="parentForm.get('vehicleMake')?.invalid && parentForm.get('vehicleMake')?.touched">
            <option value="" class="bg-[#141830] text-white">{{ filteredMakes.length === 0 ? 'Select type first' : 'Select make' }}</option>
            <option *ngFor="let make of filteredMakes" [value]="make.id" class="bg-[#141830] text-white">
              {{ make.name }}
            </option>
          </select>
          <!-- Validation Error Message -->
          <div *ngIf="parentForm.get('vehicleMake')?.invalid && parentForm.get('vehicleMake')?.touched" 
               class="text-red-400 text-sm mt-1">
            Select vehicle make
          </div>
        </div>

        <!-- Vehicle Model Dropdown -->
        <div>
          <label class="block text-sm font-medium mb-2 text-purple-300">Vehicle Model *</label>
          <select 
            formControlName="vehicleModel"
            class="w-full px-4 py-3.5 text-lg bg-[#141830] border border-[#2d3748] rounded-lg text-white
                   focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none 
                   transition-all duration-300 shadow-lg hover:shadow-xl
                   [&>option]:bg-[#141830] [&>option]:text-white [&>option]:border-none"
            [class.border-red-500]="parentForm.get('vehicleModel')?.invalid && parentForm.get('vehicleModel')?.touched">
            <option value="" class="bg-[#141830] text-white">{{ availableModels.length === 0 ? 'Select make first' : 'Select model' }}</option>
            <option *ngFor="let model of availableModels" [value]="model.id" class="bg-[#141830] text-white">
              {{ model.name }}
            </option>
          </select>
          <!-- Validation Error Message -->
          <div *ngIf="parentForm.get('vehicleModel')?.invalid && parentForm.get('vehicleModel')?.touched" 
               class="text-red-400 text-sm mt-1">
            Select vehicle model
          </div>
        </div>

        <!-- Vehicle Year Field -->
        <div>
          <label class="block text-sm font-medium mb-2 text-purple-300">Vehicle Year *</label>
          <input 
            type="number" 
            formControlName="vehicleYear"
            [min]="1990" 
            [max]="currentYear + 1"
            class="w-full px-4 py-3.5 text-lg bg-[#141830] border border-[#2d3748] rounded-lg text-white
                   placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none 
                   transition-all duration-300 shadow-lg hover:shadow-xl"
            [placeholder]="currentYear.toString()"
            [class.border-red-500]="parentForm.get('vehicleYear')?.invalid && parentForm.get('vehicleYear')?.touched" />
          <!-- Validation Error Message -->
          <div *ngIf="parentForm.get('vehicleYear')?.invalid && parentForm.get('vehicleYear')?.touched" 
               class="text-red-400 text-sm mt-1">
            Enter valid year
          </div>
        </div>
      </div>

      <!-- Helper Text: Information about vehicle selection -->
      <div class="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
        <p class="text-sm text-purple-300">
          <span class="font-medium">💡 Tip:</span> 
          Select your vehicle type first, then choose from available makes and models. 
          This helps us provide the most accurate insurance quote for your specific vehicle.
        </p>
      </div>
    </div>
  `
})
export class VehicleInfoSectionComponent implements OnInit, OnDestroy { // Main component class with lifecycle hooks
  @Input() parentForm!: FormGroup;                                      // Input: parent form group for reactive form binding
  
  // 🚗 VEHICLE DATA ARRAYS - Static data for dropdowns
  public vehicleTypes: VehicleOption[] = [                           // Hardcoded array of car type options that populate the "Vehicle Type" dropdown
    { id: 'sedan', name: 'Sedan' },                                  // 4-door family cars like Honda Accord, Toyota Camry
    { id: 'coupe', name: 'Coupe' },                                  // 2-door sporty cars like Honda Civic Si, Mustang  
    { id: 'suv', name: 'SUV' },                                      // Tall utility vehicles like Honda CR-V, Ford Explorer
    { id: 'truck', name: 'Truck' },                                  // Pickup trucks like Ford F-150, Chevy Silverado
    { id: 'van', name: 'Van/Minivan' },                              // Large passenger vehicles like Honda Odyssey, Toyota Sienna
    { id: 'wagon', name: 'Wagon' },                                  // Low long cars like Subaru Outback, Volvo V60
    { id: 'hatchback', name: 'Hatchback' },                          // Small cars with rear lift-up door like Honda Civic Hatch, VW Golf
    { id: 'convertible', name: 'Convertible' }                       // Cars with removable/foldable roof like Mazda Miata, Ford Mustang Convertible
  ];
  
  // Component state for vehicle selection
  public filteredMakes: VehicleMake[] = [];                            // Available makes based on selected type
  public availableModels: VehicleOption[] = [];                       // Available models based on selected make + type
  public currentYear = new Date().getFullYear();                       // Current year for validation
  
  private subscriptions: Subscription[] = [];                          // Array to track subscriptions for cleanup

  constructor(private vehicleDataService: VehicleDataService, private cdr: ChangeDetectorRef) {
    console.log('VehicleInfoSection constructor called');               // DEBUG
  }       // Inject vehicle data service and change detector

  ngOnInit() {                                                         // Component initialization
    console.log('VehicleInfoSection initialized');                    // DEBUG
    this.setupFormValueChanges();                                     // Set up reactive form change listeners
  }

  ngOnDestroy() {                                                      // Component cleanup
    this.subscriptions.forEach(sub => sub.unsubscribe());             // Unsubscribe from all subscriptions to prevent memory leaks
  }

  private setupFormValueChanges() {                                    // Set up form change detection for cascading dropdowns
    // Watch for vehicle type changes
    const typeSubscription = this.parentForm.get('vehicleType')?.valueChanges.subscribe(type => {
      console.log('Vehicle type changed:', type);                     // Debug logging
      this.filterMakesByType(type);                                   // Update available makes
      // Clear dependent fields when type changes
      this.parentForm.patchValue({ 
        vehicleMake: '', 
        vehicleModel: '' 
      }, { emitEvent: false });
      this.availableModels = [];                                      // Clear models array
    });

    // Watch for vehicle make changes
    const makeSubscription = this.parentForm.get('vehicleMake')?.valueChanges.subscribe(makeId => {
      console.log('Vehicle make changed:', makeId);                   // Debug logging
      this.filterModelsByMakeAndType(makeId);                        // Update available models
      // Clear dependent fields when make changes
      this.parentForm.patchValue({ 
        vehicleModel: '' 
      }, { emitEvent: false });
    });

    // Store subscriptions for cleanup
    if (typeSubscription) this.subscriptions.push(typeSubscription);
    if (makeSubscription) this.subscriptions.push(makeSubscription);
  }

  private filterMakesByType(typeId: string) {                         // Filter manufacturers by selected vehicle type
    if (!typeId) {                                                    // If no type selected
      this.filteredMakes = [];                                        // Clear makes array
      return;
    }
    
    // Get manufacturers that make the selected vehicle type
    this.filteredMakes = this.vehicleDataService.getMakesByType(typeId);
    console.log('Available makes for type', typeId, ':', this.filteredMakes.map(m => m.name));
    
    // Force change detection
    this.cdr.detectChanges();
  }

  private filterModelsByMakeAndType(makeId: string) {                 // Filter models by selected make and type
    console.log('=== filterModelsByMakeAndType called ===');
    console.log('makeId:', makeId);
    console.log('Current availableModels before:', this.availableModels.length);
    
    if (!makeId) {                                                    // If no make selected
      console.log('No makeId, clearing models');
      this.availableModels = [];                                      // Clear models array
      return;
    }

    const selectedType = this.parentForm.get('vehicleType')?.value;   // Get currently selected type
    console.log('selectedType:', selectedType);
    if (!selectedType) {                                              // If no type selected
      console.log('No selectedType, clearing models');
      this.availableModels = [];                                      // Clear models array
      return;
    }

    // Get models for the selected make that support the selected type
    console.log('Calling vehicleDataService.getModelsByMakeAndType with:', makeId, selectedType);
    this.availableModels = this.vehicleDataService.getModelsByMakeAndType(makeId, selectedType);
    console.log('Results returned:', this.availableModels);
    console.log('Available models for', makeId, 'of type', selectedType, ':', this.availableModels.map(m => m.name));
    
    // Force change detection
    this.cdr.detectChanges();
    console.log('=== filterModelsByMakeAndType complete ===');
  }

  // 🎯 COMPONENT PURPOSE:
  // - Manages complex vehicle selection with cascading dropdowns
  // - Ensures only valid Make→Model combinations are available
  // - Provides real-time validation and user feedback
  // - Handles the core business logic of vehicle data filtering
  //
  // 🔄 CASCADING LOGIC:
  // 1. User selects Type (Sedan) → Shows Makes that produce Sedans (Honda, Toyota)
  // 2. User selects Make (Honda) → Shows Models that are Sedans (Civic, Accord)
  // 3. Year validation ensures realistic vehicle years
  //
  // 📊 DATA FLOW:
  // Type Selection → filterMakesByType() → Updates filteredMakes
  // Make Selection → filterModelsByMakeAndType() → Updates availableModels
}
