import { ApplicationConfig } from '@angular/core';
import { provideRouter, UrlSerializer, withComponentInputBinding, withRouterConfig } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideServiceWorker } from '@angular/service-worker';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
// import { environment } from '../environments/environment';
import { provideMarkdown } from "ngx-markdown" 
import { CustomUrlSerializer } from './core/config/custom-url-serializer';

export const appConfig: ApplicationConfig = {
  providers: [
    // Router configuration
    provideRouter(
      routes,
      withComponentInputBinding(),
      withRouterConfig({
        paramsInheritanceStrategy: 'always',
      })
    ),
    { provide: UrlSerializer, useClass: CustomUrlSerializer },
    
    // HTTP client with interceptors
    provideHttpClient(
      withInterceptors([
        authInterceptor,
        errorInterceptor,
        loadingInterceptor,
      ])
    ),
    
    // Animations
    provideAnimationsAsync(),
    
    // Service Worker for PWA
    // provideServiceWorker('ngsw-worker.js', {
    //   enabled: environment.production && environment.features.enablePWA,
    //   registrationStrategy: 'registerWhenStable:30000'
    // }),
    provideMarkdown(),
    
    // Material Design configuration
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'outline',
        subscriptSizing: 'dynamic'
      }
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 4000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      }
    }
  ],
};
