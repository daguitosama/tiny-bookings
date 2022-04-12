import { isValidString } from "utils";
import { USER_ROLES } from "~/dao/DBConstans";
import Joi from 'joi';
import moment from 'moment-timezone';
import { DateTime } from 'luxon';
/**
 * Maps a find admin query response data 
 * to a consumable admin user obj
 * 
 * Data obj expected as:
 * ```js
 *  {
 *      id: 1,
 *      user_role: 1,
 *      admin_name: 'dago',
 *      admin_description: 'system creator',
 *      hash_password: '$2a$10$2nZp/EGj.aQY/PyyqGAMze2.a1C4H1knpdNSAO.TX/92katjMo75C',
 *      reset_token: null,
 *      created_at: 2022-03-26T05:02:30.090Z,
 *      user_roles: { id: 1, user_role: 'full-admin' }
 *  }
 * ```
 * 
*/


export function isInAdminRoles(user_role) {
    var isInAdminRoles = false;
    if (!isValidString(user_role)) {
        return isInAdminRoles
    }
    const admin_roles_list = [USER_ROLES.FULL_ADMIN.user_role, USER_ROLES.BASIC_ADMIN.user_role];
    const user_role_index = admin_roles_list.indexOf(user_role);
    if (user_role_index == -1) {
        return isInAdminRoles
    }
    isInAdminRoles = true;
    return isInAdminRoles;

}

export function isFullAdmin(user_role) {
    var isFullAdmin = false;
    if (!isValidString(user_role)) {
        return isInAdminRoles
    }
    isFullAdmin = user_role == USER_ROLES.FULL_ADMIN.user_role;
    return isFullAdmin;

}

// ---------------
// VAlidators 
// ---------------


export function isValidEmail(email) {
    const emailSchema = Joi.string().email().required();
    const { error, value } = emailSchema.validate(
        email,
        { presence: 'required', convert: false }
    );
    return !error;
}

export function isValidUserName(user_name) {
    const userNameSchema = Joi.string().min(4).max(60).required();
    const { error, value } = userNameSchema.validate(
        user_name,
        { presence: 'required', convert: false }
    );
    return !error;
}

export function isValidAdminDescription(admin_description) {
    const adminDescriptionSchema = Joi.string().min(4).max(150).required();
    const { error, value } = adminDescriptionSchema.validate(
        admin_description,
        { presence: 'required', convert: false }
    );
    return !error;
}


/**
 * A valid password is a string
 * From 8 characters to 24
 * @param {string} password 
 * @returns 
 */
export function isValidPassword(password) {
    // a password should have to be at least 8 chars long
    // maximun 18 charactes
    const passwordSchema = Joi.string().min(8).max(24).required();
    const { error, value } = passwordSchema.validate(
        password,
        { presence: 'required', convert: false }
    );
    return !error;
}

export function isValidId(id) {
    const idSchema = Joi.number().integer().min(0).required();
    const { error, value } = idSchema.validate(
        id,
        { presence: 'required', convert: false }
    );
    return !error;
}

export function isValidInteger(number) {
    const intSchema = Joi.number().integer().required();
    const { error, value } = intSchema.validate(
        number,
        { presence: 'required', convert: false }
    );
    return !error;
}

export function isValidPositiveInteger(number) {
    const intSchema = Joi.number().integer().required().min(0);
    const { error, value } = intSchema.validate(
        number,
        { presence: 'required', convert: false }
    );
    return !error;
}

/**
 * A valid Hotel Name is a string
 * From 4 characters to 60
 * @param {string} password 
 * @returns 
 */
export function isValidHotelName(hotelName) {
    // a password should have to be at least 8 chars long
    // maximun 18 charactes
    const hotelNameSchema = Joi.string().trim().min(4).max(60).required();
    const { error, value } = hotelNameSchema.validate(
        hotelName,
        { presence: 'required', convert: false }
    );
    return !error;
}

export function isValidHourTime({ hours = 0, mins = 0 }) {
    // hours from 0 to 23 and min from 0 to 59
    // to avoid date recalculations
    const hourSchema = Joi.number().integer().min(0).max(23).required();
    const minSchema = Joi.number().integer().min(0).max(59).required();

    const { h_error, h_value } = hourSchema.validate(
        hours,
        { presence: 'required', convert: false }
    );
    const { m_error, m_value } = minSchema.validate(
        mins,
        { presence: 'required', convert: false }
    );


    return !h_error && !m_error;
}

export function isValidHourTime2({ hour = 0, minute = 0 }) {
    // hours from 0 to 23 and min from 0 to 59
    // to avoid date recalculations
    const hourSchema = Joi.number().integer().min(0).max(23).required();
    const minSchema = Joi.number().integer().min(0).max(59).required();

    const { h_error, h_value } = hourSchema.validate(
        hour,
        { presence: 'required', convert: false }
    );
    const { m_error, m_value } = minSchema.validate(
        minute,
        { presence: 'required', convert: false }
    );


    return !h_error && !m_error;
}

