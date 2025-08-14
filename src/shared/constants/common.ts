export const OFFERING = {
    DURATION_VARIATION: 40,
} as const;

export const PAGINATION = {
    LIMIT: 24,
    LIMIT_MAX: 200,
} as const;

export const PROPERTY = {
    DEFAULT_HOURS: {
        mon: { ini: '08:00', end: '18:00' },
        tue: { ini: '08:00', end: '18:00' },
        wed: { ini: '08:00', end: '18:00' },
        thu: { ini: '08:00', end: '18:00' },
        fri: { ini: '08:00', end: '18:00' },
        sat: { ini: '08:00', end: '12:00' },
    },
} as const;

export const SCHEDULE = {
    DEFAULT_HOURS: [
        { ini: '08:30', end: '10:00' },
        { ini: '10:30', end: '12:00' },
        { ini: '13:00', end: '14:30' },
        { ini: '15:00', end: '16:30' },
    ],
    SLOT_DURATION: 30,
} as const;

export const WASHER = {
    DEFAULT_HOURS: {
        mon: { ini: '08:30', end: '18:00' },
        tue: { ini: '08:30', end: '18:00' },
        wed: { ini: '08:30', end: '18:00' },
        thu: { ini: '08:30', end: '18:00' },
        fri: { ini: '08:30', end: '18:00' },
        sat: { ini: '08:30', end: '12:00' },
    },
} as const;
