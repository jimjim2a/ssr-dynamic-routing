import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, Router } from '@angular/router';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';

import { FakeRoutesService } from './fake-routes.service';
import { tap } from 'rxjs';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideAppInitializer(() => {
      const router = inject(Router);
      const fakeRoutesService = inject(FakeRoutesService);

      // By default the router has no route, all Routes are loaded asynchronously, so we need to reset the router configuration
      return fakeRoutesService.getRoutes().pipe(
        tap((routes) => {
          router.resetConfig(routes);
          console.log('App initialized with paths:', routes);
        })
      );
    }),
  ],
};
