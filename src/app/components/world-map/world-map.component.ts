import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
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
  svgContent: SafeHtml = '';
  activeCountryId: string | null = null;

  // Mapping of SVG country IDs to World Bank country codes
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
    'SG': 'SG',
    'CH': 'CH',
    'SE': 'SE',
    'NO': 'NO',
    'DK': 'DK',
    'TR': 'TR',
    'SA': 'SA',
    'AE': 'AE',
    'NZ': 'NZ',
    'PK': 'PK',
    'BD': 'BD',
    'VN': 'VN',
    'MY': 'MY',
    'PH': 'PH'
  };

  constructor(
    private countryService: CountryService,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadSvgMap();
  }

  /**
   * Loads the SVG world map from external URL
   */
  private loadSvgMap(): void {
    const svgUrl = 'https://innovsandbox.space/map-image.svg';
    
    this.http.get(svgUrl, { responseType: 'text' }).subscribe({
      next: (svgData: string) => {
        // Sanitize and store the SVG content
        this.svgContent = this.sanitizer.bypassSecurityTrustHtml(svgData);
        // Attach event handlers after SVG is rendered
        setTimeout(() => this.attachEventHandlers(), 100);
      },
      error: (error) => {
        console.error('Error loading SVG map:', error);
        this.errorMessage = 'Failed to load the world map. Please try again later.';
      }
    });
  }

  /**
   * Attaches mouse event handlers to SVG country paths
   */
  private attachEventHandlers(): void {
    const container = document.querySelector('.map-column svg');
    if (!container) {
      console.warn('SVG container not found');
      return;
    }

    // Attach click handlers to all SVG elements with country data
    const elements = container.querySelectorAll('[data-country]');
    elements.forEach(element => {
      element.addEventListener('click', (event) => this.onCountryClick(event as MouseEvent));
    });

    // Also try to attach handlers to path elements
    const paths = container.querySelectorAll('path, polygon, g[id]');
    paths.forEach(path => {
      const countryCode = path.getAttribute('id') || path.getAttribute('data-country');
      if (countryCode && this.countryMapping[countryCode]) {
        path.addEventListener('click', (event) => this.onCountryClick(event as MouseEvent));
      }
    });
  }

  /**
   * Handles country selection via SVG click event
   * @param event - Mouse event from SVG element click
   */
  private onCountryClick(event: MouseEvent): void {
    const target = event.target as SVGElement;
    let countryCode = target.getAttribute('data-country') || target.getAttribute('id');

    // If the clicked element is a child, try to find country code from parent
    if (!countryCode && target.parentElement) {
      countryCode = target.parentElement.getAttribute('id') || target.parentElement.getAttribute('data-country');
    }

    if (countryCode && this.countryMapping[countryCode]) {
      this.selectCountry(countryCode, target);
    }
  }

  /**
   * Selects a country and fetches its information from the World Bank API
   * This method is called when a country is clicked on the map
   * @param countryCode - Two-letter country code
   * @param element - SVG element
   */
  private selectCountry(countryCode: string, element: SVGElement): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Remove active class from previously selected country
    if (this.activeCountryId) {
      const previousElements = document.querySelectorAll(`[id="${this.activeCountryId}"], [data-country="${this.activeCountryId}"]`);
      previousElements.forEach(el => el.classList.remove('active'));
    }

    // Add active class to current selection
    this.activeCountryId = countryCode;
    const activeElements = document.querySelectorAll(`[id="${countryCode}"], [data-country="${countryCode}"]`);
    activeElements.forEach(el => el.classList.add('active'));

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
