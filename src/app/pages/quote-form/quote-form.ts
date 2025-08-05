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
    { id: 'suv', name: 'SUV' },
    { id: 'truck', name: 'Truck' },
    { id: 'van', name: 'Van' }
  ];

  public availableModels: VehicleOption[] = [];
  public currentYear = new Date().getFullYear();
  public isLoading = false;
  public submitError: string | null = null;
  public vehicleMakes: VehicleMake[] = [
    {
      id: 'ford',
      name: 'Ford',
      models: [
        { id: 'f150', name: 'F-150' },
        { id: 'explorer', name: 'Explorer' },
        { id: 'escape', name: 'Escape' },
        { id: 'mustang', name: 'Mustang' }
      ]
    },
    {
      id: 'chevrolet',
      name: 'Chevrolet',
      models: [
        { id: 'silverado', name: 'Silverado' },
        { id: 'equinox', name: 'Equinox' },
        { id: 'tahoe', name: 'Tahoe' },
        { id: 'camaro', name: 'Camaro' }
      ]
    },
    {
      id: 'toyota',
      name: 'Toyota',
      models: [
        { id: 'camry', name: 'Camry' },
        { id: 'rav4', name: 'RAV4' },
        { id: 'highlander', name: 'Highlander' },
        { id: 'tacoma', name: 'Tacoma' }
      ]
    },
    {
      id: 'honda',
      name: 'Honda',
      models: [
        { id: 'civic', name: 'Civic' },
        { id: 'cr-v', name: 'CR-V' },
        { id: 'pilot', name: 'Pilot' },
        { id: 'accord', name: 'Accord' }
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
    this.availableModels = selectedMake?.models || [];
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
    const controls = this.quoteForm.controls;
    const totalFields = Object.keys(controls).length;
    const completedFields = Object.values(controls).filter(control => 
      control.valid && control.value !== '' && control.value !== null
    ).length;
    
    const progress = Math.round((completedFields / totalFields) * 100);
    this.formProgress$.next(progress);
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
