import { DB_UNIQUE_CONSTRAINT_ERROR_KEY } from "dao/Errors";
import { createHotel, deleteHotelById } from "dao/HotelDao";
import { v4 as uuid } from 'uuid';
import { mapTimeToDateTime } from 'dao/utils';
import { createRoom, deleteRoom, getRoomById, updateARoomIsType, updateRoomCapacity, updateRoomName, updateRoomNightPrice, updateRoomNumberOfBeds } from "dao/room/RoomDao";
import { createRoomType, deleteRoomTypeByType } from "dao/room/RoomTypesDao";
import { createARoomPicture, deleteARoomPicture } from "dao/room/RoomPicturesDao";
import { createARoomIsAmenity, createRoomAmenity, deleteARoomIsAmenity } from "dao/room/RoomAmenitiesDao";
describe(
    'Room Dao',

    function roomDaoTest() {

        var customHotel;
        var customRoomType;
        beforeAll(async () => {

            try {
                // create a hotel for use it in the tests
                customHotel = await createHotel({
                    hotel_name: uuid().substring(10),
                    maximun_free_calendar_days: 30,
                    check_in_hour_time: mapTimeToDateTime({ hours: 13, mins: 30 }),
                    check_out_hour_time: mapTimeToDateTime({ hours: 12, mins: 0 }),
                    minimal_prev_days_to_cancel: 5,
                    iana_time_zone: 'America/Lima'
                });

                // create a room type for use it
                customRoomType = await createRoomType(
                    // 'supper fussy'
                    uuid().substring(10)
                );

            } catch (error) {
                console.log(error);
            }
        })

        afterAll(async () => {
            try {
                // Pending Clean TODO
                // make sure there is not dependent room at this point ok
                // clean created roomType
                await deleteRoomTypeByType(customRoomType.room_type);
                // clean created hotel
                await deleteHotelById(customHotel.id); // delete depending room first TODO
            } catch (error) {
                console.log(error);
            }
        })



        var roomData = {
            // hotel_id, await to run test functions to use global `customHotel.id`
            // room_type, await to run test functions to use global `customHotel.id`
            room_name: uuid().substring(0, 10),
            night_price: 10,
            capacity: 2,
            number_of_beds: 1
        }


        // create and delete
        test(
            "Create and delete room",
            async function () {
                var dbError = null, room = null, del_result = null;

                try {
                    room = await createRoom({
                        hotel_id: customHotel.id,
                        room_name: roomData.room_name,
                        night_price: roomData.night_price,
                        number_of_beds: roomData.number_of_beds,
                        capacity: roomData.capacity
                    })

                    // console.log({ room });

                    del_result = await deleteRoom(room.id);
                } catch (error) {
                    console.log(error)
                    dbError = error;
                }

                expect(dbError).toBe(null);
                // //
                // Create tests
                // //
                // spec check when created 
                // some fields are null or empty arrays
                expect(room.id).toBeDefined();
                expect(room.hotel_id).toBeDefined();
                expect(room.room_name).toBeDefined();
                expect(room.night_price).toBeDefined();
                expect(room.capacity).toBeDefined();
                expect(room.number_of_beds).toBeDefined();
                expect(room.created_at).toBeDefined();
                expect(room.room_type).toBeNull();
                expect(room.room_types).toBeNull();
                expect(room.room_pictures).toStrictEqual([]);
                expect(room.rooms_amenities).toStrictEqual([]);
                // //
                // Delete tests
                // //
                expect(del_result.id).toBeDefined();

            }
        )
        // roomName
        test(
            "Update a room name",
            async function () {
                var dbError = null, room = null, NEW_NAME = uuid().substring(0, 10);

                try {
                    room = await createRoom({
                        hotel_id: customHotel.id,
                        room_name: roomData.room_name,
                        night_price: roomData.night_price,
                        number_of_beds: roomData.number_of_beds,
                        capacity: roomData.capacity
                    })

                    // update
                    var u_room = await updateRoomName(room.id, NEW_NAME);
                    // console.log({u_room});
                    // clean
                    await deleteRoom(room.id);
                } catch (error) {
                    console.log(error)
                    dbError = error;
                }

                expect(dbError).toBe(null);
                expect(room.id).toBeDefined()
                expect(u_room.room_name).toBe(NEW_NAME);

            }
        )

        // update a room is type
        test(
            "Update a Room is Type",
            async function () {

                var dbError = null, room = null, roomType = null, ROOM_TYPE_KEY = uuid().substring(0, 10);

                try {
                    room = await createRoom({
                        hotel_id: customHotel.id,
                        room_name: roomData.room_name,
                        night_price: roomData.night_price,
                        number_of_beds: roomData.number_of_beds,
                        capacity: roomData.capacity
                    })

                    // create a room_type to use it
                    roomType = await createRoomType(ROOM_TYPE_KEY);
                    // console.log({ roomType })
                    // update
                    var u_room = await updateARoomIsType(room.id, roomType.id);

                    // console.log({ u_room })

                    // clean
                    await deleteRoom(room.id);
                    await deleteRoomTypeByType(roomType.room_type)
                } catch (error) {
                    console.log(error)
                    dbError = error;
                }

                expect(dbError).toBe(null);
                expect(room.id).toBeDefined()
                expect(u_room.room_type).toBe(roomType.id);
                expect(u_room.room_types.room_type).toBe(ROOM_TYPE_KEY);

            }
        )

        // updateRoomNightPrice
        test(
            "Update a room night price",
            async function () {
                var dbError = null, room = null, u_room = null, NEW_NIGHT_PRICE = 20.79;

                try {
                    room = await createRoom({
                        hotel_id: customHotel.id,
                        room_name: roomData.room_name,
                        night_price: 13.50,
                        number_of_beds: roomData.number_of_beds,
                        capacity: roomData.capacity
                    });

                    u_room = await updateRoomNightPrice(room.id, NEW_NIGHT_PRICE);

                    // console.log({ u_room });

                    await deleteRoom(room.id);

                } catch (error) {
                    dbError = error;
                    console.log(error);
                }
                expect(dbError).toBeNull();
                expect(+u_room.night_price).toBe(NEW_NIGHT_PRICE);
            }
        )

        // updateRoomCapacity
        test(
            "Update a room capacity",
            async function () {
                var dbError = null, room = null, uc_room = null, NEW_CAPACITY = 40;

                try {
                    room = await createRoom({
                        hotel_id: customHotel.id,
                        room_name: roomData.room_name,
                        night_price: 13.50,
                        number_of_beds: roomData.number_of_beds,
                        capacity: roomData.capacity
                    });

                    // console.log({
                    //     'ntofb': typeof room.number_of_beds
                    // })
                    uc_room = await updateRoomCapacity(room.id, NEW_CAPACITY);

                    // console.log({ uc_room });

                    await deleteRoom(room.id);

                } catch (error) {
                    dbError = error;
                    console.log(error);
                }
                expect(dbError).toBeNull();
                expect(uc_room.capacity).toBe(NEW_CAPACITY);
            }
        )

        // updateRoomNumberOfBeds
        test(
            "Update a room number_of_beds",
            async function () {
                var dbError = null, room = null, u_room = null, NEW_NUMBER_OF_BEDS = 4;

                try {
                    room = await createRoom({
                        hotel_id: customHotel.id,
                        room_name: roomData.room_name,
                        night_price: 13.50,
                        number_of_beds: roomData.number_of_beds,
                        capacity: roomData.capacity
                    });

                    // console.log({
                    //     'ntofb': typeof room.number_of_beds
                    // })
                    u_room = await updateRoomNumberOfBeds(room.id, NEW_NUMBER_OF_BEDS);

                    // console.log({ u_room });

                    await deleteRoom(room.id);

                } catch (error) {
                    dbError = error;
                    console.log(error);
                }
                expect(dbError).toBeNull();
                expect(u_room.number_of_beds).toBe(NEW_NUMBER_OF_BEDS);
            }
        )

        // get room with pictures
        // test(
        //     "Get a room with pictures",
        //     async function () {
        //         var dbError = null, room = null, roomPicture = null, FILE_NAME = 'supper-foo-picture', fetch_room = null;

        //         try {
        //             room = await createRoom({
        //                 hotel_id: customHotel.id,
        //                 room_name: roomData.room_name,
        //                 night_price: roomData.night_price,
        //                 number_of_beds: roomData.number_of_beds,
        //                 capacity: roomData.capacity
        //             });

        //             roomPicture = await createARoomPicture(room.id, FILE_NAME);

        //             fetch_room = await getRoomById(room.id);

        //             console.log({
        //                 roomPicture,
        //                 fetch_room,
        //                 f_rp: fetch_room.room_pictures
        //             });


        //             await deleteARoomPicture(roomPicture.id);
        //             await deleteRoom(room.id);

        //         } catch (error) {
        //             dbError = error;
        //             console.log(error);
        //         }
        //     }
        // )

        //  with pictures and type
        // test(
        //     "Get a room with picures and  room type",
        //     async function () {
        //         var dbError = null, room = null, roomPicture = null, FILE_NAME = 'supper-foo-picture', fetch_room = null;

        //         try {
        //             room = await createRoom({
        //                 hotel_id: customHotel.id,
        //                 room_name: roomData.room_name,
        //                 night_price: roomData.night_price,
        //                 number_of_beds: roomData.number_of_beds,
        //                 capacity: roomData.capacity
        //             });

        //             roomPicture = await createARoomPicture(room.id, FILE_NAME);

        //             await updateARoomIsType(room.id, customRoomType.id);


        //             fetch_room = await getRoomById(room.id);

        //             console.log({
        //                 roomPicture,
        //                 fetch_room,
        //                 f_rp: fetch_room.room_pictures,
        //                 f_rt: fetch_room.room_type,
        //             });


        //             await deleteARoomPicture(roomPicture.id);
        //             await deleteRoom(room.id);

        //         } catch (error) {
        //             dbError = error;
        //             console.log(error);
        //         }
        //     }
        // )

        


        




        

        // amenities 
        // test(
        //     "Create a room with amenities, type, pictures",
        //     async function () {

        //         var dbError = null,
        //             room = null,
        //             roomType = null,
        //             ROOM_TYPE_KEY = uuid().substring(0, 10),
        //             amenity = null,
        //             AMENITY_KEY = uuid().substring(0, 10),
        //             roomPicture = null, FILE_NAME = 'supper-foo-picture',
        //             final_room = null,
        //             roomAmenity
        //             ;

        //         try {
        //             room = await createRoom({
        //                 hotel_id: customHotel.id,
        //                 room_name: roomData.room_name,
        //                 night_price: roomData.night_price,
        //                 number_of_beds: roomData.number_of_beds,
        //                 capacity: roomData.capacity
        //             })

        //             // create a room_type to use it
        //             roomType = await createRoomType(ROOM_TYPE_KEY);
        //             // update with the type
        //             await updateARoomIsType(room.id, roomType.id);
        //             // amenity
        //             amenity = await createRoomAmenity(AMENITY_KEY);
        //             roomAmenity = await createARoomIsAmenity(room.id, amenity.id);
        //             console.log({ roomAmenity })
        //             // pictures
        //             roomPicture = await createARoomPicture(room.id, FILE_NAME);

        //             final_room = await getRoomById(room.id);

        //             console.log({
        //                 final_room,
        //                 amenities: final_room.amenities,
        //                 rooms_amenities: final_room.rooms_amenities,
        //                 room_pictures: final_room.room_pictures
        //             })
        //             // clean
        //             await deleteARoomIsAmenity(roomAmenity.id)
        //             await deleteARoomPicture(roomPicture.id);
        //             await deleteRoom(room.id);
        //             await deleteRoomTypeByType(roomType.room_type)
        //         } catch (error) {
        //             console.log(error)
        //             dbError = error;
        //         }

        //         expect(dbError).toBe(null);
        //         expect(room.id).toBeDefined()
        //         expect(final_room.room_type).toBe(roomType.id);
        //         expect(final_room.room_type_key).toBe(ROOM_TYPE_KEY);

        //     }
        // )

    }

)
