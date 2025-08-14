import { CONFIG } from '@/config';
import axios, { AxiosInstance } from 'axios';

class PagBankClient {
    private client: AxiosInstance;

    constructor(config: typeof CONFIG.PAGBANK) {
        if (!config.key) {
            throw new Error('Missing PAGBANK_API_KEY');
        }

        this.client = axios.create({
            baseURL: config.url,
            timeout: config.timeout,
            headers: {
                Authorization: `Bearer ${config.key}`,
                'Content-Type': 'application/json',
            },
        });

        this.client.interceptors.request.use(
            req => {
                console.log('PagBankClient', 'req', req);
                return req;
            },
            err => {
                console.log('PagBankClient', 'req.err', err);
                return Promise.reject(err);
            }
        );
        this.client.interceptors.response.use(
            res => {
                console.log('PagBankClient', 'res', res);
                return res;
            },
            err => {
                console.log('PagBankClient', 'res.err', err);
                return Promise.reject(err);
            }
        );
    }

    async checkoutCreate(data: any, key: string) {
        try {
            const res = await this.client.post('/checkouts', data, {
                headers: { 'x-idempotency-key': key },
            });
            return res.data;
        } catch (err) {
            console.log('PagBankClient.createCheckout', err);
            throw err;
        }
    }

    async checkoutGetById(checkout_id: string) {
        try {
            const url = `/checkouts/${checkout_id}`;
            const res = await this.client.get(url);
            return res.data;
        } catch (err) {
            console.log('PagBankClient.checkoutGetById', err);
            throw err;
        }
    }

    async checkoutUpdate(
        checkout_id: string,
        action: 'activate' | 'inativate' = 'activate'
    ) {
        try {
            const url = `/checkouts/${checkout_id}/${action}`;
            const res = await this.client.post(url);
            return res.data;
        } catch (err) {
            console.log('PagBankClient.checkoutUpdate', err);
            throw err;
        }
    }
}

const pagbankClient = new PagBankClient(CONFIG.PAGBANK);
export { pagbankClient };
