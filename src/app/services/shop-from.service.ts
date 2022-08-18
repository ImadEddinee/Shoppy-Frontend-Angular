import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Country} from "../model/country";
import {environment} from "../../environments/environment";
import {State} from "../model/state";

@Injectable({
  providedIn: 'root'
})
export class ShopFromService {

  constructor(private http: HttpClient) { }

  getAllCountries(): Observable<Country[]>{
    return this.http.get<Country[]>(environment.baseUrl + "countries");
  }

  getStates(countryCode: string): Observable<State[]>{
    return this.http.get<State[]>(environment.baseUrl + "states/search/countryCode?cc=" + countryCode);
  }

  getCreditCardMonths(startMonth: number): Observable<number[]>{
    let months: number[] = [];
    for (let month=startMonth;month <= 12;month++){
      months.push(month);
    }
    return of(months);
  }

  getCreditCardYear(): Observable<number[]>{
    let years: number[] = [];
    const startYear = new Date().getFullYear();
    const endYear = startYear + 10;
    for (let year=startYear;year <= endYear; year++){
      years.push(year);
    }
    return of(years);
  }
}
