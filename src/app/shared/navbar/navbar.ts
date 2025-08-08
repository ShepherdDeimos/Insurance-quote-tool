// ================================================================================================
// NAVBAR COMPONENT - Top Navigation Bar That Appears On Every Page of the Insurance App
// ================================================================================================
// This is the persistent navigation menu that stays at the top of every page.
// It provides consistent navigation between the main sections of our insurance application.
// User Experience: Always visible, lets users jump between Quote Form, Results, and Saved Quotes
// Architecture: Shared component included in app.html, appears above router-outlet content

// 🔗 ANGULAR IMPORTS - Core framework functionality
import { Component } from '@angular/core';                      // Angular decorator that transforms this class into a reusable UI component

@Component({                                                    // Angular decorator that defines component metadata and configuration
  selector: 'app-navbar',                                      // HTML tag name: <app-navbar></app-navbar> (used in app.html)
  imports: [],                                                 // Dependencies array (currently empty - this is a simple static navigation)
  templateUrl: './navbar.html',                               // External HTML file containing the navigation menu structure
  styleUrl: './navbar.scss'                                   // External SCSS file containing navigation-specific styles (colors, fonts, hover effects)
})
export class Navbar {                                          // Main TypeScript class that defines navbar behavior
  // 📝 NOTE: This navbar component is intentionally minimal because it's purely presentational.
  // All navigation logic is handled by Angular Router through routerLink directives in the template.
  // 
  // 🏗️ TEMPLATE STRUCTURE: The navbar.html contains:
  // - App logo/title
  // - Navigation links with routerLink="/path" attributes
  // - Responsive design for mobile/desktop viewing
  //
  // 🎨 STYLING: The navbar.scss contains:
  // - Color scheme matching our insurance app branding
  // - Hover effects for interactive feedback
  // - Responsive breakpoints for different screen sizes
  //
  // 🔗 USAGE: This component is imported in app.html above <router-outlet>
  // so it appears on every page consistently.

}
