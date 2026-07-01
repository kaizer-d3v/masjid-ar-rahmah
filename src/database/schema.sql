CREATE TABLE jemaah (
  id        SERIAL PRIMARY KEY,
  name      VARCHAR(100) NOT NULL,
  phone     VARCHAR(20),
  email     VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE solat_times (
  id         SERIAL PRIMARY KEY,
  prayer     VARCHAR(20) NOT NULL,
  time       TIME NOT NULL,
  iqamah     TIME,
  effective_date DATE NOT NULL
);

CREATE TABLE announcements (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(200) NOT NULL,
  content     TEXT,
  event_date  DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE donations (
  id          SERIAL PRIMARY KEY,
  jemaah_id   INTEGER REFERENCES jemaah(id),
  amount      DECIMAL(10,2) NOT NULL,
  method      VARCHAR(30),
  donated_at  TIMESTAMPTZ DEFAULT NOW()
);
