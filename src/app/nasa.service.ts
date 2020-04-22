import { tap } from 'rxjs/operators';
import { HttpOptions } from './model/http-options';
import { Apod } from './model/apod';
import { environment } from './../environments/environment';
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NasaService {
  private apod$ = new Subject<Apod>();
  get apod() { return this.apod$.asObservable() }

  apodUrl = 'https://api.nasa.gov/planetary/apod';

  constructor(
    private Http: HttpClient
  ) { }

  getApod(date?: string): Observable<Apod> {
    let params = new HttpParams()
      .append('api_key', environment.nasaApiKey);

    if (date) {
      params = params.set('date', date);
    }

    const options = {
      params,
    };

    return this.Http.get<Apod>(`${this.apodUrl}`, options).pipe(
      tap(apod => this.apod$.next(apod))
    )
  }
}