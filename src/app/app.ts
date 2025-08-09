// ================================================================================================
// APP.TS - THE ROOT COMPONENT THAT ACTS AS THE MAIN CONTAINER FOR OUR ENTIRE APPLICATION
// ================================================================================================
// This is the "master component" that gets inserted into <app-root> in index.html.
// It's like the main container that holds all other components (navigation, pages, footer).
// 
// RESPONSIBILITY: Provide the overall app structure and routing foundation
// CONTAINS: Navigation bar + router-outlet (where different pages get loaded)
// RELATIONSHIP: Parent to all other components in our app

import { Component } from '@angular/core';                               // Angular decorator that marks this class as a component
import { RouterOutlet } from '@angular/router';                         // Special component that displays the current route's component
import { HttpClientModule } from '@angular/common/http';                // Module for making HTTP requests to backend APIs

@Component({                                                             // Angular decorator that defines component metadata
  selector: 'app-root',                                                 // HTML tag name - Angular replaces <app-root> with this component's template
  standalone: true,                                                     // This component doesn't need to be declared in an NgModule
  imports: [RouterOutlet, HttpClientModule],                           // Other Angular pieces this component needs to function
  templateUrl: './app.html',                                           // External HTML file containing the component's visual layout
  
})
export class AppComponent {                                             // TypeScript class that defines component behavior
  // 📝 NOTE: This class is intentionally minimal because AppComponent is just a container.
  // The real functionality lives in child components:
  // - QuoteForm: Handles insurance quote form logic
  // - QuoteResults: Displays calculated quotes  
  // - SavedQuotes: Shows user's quote history
  // - Navbar: Handles navigation between pages
  //
  // 🏗️ ARCHITECTURE: AppComponent is the foundation that holds everything together,
  // while specialized components handle specific features.
}
