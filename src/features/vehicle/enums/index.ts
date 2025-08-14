export const ENUMS = {
    SIZE: [
        'xs', // XS -> Extra small vehicles like motorcycles, scooters, and bicycles
        'sm', // SM -> Small vehicles like cars, trucks, and vans
        'md', // MD -> Medium vehicles like SUVs, minivans, and pickup trucks
        'lg', // LG -> Large vehicles like trucks, buses, and trailers
        'xl', // XL -> Extra large vehicles like semi-trailers and tankers
    ],
    TYPE: ['unknown'],
} as const;

export { ENUMS as VEHICLE_ENUMS };
