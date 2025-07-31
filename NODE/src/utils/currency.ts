export const currencyUtils = {
    /**
     * Convert a value from cents to decimal
     */
    centsToPrice: (value: number): number => {
        return value / 100;
    },

    /**
     * Convert a value from decimal to cents
     */
    priceToCents: (value: number): number => {
        return value * 100;
    },
}; 