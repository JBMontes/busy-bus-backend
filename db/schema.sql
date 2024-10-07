DROP DATABASE IF EXISTS busy_bus_app;

CREATE DATABASE busy_bus_app;

\c busy_bus_app;

DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS parents;
DROP TABLE IF EXISTS matrons;
DROP TABLE IF EXISTS drivers;
DROP TABLE IF EXISTS bus;

--Might need to add school
CREATE TABLE bus (
	bus_id SERIAL PRIMARY KEY,
	name VARCHAR(225)
);

--Might need to add school
CREATE TABLE drivers (
    driver_id SERIAL PRIMARY KEY,
    name VARCHAR(225),
    license_number VARCHAR(50),
    telephone VARCHAR(15),
    bus_id INTEGER REFERENCES bus(bus_id) ON DELETE CASCADE,
	email VARCHAR(255) UNIQUE NOT NULL,
	password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE matrons (
	matron_id SERIAL PRIMARY KEY,
  	name VARCHAR(225),
  	telephone VARCHAR(20), 
  	bus_id INTEGER REFERENCES bus(bus_id) ON DELETE CASCADE,
  	work_id INTEGER,
  	company VARCHAR(225),
  	school VARCHAR(225), 
	email VARCHAR(255) UNIQUE NOT NULL,
  	password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE parents (
	parent_id SERIAL PRIMARY KEY,
  	name VARCHAR(225),
  	telephone VARCHAR(20), 
  	address VARCHAR(225),
  	bus_id INTEGER REFERENCES bus(bus_id) ON DELETE CASCADE,
	email VARCHAR(255) UNIQUE NOT NULL,
  	password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE students (
	student_id SERIAL PRIMARY KEY,
  	name VARCHAR(225),
  	parent_id INTEGER REFERENCES parents(parent_id) ON DELETE CASCADE,
  	school VARCHAR(225),
	medical_history VARCHAR(225),
	bus_id INTEGER REFERENCES bus(bus_id) ON DELETE CASCADE
);

CREATE TABLE attendance (
    attendance_id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(student_id) ON DELETE CASCADE,
    date DATE,
    present BOOLEAN
);

CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    message TEXT,
    recipient_id INTEGER, 
	recipient_type VARCHAR(50),
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
