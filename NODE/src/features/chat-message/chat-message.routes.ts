import { Router } from "express";
import { chatMessageController } from "./chat-message.controller";

const router = Router();

// Inherits a url chunk from chatRoutes
// url: /chats/:chatId/messages

router.delete('/:chatMessageId', chatMessageController.deleteById);

router.get('/:chatMessageId', chatMessageController.getById);
router.get('/', chatMessageController.findByChatId);

router.post('/', chatMessageController.create);

router.put('/:chatMessageId', chatMessageController.updateById);

export { router as chatMessageRoutes };
export default router;
