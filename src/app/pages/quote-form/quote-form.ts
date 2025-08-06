import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { QuoteService } from '../../services/quote.service';
import { QuoteData } from '../../models/quote.model';
import { BehaviorSubject } from 'rxjs';

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
  imports: [CommonModule, ReactiveFormsModule, RouterLink]
})
export class QuoteForm implements OnInit {
  public quoteForm!: FormGroup;
  public formProgress$ = new BehaviorSubject<number>(0);
  public Math = Math; // Make Math available in template

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
  public vehicleMakes: VehicleMake[] = [
    {
      id: 'ford',
      name: 'Ford',
      models: [
        { id: 'mustang', name: 'Mustang', types: ['coupe', 'convertible'] },
        { id: 'fusion', name: 'Fusion', types: ['sedan'] },
        { id: 'f150', name: 'F-150', types: ['truck'] },
        { id: 'ranger', name: 'Ranger', types: ['truck'] },
        { id: 'explorer', name: 'Explorer', types: ['suv'] },
        { id: 'escape', name: 'Escape', types: ['suv'] },
        { id: 'bronco', name: 'Bronco', types: ['suv'] },
        { id: 'expedition', name: 'Expedition', types: ['suv'] },
        { id: 'edge', name: 'Edge', types: ['suv'] }
      ]
    },
    {
      id: 'chevrolet',
      name: 'Chevrolet',
      models: [
        { id: 'camaro', name: 'Camaro', types: ['coupe', 'convertible'] },
        { id: 'malibu', name: 'Malibu', types: ['sedan'] },
        { id: 'silverado', name: 'Silverado', types: ['truck'] },
        { id: 'colorado', name: 'Colorado', types: ['truck'] },
        { id: 'equinox', name: 'Equinox', types: ['suv'] },
        { id: 'tahoe', name: 'Tahoe', types: ['suv'] },
        { id: 'traverse', name: 'Traverse', types: ['suv'] },
        { id: 'blazer', name: 'Blazer', types: ['suv'] }
      ]
    },
    {
      id: 'toyota',
      name: 'Toyota',
      models: [
        { id: 'camry', name: 'Camry', types: ['sedan'] },
        { id: 'corolla', name: 'Corolla', types: ['sedan', 'hatchback'] },
        { id: 'gr86', name: 'GR86', types: ['coupe'] },
        { id: 'tacoma', name: 'Tacoma', types: ['truck'] },
        { id: 'tundra', name: 'Tundra', types: ['truck'] },
        { id: 'rav4', name: 'RAV4', types: ['suv'] },
        { id: 'highlander', name: 'Highlander', types: ['suv'] },
        { id: '4runner', name: '4Runner', types: ['suv'] },
        { id: 'sienna', name: 'Sienna', types: ['van'] }
      ]
    },
    {
      id: 'honda',
      name: 'Honda',
      models: [
        { id: 'civic', name: 'Civic', types: ['sedan', 'hatchback'] },
        { id: 'accord', name: 'Accord', types: ['sedan'] },
        { id: 'ridgeline', name: 'Ridgeline', types: ['truck'] },
        { id: 'cr-v', name: 'CR-V', types: ['suv'] },
        { id: 'pilot', name: 'Pilot', types: ['suv'] },
        { id: 'passport', name: 'Passport', types: ['suv'] },
        { id: 'hr-v', name: 'HR-V', types: ['suv'] },
        { id: 'odyssey', name: 'Odyssey', types: ['van'] }
      ]
    },
    {
      id: 'bmw',
      name: 'BMW',
      models: [
        { id: '2-series', name: '2 Series', types: ['coupe', 'convertible'] },
        { id: '3-series', name: '3 Series', types: ['sedan', 'wagon'] },
        { id: '4-series', name: '4 Series', types: ['coupe', 'convertible'] },
        { id: '5-series', name: '5 Series', types: ['sedan'] },
        { id: '7-series', name: '7 Series', types: ['sedan'] },
        { id: 'x1', name: 'X1', types: ['suv'] },
        { id: 'x3', name: 'X3', types: ['suv'] },
        { id: 'x5', name: 'X5', types: ['suv'] },
        { id: 'x7', name: 'X7', types: ['suv'] }
      ]
    },
    {
      id: 'mercedes',
      name: 'Mercedes-Benz',
      models: [
        { id: 'a-class', name: 'A-Class', types: ['sedan'] },
        { id: 'c-class', name: 'C-Class', types: ['sedan', 'coupe', 'convertible'] },
        { id: 'e-class', name: 'E-Class', types: ['sedan', 'coupe', 'convertible'] },
        { id: 's-class', name: 'S-Class', types: ['sedan', 'coupe'] },
        { id: 'gla', name: 'GLA', types: ['suv'] },
        { id: 'glc', name: 'GLC', types: ['suv'] },
        { id: 'gle', name: 'GLE', types: ['suv'] },
        { id: 'gls', name: 'GLS', types: ['suv'] }
      ]
    },
    {
      id: 'audi',
      name: 'Audi',
      models: [
        { id: 'a3', name: 'A3', types: ['sedan'] },
        { id: 'a4', name: 'A4', types: ['sedan'] },
        { id: 'a6', name: 'A6', types: ['sedan'] },
        { id: 'a8', name: 'A8', types: ['sedan'] },
        { id: 'q3', name: 'Q3', types: ['suv'] },
        { id: 'q5', name: 'Q5', types: ['suv'] },
        { id: 'q7', name: 'Q7', types: ['suv'] },
        { id: 'q8', name: 'Q8', types: ['suv'] }
      ]
    },
    {
      id: 'lexus',
      name: 'Lexus',
      models: [
        { id: 'is', name: 'IS', types: ['sedan'] },
        { id: 'es', name: 'ES', types: ['sedan'] },
        { id: 'ls', name: 'LS', types: ['sedan'] },
        { id: 'rc', name: 'RC', types: ['coupe'] },
        { id: 'lc', name: 'LC', types: ['coupe', 'convertible'] },
        { id: 'ux', name: 'UX', types: ['suv'] },
        { id: 'nx', name: 'NX', types: ['suv'] },
        { id: 'rx', name: 'RX', types: ['suv'] },
        { id: 'gx', name: 'GX', types: ['suv'] }
      ]
    }
  ];

