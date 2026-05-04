import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryService, CountryData } from '../../services/country.service';

interface CountryMapping {
  [key: string]: string; // Maps SVG path ID to country code
}

@Component({
  selector: 'app-world-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './world-map.component.html',
  styleUrls: ['./world-map.component.scss']
})
export class WorldMapComponent implements OnInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  selectedCountry: CountryData | null = null;
  isLoading = false;
  errorMessage = '';
  svgContent = '';
  activeCountryId: string | null = null;

  // Mapping of common SVG country IDs to World Bank country codes
  private countryMapping: CountryMapping = {
    'US': 'US',
    'CA': 'CA',
    'MX': 'MX',
    'BR': 'BR',
    'AR': 'AR',
    'GB': 'GB',
    'FR': 'FR',
    'DE': 'DE',
    'ES': 'ES',
    'IT': 'IT',
    'RU': 'RU',
    'CN': 'CN',
    'IN': 'IN',
    'JP': 'JP',
    'AU': 'AU',
    'ZA': 'ZA',
    'EG': 'EG',
    'NG': 'NG',
    'KE': 'KE',
    'ID': 'ID',
    'TH': 'TH',
    'SG': 'SG'
  };

  constructor(private countryService: CountryService) {}

  ngOnInit(): void {
    this.loadSvgMap();
  }

  /**
   * Loads the SVG world map and sets up event listeners
   */
  private loadSvgMap(): void {
    // Using a free SVG world map from cdn
    const svgUrl = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/vectors/natural_earth_10m_admin_0_countries.svg';
    
    // For demo purposes, we'll create a simple SVG with major countries
    this.createSimpleSvgMap();
  }

  /**
   * Creates a simplified SVG map with interactive country paths
   */
  private createSimpleSvgMap(): void {
    // This is a simplified map - in production, use a complete world map SVG
    this.svgContent = this.getSvgMapContent();
    setTimeout(() => this.attachEventHandlers(), 100);
  }

  /**
   * Returns a simplified SVG world map with major countries
   */
  private getSvgMapContent(): string {
    return `
      <svg viewBox="0 0 960 600" xmlns="http://www.w3.org/2000/svg">
        <style>
          .country-path { fill: #e8e8e8; stroke: #999; stroke-width: 0.5; cursor: pointer; transition: all 0.2s ease; }
          .country-path:hover { fill: #4da6ff; stroke: #0066cc; stroke-width: 1; }
          .country-path.active { fill: #003d99; stroke: #001f4d; stroke-width: 1; }
        </style>
        
        <!-- Simplified country boundaries (approximate) -->
        <!-- USA -->
        <path id="US" class="country-path" d="M 150 150 L 200 140 L 210 180 L 200 190 L 150 185 Z" data-country="US" data-name="United States"/>
        
        <!-- Canada -->
        <path id="CA" class="country-path" d="M 150 100 L 200 90 L 210 130 L 150 140 Z" data-country="CA" data-name="Canada"/>
        
        <!-- Mexico -->
        <path id="MX" class="country-path" d="M 150 190 L 200 185 L 210 220 L 150 225 Z" data-country="MX" data-name="Mexico"/>
        
        <!-- Brazil -->
        <path id="BR" class="country-path" d="M 220 200 L 260 190 L 270 260 L 220 270 Z" data-country="BR" data-name="Brazil"/>
        
        <!-- UK -->
        <path id="GB" class="country-path" d="M 340 120 L 360 115 L 365 140 L 345 145 Z" data-country="GB" data-name="United Kingdom"/>
        
        <!-- France -->
        <path id="FR" class="country-path" d="M 365 120 L 385 118 L 390 145 L 370 147 Z" data-country="FR" data-name="France"/>
        
        <!-- Germany -->
        <path id="DE" class="country-path" d="M 390 110 L 415 108 L 420 135 L 395 137 Z" data-country="DE" data-name="Germany"/>
        
        <!-- Spain -->
        <path id="ES" class="country-path" d="M 330 130 L 350 128 L 355 155 L 335 157 Z" data-country="ES" data-name="Spain"/>
        
        <!-- Italy -->
        <path id="IT" class="country-path" d="M 410 120 L 425 118 L 430 155 L 415 157 Z" data-country="IT" data-name="Italy"/>
        
        <!-- Russia -->
        <path id="RU" class="country-path" d="M 430 80 L 530 75 L 535 130 L 435 135 Z" data-country="RU" data-name="Russia"/>
        
        <!-- China -->
        <path id="CN" class="country-path" d="M 530 140 L 600 135 L 605 185 L 535 190 Z" data-country="CN" data-name="China"/>
        
        <!-- Japan -->
        <path id="JP" class="country-path" d="M 610 150 L 630 148 L 635 180 L 615 182 Z" data-country="JP" data-name="Japan"/>
        
        <!-- India -->
        <path id="IN" class="country-path" d="M 480 180 L 520 175 L 525 220 L 485 225 Z" data-country="IN" data-name="India"/>
        
        <!-- Australia -->
        <path id="AU" class="country-path" d="M 600 350 L 650 345 L 655 400 L 605 405 Z" data-country="AU" data-name="Australia"/>
        
        <!-- South Africa -->
        <path id="ZA" class="country-path" d="M 430 350 L 460 348 L 465 390 L 435 392 Z" data-country="ZA" data-name="South Africa"/>
        
        <!-- Egypt -->
        <path id="EG" class="country-path" d="M 420 230 L 445 228 L 450 270 L 425 272 Z" data-country="EG" data-name="Egypt"/>
        
        <!-- Nigeria -->
        <path id="NG" class="country-path" d="M 390 280 L 415 278 L 420 320 L 395 322 Z" data-country="NG" data-name="Nigeria"/>
        
        <!-- Kenya -->
        <path id="KE" class="country-path" d="M 450 290 L 475 288 L 480 330 L 455 332 Z" data-country="KE" data-name="Kenya"/>
        
        <!-- Indonesia -->
        <path id="ID" class="country-path" d="M 550 270 L 600 265 L 605 300 L 555 305 Z" data-country="ID" data-name="Indonesia"/>
        
        <!-- Thailand -->
        <path id="TH" class="country-path" d="M 510 240 L 535 238 L 540 270 L 515 272 Z" data-country="TH" data-name="Thailand"/>
        
        <!-- Singapore -->
        <path id="SG" class="country-path" d="M 545 280 L 555 279 L 558 290 L 548 291 Z" data-country="SG" data-name="Singapore"/>
      </svg>
    `;
  }

  /**
   * Attaches mouse event handlers to SVG country paths
   */
  private attachEventHandlers(): void {
    const container = document.querySelector('.map-column svg');
    if (!container) return;

    const paths = container.querySelectorAll('path.country-path');
    paths.forEach(path => {
      path.addEventListener('click', (event) => this.onCountryClick(event as MouseEvent));
    });
  }

  /**
   * Handles country selection via SVG click event
   * @param event - Mouse event from SVG path click
   */
  private onCountryClick(event: MouseEvent): void {
    const target = event.target as SVGPathElement;
    const countryCode = target.getAttribute('data-country');
    const countryName = target.getAttribute('data-name');

    if (countryCode) {
      this.selectCountry(countryCode, target);
    }
  }

  /**
   * Selects a country and fetches its information from the World Bank API
   * This method is called when a country is clicked on the map
   * @param countryCode - Two-letter country code
   * @param element - SVG path element
   */
  private selectCountry(countryCode: string, element: SVGPathElement): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Remove active class from previously selected country
    if (this.activeCountryId) {
      const previousElement = document.getElementById(this.activeCountryId);
      if (previousElement) {
        previousElement.classList.remove('active');
      }
    }

    // Add active class to current selection
    this.activeCountryId = element.id;
    element.classList.add('active');

    // Trigger the service method to fetch country information
    this.countryService.getCountryInfo(countryCode).subscribe({
      next: (data: CountryData) => {
        this.selectedCountry = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = `Error loading country information: ${error.message}`;
        this.isLoading = false;
      }
    });
  }
}
