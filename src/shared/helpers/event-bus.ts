export type TEventHandler<T = any> = (data: T) => Promise<void>;

export class EventBus {
    private handlers: Map<string, TEventHandler[]> = new Map();

    private handleEvent(event: string, handler: TEventHandler, data: any) {
        try {
            console.log(`eventBus.emit`, event, data);
            return handler(data);
        } catch (err) {
            console.error(`eventBus.emit`, err);
            throw err;
        }
    }

    async count(event: string): Promise<number> {
        const handlers = this.handlers.get(event);
        return handlers ? handlers.length : 0;
    }

    async emit(event: string, data: any): Promise<void> {
        const handlers = this.handlers.get(event);
        if (!handlers) {
            return;
        }
        const count = await this.count(event);
        console.log(`eventBus.emit`, event, `Triggering ${count} handlers`);
        await Promise.all(
            handlers.map(handler => this.handleEvent(event, handler, data))
        );
    }

    off(event: string, handler: TEventHandler): void {
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

    on<T = any>(event: string, handler: TEventHandler<T>): void {
        if (!this.handlers.has(event)) {
            this.handlers.set(event, []);
        }
        this.handlers.get(event)?.push(handler);
    }
}

export const eventBus = new EventBus();
export const emitter = eventBus.emit;
