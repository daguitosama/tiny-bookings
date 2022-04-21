/**
 * 
 * Define
 * 
 * Create a booking
 *      for a non user client, on behalf of an admin
 *      client user
 * Cancel a booking
 * Get availability
 * 
 * 
 */

import { createBooking, deleteBooking, updateBookingAsCancel } from "dao/booking/BookingDao";
import { getBookingStateByKey } from "dao/booking/BookingStateDao";
import { createARoomBooking, deleteARoomBooking, deleteRoomBookingsByBookingId } from "dao/booking/RoomsBookingsDao";
import { BOOKING_STATES, USER_ROLES } from "dao/DBConstans";
import { createAPaymentWithBooking, deleteAPayment, deletePaymentByBookingId } from "dao/payments/PaymentsDao";
import { createARoomLockPeriod, deleteRoomLockPeriod, deleteRoomLocksByBookingId, isRoomAvailableIn } from "dao/room/RoomLock";
import { createNonUserClient, deleteClient } from "dao/users/ClientDao";
import { getUserRoleByKey } from "dao/users/UserRoleDao";
import { isValidClientName, isValidDateInput, isValidId, isValidPositiveInteger, isValidPrice } from "dao/utils";

export async function createABookingAsAdmin({
    start_date = { year, month, day, hour, minute },
    end_date = { year, month, day, hour, minute },
    rooms_ids = [],
    hotel_id,
    hotel_calendar_length,
    client_name,
    client_last_name,
    total_price,
    payment_type_id,
    currency_id,
    number_of_guests
}) {

    // scoped oulets for error recovery
    var validationSucced = false;
    var client = null;
    var clientWasCreated = false;
    var booking = null;
    var bookingWasCreated = false;
    var clientPayment = null;
    var clientPaymentWasCreated = false;
    var roomLocks = [];
    var roomBookings = [];

    // end result
    var completed = false;
    var results = {};

    try {


        // validate
        function validate() {
            // dates
            if (!isValidDateInput(start_date)) {
                throw new Error('Non valid start_date')
            }
            if (!isValidDateInput(end_date)) {
                throw new Error('Non valid end_date')
            }

            // hotel id
            if (!isValidId(hotel_id)) {
                throw new Error('Non valid hotel id')
            }

            // room ids
            if (!Array.isArray(rooms_ids)) {
                throw new Error('Non valid rooms_ids')
            }

            var roomIdsAreValid = true;
            for (let i = 0; i < rooms_ids.length; i++) {
                if (!isValidId(rooms_ids[i])) {
                    roomIdsAreValid = false;
                    break;
                }
            }

            if (!roomIdsAreValid) {
                throw new Error('A room id was not valid')
            }

            // client data
            if (!isValidClientName(client_name)) {
                throw new Error('Non valid client name');
            }

            if (!isValidClientName(client_last_name)) {
                throw new Error('Non valid client last name');
            }

            if (!isValidPrice(total_price)) {
                throw new Error('Non valid total_price')
            }

            if (!isValidId(payment_type_id)) {
                throw new Error('Non valid payment type id')
            }

            if (!isValidId(currency_id)) {
                throw new Error('Non valid currency id')
            }

            if (!isValidPositiveInteger(number_of_guests)) {
                throw new Error('Non valid number_of_guests')
            }

            if (!isValidPositiveInteger(hotel_calendar_length)) {
                throw new Error('Non valid hotel calendar lenght')
            }

        }

        validate();
        validationSucced = true;

        // check rooms availability
        var roomsAreAvailable = true;

        for (let i = 0; i < rooms_ids.length; i++) {

            var isAvailable = await isRoomAvailableIn({
                delta_search_days: hotel_calendar_length,
                room_id: rooms_ids[i],
                start_date,
                end_date
            })

            if (!isAvailable) {
                roomsAreAvailable = false;
                break;
            }

        }

        if (!roomsAreAvailable) {
            throw new Error('A room was not available');
        }



        // create a client
        var clientRole = await getUserRoleByKey(USER_ROLES.CLIENT.user_role);
        client = await createNonUserClient({
            user_role: clientRole.id,
            client_name,
            client_last_name
        });
        clientWasCreated = true;
        results.client = client;

        // create booking
        var paidBS = await getBookingStateByKey(BOOKING_STATES.PAID.key);
        booking = await createBooking({
            hotel_id,
            client_id: client.id,
            booking_state_id: paidBS.id,
            total_price,
            number_of_guests,
            start_date,
            end_date,
        })
        bookingWasCreated = true;
        results.booking = booking;


        // create client payment
        clientPayment = await createAPaymentWithBooking({
            client_id: client.id,
            amount: total_price,
            currency: currency_id,
            booking_id: booking.id,
            payment_type: payment_type_id
        })
        clientPaymentWasCreated = true;
        results.clientPayment = clientPayment;
        // rooms_locks
        // create rooms_bookings
        for (let i = 0; i < rooms_ids.length; i++) {

            var lock = await createARoomLockPeriod({
                room_id: rooms_ids[i],
                start_date,
                end_date,
                hotel_calendar_length: hotel_calendar_length,
                reason: 'Booked',
                is_a_booking: true,
                booking_id: booking.id,
            })
            roomLocks.push(lock);

            var roomBooking = await createARoomBooking(rooms_ids[i], booking.id)
            roomBookings.push(roomBooking);
        }
        results.roomLocks = roomLocks;
        results.roomBookings = roomBookings;

        completed = true;
        var error = null;
        return { completed, error, results };


    } catch (error) {

        // handle error recovery
        // in case somthing other then validation was wrong
        // the service should clean relation-broken saved entities if any
        try {
            // validation error
            if (!validationSucced) {
                throw error
            }

            // recovery secuence
            // from the bottom up for 
            // the dependencies chain

            if (roomBookings.length) {
                for (let i = 0; i < roomBookings.length; i++) {
                    await deleteARoomBooking(
                        roomBooking[i].room_id,
                        roomBooking[i].booking_id
                    )
                    results.roomBookings.shift()
                }
            }

            if (roomLocks.length) {
                for (let i = 0; i < roomLocks.length; i++) {
                    await deleteRoomLockPeriod(roomLocks[i].id)
                    results.roomLocks.shift()
                }
            }

            if (clientPaymentWasCreated) {
                await deleteAPayment(clientPayment.id)
                results.clientPayment = null;
            }

            if (bookingWasCreated) {
                await deleteBooking(booking.id)
                results.booking = null;
            }

            if (clientWasCreated) {
                await deleteClient(client.id)
                results.client = null
            }

            return {
                completed,
                error,
                results
            }

        } catch (error) {
            return {
                completed,
                error,
                results
            }
        }
    }

}

export async function cancelBookingAsAdmin(booking_id) {

    if (!isValidId(booking_id)) {
        throw new Error('Non valid Booking Id')
    }

    // end result
    var completed = false;
    var results = {};
    try {
        // clean booking dependency chain

        // room locks
        //  deleteRoomLocksByBookingId
        await deleteRoomLocksByBookingId(booking_id);

        // room bookings
        // deleteRoomBookings by booking id
        await deleteRoomBookingsByBookingId(booking_id);

        // client payment
        // delete client payment  by booking id
        await deletePaymentByBookingId(booking_id);

        // set the booked state as cancel
        // updateBooking
        var canceledState = await getBookingStateByKey(BOOKING_STATES.CANCEL.key);
        var updatedBooking = await updateBookingAsCancel(booking_id, canceledState.id);
        results.booking = updatedBooking
        completed = true;
        return {
            completed,
            results,
            error: null,
        }

    } catch (error) {
        return {
            completed,
            results,
            error,
        }
    }
}