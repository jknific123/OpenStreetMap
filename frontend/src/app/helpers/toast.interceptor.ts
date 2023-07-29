import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable, throwError} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastInterceptor implements HttpInterceptor {

  constructor(private toastr: ToastrService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse && event.status === 200) {
          this.toastr.success('Success!');
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status !== 200) {
          this.toastr.error('Something went wrong!');
        }
        return throwError(error);
      })
    );
  }
}

export const httpToastInterceptorProvider = [
  { provide: HTTP_INTERCEPTORS, useClass: ToastInterceptor, multi: true },
];
