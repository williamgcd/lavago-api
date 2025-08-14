import { Router } from 'express';
import { chatMessageController } from './controller';

const router = Router();

// Inherits a url chunk from chatRoutes
// url: /chat/:chat_id/messages

router
    .route('/:message_id')
    .delete(chatMessageController.delete)
    .get(chatMessageController.getById)
    .patch(chatMessageController.update)
    .put(chatMessageController.update);

router
    .route('/')
    .get(chatMessageController.listByChatId)
    .post(chatMessageController.create)
    .put(chatMessageController.upsert);

export { router as chatMessageRouter };
