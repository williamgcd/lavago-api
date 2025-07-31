import { TSubscription } from "./subscription.schema";

export type TSubscriptionEvents = {
    'subscription.created': TSubscription;
    'subscription.updated': { prev: TSubscription, next: TSubscription };
    'subscription.deleted': { id: string };
};
