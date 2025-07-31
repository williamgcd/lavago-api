export const formatterUtils = {
    /**
     * Formats a CPF to a standard format
     * @param cpf - The CPF to format
     * @returns The formatted CPF
     */
    formatCpf: (cpf: string) => {
        // Remove any non-numeric characters
        return cpf.replace(/\D/g, '');
    },

    /**
     * Formats a phone number to a standard format
     * @param phone - The phone number to format
     * @returns The formatted phone number
     */
    formatPhone: (phone: string) => {
        // Remove any non-numeric characters
        const numericPhone = phone.replace(/\D/g, '');
        // Add country code if not present
        if (!numericPhone.startsWith('55')) {
            return `+55${numericPhone}`;
        }
        return numericPhone;
    },

    /**
     * Formats a zip code to a standard format
     * @param zip - The zip code to format
     * @returns The formatted zip code
     */
    formatZip: (zip: string) => {
        // Remove any non-numeric characters
        return zip.replace(/\D/g, '');
    },
};