export function isValidTimeZone(iana_time_zone) {
    var tzSchema = Joi.string().trim().required();
    const { error, value } = tzSchema.validate(
        iana_time_zone,
        { presence: 'required', convert: false }
    );

    return !error;
}



export function isValidRoomType(roomType) {
    var roomSchema = Joi.string().trim().min(4).max(30);
    var { error, value } = roomSchema.validate(
        roomType,
        { presence: 'required', convert: false }
    )
    return !error;
}


export function isValidRoomAmenity(amenity) {
    var amenitySchema = Joi.string().trim().min(1).max(30);
    var { error, value } = amenitySchema.validate(
        amenity,
        { presence: 'required', convert: false }
    )
    return !error;
}


export function isValidRoomName(room_name) {
    var roomNameSchema = Joi.string().trim().min(4).max(20);
    var { error, value } = roomNameSchema.validate(
        room_name,
        { presence: 'required', convert: false }
    )
    return !error;
}

export function areValidAmenities(amenities = []) {
    if (!Array.isArray(amenities)) {
        return false
    }
    if (!amenities.length) {
        return false
    }

    var areValidAmenities = true;

    for (let i = 0; i < amenities.length; i++) {
        if (!isValidRoomAmenity(amenities[i])) {
            areValidAmenities = false;
            break;
        }

    }
    return areValidAmenities;
}

export function areValidAmenitiesIds(ids = []) {
    if (!Array.isArray(ids)) {
        return false
    }
    if (!ids.length) {
        // empty amenities array case
        return true
    }

    var areValidIds = true;

    for (let i = 0; i < ids.length; i++) {
        if (!isValidId(ids[i])) {
            areValidIds = false;
            break;
        }

    }
    return areValidIds;
}

export function isValidPrice(price) {
    const priceSchema = Joi.number().required().min(0.1);
    const { error, value } = priceSchema.validate(
        price,
        { presence: 'required', convert: false }
    );
    return !error;
}

export function isValidUserRoleKey(user_role_key) {
    var userRoleSchema = Joi.string().required().trim().min(3).max(40);
    const { error, value } = userRoleSchema.validate(
        user_role_key,
        { presence: 'required', convert: false }
    );
    return !error;
}

export function isValidRoomLockReason(reason) {
    var reasonSchema = Joi.string().required().trim().min(5).max(300);
    const { error, value } = reasonSchema.validate(
        reason,
        { presence: 'required', convert: false }
    );
    return !error;
}

export function isValidYearMonthDayDate(yearMonthDayDate = { year, month, day }) {
    var yearSchema = Joi.number().integer().min(2000).max(3000);
    var monthSchema = Joi.number().integer().min(0).max(11);
    var daySchema = Joi.number().integer().min(1).max(31);
    var complyAllSchemas;

    const { y_error, y_value } = yearSchema.validate(
        yearMonthDayDate.year,
        { presence: 'required', convert: false }
    );
    const { m_error, m_value } = monthSchema.validate(
        yearMonthDayDate.month,
        { presence: 'required', convert: false }
    );
    const { d_error, d_value } = daySchema.validate(
        yearMonthDayDate.day,
        { presence: 'required', convert: false }
    );
    complyAllSchemas = !y_error && !m_error && !d_error;

    return complyAllSchemas;
}

export function isValidIanaTimeZone(timeZone) {
    var isValidTimeZone;
    if (typeof timeZone != 'string') {
        isValidTimeZone = false
        return isValidTimeZone
    }
    var tz = moment.tz.names();
    isValidTimeZone = tz.includes(timeZone);
    return isValidTimeZone;
}

export function isValidDateObject(date){
    return typeof date?.getMonth == 'function'
}

// ---------------
// Mapers 
// ---------------

/**
 * 
 * Maps a `time` obj to a Default Date with the `hour-time`
 * sets as the time obj
 * @returns 
 */
export function mapTimeToDateTime({ hours, mins }) {
    var now = new Date(Date.UTC(1970, 0, 1, 0, 0, 0));
    now.setUTCHours(hours, mins, 0);
    return now;
}

export function mapYearMonthDayDateToUTC({ year = 1970, month = 0, day = 1 }) {
    var utcDate = new Date(Date.UTC(year, month, day, 0, 0, 0));
    return utcDate;
}

export function setUTCHourTime({ date, hour, minute }) {
    date.setUTCHours(hour, minute, 0, 0);
    return date;
}

export function utcDate({
    year = 0,
    month = 0,
    day = 0,
    hour = 0,
    minute = 0,
}) {
    return new Date(Date.UTC(
        year, month, day, hour, minute
    ));
}

export function getCurrentUTCDayDate() {
    var dt = DateTime.now();
    var dayDate = utcDate({
        year: dt.year,
        month: dt.month,
        day: dt.day
    })

    return dayDate;
}

/**
 * Extracs the hour and minute from a 
 * Date obj and return it as `{ hour, minute}`
 * @param {Date} date 
 * @returns 
 */
export function mapDateToHourTime(date) {

    if (typeof date.getUTCHours != 'function') {
        throw Error('Non Valid date object');
    }

    var hour = date.getUTCHours();
    var minute = date.getUTCMinutes();

    return { hour, minute }
}