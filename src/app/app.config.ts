import { ApplicationConfig, provideBrowserGlobalErrorListeners, SecurityContext } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideMarkdown, SANITIZE } from 'ngx-markdown';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideRouter(routes),
    provideMarkdown({
      sanitize: { provide: SANITIZE, useValue: SecurityContext.HTML }
    })
  ]
};
