import { isPlatformBrowser } from '@angular/common';
import {
  inject,
  Injectable,
  PLATFORM_ID,
  REQUEST_CONTEXT,
} from '@angular/core';
import { Routes } from '@angular/router';
import { of } from 'rxjs';

/**
 * Service responsible of mocking the routes configuration to highlight the dynamic routes paths issue.
 * The context is the following:
 * 
 * Let's say that at build time, there's a single route path defined by the remote Routes API.
 * Then for some reason, a new route is added and activated by the API, and is now added to the Router Config.
 * 
 * We are in a case where the Server routes manifest only contains the first route, but the SSR and the Browser Router Configs have both routes.
 * In this case if I load the /video route, it will end up with a 404 error.
 */
@Injectable({
  providedIn: 'root',
})
export class FakeRoutesService {
  isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  context = inject<{ server: string }>(REQUEST_CONTEXT);

  getRoutes() {
    let routes: Routes;

    // For the demo, on the browser router has all routes defined, we don't care
    if (this.isBrowser) {
      routes = [
        {
          path: 'article',
          loadComponent: () =>
            import('./article/article.component').then(
              (m) => m.ArticleComponent
            ),
        },
        {
          path: 'video',
          loadComponent: () =>
            import('./video/video.component').then((m) => m.VideoComponent),
        },
      ];
    } else {
      // On the server if we have the context, we naïvely assume that we are on a regular SSR context and then, we say that there are now 2 routes
      // available on the server side
      if (this.context && this.context.server === 'express') {
        routes = [
          {
            path: 'article',
            loadComponent: () =>
              import('./article/article.component').then(
                (m) => m.ArticleComponent
              ),
          },
          {
            path: 'video',
            loadComponent: () =>
              import('./video/video.component').then((m) => m.VideoComponent),
          },
        ];
      } else {
        // Otherwise we are on the first request, we assume it's routes extraction process at build time, let's say we have only one route
        routes = [
          {
            path: 'article',
            loadComponent: () =>
              import('./article/article.component').then(
                (m) => m.ArticleComponent
              ),
          },
        ];
      }
    }

    return of(routes);
  }
}
