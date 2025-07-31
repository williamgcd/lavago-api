import { eventBus } from "@/libs/event-bus-client";
import { userService } from "./user.service";

eventBus.on('auth.login', async (event) => {
    const { userId } = event;
    await userService.updateById(userId, { phoneVerifiedAt: new Date() });
});