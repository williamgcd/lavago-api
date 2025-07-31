import { formatterUtils } from './formatters';

/**
 * Validators
 * Throws an error if the validation fails
 */
export const validatorUtils = {
    /**
     * Validates a CPF
     * @param cpf - The CPF to validate
     * @returns The formatted CPF
     */
    validateCpf: (cpf: string) => {
        const formattedCpf = formatterUtils.formatCpf(cpf);
        if (formattedCpf.length !== 11) {
            throw new Error('Invalid CPF');
        }
        return formattedCpf;
    },

    validateEmail: (email: string) => {
        const formattedEmail = email.trim().toLowerCase();
        if (!formattedEmail.includes('@')) {
            throw new Error('Invalid email');
        }
        return formattedEmail;
    },

    /**
     * Validates a phone number
     * @param phone - The phone number to validate
     * @returns The formatted phone number
     */
    validatePhone: (phone: string) => {
        const formattedPhone = formatterUtils.formatPhone(phone);
        if (formattedPhone.length < 11) {
            throw new Error('Invalid phone number');
        }
        if (!formattedPhone.startsWith('+55')) {
            throw new Error('Invalid phone number');
        }
        return formattedPhone;
    },

    /**
     * Validates a zip code
     * @param zip - The zip code to validate
     * @returns The formatted zip code
     */
    validateZip: (zip: string) => {
        const formattedZip = formatterUtils.formatZip(zip);
        if (formattedZip.length !== 8) {
            throw new Error('Invalid zip code');
        }
        return formattedZip;
    },
};