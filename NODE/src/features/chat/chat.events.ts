import { TChat } from "./chat.schema";

export type TChatEvents = {
    'chat.created': TChat;
    'chat.updated': {
        prev: TChat;
        next: TChat;
    };
    'chat.deleted': {
        id: string;
        object: string;
        objectId: string;
    };
};