  constructor(
    private fb: FormBuilder,
    private quoteService: QuoteService,
    private router: Router
  ) {
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
      coverageLevel: ['basic', [Validators.required]],
      drivingHistory: ['clean', [Validators.required]],
      accidents: [0, [Validators.required, Validators.min(0), Validators.max(10)]],
      violations: [0, [Validators.required, Validators.min(0), Validators.max(10)]]
    });

    // Update available makes and models when vehicle type changes
    this.quoteForm.get('vehicleType')?.valueChanges.subscribe(type => {
      // Reset make and model when type changes
      this.quoteForm.patchValue({
        vehicleMake: '',
        vehicleModel: ''
      }, { emitEvent: false });
      
      // Update available makes based on vehicle type
      this.filteredMakes = this.vehicleMakes.filter(make =>
        make.models.some(model => model.types?.includes(type))
      );
    });

    // Update available models when make changes
    this.quoteForm.get('vehicleMake')?.valueChanges.subscribe(makeId => {
      this.updateAvailableModels(makeId);
      // Reset model when make changes
      this.quoteForm.patchValue({ vehicleModel: '' }, { emitEvent: false });
    });

    // Track form progress
    this.quoteForm.valueChanges.subscribe(() => {
      this.updateFormProgress();
    });
  }

  ngOnInit(): void {
    // Initialize with empty models list
    this.updateAvailableModels('');
  }

  updateAvailableModels(makeId: string): void {
    const selectedMake = this.vehicleMakes.find(make => make.id === makeId);
    const selectedType = this.quoteForm.get('vehicleType')?.value;
    
    if (selectedMake) {
      this.availableModels = selectedMake.models.filter(model => 
        !selectedType || (model.types && model.types.includes(selectedType))
      );
    } else {
      this.availableModels = [];
    }
  }

  onSubmit(): void {
    if (this.quoteForm.valid) {
      this.isLoading = true;
      this.submitError = null;

      const formValue = this.quoteForm.value;
      const quoteData: QuoteData = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        phone: formValue.phone,
        age: Number(formValue.age),
        vehicleType: formValue.vehicleType,
        vehicleMake: formValue.vehicleMake,
        vehicleModel: formValue.vehicleModel,
        vehicleYear: Number(formValue.vehicleYear),
        accidents: Number(formValue.accidents),
        violations: Number(formValue.violations),
        coverageLevel: formValue.coverageLevel,
        drivingHistory: formValue.drivingHistory
      };

      this.quoteService.submitQuote(quoteData).subscribe({
        next: (result) => {
          this.router.navigate(['/quote-results', result.id]);
        },
        error: (error) => {
          this.submitError = 'Failed to submit quote. Please try again.';
          console.error('Quote submission error:', error);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.quoteForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
    this.updateFormProgress();
  }

  private updateFormProgress(): void {
    const sections = {
      personal: ['firstName', 'lastName', 'email', 'phone', 'age', 'zip'],
      vehicle: ['vehicleType', 'vehicleMake', 'vehicleModel', 'vehicleYear'],
      coverage: ['coverageLevel', 'drivingHistory', 'accidents', 'violations']
    };

    const calculateSectionProgress = (fields: string[]): number => {
      const validFields = fields.filter(field => {
        const control = this.quoteForm.get(field);
        return control && control.valid && control.value !== '' && control.value !== null;
      });
      return (validFields.length / fields.length) * 100;
    };

    const personalProgress = calculateSectionProgress(sections.personal);
    const vehicleProgress = calculateSectionProgress(sections.vehicle);
    const coverageProgress = calculateSectionProgress(sections.coverage);

    // Weight the sections (40-30-30 split)
    const totalProgress = Math.round(
      (personalProgress * 0.4) +
      (vehicleProgress * 0.3) +
      (coverageProgress * 0.3)
    );

    // Smoothly update the progress
    const currentProgress = this.formProgress$.value;
    const smoothProgress = Math.min(
      currentProgress + 5, // Limit the increment per update
      Math.max(currentProgress, totalProgress) // Never decrease progress
    );
    
    this.formProgress$.next(smoothProgress);
  }

  getErrorMessage(controlName: string): string {
    const control = this.quoteForm.get(controlName);
    if (!control) return '';
    
    if (control.hasError('required')) return 'This field is required';
    if (control.hasError('email')) return 'Please enter a valid email address';
    if (control.hasError('pattern')) {
      if (controlName === 'phone') return 'Please enter a valid 10-digit phone number';
    }
    if (control.hasError('min')) {
      if (['age', 'vehicleYear'].includes(controlName)) {
        return `Must be at least ${control.errors?.['min'].min}`;
      }
      return 'Value is too low';
    }
    if (control.hasError('max')) {
      if (['age', 'vehicleYear'].includes(controlName)) {
        return `Must be no more than ${control.errors?.['max'].max}`;
      }
      return 'Value is too high';
    }
    
    return '';
  }

  public incrementValue(field: 'accidents' | 'violations'): void {
    const control = this.quoteForm.get(field);
    if (control) {
      const currentValue = control.value || 0;
      const newValue = Math.min(10, currentValue + 1);
      this.quoteForm.patchValue({ [field]: newValue });
    }
  }

  public decrementValue(field: 'accidents' | 'violations'): void {
    const control = this.quoteForm.get(field);
    if (control) {
      const currentValue = control.value || 0;
      const newValue = Math.max(0, currentValue - 1);
      this.quoteForm.patchValue({ [field]: newValue });
    }
  }
}
