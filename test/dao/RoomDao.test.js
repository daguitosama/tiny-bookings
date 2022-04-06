import { DB_UNIQUE_CONSTRAINT_ERROR_KEY } from "dao/Errors";
import { createHotel, deleteHotelById } from "dao/HotelDao";
import { v4 as uuid } from 'uuid';
import { mapTimeToDateTime } from 'dao/utils';
import { createRoom, deleteRoom } from "dao/room/RoomDao";
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
                // customRoomType = await createRoomType(
                //     // 'supper fussy'
                //     uuid().substring(10)
                // );

            } catch (error) {
                console.log(error);
            }
        })

        afterAll(async () => {
            try {
                // Pending Clean TODO
                // make sure there is not dependent room at this point ok
                // clean created roomType
                // await deleteRoomTypeByType(customRoomType.room_type);
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

        var gloablAmenities = [
            'Air conditioner',
            'Jacussi',
            'Mini Bar',
            'Desktop',
            'TV',
            'Safe Box',
        ]

        test(
            "Create and delete room",
            async function () {
                var dbError = null, room = null;

                try {
                    room = await createRoom({
                        hotel_id: customHotel.id,
                        room_name: roomData.room_name,
                        night_price: roomData.night_price,
                        number_of_beds: roomData.number_of_beds,
                        capacity: roomData.capacity
                    })

                    console.log({ room });

                    await deleteRoom(room.id);
                } catch (error) {
                    console.log(error)
                    dbError = error;
                }

                expect(dbError).toBe(null);
                expect(room.id).toBeDefined()
                expect(room.hotel_id).toBeDefined()
                expect(room.room_name).toBeDefined()
                expect(room.night_price).toBeDefined()
                expect(room.number_of_beds).toBeDefined()
                expect(room.capacity).toBeDefined()
                expect(room.created_at).toBeDefined()

            }
        )

    }

)
