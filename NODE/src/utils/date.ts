export const dateUtils = {
    getDate: () => {
        // Return the current date in the UTC timezone
        return new Date().toUTCString();
    },

    /**
     * Convert E.g. "2025-08-01" to a Date object
     * @param isoString - The ISO string to convert
     * @returns The Date object
     */
    getDateFromParam: (isoString: string, startOfDay: boolean = true) => {
        const date = new Date(isoString);
        // Check if the date has a set time
        if (date.getTime() !== 0) {
            return date;
        }
        // If not, set it to the start/end of the day
        if (startOfDay) {
            date.setHours(0, 0, 0, 0);
        } else {
            date.setHours(23, 59, 59, 999);
        }
        return date;
    },

    /**
     * Convert E.g. "2025-08-01T00:00:00.000Z" to a Date object
     * @param isoString - The ISO string to convert
     * @returns The Date object
     */
    getDatetimeFromParam: (isoString: string) => {
        return new Date(isoString);
    },
}