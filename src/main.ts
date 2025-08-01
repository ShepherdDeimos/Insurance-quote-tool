import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app'; // ✅ This is your actual file and class
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
});
