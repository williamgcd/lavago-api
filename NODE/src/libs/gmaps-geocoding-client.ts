import { CONFIG } from "@/config";
import { AddressComponent, GeocodingResult } from "./gmaps-geocoding-client.types";

export class GmapsGeocodingClient {
    private readonly apiKey: string;
	private readonly baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

    constructor(apiKey?: string) {
        this.apiKey = apiKey || CONFIG.googleMaps.apiKey!;
        if (!this.apiKey) {
            throw new Error('Google Maps API key is required');
        }
    }

    private parseAddressComponents(
        addressComponents: AddressComponent[]
    ): Pick<GeocodingResult, 'addressComponents' | 'neighborhood' | 'city' | 'state' | 'country'> {
        const components = addressComponents.map(component => ({
            longName: component.longName,
            shortName: component.shortName,
            types: component.types,
        }));
        const result: Pick<GeocodingResult, 'addressComponents' | 'neighborhood' | 'city' | 'state' | 'country'> = {
            addressComponents: components,
        };
        for (const comp of addressComponents) {
            if (comp.types.includes('sublocality_level_1')) {
				result.neighborhood = comp.longName;
			} else if (comp.types.includes('administrative_area_level_2')) {
				result.city = comp.longName;
			} else if (comp.types.includes('administrative_area_level_1')) {
				result.state = comp.shortName;
			} else if (comp.types.includes('country')) {
				result.country = comp.shortName;
			}
        }
        return result;
    }

    private async parseResponseData(data: { status: string, results: any[] }) {
        if (data.status === 'OVER_QUERY_LIMIT') {
            console.error('GmapsGeocodingClient.parseResponseData', 'OVER_QUERY_LIMIT', data);
            throw new Error('Rate limit exceeded');
        }
        if (data.status === 'REQUEST_DENIED') {
            console.error('GmapsGeocodingClient.parseResponseData', 'REQUEST_DENIED', data);
            throw new Error('Request denied');
        }
        if (data.status === 'ZERO_RESULTS') {
            console.error('GmapsGeocodingClient.parseResponseData', 'ZERO_RESULTS', data);
            throw new Error('No results found');
        }
        if (data.status !== 'OK') {
            console.error('GmapsGeocodingClient.parseResponseData', 'UNKNOWN_ERROR', data);
            throw new Error('Geocoding API error');
        }
        return data.results;
    }

    async geocode(address: string): Promise<GeocodingResult> {
        try {
            const encodedAddress = encodeURIComponent(address);
            const url = `${this.baseUrl}?address=${encodedAddress}&key=${this.apiKey}`;

            const response = await fetch(url);
            if (!response.ok) {
                console.error('GmapsGeocodingClient.geocode', response);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const parsedData = await this.parseResponseData(data);
            if (!parsedData || parsedData.length === 0) {
				throw new Error(`No results found for address: ${address}`);
			}

            const result = parsedData[0];
            const location = result.geometry.location;
            return {
                lat: location.lat,
                lng: location.lng,
                formattedAddress: result.formatted_address,
                placeId: result.place_id,
                types: result.types,
                ...this.parseAddressComponents(result.address_components),
            };

        } catch (error) {
            console.error('GmapsGeocodingClient.geocode', error);
            throw new Error('GoogleMaps Geocoding API error');
        }
    }

    async geocodeAddress(address: string): Promise<GeocodingResult> {
        return this.geocode(address);
    }

    async geocodeZipcode(zipcode: string): Promise<GeocodingResult> {
        return this.geocode(zipcode);
    }

    async geocodeByCoordinates(lat: number, lng: number): Promise<GeocodingResult> {
        try {
            const url = `${this.baseUrl}?latlng=${lat},${lng}&key=${this.apiKey}`;

            const response = await fetch(url);
            if (!response.ok) {
                console.error('GmapsGeocodingClient.geocode', response);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const parsedData = await this.parseResponseData(data);
            if (!parsedData || parsedData.length === 0) {
				throw new Error(`No results found for coordinates: ${lat}, ${lng}`);
			}

            const result = parsedData[0];
            const location = result.geometry.location;
            return {
                lat: location.lat,
                lng: location.lng,
                formattedAddress: result.formatted_address,
                placeId: result.place_id,
                types: result.types,
                ...this.parseAddressComponents(result.address_components),
            };

        } catch (error) {
            console.error('GmapsGeocodingClient.geocode', error);
            throw new Error('GoogleMaps Geocoding API error');
        }
    }
}

export const gmapsGeocodingClient = new GmapsGeocodingClient();