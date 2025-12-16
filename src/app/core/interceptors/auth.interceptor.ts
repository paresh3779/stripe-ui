import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add other common headers if needed
    const setHeaders: Record<string, string> = {
      'X-Requested-With': 'XMLHttpRequest'
    };

    if (!(request.body instanceof FormData)) {
      setHeaders['Content-Type'] = 'application/json';
    }

    request = request.clone({
      withCredentials: true,
      setHeaders
    });

    return next.handle(request);
  }
}
