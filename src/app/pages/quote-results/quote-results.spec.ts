import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteResults } from './quote-results';

describe('QuoteResults', () => {
  let component: QuoteResults;
  let fixture: ComponentFixture<QuoteResults>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuoteResults]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuoteResults);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
