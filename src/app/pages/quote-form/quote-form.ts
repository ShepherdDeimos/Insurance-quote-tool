import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { VehicleDataService } from '../../services/vehicle-data.service';
import { QuoteService } from '../../services/quote.service';

export interface VehicleOption {
  id: string;
  name: string;
  types?: string[];
}

export interface VehicleMake {
  id: string;
  name: string;
  models: VehicleOption[];
}

@Component({
  selector: 'quote-form',
  templateUrl: './quote-form.html',
  styleUrls: ['./quote-form.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  providers: [QuoteService]
})
export class QuoteForm implements OnInit {
  public quoteForm!: FormGroup;
  public formProgress$ = new BehaviorSubject<number>(0);
  public Math = Math;

  public vehicleTypes: VehicleOption[] = [
    { id: 'sedan', name: 'Sedan' },
    { id: 'coupe', name: 'Coupe' },
    { id: 'suv', name: 'SUV' },
    { id: 'truck', name: 'Truck' },
    { id: 'van', name: 'Van/Minivan' },
    { id: 'wagon', name: 'Wagon' },
    { id: 'hatchback', name: 'Hatchback' },
    { id: 'convertible', name: 'Convertible' }
  ];

  public availableModels: VehicleOption[] = [];
  public filteredMakes: VehicleMake[] = [];
  public currentYear = new Date().getFullYear();
  public isLoading = false;
  public submitError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private vehicleDataService: VehicleDataService,
    private quoteService: QuoteService
  ) {
    this.initForm();
  }

  ngOnInit() {
    // Don't show any makes until a type is selected
    this.filteredMakes = [];
    this.setupFormValueChanges();
  }

  private initForm() {
    this.quoteForm = this.fb.group({
      // Personal Information
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      age: ['', [Validators.required, Validators.min(16), Validators.max(100)]],
      zip: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
      
      // Vehicle Information
      vehicleType: ['', [Validators.required]],
      vehicleMake: ['', [Validators.required]],
      vehicleModel: ['', [Validators.required]],
      vehicleYear: ['', [Validators.required, Validators.min(1990), Validators.max(this.currentYear + 1)]],
      
      // Coverage Information
      accidents: [0, [Validators.required, Validators.min(0), Validators.max(10)]],
      violations: [0, [Validators.required, Validators.min(0), Validators.max(10)]],
      coverageLevel: ['basic', [Validators.required]],
      drivingHistory: ['clean', [Validators.required]]
    });
  }

  private setupFormValueChanges() {
    // Watch for vehicle type changes
    this.quoteForm.get('vehicleType')?.valueChanges.subscribe(type => {
      console.log('Vehicle type changed:', type);
      this.filterMakesByType(type);
      this.quoteForm.patchValue({ vehicleMake: '', vehicleModel: '' }, { emitEvent: false });
      this.availableModels = []; // Reset models when type changes
    });

    // Watch for vehicle make changes
    this.quoteForm.get('vehicleMake')?.valueChanges.subscribe(makeId => {
      console.log('Vehicle make changed:', makeId);
      const selectedType = this.quoteForm.get('vehicleType')?.value;
      console.log('Current vehicle type:', selectedType);
      this.filterModelsByMakeAndType(makeId);
      this.quoteForm.patchValue({ vehicleModel: '' }, { emitEvent: false });
    });

    // Update progress as form is filled
    this.quoteForm.valueChanges.subscribe(() => {
      this.updateFormProgress();
    });
  }

  private filterMakesByType(typeId: string) {
    if (!typeId) {
      this.filteredMakes = [];
      return;
    }
    
    // Get all makes that have models of the selected type
    this.filteredMakes = this.vehicleDataService.getMakesByType(typeId);
    console.log('Available makes for type', typeId, ':', this.filteredMakes.map(m => m.name));
  }

  private filterModelsByMakeAndType(makeId: string) {
    if (!makeId) {
      this.availableModels = [];
      return;
    }

    const selectedType = this.quoteForm.get('vehicleType')?.value;
    if (!selectedType) {
      this.availableModels = [];
      return;
    }

    // Get all models for the make that include the selected type
    this.availableModels = this.vehicleDataService.getModelsByMakeAndType(makeId, selectedType);
    console.log('Available models for', makeId, 'of type', selectedType, ':', this.availableModels.map(m => m.name));
  }

  private updateFormProgress() {
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 'age', 'zip',  // Personal info
      'vehicleType', 'vehicleMake', 'vehicleModel', 'vehicleYear',  // Vehicle info
      'coverageLevel', 'drivingHistory'  // Coverage info
    ];
    
    const filledFields = requiredFields.filter(field => 
      this.quoteForm.get(field)?.value !== '' && 
      this.quoteForm.get(field)?.valid
    );

    const progress = (filledFields.length / requiredFields.length) * 100;
    this.formProgress$.next(progress);
  }

  incrementValue(field: 'accidents' | 'violations') {
    const currentValue = this.quoteForm.get(field)?.value || 0;
    if (currentValue < 10) {
      this.quoteForm.patchValue({ [field]: currentValue + 1 });
    }
  }

  decrementValue(field: 'accidents' | 'violations') {
    const currentValue = this.quoteForm.get(field)?.value || 0;
    if (currentValue > 0) {
      this.quoteForm.patchValue({ [field]: currentValue - 1 });
    }
  }

  onSubmit() {
    if (this.quoteForm.valid) {
      this.isLoading = true;
      this.submitError = null;

      this.quoteService.submitQuote(this.quoteForm.value).subscribe({
        next: (result) => {
          this.isLoading = false;
          this.router.navigate(['/quote-results'], { 
            queryParams: { id: result.id }
          });
        },
        error: (error) => {
          console.error('Quote submission error:', error);
          this.submitError = 'Failed to submit quote. Please try again.';
          this.isLoading = false;
        }
      });
    }
  }
}
