import { Router } from "express";

import { chatMessageRoutes } from "../chat-message";
import { chatUserRoutes } from "../chat-user";

import { chatController } from "./chat.controller";

const router = Router();

router.use('/:chatId/messages', chatMessageRoutes);
router.use('/:chatId/users', chatUserRoutes);

router.delete('/:chatId', chatController.deleteById);

router.get('/object/:object/:objectId', chatController.getByObjectAndObjectId);
router.get('/:chatId', chatController.getById);
router.get('/', chatController.find);

router.post('/', chatController.create);

router.put('/:chatId', chatController.updateById);

export { router as chatRoutes };
export default router;
