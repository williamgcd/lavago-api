import { Router } from 'express';

import { chatMessageRouter } from './_message/router';
import { chatUserRouter } from './_user/router';

import { chatController } from './controller';

const router = Router();

router.get('/entity/:entity/:entity_id', chatController.getByEntityId);
router.get('/entity/:entity', chatController.listByEntity);
router.get('/user/:user_id', chatController.listByUserId);

router.use('/:chat_id/messages', chatMessageRouter);
router.use('/:chat_id/users', chatUserRouter);

router
    .route('/:chat_id')
    .delete(chatController.delete)
    .get(chatController.getById)
    .patch(chatController.update)
    .put(chatController.update);

router
    .route('/')
    .get(chatController.list)
    .post(chatController.create)
    .put(chatController.upsert);

export { router as chatRouter };
