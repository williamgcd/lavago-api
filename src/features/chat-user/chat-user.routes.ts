import { Router } from "express";
import { chatUserController } from "./chat-user.controller";

const router = Router();

// Inherits a url chunk from propertyRoutes
// url: /chats/:chatId/users

router.delete('/:chatUserId', chatUserController.deleteById);

router.get('/user/:userId', chatUserController.getByChatIdAndUserId);
router.get('/:chatUserId', chatUserController.getById);
router.get('/', chatUserController.findByChatId);

router.post('/', chatUserController.create);

router.put('/:chatUserId', chatUserController.updateById);

export { router as chatUserRoutes };
export default router;
