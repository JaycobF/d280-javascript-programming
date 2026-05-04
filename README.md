# World Map Explorer - Angular Application

An interactive Angular web application that displays a world map with country information powered by the World Bank API.

## Features

### A. Interactive SVG World Map
- Click on any country to view detailed information
- Hover effects for better interactivity
- Active country highlighting
- Responsive design

### B. World Bank API Integration
Fetches the following country properties:
- **Country Name** (e.g., Chad)
- **Capital** (e.g., N'Djamena)
- **Region** (e.g., Sub-Saharan Africa)
- **Income Level** (e.g., Low Income)
- **Population** (custom property)
- **Currency** (custom property)

### C. Two-Column Layout
- **Left Column**: Interactive SVG world map
- **Right Column**: Selected country information display
- Responsive design that adapts to mobile devices

### D. Angular Routing
- Root path (`/`) automatically redirects to `/map`
- Clean URL structure
- Fallback routing for invalid routes

### E. Event Binding
- SVG paths connected to mouse event handlers
- Click events transmit country data to the component
- Event processing and API service integration

### F. HTTPClient Service
- `CountryService` with methods for fetching country information
- `getCountryInfo()`: Accepts country code, returns country data
- Error handling and fallback values
- RxJS Observable-based implementation

## Technology Stack

- **Angular**: 18.0.0
- **TypeScript**: 5.4.0
- **RxJS**: 7.8.0
- **SCSS**: For styling
- **World Bank API**: https://api.worldbank.org/v2

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   └── world-map/
│   │       ├── world-map.component.ts
│   │       ├── world-map.component.html
│   │       └── world-map.component.scss
│   ├── services/
│   │   └── country.service.ts
│   ├── app.component.ts
│   └── app.routes.ts
├── styles.scss
├── index.html
└── main.ts
```

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Angular CLI

### Installation

1. Clone the repository:
```bash
git clone https://github.com/JaycobF/d280-javascript-programming.git
cd d280-javascript-programming
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
ng serve
```

4. Open your browser and navigate to:
```
http://localhost:4200
```

## Usage

1. The application will automatically load at `/map`
2. Click on any country in the SVG map
3. Country information will be fetched from the World Bank API and displayed in the right column
4. Hover over countries for visual feedback
5. Click another country to see its information

## API Integration

The application uses the World Bank API endpoint:
```
https://api.worldbank.org/v2/country/{countryCode}?format=json
```

### Supported Country Codes

The application includes country codes for:
- US (United States)
- CA (Canada)
- MX (Mexico)
- BR (Brazil)
- GB (United Kingdom)
- FR (France)
- DE (Germany)
- ES (Spain)
- IT (Italy)
- RU (Russia)
- CN (China)
- JP (Japan)
- IN (India)
- AU (Australia)
- ZA (South Africa)
- EG (Egypt)
- NG (Nigeria)
- KE (Kenya)
- ID (Indonesia)
- TH (Thailand)
- SG (Singapore)

## Component Details

### WorldMapComponent

**Purpose**: Main component for displaying the interactive map and country information

**Key Methods**:
- `selectCountry()`: Handles country selection and triggers API call
- `attachEventHandlers()`: Connects SVG paths to click events
- `getSvgMapContent()`: Returns simplified SVG map content

**Properties**:
- `selectedCountry`: Stores the currently selected country data
- `isLoading`: Loading state indicator
- `errorMessage`: Error message display
- `activeCountryId`: Tracks the currently active country

### CountryService

**Purpose**: Provides API calls to World Bank for country information

**Key Methods**:
- `getCountryInfo(countryCode)`: Fetches country data from World Bank API
  - **Parameter**: `countryCode` (string) - Two-letter country code
  - **Returns**: `Observable<CountryData>` containing country information

**Error Handling**: Graceful fallback with 'N/A' values if API call fails

## Data Flow

1. User clicks on an SVG country path
2. Click event triggers `onCountryClick()` method
3. Country code is extracted from SVG element attributes
4. `selectCountry()` method is called with country code
5. Component calls `countryService.getCountryInfo(countryCode)`
6. Service makes HTTP GET request to World Bank API
7. Response is processed and mapped to `CountryData` interface
8. Component updates `selectedCountry` local variable
9. Template displays country information in the right column

## Styling

The application features:
- Clean, modern two-column layout
- Responsive design with flexbox
- Interactive hover effects on country paths
- Color-coded information display
- Mobile-friendly media queries

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- Add complete world map SVG with all countries
- Implement search functionality to find countries
- Add historical data visualization
- Include additional country statistics
- Add country comparison feature
- Implement data export (CSV/JSON)

## License

MIT

## Author

JaycobF
