import { prisma } from 'dao/PrismaClient.js';
import { DB_UNIQUE_CONSTRAINT_ERROR, FORGEIN_KEY_ERROR, NOT_FOUND_RECORD_ERROR } from './Errors';
import { isValidId, isValidInteger, isValidRoomAmenity, isValidRoomType, isValidRoomName, mapCreateRoomResToRoom } from './utils';





// ---------------
// Room Types 
// ---------------



/**
 * Create a room Type
 * Returns the created Room Type
 * Throws:
 *   dbErrors, 
 *   Unique Constrain error
 *   Non Valid Input error
 * @param {String} type
 */
export async function createRoomType(room_type) {

    // validate
    if (!isValidRoomType(room_type)) {
        throw new Error('Non Valid [roomType] argument')
    }

    try {

        const RoomType = await prisma.room_types.create({
            data: {
                room_type
            }
        })
        return RoomType;

    } catch (error) {
        if (error?.code == 'P2002') {
            throw new DB_UNIQUE_CONSTRAINT_ERROR('Unable to create [roomType] as unique constrain fails')
        }
        throw error
    }

}


/**
 * Deletes a roomType user from db
 * filtered by his roomType Key
 * @param {String} adminName 
 */
export async function deleteRoomTypeByType(room_type) {
    // validate
    if (!isValidRoomType(room_type)) {
        throw new Error('Non Valid [roomType] argument: ' + room_type)
    }


    try {

        var delRes = await prisma.room_types.delete({
            where: {
                room_type
            },
        })

        return delRes;

    } catch (error) {
        // case prisma record not found
        if (error.code == 'P2025') {
            var customError = new NOT_FOUND_RECORD_ERROR('[room_type] not found');
            throw customError;
        }
        throw error;
    }
}


/**
 * Retrives a room type  from db 
 * based in is `room_type` 
 * 
 * Throws dbErrors, Not Found errors
 * 
 * 
 * @param {String} room_type 
 */
export async function getRoomTypeByTpe(room_type) {
    // validate
    if (!isValidRoomType(room_type)) {
        throw new Error('Non Valid [roomType] argument')
    }

    try {
        // query for user with user_role
        var roomType = await prisma.room_types.findUnique({
            where: {
                room_type
            }
        })

        // handle not found case
        if (!roomType) {
            throw new NOT_FOUND_RECORD_ERROR('No roomType Found');
        }

        return roomType;
    }
    catch (error) {
        throw error
    }
}


/**
 * Returns all the room types
 * @returns {Promise<[RoomType]>} 
 */
export async function getRoomTypes() {

    try {
        var roomTypes = await prisma.room_types.findMany();
        return roomTypes;
    } catch (error) {
        throw error;
    }

}

export async function updateRoomType(room_type, new_room_type) {
    // validate
    if (!isValidRoomType(room_type)) {
        throw new Error('Non Valid [room_type] argument')
    }
    if (!isValidRoomType(new_room_type)) {
        throw new Error('Non Valid [room_type] argument')
    }

    try {
        // query for user with user_role
        var roomType = await prisma.room_types.update({
            where: {
                room_type
            },
            data: {
                room_type: new_room_type
            }
        })

        // handle not found case
        if (!roomType) {
            throw new NOT_FOUND_RECORD_ERROR('No [room_type] Found');
        }

        return roomType;
    }
    catch (error) {
        throw error
    }
}





// ---------------
// Room Amenities 
// ---------------



export async function createRoomAmenity(amenity) {
    // validate
    if (!isValidRoomAmenity(amenity)) {
        throw new Error('Non Valid [amenity] argument')
    }

    try {

        const RoomAmenity = await prisma.room_amenity.create({
            data: {
                amenity
            }
        })
        return RoomAmenity;

    } catch (error) {
        if (error?.code == 'P2002') {
            throw new DB_UNIQUE_CONSTRAINT_ERROR('Unable to create [room_amenity] as unique constrain fails')
        }
        throw error
    }
}


/**
 * Retrives a room_amenity  from db 
 * based in is `amenity` 
 * 
 * Throws dbErrors, Not Found errors
 * 
 * 
 * @param {String} amenity 
 */
