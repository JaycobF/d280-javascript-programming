import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface CountryData {
  name: string;
  capital: string;
  region: string;
  incomeLevel: string;
  population: string;
  currency: string;
}

interface CountryIndicatorResponse {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private readonly worldBankUrl = 'https://api.worldbank.org/v2';
  private populationCache: Map<string, string> = new Map();

  constructor(private http: HttpClient) {
    this.loadPopulationData();
  }

  /**
   * Loads population data from World Bank API for all countries
   * This endpoint: https://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL?format=json
   */
  private loadPopulationData(): void {
    const populationUrl = `${this.worldBankUrl}/country/all/indicator/SP.POP.TOTL?format=json&per_page=500`;
    
    this.http.get<any[]>(populationUrl).subscribe({
      next: (response: any) => {
        if (response && response.length > 1 && response[1]) {
          response[1].forEach((countryData: any) => {
            if (countryData.countryiso3code && countryData.value) {
              // Convert ISO3 to ISO2 code for mapping
              const iso2Code = this.iso3ToIso2(countryData.countryiso3code);
              this.populationCache.set(iso2Code, countryData.value);
            }
          });
        }
      },
      error: (error) => {
        console.error('Error loading population data:', error);
      }
    });
  }

  /**
   * Fetches country information from the World Bank API
   * Uses both country detail endpoint and population indicator endpoint
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
          
          // Get population from cache (loaded from population indicator endpoint)
          let population = this.populationCache.get(countryCode) || 'N/A';
          if (population !== 'N/A' && !isNaN(Number(population))) {
            // Format population as a readable number
            population = this.formatPopulation(Number(population));
          }
          
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

  /**
   * Converts ISO 3-letter country code to ISO 2-letter code
   * @param iso3 - Three-letter ISO country code
   * @returns Two-letter ISO country code
   */
  private iso3ToIso2(iso3: string): string {
    const iso3to2Map: { [key: string]: string } = {
      'USA': 'US',
      'CAN': 'CA',
      'MEX': 'MX',
      'BRA': 'BR',
      'ARG': 'AR',
      'GBR': 'GB',
      'FRA': 'FR',
      'DEU': 'DE',
      'ESP': 'ES',
      'ITA': 'IT',
      'RUS': 'RU',
      'CHN': 'CN',
      'IND': 'IN',
      'JPN': 'JP',
      'AUS': 'AU',
      'ZAF': 'ZA',
      'EGY': 'EG',
      'NGA': 'NG',
      'KEN': 'KE',
      'IDN': 'ID',
      'THA': 'TH',
      'SGP': 'SG',
      'CHE': 'CH',
      'SWE': 'SE',
      'NOR': 'NO',
      'DNK': 'DK',
      'TUR': 'TR',
      'SAU': 'SA',
      'ARE': 'AE',
      'NZL': 'NZ',
      'PAK': 'PK',
      'BGD': 'BD',
      'VNM': 'VN',
      'MYS': 'MY',
      'PHL': 'PH'
    };
    
    return iso3to2Map[iso3] || iso3;
  }

  /**
   * Formats population number for display
   * @param population - Population as a number
   * @returns Formatted population string (e.g., "331,900,000")
   */
  private formatPopulation(population: number): string {
    if (population >= 1000000000) {
      return (population / 1000000000).toFixed(2) + 'B';
    } else if (population >= 1000000) {
      return (population / 1000000).toFixed(2) + 'M';
    } else if (population >= 1000) {
      return (population / 1000).toFixed(2) + 'K';
    }
    return population.toLocaleString();
  }
}
