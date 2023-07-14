import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

export class AuthInterceptor implements HttpInterceptor {
  // Implement intercept method
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get token from local storage
    const token = localStorage.getItem('token');

    // clone request
    req = req.clone({
      setHeaders: {
        Authorizations: token ?? '[]'
      }
    })

    // Handle the cloned request
    return next.handle(req);
  }
}