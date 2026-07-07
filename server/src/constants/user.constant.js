export const USER_ROLES = Object.freeze({
    USER: "user",
    ADMIN: "admin",
});

export const USER_STATUS = Object.freeze({
    ACTIVE: "active",
    INACTIVE: "inactive",
    SUSPENDED: "suspended",
});

export const ADDRESS_TYPES = Object.freeze({
    HOME: "home",
    WORK: "work",
    OTHER: "other",
});

export const PASSWORD_MIN_LENGTH = 8;

export const BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;