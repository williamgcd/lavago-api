export type EventHandler<T = any> = (data: T) => Promise<void>;

export class EventBusClient {
    private handlers: Map<string, EventHandler[]> = new Map();

    async clear(): Promise<void> {
        this.handlers.clear();
    }

    async count(event?: string): Promise<number> {
        if (event) {
            return this.handlers.get(event)?.length ?? 0;
        }
        return this.handlers.size;
    }
    
    async emit<T = any>(event: string, data: T): Promise<void> {
        const handlers = this.handlers.get(event);
        if (!handlers) {
            return;
        }
        await Promise.all(handlers.map(handler => {
            try {
                console.log(`EventBusClient.emit.${event}`, data);
                return handler(data);
            } catch (error) {
                console.error(`Error handling event ${event}:`, error);
            }
        }));
    }

    off<T = any>(event: string, handler: EventHandler<T>): void {
        const handlers = this.handlers.get(event);
        if (!handlers) {
            return;
        }
        const index = handlers.indexOf(handler);
        if (index !== -1) {
            handlers.splice(index, 1);
        }

        if (handlers.length === 0) {
            this.handlers.delete(event);
        }
    }

    on<T = any>(event: string, handler: EventHandler<T>): void {
        if (!this.handlers.has(event)) {
            this.handlers.set(event, []);
        }
        this.handlers.get(event)?.push(handler);
    }
}

export const eventBus = new EventBusClient();
export const eventBusClient = eventBus;