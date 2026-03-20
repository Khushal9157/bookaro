CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  venue TEXT NOT NULL,
  event_date TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE seats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  seat_number TEXT NOT NULL,
  price INTEGER NOT NULL,
  status TEXT DEFAULT 'AVAILABLE',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(event_id, seat_number)
);

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id INTEGER REFERENCES users(id),
  event_id UUID REFERENCES events(id),
  status TEXT NOT NULL,
  total_amount INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE booking_seats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    seat_id UUID REFERENCES seats(id),
    price INTEGER NOT NULL
);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id),
    amount INTEGER NOT NULL,
    status TEXT NOT NULL,
    provider TEXT,
    idempotency_key TEXT UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_events_date ON events(event_date);

CREATE INDEX idx_seats_event ON seats(event_id);

CREATE INDEX idx_seats_event_status ON seats(event_id, status);