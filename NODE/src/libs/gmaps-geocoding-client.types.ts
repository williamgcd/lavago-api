export interface AddressComponent {
	longName: string;
	shortName: string;
	types: string[];
}

export interface GeocodingError {
	code: string;
	message: string;
}

export interface GeocodingResult {
	lat: number;
	lng: number;
	addressComponents: AddressComponent[];
	formattedAddress: string;
	placeId: string;
	types: string[];
	neighborhood?: string;
	city?: string;
	state?: string;
	country?: string;
}