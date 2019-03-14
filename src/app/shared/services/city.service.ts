import { Injectable } from '@angular/core';
import { CityMetaData } from '../models/city-meta-data';
import { map, tap, catchError } from 'rxjs/operators';
import { Constants } from '../app.constants';
import { Observable } from 'rxjs';
import { City } from '../../shared/models/city';
import { HttpClient } from '@angular/common/http';
import { ErrorHandleService } from './error-handle.service';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  constructor(
    private http: HttpClient,
    private errorHandleService: ErrorHandleService) { }

  getLastAccessedCity(): Observable<City> {
    const uri = decodeURIComponent(`${Constants.cityAPIUrl}`);
    return this.http.get<CityMetaData>(uri)
      .pipe(
        map(res => {
          const data = res as CityMetaData;
          const city = {
            Key: data.id,
            EnglishName: data.name,
            Type: 'City',
            Country:
            {
              ID: data.countryId,
              EnglishName: ''
            }
          };
          return city;
        }),
        tap(_ => console.log('fetched the last accessed city')),
        catchError(this.errorHandleService.handleError('getLastAccessedCity', null))
      );
  }

  updateLastAccessedCity(city: City) {
    const uri = decodeURIComponent(`${Constants.cityAPIUrl}`);
    var data = new CityMetaData(city);
    return this.http.post(uri, data)
      .pipe(
        catchError(this.errorHandleService.handleError('updateLastAccessedCity', []))
      );
  }
}
