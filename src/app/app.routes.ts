// ================================================================================================
// APP.ROUTES.TS - THE NAVIGATION MAP THAT TELLS ANGULAR WHICH COMPONENT TO SHOW FOR EACH URL
// ================================================================================================
// This file defines the "road map" of our insurance app. When users type different URLs 
// or click navigation links, Angular uses this file to know which component to display.
//
// HOW IT WORKS: Angular checks the browser URL against these patterns and loads the matching component
// LAZY LOADING: Components are loaded only when needed (not all at startup) for better performance
// RELATIONSHIP: Works with RouterOutlet in app.html to inject the correct page component

import { Routes } from '@angular/router';                               // Angular's routing system that maps URLs to components

export const routes: Routes = [                                        // Array of route definitions that Angular will use for navigation
  {                                                                     // ⭐ DEFAULT ROUTE - What happens when user visits the root URL
    path: '',                                                          // Empty string = root URL (like mysite.com/)
    redirectTo: 'quote-form',                                          // Automatically send users to the quote form page
    pathMatch: 'full',                                                 // Only redirect if URL exactly matches '' (not partial match)
  },
  {                                                                     // 📝 QUOTE FORM ROUTE - Where users enter their insurance information
    path: 'quote-form',                                                // URL pattern: mysite.com/quote-form
    loadComponent: () => import('./pages/quote-form/quote-form').then(m => m.QuoteForm)  // Lazy load: only download QuoteForm component when this route is visited
  },
  {                                                                     // 📊 QUOTE RESULTS ROUTE - Shows calculated insurance quotes
    path: 'quote-results/:id',                                         // URL pattern: mysite.com/quote-results/123 (id = unique quote identifier)
    loadComponent: () =>                                               // Lazy load: download QuoteResults component when needed
      import('./pages/quote-results/quote-results').then(m => m.QuoteResults)  // Import the component class from its file
  },
  {                                                                     // 💾 SAVED QUOTES ROUTE - Displays user's quote history
  path: 'saved-quotes',                                               // URL pattern: mysite.com/saved-quotes
  loadComponent: () =>                                                // Lazy load: download SavedQuotes component when user navigates here
    import('./pages/saved-quotes/saved-quotes').then(m => m.SavedQuotesComponent)  // Import the saved quotes component
  },

  {                                                                     // 🚫 WILDCARD ROUTE - Catches any URL that doesn't match the above patterns
    path: '**',                                                        // ** = "any other URL" (like a catch-all safety net)
    redirectTo: 'quote-form'                                           // Send confused users back to the main quote form page
  }
];

// 🏗️ ARCHITECTURE EXPLANATION:
// 1. User types URL or clicks link → Angular checks this routes array
// 2. Angular finds matching pattern → Loads the specified component  
// 3. Component gets injected into <router-outlet> in app.html
// 4. User sees the new page content without full page reload (SPA magic!)
//
// 💡 LAZY LOADING BENEFITS:
// - Faster initial app startup (only loads what's needed immediately)
// - Better performance on slow connections
// - Users download code for pages they actually visit
