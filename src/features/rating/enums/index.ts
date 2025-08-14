import { METRIC } from './rating-metric';
import { PATTERN } from './rating-pattern';

export const ENUMS = {
    METRIC,
    PATTERN,
    SCALE: ['0-10', '1-5', '1-10'],
} as const;

export { ENUMS as RATING_ENUMS };