export async function getRoomAmenity(amenity) {
    // validate
    if (!isValidRoomAmenity(amenity)) {
        throw new Error('Non Valid [amenity] argument')
    }

    try {
        // query for user with user_role
        var roomAmenity = await prisma.room_amenity.findUnique({
            where: {
                amenity
            }
        })

        // handle not found case
        if (!roomAmenity) {
            throw new NOT_FOUND_RECORD_ERROR('No [room_amenity] Found');
        }

        return roomAmenity;
    }
    catch (error) {
        throw error
    }
}

/**
 * Returns all the room types
 * @returns {Promise<[RoomAmenity]>} 
 */
export async function getRoomAmenities() {

    try {
        var amenities = await prisma.room_amenity.findMany();
        return amenities;
    } catch (error) {
        throw error;
    }

}


export async function updateRoomAmenity(amenity, new_amenity) {
    // validate
    if (!isValidRoomAmenity(amenity)) {
        throw new Error('Non Valid [amenity] argument')
    }
    if (!isValidRoomAmenity(new_amenity)) {
        throw new Error('Non Valid [amenity] argument')
    }

    try {
        // query for user with user_role
        var roomAmenity = await prisma.room_amenity.update({
            where: {
                amenity
            },
            data: {
                amenity: new_amenity
            }
        })

        // handle not found case
        if (!roomAmenity) {
            throw new NOT_FOUND_RECORD_ERROR('No [amenity] Found');
        }

        return roomAmenity;
    }
    catch (error) {
        throw error
    }
}


/**
 * Deletes a room_amenity
 * by his `amenity`
 * @param {String} amenity 
 */
export async function deleteRoomAmenity(amenity) {
    // validate
    if (!isValidRoomAmenity(amenity)) {
        throw new Error('Non Valid [amenity] argument')
    }


    try {

        var delRes = await prisma.room_amenity.delete({
            where: {
                amenity
            },
        })

        return delRes;

    } catch (error) {
        // case prisma record not found
        if (error.code == 'P2025') {
            var customError = new NOT_FOUND_RECORD_ERROR('[amenity] not found');
            throw customError;
        }
        
        if(error.code == 'P2003'){
            var customError = new FORGEIN_KEY_ERROR('Forgein Key Error');
            throw customError;
        }
        throw error;
    }
}

// ---------------
// Room Pictures 
// ---------------
// pending till rom completion since it's depending on those

// ---------------
// Rooms 
// ---------------
// ON THIS + [ add room amenities ]
export async function createRoom({
    hotel_id,       // Int reference to a Hotel id
    room_type,      // Int reference to RoomType id
    room_name,      // String
    night_price,    // Int
    capacity,       // Int
    number_of_beds, // Int
}) {

    // validation
    if (!isValidId(hotel_id)) {
        throw new Error('Non Valid Id')
    }
    if (!isValidId(room_type)) {
        throw new Error('Non Valid Id')
    }
    if (!isValidRoomName(room_name)) {
        throw new Error('Non Valid Room Name: ' + room_name)
    }
    if (!isValidInteger(night_price)) {
        throw new Error('Non Valid Night Price')
    }
    if (!isValidInteger(capacity)) {
        throw new Error('Non Valid Capacity')
    }
    if (!isValidInteger(number_of_beds)) {
        throw new Error('Non Valid Number Of Beds')
    }

    try {
        var room = await prisma.room.create({
            data: {
                hotel_id,
                room_type,
                room_name,
                night_price,
                capacity,
                number_of_beds
            },
            include: {
                room_types: true
            }
        });

        var mapedRoom = mapCreateRoomResToRoom(room);
        return mapedRoom;

    } catch (error) {
        throw error;
    }
}


export async function deleteRoom(room_id) {

    // validation
    if (!isValidId(room_id)) {
        throw new Error('Non Valid Room Id')
    }

    try {

        var delRes = await prisma.room.delete({
            where: {
                id: room_id
            },
        })

        return delRes;

    } catch (error) {
        // case prisma record not found
        if (error.code == 'P2025') {
            var customError = new NOT_FOUND_RECORD_ERROR('[room_type] not found');
            throw customError;
        }
        throw error;
    }

    // delete all rooms

    // prisma delete cascading sample
    /**
       const deletePosts = prisma.post.deleteMany({
        where: {
            authorId: 7,
        },
        })

        const deleteUser = prisma.user.delete({
        where: {
            id: 7,
        },
        })

        // transaction
        const transaction = await prisma.$transaction([deletePosts, deleteUser])
     */

}
