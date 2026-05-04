import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface CountryData {
  name: string;
  capital: string;
  region: string;
  incomeLevel: string;
  population: string;
  currency: string;
}

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private readonly worldBankUrl = 'https://api.worldbank.org/v2';

  constructor(private http: HttpClient) {}

  /**
   * Fetches country information from the World Bank API
   * @param countryCode - Two-letter country code (e.g., 'US', 'FR')
   * @returns Observable with country data including name, capital, region, income level, population, and currency
   */
  getCountryInfo(countryCode: string): Observable<CountryData> {
    return this.http
      .get<any[]>(`${this.worldBankUrl}/country/${countryCode}?format=json`)
      .pipe(
        map(response => {
          if (!response || response.length < 2 || !response[1] || response[1].length === 0) {
            throw new Error('Country not found');
          }

          const countryInfo = response[1][0];
          const population = countryInfo.populationTotal || 'N/A';
          const currency = countryInfo.currencyOfficial || 'N/A';

          return {
            name: countryInfo.name || 'N/A',
            capital: countryInfo.capitalCity || 'N/A',
            region: countryInfo.region || 'N/A',
            incomeLevel: countryInfo.incomeLevel || 'N/A',
            population: population,
            currency: currency
          };
        }),
        catchError(error => {
          console.error('Error fetching country info:', error);
          return of({
            name: 'Unknown',
            capital: 'N/A',
            region: 'N/A',
            incomeLevel: 'N/A',
            population: 'N/A',
            currency: 'N/A'
          });
        })
      );
  }
}
