// ================================================================================================
// MAIN.TS - THE STARTING POINT OF OUR ENTIRE ANGULAR APPLICATION
// ================================================================================================
// This file is the "ignition key" that starts our insurance quote app. When someone visits our website,
// this is the FIRST code that runs. It's like the main() function in other programming languages.
// 
// WHAT HAPPENS HERE:
// 1. Angular framework loads and initializes
// 2. Our AppComponent becomes the root component (the container for everything)
// 3. Routing system activates (handles /quote-form, /quote-results, etc. URLs)
// 4. HTTP client enables API calls (currently used for future backend integration)
// 5. The entire app becomes available to users in their browser

import { bootstrapApplication } from '@angular/platform-browser';         // Angular's main function that starts the app in browser environment
import { AppComponent } from './app/app';                                // Our root component - the main container that holds everything else
import { provideRouter } from '@angular/router';                         // Router service that handles URL navigation between pages
import { routes } from './app/app.routes';                               // Our route configuration (which URLs lead to which components)
import { provideHttpClient } from '@angular/common/http';                // HTTP client for making API calls (future backend communication)

// 🚀 APPLICATION BOOTSTRAP - Start the entire Angular application
// This is like turning the key in a car - everything springs to life from this point
bootstrapApplication(AppComponent, {                                     // Launch AppComponent as the root of our app tree
  providers: [                                                           // Services available throughout the entire application
    provideRouter(routes),                                              // Enable URL routing: /quote-form → QuoteForm component, /quote-results → QuoteResults component
    provideHttpClient()                                                 // Enable HTTP requests: future API calls to real insurance backend servers
  ]
});

// 🏗️ ARCHITECTURE OVERVIEW - How this fits in the bigger picture:
// main.ts → app.ts → app.routes.ts → specific page components (quote-form, quote-results, etc.)
// This creates a hierarchical structure where each level adds more specific functionality.
