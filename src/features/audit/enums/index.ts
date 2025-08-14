import { USER_ENUMS } from '@/features/user/enums';

export const ENUMS = {
    ROLE: [...USER_ENUMS.ROLE, 'system'],
} as const;
