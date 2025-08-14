import { throwRecordMissing } from '@/errors';
import { chatRepository } from '../repository';
import { TChatDto } from '../types';
import * as t from './types';

const repo = {
    create: async (
        chat_id: t.TChatUserDto['chat_id'],
        user_id: t.TChatUserDto['user_id']
    ): Promise<string[]> => {
        const user_ids = await repo.getUserIds(chat_id);
        // Check if the user already exists
        if (user_ids.includes(user_id)) {
            return user_ids;
        }
        // Check if the user limit is reached
        if (user_ids.length >= 10) {
            throw new Error('Chat has reached its user limit');
        }

        try {
            user_ids.push(user_id);
            const record = await chatRepository.update(chat_id, { user_ids });
            return record.user_ids;
        } catch (err) {
            console.error('chat.user.repo.create', err);
            throw err;
        }
    },

    delete: async (
        chat_id: t.TChatUserDto['chat_id'],
        user_id: t.TChatUserDto['user_id']
    ): Promise<string[]> => {
        const user_ids = await repo.getUserIds(chat_id);
        // Check if the user already exists
        if (!user_ids.includes(user_id)) {
            throwRecordMissing('Chat User');
        }
        try {
            user_ids.splice(user_ids.indexOf(user_id), 1);
            await chatRepository.update(chat_id, { user_ids });
            return user_ids;
        } catch (err) {
            console.error('chat.user.repo.delete', err);
            throw err;
        }
    },

    getUserById: async (
        chat_id: t.TChatUserDto['chat_id'],
        user_id: t.TChatUserDto['user_id']
    ) => {
        const user_ids = await repo.getUserIds(chat_id);
        // Check if user exists on the array
        if (!user_ids.includes(user_id)) {
            throwRecordMissing('Chat User');
        }
        return user_id;
    },

    getUserIds: async (chat_id: t.TChatUserDto['chat_id']) => {
        const chat = await chatRepository.getById(chat_id);
        return chat.user_ids ?? [];
    },
};

export { repo, repo as chatUserRepository };
