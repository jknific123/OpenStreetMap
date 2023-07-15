import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HTTP_INTERCEPTORS,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError} from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { SessionStorageService } from "../services/session.storage.service";
import { AuthService } from "../services/auth.service";

const TOKEN_HEADER_KEY = 'Authorization';
@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

  constructor(private sessionStorageService: SessionStorageService,
              private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.sessionStorageService.isLoggedIn()) {
      const token = this.sessionStorageService.getAuthToken();
      request = request.clone({
        headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token)
      });
    }

    return next.handle(request).pipe(
      catchError(error => {
        if (error.status === 401) {
          return this.handleUnauthorizedError(request, next);
        }
        return throwError(error);
      })
    );
  }

  private handleUnauthorizedError(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.refreshToken().pipe(
      switchMap((response) => {
        const newAuthToken = response.accessToken;

        request = request.clone({
          headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + newAuthToken)
        });

        return next.handle(request);
      })
    );
  }

}

export const httpAuthInterceptorProvider = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
];









/**
 *   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
 *     let authReq = req;
 *     const token = this.sessionStorageService.getAuthToken();
 *     if (token != null) {
 *       // TODO pohendlaj ce je token neveljaven ga je treba refreshat
 *       authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
 *     }
 *     else {
 *       console.log('Token je null..');
 *     }
 *     return next.handle(authReq)
 *     // return next.handle(authReq).pipe(catchError((err: HttpErrorResponse) => {
 *     //   if (err.status === 401) {
 *     //     this.authService.refreshToken().subscribe({
 *     //       next: res => {
 *     //
 *     //       },
 *     //       error: err => {
 *     //
 *     //       }
 *     //     });
 *     //   }
 *     // }));
 *   }
 */
