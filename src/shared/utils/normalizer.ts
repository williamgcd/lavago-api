export const normalizer = {
    /**
     * Normalize a CNPJ number
     * We will remove all non-numeric characters
     * @param cnpj - The CNPJ number to normalize
     * @returns The normalized CNPJ number
     */
    cnpj: (cnpj: string) => cnpj.replace(/\D/g, ''),

    /**
     * Normalize a CPF number
     * We will remove all non-numeric characters
     * @param cpf - The CPF number to normalize
     * @returns The normalized CPF number
     */
    cpf: (cpf: string) => cpf.replace(/\D/g, ''),

    /**
     * Normalize a document number
     * We will remove all non-numeric characters
     * @param document - The document number to normalize
     * @returns The normalized document number
     */
    document: (document: string) => document.replace(/\D/g, ''),

    /**
     * Normalize an email
     * We will convert the email to lowercase
     * @param email - The email to normalize
     * @returns The normalized email
     */
    email: (email: string) => email.toLowerCase(),

    /**
     * Normalize a phone number
     * We will remove all non-numeric characters
     * @param phone - The phone number to normalize
     * @returns The normalized phone number
     */
    phone: (phone: string) => phone.replace(/\D/g, ''),

    /**
     * Convert a phone number to an object
     * @param phone - The phone number to convert
     * @param type - The type of phone number
     * @returns The normalized phone number
     */
    phoneToObj: (phone?: string | null, type: string = 'MOBILE') => {
        if (!phone) {
            return undefined;
        }
        const value = normalizer.phone(phone);
        if (value.length !== 11) {
           return undefined;
        }
        return {
            area: value.slice(0, 2),
            country: 55,
            number: value.slice(2),
            type,
        };
    },

    /**
     * Convert a UUID to a string
     * We will remove all non-numeric characters
     * @param uuid - The UUID to convert
     * @returns The string representation of the UUID
     */
    uuidToStr: (uuid: string) => uuid.replace(/-/g, ''),

    /**
     * Normalize a zip code
     * We will remove all non-numeric characters
     * @param zipCode - The zip code to normalize
     * @returns The normalized zip code
     */
    zipCode: (zipCode: string) => zipCode.replace(/\D/g, ''),
};
