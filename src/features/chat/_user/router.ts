import { Router } from 'express';
import { chatUserController } from './controller';

const router = Router();

// Inherits a url chunk from chatRoutes
// url: /chat/:chat_id/users

router
    .route('/:user_id')
    .delete(chatUserController.delete)
    .get(chatUserController.getUserById)
    .post(chatUserController.create)
    .post(chatUserController.upsert);

router
    .route('/')
    .delete(chatUserController.delete)
    .get(chatUserController.list)
    .post(chatUserController.create)
    .post(chatUserController.upsert);

export { router as chatUserRouter };
