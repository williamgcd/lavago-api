import { normalizer } from './normalizer';

export const validator = {
    /**
     * Validate a CNPJ number
     * @param cnpj - The CNPJ number to validate
     * @returns The normalized CNPJ number
     */
    cnpj: (cnpj: string) => {
        // TODO: Validate CNPJ against calculation
        const value = normalizer.cnpj(cnpj);
        const regex = /^\d{14}$/;
        if (!regex.test(value)) {
            throw new Error('Invalid cnpj');
        }
        return value;
    },

    /**
     * Validate a CPF number
     * @param cpf - The CPF number to validate
     * @returns The normalized CPF number
     */
    cpf: (cpf: string) => {
        // TODO: Validate CPF against calculation
        const value = normalizer.cpf(cpf);
        const regex = /^\d{11}$/;
        if (!regex.test(value)) {
            throw new Error('Invalid cpf');
        }
        return value;
    },

    /**
     * Validate a document number
     * @param document - The document number to validate
     * @returns The normalized document number
     */
    document: (document: string, documentType: 'cpf' | 'cnpj') => {
        const options = {
            cnpj: validator.cnpj,
            cpf: validator.cpf,
        };
        return options[documentType](document);
    },

    /**
     * Validate an email
     * @param email - The email to validate
     * @returns The normalized email
     */
    email: (email: string): string => {
        const value = normalizer.email(email);
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(value)) {
            throw new Error('Invalid email');
        }
        return value;
    },

    /**
     * Validate a role
     * @param role - The role to validate
     * @returns True if the role is valid, false otherwise
     */
    isAdmin: (role: string) => {
        return ['admin', 'super'].includes(role);
    },

    /**
     * Validate a phone number
     * @param phone - The phone number to validate
     * @returns The normalized phone number
     */
    phone: (phone: string): string => {
        const value = normalizer.phone(phone);
        const regex = /^\d{10,11}$/;
        if (!regex.test(value)) {
            throw new Error('Invalid phone');
        }
        return value;
    },

    /**
     * Validate a zip code
     * @param zipCode - The zip code to validate
     * @returns The normalized zip code
     */
    zipCode: (zipCode: string) => {
        const value = normalizer.zipCode(zipCode);
        const regex = /^\d{8}$/;
        if (!regex.test(value)) {
            throw new Error('Invalid zipCode');
        }
        return value;
    },
};
