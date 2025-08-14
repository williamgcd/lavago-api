import { emitter } from '@/shared/helpers/event-bus';

import { userService } from '@/features/user/service';

import * as t from './types';
import { repo } from './repository';

const serv = {
    /**
     * Create a chat user record
     * @param values - The chat user values to create
     * @returns The created chat user record
     */
    create: async (
        chat_id: t.TChatUserDtoCreate['chat_id'],
        user_id: t.TChatUserDtoCreate['user_id']
    ) => {
        await repo.create(chat_id, user_id);
        emitter('chat.user.created', { chat_id, user_id });
        return serv.getUserById(chat_id, user_id);
    },

    /**
     * Delete a chat user record
     * @param id - The id of the chat user record to delete
     * @returns void
     */
    delete: async (
        chat_id: t.TChatUserDto['chat_id'],
        user_id: t.TChatUserDto['user_id']
    ) => {
        await repo.delete(chat_id, user_id);
        emitter('chat.user.deleted', { chat_id, user_id });
    },

    /**
     * Get a chat user record by id
     * @param id - The id of the chat user record to get
     * @returns The chat user record
     */
    getUserById: async (
        chat_id: t.TChatUserDto['chat_id'],
        user_id: t.TChatUserDto['user_id']
    ) => {
        const record = await repo.getUserById(chat_id, user_id);
        return await userService.getById(record);
    },

    list: async (chat_id: string) => {
        const user_ids = await repo.getUserIds(chat_id);
        // No users? Return an empty array.
        if (!user_ids.length) {
            return [];
        }
        // Get the user infomation from the users;
        const { data } = await userService.listByUserIds(user_ids);
        return data;
    },

    upsert: async (chat_id: string, user_id: string) => {
        return serv.create(chat_id, user_id);
    },
};

export { serv, serv as chatUserService };
export default serv;
