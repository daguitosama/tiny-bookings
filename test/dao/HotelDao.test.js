import {
    createHotel,
    deleteHotelById,
    updateHotelName,
    updateHotelCheckInTime,
    updateHotelCheckOutTime,
    updateHotelFreeCalendarDays,
    updateHotelDaysToCancel,
    getHotelById,
} from "dao/HotelDao";
import { createHotel as createHotelS, updateHotelTimeZone } from "~/services/hotel"
const { createAdmin, deleteAdminById } = require("dao/users/AdminDao");
const { mapTimeToDateTime, randStr } = require("dao/utils");
import { USER_ROLES } from '~/dao/DBConstans'
import { NOT_FOUND_RECORD_ERROR_KEY } from "dao/Errors";
import { v4 as uuid } from 'uuid';
import { getUserRoleByKey } from "dao/users/UserRoleDao";


var FULL_ADMIN_USER_ROLE_ID = null;
beforeAll(async () => {
    FULL_ADMIN_USER_ROLE_ID = (await getUserRoleByKey(USER_ROLES.FULL_ADMIN.key)).id;
})

describe(
    'Hotel Dao',

    function hoetlDaoTest() {

        var hotelData = {
            hotel_name: randStr(),
            maximun_free_calendar_days: 30,
            check_in_hour_time: { hours: 13, minutes: 30 },
            check_out_hour_time: { hours: 12, minutes: 0 },
            minimal_prev_days_to_cancel: 5,
            iana_time_zone: 'America/Lima'
        }

        var updateHotelInput = {
            hotel_name: 'Test Hotel Update',
            maximun_free_calendar_days: 15,
            check_in_hour_time: { hours: 5, minutes: 30 },
            check_out_hour_time: { hours: 10, minutes: 0 },
            minimal_prev_days_to_cancel: 10,
            iana_time_zone: 'America/Lima'
        }

        var fullAdminData = {
            user_role: USER_ROLES.FULL_ADMIN.user_role,
            email: 'test-full@email.com',
            admin_name: 'admin:' + uuid(),
            admin_description: 'test admin for development',
            hash_password: 'supper foo hash password ',
            reset_token: 'supper reset token for test admin',
        }

        test(
            "Creates and Deletes A Hotel",
            async function () {

                var dbError = null, fooHotel = null, delHotel = null;
                // new Date().toUTCString
                try {
                    fooHotel = await createHotel(hotelData);
                    delHotel = await deleteHotelById(fooHotel.id);
                    console.log({
                        fooHotel,
                        delHotel
                    })

                } catch (error) {
                    dbError = error;
                }
                expect(fooHotel).toBeDefined();
                expect(delHotel.id).toBe(fooHotel.id);
                expect(fooHotel.id).toBeDefined();
                expect(fooHotel.hotel_name).toBeDefined();
                expect(fooHotel.maximun_free_calendar_days).toBeDefined();
                expect(fooHotel.check_in_hour_time).toBeDefined();
                expect(fooHotel.check_out_hour_time).toBeDefined();
                expect(fooHotel.minimal_prev_days_to_cancel).toBeDefined();
                expect(fooHotel.iana_time_zone).toBeDefined();
                expect(dbError).toBe(null);
            }
        );

        

        // test(
        //     "Update a hotel",
        //     async function () {

        //         var dbError = null, fooHotel, updatedFooHotel;

        //         try {
        //             fooHotel = await createHotel(hotelData);
        //             // name
        //             updatedFooHotel = await updateHotelName(fooHotel.id, 'Supper Foo Hotel');
        //             // check_in_hour_time
        //             updatedFooHotel = await updateHotelCheckInTime(fooHotel.id, mapTimeToDateTime({ hours: 3, minutes: 10 }));
        //             // check_out_hour_time
        //             updatedFooHotel = await updateHotelCheckOutTime(fooHotel.id, mapTimeToDateTime({ hours: 3, minutes: 10 }));
        //             // maximun_free_calendar_days
        //             updatedFooHotel = await updateHotelFreeCalendarDays(fooHotel.id, 90);
        //             // minimal_prev_days_to_cancel
        //             updatedFooHotel = await updateHotelDaysToCancel(fooHotel.id, 10);
        //             // iana_time_zone
        //             updatedFooHotel = await updateHotelTimeZone(fooHotel.id, 'America/Havana');


        //             // clean
        //             await deleteHotelById(fooHotel.id);
        //             console.log({ updatedFooHotel })
        //         } catch (error) {
        //             console.log(error)
        //             dbError = error
        //         }

        //         expect(updatedFooHotel.id).toBeDefined();
        //         expect(dbError).toBe(null);
        //     }
        // )

        // test(
        //     "Crate Hotel Service",
        //     async function () {
        //         var dbError = null, fooAdmin = null, hotel = null;


        //         try {
        //             fooAdmin = await createAdmin({
        //                 user_role_id: FULL_ADMIN_USER_ROLE_ID,
        //                 admin_name: uuid().substring(0, 6),
        //                 admin_description: uuid().substring(0, 10),
        //                 email: uuid().substring(0, 4) + '@gmail.com',
        //                 hash_password: uuid().substring(0, 10)
        //             })

        //             hotel = await createHotelS({
        //                 admin_id: fooAdmin.id,
        //                 ...hotelData,
        //             })

        //             console.log({ hotel })
        //             // clean 
        //             await deleteAdminById(fooAdmin.id);
        //             await deleteHotelById(hotel.id);

        //         } catch (error) {
        //             console.log(error)
        //             dbError = error
        //         }

        //         expect(dbError).toBeNull();
        //         expect(hotel.id).toBeDefined();
        //         expect(hotel.hotel_name).toBe(hotelData.hotel_name)
        //         expect(hotel.check_in_hour_time).toBe(hotelData.check_in_hour_time.toUTCString())
        //         expect(hotel.check_out_hour_time).toBe(hotelData.check_out_hour_time.toUTCString())
        //         expect(hotel.maximun_free_calendar_days).toBe(hotelData.maximun_free_calendar_days)
        //         expect(hotel.minimal_prev_days_to_cancel).toBe(hotelData.minimal_prev_days_to_cancel)
        //         expect(hotel.iana_time_zone).toBe(hotelData.iana_time_zone)
        //     }
        // )


        test(
            "Get Hotel By Id",
            async function () {
                var dbError = null, hotel = null, fooHotel = null;

                try {
                    fooHotel = await createHotel(hotelData);
                    hotel = await getHotelById(fooHotel.id);

                    console.log({ hotelById: hotel });
                    // clean
                    await deleteHotelById(hotel.id);

                } catch (error) {
                    dbError = error;
                    console.log(error);
                }

                expect(dbError).toBeNull();
                expect(hotel.id).toBeDefined();
            }

        )


    }

)
