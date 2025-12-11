import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

import { TokenService } from '../services/token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private tokenService: TokenService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the authorization header
    const authHeader = this.tokenService.getAuthorizationHeader();

    // Clone the request and add the authorization header if token exists
    if (authHeader) {
      request = request.clone({
        setHeaders: {
          Authorization: authHeader
        }
      });
    }

    // Add other common headers if needed
    request = request.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    return next.handle(request);
  }
}
