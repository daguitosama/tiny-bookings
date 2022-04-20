// This constans shoul be fullfiled in the data-base, 
// in the precise same order as in the `init-db-values.sql` file
// TODO
// Dprecate the use of the `id` field

import { isValidId, isValidPaymentType } from "./utils";

/**
 * User Roles
 */
// will be dinamyc as is db state dependent
export const USER_ROLES = {
    'FULL_ADMIN': {
        id: 1,
        user_role: 'FULL_ADMIN'
    },
    'BASIC_ADMIN': {
        id: 2,
        user_role: 'BASIC_ADMIN'
    },
    'CLIENT': {
        id: 3,
        user_role: 'CLIENT'
    }
}

export function setUserRoleId(user_role_key, id) {
    if (!isValidId(id)) {
        throw new error(`Non valid id: ${id}`);
    }
    if (!USER_ROLES[user_role_key]) {
        throw new error(`Non valid user_role_key: ${user_role_key}`);
    }

    USER_ROLES[user_role_key].id = id;
}

/**
 * Returns the current id of the local user role
 * constant. Throws if passed a bad `user_role_key`
 * @param {String} user_role_key 
 * @returns {number} 
 */
export function getUserRoleId(user_role_key) {
    if (!USER_ROLES[user_role_key]) {
        throw new error(`Non valid user_role_key: ${user_role_key}`);
    }
    return USER_ROLES[user_role_key].id
}

export const USER_ROLES_LIST = [
    USER_ROLES.FULL_ADMIN,
    USER_ROLES.BASIC_ADMIN,
    USER_ROLES.CLIENT
]

/**
 * Booking States
 */
export const BOOKING_STATES = {
    PAID: {
        key: 'PAID',
        id: null,
    },
    CANCEL: {
        key: 'CANCEL',
        id: null,
    },
    PAYMENT_PENDING: {
        key: 'PAYMENT_PENDING',
        id: null
    }
}
export const BOOKING_STATES_LIST = [
    BOOKING_STATES.PAID.key,
    BOOKING_STATES.CANCEL.key,
    BOOKING_STATES.PAYMENT_PENDING.key,
]

export function setBookingStateId(booking_state, id) {
    if (!isValidId(id)) {
        throw new Error('Non valid id');
    }
    if (!BOOKING_STATES_LIST.includes(booking_state)) {
        throw new Error('Non valid booking_state')
    }

    BOOKING_STATES[booking_state].id = id;
}

export async function getBookingStateId(booking_state) {
    var id = BOOKING_STATES[booking_state].id;

    if (!id) {
        throw new Error('Non valid booking_state')
    }

    return id
}


// ---------------
// Payment Types 
// ---------------

export const PAYMENT_TYPES = {
    CASH: {
        key: 'CASH',
        id: null
    }
}
export const PAYMENT_TYPES_LIST = [PAYMENT_TYPES.CASH.key];
export function setPaymentTypeId(payment_type_key, id) {
    if (!isValidId(id)) {
        throw new Error('Non valid id for payemnt type');
    }
    if (!isValidPaymentType(payment_type_key)) {
        throw new Error('Non valid payment_type_key')
    }

    if (!PAYMENT_TYPES_LIST.includes(payment_type_key)) {
        throw new Error('Non present payment_type_key in payment types')
    }

    PAYMENT_TYPES[payment_type_key].id = id
}

export function getPaymentTypeId(payment_type_key) {
    if (!isValidPaymentType(payment_type_key)) {
        throw new Error('Non valid payment_type_key')
    }

    if (!PAYMENT_TYPES_LIST.includes(payment_type_key)) {
        throw new Error('Non present payment_type_key in payment types')
    }

    return PAYMENT_TYPES[payment_type_key].id;
}