import { ApplicationConfig } from '@angular/core';
import { provideRouter, UrlSerializer  } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { provideMarkdown } from "ngx-markdown" 
import { CustomUrlSerializer } from './core/config/custom-url-serializer';

export const appConfig: ApplicationConfig = {
  providers: [
    // Router configuration
    provideRouter(routes),
    { provide: UrlSerializer, useClass: CustomUrlSerializer },
    
    // HTTP client with interceptors
    provideHttpClient(
      withFetch(),
      withInterceptors([
        authInterceptor,
        errorInterceptor,
      ])
    ),

    provideMarkdown(),
    
    // Material Design configuration
    // {
    //   provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
    //   useValue: {
    //     appearance: 'outline',
    //     subscriptSizing: 'dynamic'
    //   }
    // },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 4000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom'
      }
    }
  ],
};
