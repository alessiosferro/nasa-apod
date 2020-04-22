import { Apod } from './model/apod';
import { environment } from './../environments/environment';
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NasaService {
  apodUrl = 'https://api.nasa.gov/planetary/apod';

  constructor(
    private Http: HttpClient
  ) { }

  getApod(date?: string): Observable<Apod> {
    const params = new HttpParams()
      .append('api_key', environment.nasaApiKey);

    console.log(date);

    if (date) {
      params.append('date', date);
    }

    const options = {
      params,
    };

    return this.Http.get<Apod>(`${this.apodUrl}`, options);
  }
}