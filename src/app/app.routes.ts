import { Routes } from '@angular/router';
import { QuoteForm } from './pages/quote-form/quote-form';
import { QuoteResults } from './pages/quote-results/quote-results';

export const routes: Routes = [
  { path: '', component: QuoteForm },
  { path: 'quote-results', component: QuoteResults }
];
