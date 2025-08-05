import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'quote-form',
    pathMatch: 'full',
  },
  {
    path: 'quote-form',
    loadComponent: () => import('./pages/quote-form/quote-form').then(m => m.QuoteForm)
  },
  {
    path: 'quote-results/:id',
    loadComponent: () =>
      import('./pages/quote-results/quote-results.new').then(m => m.QuoteResults)
  },
  {
  path: 'saved-quotes',
  loadComponent: () =>
    import('./pages/saved-quotes/saved-quotes').then(m => m.SavedQuotesComponent)
  },


  {
    path: '**',
    redirectTo: 'quote-form'
  }
];
