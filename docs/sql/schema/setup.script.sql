-- This script was generated by a beta version of the ERD tool in pgAdmin 4.
-- Please log an issue at https://redmine.postgresql.org/projects/pgadmin4/issues/new if you find any bugs, including reproduction steps.
BEGIN;

CREATE TABLE IF NOT EXISTS public.user_roles
(
    id serial,
    user_role character varying(40) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT unique_user_role UNIQUE (user_role)
);

CREATE TABLE IF NOT EXISTS public.booking_states
(
    id serial,
    booking_state character varying(40) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT unique_booking_state UNIQUE (booking_state)
);

CREATE TABLE IF NOT EXISTS public.payment_types
(
    id serial,
    payment_type character varying(60) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT unique_payment_types UNIQUE (payment_type)
);

CREATE TABLE IF NOT EXISTS public.hotel
(
    id serial,
    hotel_name character varying(100) NOT NULL,
    maximun_free_calendar_days integer NOT NULL DEFAULT 30,
    check_in_hour_time time without time zone NOT NULL,
    check_out_hour_time time without time zone NOT NULL,
    minimal_prev_days_to_cancel integer NOT NULL DEFAULT 5,
    iana_time_zone character varying(60) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT unique_hotel_name UNIQUE (hotel_name)
);

CREATE TABLE IF NOT EXISTS public.admins
(
    id serial,
    user_role integer NOT NULL,
    admin_name character varying(100) NOT NULL,
    admin_description character varying(150),
    hash_password text NOT NULL,
    reset_token text,
    created_at timestamp(0) without time zone DEFAULT (now() at time zone 'utc'),
    email character varying(80) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT unique_admin_name UNIQUE (admin_name),
    CONSTRAINT unique_admin_email UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS public.clients
(
    id serial,
    user_role integer NOT NULL,
    client_name character varying(60) NOT NULL,
    client_last_name character varying(60) NOT NULL,
    hash_password text,
    email character varying(120),
    is_email_verified boolean NOT NULL DEFAULT false,
    reset_token text,
    created_at timestamp(0) without time zone DEFAULT (now() at time zone 'utc'),
    PRIMARY KEY (id),
    CONSTRAINT unique_email UNIQUE (email)
);

COMMENT ON COLUMN public.clients.hash_password
    IS 'A client record can be created by a real client, wish requires a pasword to be hashed and stored here, or by a hotel admin, wish not need to create a pasword for the client, just name and last name, so this field is optional.';

COMMENT ON COLUMN public.clients.email
    IS 'Optional too since clients created by and hotel admin does not require email field';

CREATE TABLE IF NOT EXISTS public.room_amenity
(
    id serial,
    amenity character varying(100) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT unique_amenity UNIQUE (amenity)
);

CREATE TABLE IF NOT EXISTS public.room
(
    id serial,
    hotel_id integer NOT NULL,
    room_name character varying(20) NOT NULL,
    night_price numeric NOT NULL,
    capacity integer NOT NULL,
    number_of_beds integer NOT NULL,
    created_at timestamp(0) without time zone DEFAULT (now() at time zone 'utc'),
    room_type integer,
    PRIMARY KEY (id),
    CONSTRAINT unique_room_name UNIQUE (room_name)
);

CREATE TABLE IF NOT EXISTS public.rooms_amenities
(
    room_id integer,
    amenity_id integer,
    CONSTRAINT id PRIMARY KEY (room_id, amenity_id)
);

CREATE TABLE IF NOT EXISTS public.room_pictures
(
    id serial,
    room_id integer NOT NULL,
    filename text NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.booking
(
    id serial,
    client_id integer,
    hotel_id integer NOT NULL,
    booking_state integer,
    total_price numeric NOT NULL,
    start_date timestamp(0) without time zone NOT NULL,
    end_date timestamp(0) without time zone NOT NULL,
    number_of_guests integer NOT NULL,
    is_cancel boolean DEFAULT false,
    created_at timestamp(0) without time zone DEFAULT (now() at time zone 'utc'),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.currencies
(
    id serial,
    currency character varying(10) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT unique_currency UNIQUE (currency)
);

CREATE TABLE IF NOT EXISTS public.rooms_bookings
(
    room_id integer NOT NULL,
    booking_id integer NOT NULL,
    CONSTRAINT unique_room_booking_unit PRIMARY KEY (room_id, booking_id)
);

CREATE TABLE IF NOT EXISTS public.room_lock_period
(
    id serial,
    room_id integer,
    start_date timestamp(0) without time zone NOT NULL,
    end_date timestamp(0) without time zone NOT NULL,
    reason character varying(300),
    created_at timestamp(0) without time zone DEFAULT (now() at time zone 'utc'),
    during tsrange NOT NULL,
    is_a_booking boolean NOT NULL DEFAULT false,
    booking_id integer,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.room_types
(
    id serial,
    room_type character varying(30) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT unque_room_type UNIQUE (room_type)
);

CREATE TABLE IF NOT EXISTS public.client_payments
(
    id serial NOT NULL,
    client_id integer NOT NULL,
    amount numeric(12, 2) NOT NULL,
    booking_reference integer,
    payment_type integer NOT NULL,
    currency integer NOT NULL,
    effectuated_at timestamp(0) without time zone DEFAULT (now() at time zone 'utc'),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.room_data
(
    id integer NOT NULL,
    hotel_id integer NOT NULL,
    room_name character varying(20) NOT NULL,
    night_price numeric(10, 2) NOT NULL,
    capacity integer NOT NULL,
    number_of_beds integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    room_type_id integer,
    room_type_key character varying(30),
    room_pictures text[],
    room_amenities text[]
);

ALTER TABLE IF EXISTS public.admins
    ADD CONSTRAINT user_role FOREIGN KEY (user_role)
    REFERENCES public.user_roles (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.clients
    ADD CONSTRAINT user_role FOREIGN KEY (user_role)
    REFERENCES public.user_roles (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.room
    ADD CONSTRAINT hotel_id FOREIGN KEY (hotel_id)
    REFERENCES public.hotel (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.room
    ADD FOREIGN KEY (room_type)
    REFERENCES public.room_types (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.rooms_amenities
    ADD CONSTRAINT room_id_link FOREIGN KEY (room_id)
    REFERENCES public.room (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.rooms_amenities
    ADD CONSTRAINT amenity_id_link FOREIGN KEY (amenity_id)
    REFERENCES public.room_amenity (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.room_pictures
    ADD CONSTRAINT room_link FOREIGN KEY (room_id)
    REFERENCES public.room (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.booking
    ADD CONSTRAINT client_link FOREIGN KEY (client_id)
    REFERENCES public.clients (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.booking
    ADD CONSTRAINT booking_state_link FOREIGN KEY (booking_state)
    REFERENCES public.booking_states (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.rooms_bookings
    ADD CONSTRAINT booking_link FOREIGN KEY (booking_id)
    REFERENCES public.booking (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.rooms_bookings
    ADD CONSTRAINT room_link FOREIGN KEY (room_id)
    REFERENCES public.room (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.room_lock_period
    ADD CONSTRAINT room_link FOREIGN KEY (room_id)
    REFERENCES public.room (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.room_lock_period
    ADD CONSTRAINT booking_reference FOREIGN KEY (booking_id)
    REFERENCES public.booking (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;

ALTER TABLE IF EXISTS public.booking
    ADD CONSTRAINT booking_hotel_ownership FOREIGN KEY (hotel_id)
    REFERENCES public.hotel (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.client_payments
    ADD CONSTRAINT client_payer_reference FOREIGN KEY (client_id)
    REFERENCES public.clients (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.client_payments
    ADD CONSTRAINT booking_of_payment FOREIGN KEY (booking_reference)
    REFERENCES public.booking (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;    

ALTER TABLE IF EXISTS public.client_payments
    ADD CONSTRAINT payment_type_link FOREIGN KEY (payment_type)
    REFERENCES public.payment_types (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;    


ALTER TABLE IF EXISTS public.client_payments
    ADD CONSTRAINT payment_currency_link FOREIGN KEY (currency)
    REFERENCES public.currencies (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


--  INDEXES
CREATE INDEX admin_email_idx on admins USING BTREE (email);
CREATE INDEX client_email_idx on clients USING BTREE (email);
CREATE INDEX booking_start_date_idx on booking USING BTREE (start_date);
CREATE INDEX lock_period_start_date_idx on room_lock_period USING BTREE (start_date);
CREATE INDEX lock_period_during_idx ON room_lock_period USING GIST (during);
CREATE INDEX lock_period_booking_idx ON room_lock_period USING BTREE (booking_id);
CREATE INDEX client_payments_effectuated_at_idx on client_payments USING BTREE (effectuated_at);
CREATE INDEX client_payments_booking_reference_idx on client_payments USING BTREE (booking_reference);
CREATE INDEX client_created_at_idx on clients USING BTREE (created_at);

-- FUNCTIONS
create or replace function is_room_available_in( 
	room_id_filter integer,
    delta_search_days integer,
	query_range tsrange,
	out is_available boolean
) as $$

DECLARE
temp_lock RECORD;
current_utc_date date = current_date at time zone 'UTC';
latest_date_to_search date = current_utc_date - ( delta_search_days + 1);

BEGIN
is_available = true;

for temp_lock in 
	select 
            * 
        from 
            room_lock_period rlp 
        where rlp.room_id = room_id_filter and rlp.start_date > latest_date_to_search
loop
	if query_range && temp_lock.during then
		is_available = false;
		EXIT;
	end if;
end loop;

END;
$$
LANGUAGE plpgsql;
END;