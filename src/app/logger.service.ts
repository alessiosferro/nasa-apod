import { Apod } from './model/apod';
import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoggerService implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<Apod>> {
    return next.handle(req).pipe(
      tap((event: HttpEvent<Apod>) => {
        if (event instanceof HttpResponse) {
          // console.log(event.body);
        }
      })
    );
  }

}