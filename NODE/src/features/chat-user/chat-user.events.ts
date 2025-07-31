import { TChatUser } from "./chat-user.schema";

export type TChatUserEvents = {
    'chat-user.created': TChatUser;
    'chat-user.updated': {
        prev: TChatUser;
        next: TChatUser;
    };
    'chat-user.deleted': {
        id: string;
        chatId: string;
        userId: string;
    };
};
