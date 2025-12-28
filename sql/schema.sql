CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE venues (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  venue_id INT REFERENCES venues(id),
  name TEXT,
  event_date TIMESTAMP
);

CREATE TABLE seats (
  id SERIAL PRIMARY KEY,
  venue_id INT REFERENCES venues(id),
  seat_number TEXT
);

CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  user_id INT,
  event_id INT,
  seat_id INT,
  status TEXT
);

CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  booking_id INT,
  idempotency_key TEXT UNIQUE,
  amount INT,
  status TEXT
);
