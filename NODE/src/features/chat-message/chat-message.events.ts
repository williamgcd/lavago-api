import { TChatMessage } from "./chat-message.schema";

export type TChatMessageEvents = {
    'chat-message.created': TChatMessage;
    'chat-message.updated': {
        prev: TChatMessage;
        next: TChatMessage;
    };
    'chat-message.deleted': {
        id: string;
        chatId: string;
        type: string;
        actor: string;
    };
};
