import { eventBus } from "@/libs/event-bus-client";
import { walletService } from "./wallet.service";

eventBus.on('transaction.updated.status.COMPLETED', async (event) => {
    const { userId, type, value } = event;
    await walletService.updateBalance(userId, type, value);
});

eventBus.on('user.created', async (event) => {
    const { id } = event;
    await walletService.create({ userId: id, balance: 0 });
});