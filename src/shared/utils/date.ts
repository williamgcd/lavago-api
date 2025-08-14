export const date = {
    /**
     * Checks if a date has expired
     * @param date - The date to check
     * @returns True if the date has expired, false otherwise
     */
    hasExpired: (date: Date) => date < new Date(),

    /**
     * Checks if a date has passed
     * @param date - The date to check
     * @returns True if the date has passed, false otherwise
     */
    hasPassed: (date: Date) => date < new Date(),

    /**
     * Returns a date in the future
     * @param metric - The metric to use
     * @param value - The value to use
     * @returns The date in the future
     */
    inTheFuture: (metric: string = 'months', value: number = 1) => {
        const ops = {
            months: 1000 * 60 * 60 * 24 * 30,
            weeks: 1000 * 60 * 60 * 24 * 7,
            days: 1000 * 60 * 60 * 24,
            hours: 1000 * 60 * 60,
            minutes: 1000 * 60,
            seconds: 1000,
        };
        return new Date(Date.now() + ops[metric] * value);
    },

    /**
     * Returns a date in the past
     * @param metric - The metric to use
     * @param value - The value to use
     * @returns The date in the past
     */
    inThePast: (metric: string = 'months', value: number = 1) => {
        const ops = {
            months: 1000 * 60 * 60 * 24 * 30,
            weeks: 1000 * 60 * 60 * 24 * 7,
            days: 1000 * 60 * 60 * 24,
            hours: 1000 * 60 * 60,
            minutes: 1000 * 60,
            seconds: 1000,
        };
        return new Date(Date.now() - ops[metric] * value);
    },
};
