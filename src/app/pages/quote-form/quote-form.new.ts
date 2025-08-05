import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { QuoteService } from '../../services/quote.service';

@Component({
  selector: 'app-quote-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './quote-form.html',
  styleUrls: ['./quote-form.scss']
})
export class QuoteForm implements OnInit {
  quoteForm!: FormGroup;
  public currentYear = new Date().getFullYear();
  public isLoading = false;
  public submitError: string | null = null;

  public vehicleTypes: Array<{id: string, name: string}> = [
    { id: 'sedan', name: 'Sedan' },
    { id: 'suv', name: 'SUV' },
    { id: 'truck', name: 'Truck' },
    { id: 'van', name: 'Van' }
  ];
  
  public vehicleMakes: Array<{id: string, name: string, models: Array<{id: string, name: string}>}> = [
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
    },
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
    }
  ];

  public availableModels: Array<{id: string, name: string}> = [];

  private readonly sections = {
    driverInfo: ['age', 'zip'],
    vehicleInfo: ['vehicleType', 'vehicleMake', 'vehicleModel', 'vehicleYear'],
    coverageInfo: ['coverageLevel', 'accidents', 'violations']
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private quoteService: QuoteService
  ) {
    this.quoteForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      age: ['', [Validators.required, Validators.min(16), Validators.max(100)]],
      vehicleType: ['', Validators.required],
      vehicleMake: ['', Validators.required],
      vehicleModel: ['', Validators.required],
      vehicleYear: ['', [Validators.required, Validators.min(1990), Validators.max(this.currentYear + 1)]],
      coverageLevel: ['basic', Validators.required],
      drivingHistory: ['clean', Validators.required],
      accidents: [0, [Validators.required, Validators.min(0), Validators.max(10)]],
      violations: [0, [Validators.required, Validators.min(0), Validators.max(10)]]
    });
  }

  ngOnInit(): void {
    // Initialize form with empty values
    this.updateAvailableModels('');

    // Subscribe to make changes to update models
    this.quoteForm.get('vehicleMake')?.valueChanges.subscribe(makeId => {
      this.updateAvailableModels(makeId);
      this.quoteForm.patchValue({ vehicleModel: '' }, { emitEvent: false });
    });
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

  updateAvailableModels(makeId: string): void {
    const selectedMake = this.vehicleMakes.find(make => make.id === makeId);
    this.availableModels = selectedMake?.models || [];
  }

  async onSubmit(): Promise<void> {
    if (this.quoteForm.valid) {
      this.isLoading = true;
      this.submitError = null;

      try {
        const quoteData = {
          ...this.quoteForm.value,
          accidents: Number(this.quoteForm.value.accidents),
          violations: Number(this.quoteForm.value.violations),
          age: Number(this.quoteForm.value.age),
          vehicleYear: Number(this.quoteForm.value.vehicleYear)
        };
        
        await this.quoteService.submitQuote(quoteData);
        this.router.navigate(['/quote-results']);
      } catch (error) {
        console.error('Quote submission error:', error);
        this.submitError = 'Failed to submit quote. Please try again.';
      } finally {
        this.isLoading = false;
      }
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
  }
}
