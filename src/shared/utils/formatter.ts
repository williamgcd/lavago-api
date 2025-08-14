import { normalizer } from './normalizer';

export const formatter = {
    /**
     * Format a CNPJ number
     * @param cnpj - The CNPJ number to format
     * @returns The formatted CNPJ number
     */
    cnpj: (cnpj: string) => {
        const value = normalizer.cnpj(cnpj);
        return value.replace(
            /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
            '$1.$2.$3/$4-$5'
        );
    },

    /**
     * Format a CPF number
     * @param cpf - The CPF number to format
     * @returns The formatted CPF number
     */
    cpf: (cpf: string) => {
        const value = normalizer.cpf(cpf);
        return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    },

    /**
     * Format a document number
     * @param document - The document number to format
     * @returns The formatted document number
     */
    document: (document: any) => {
        if (!document || typeof document !== 'string') {
            return '';
        }
        if (document.length === 11) {
            return formatter.cpf(document);
        } else if (document.length === 14) {
            return formatter.cnpj(document);
        }
        return document;
    },

    /**
     * Format a phone number
     * @param phone - The phone number to format
     * @returns The formatted phone number
     */
    phone: (phone: any) => {
        if (!phone || typeof phone !== 'string') {
            return '';
        }
        const value = normalizer.phone(phone);
        return value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    },

    /**
     * Format a zip code
     * @param zipCode - The zip code to format
     * @returns The formatted zip code
     */
    zipCode: (zipCode: string) => {
        const value = normalizer.zipCode(zipCode);
        return value.replace(/(\d{5})(\d{3})/, '$1-$2');
    },
};
