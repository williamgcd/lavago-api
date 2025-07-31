import jwt, { SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.API_JWT_SECRET!;
const JWT_LENGTH = process.env.API_JWT_LENGTH || '1h';

export type TToken = {
    phone: string;
    userId: string;
	iat?: number;
	exp?: number;
}

export class TokenClient {
    decode(token: string): TToken | string | null {
        try {
            return jwt.verify(token, JWT_SECRET) as TToken;
        } catch (error) {
            console.error('TokenClient.decode', error);
            return null;
        }
    }

    generateToken(userId: string, phone: string): string {
        return this.sign({ userId, phone });
    }

    sign(payload: Omit<TToken, 'iat' | 'exp'>, options: SignOptions = {}): string {
        options.expiresIn = options.expiresIn || JWT_LENGTH as any;
        return jwt.sign(payload, JWT_SECRET, options);
    }

    verify(token: string): TToken | null {
        return jwt.verify(token, JWT_SECRET) as TToken;
    }
}

export const tokenClient = new TokenClient();