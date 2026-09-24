-- Create the database first.
CREATE DATABASE bootcamp;

-- Connect to bootcamp before running the rest of this file.
-- In psql, use: \connect bootcamp

-- Create the students table.
CREATE TABLE students (
		id SERIAL PRIMARY KEY,
		first_name VARCHAR(50) NOT NULL,
		last_name VARCHAR(50) NOT NULL,
		birth_date DATE NOT NULL
);

-- Insert the students in one statement.
INSERT INTO students (first_name, last_name, birth_date)
VALUES
		('Marc', 'Benichou', DATE '1998-11-02'),
		('Yoan', 'Cohen', DATE '2010-12-03'),
		('Lea', 'Benichou', DATE '1987-07-27'),
		('Amelia', 'Dux', DATE '1996-04-07'),
		('David', 'Grez', DATE '2003-06-14'),
		('Omer', 'Simpson', DATE '1980-10-03');

-- Add my own details. The id is generated automatically.
INSERT INTO students (first_name, last_name, birth_date)
VALUES ('EHK', 'Student', DATE '2000-01-01');

-- Select all columns and all students.
SELECT *
FROM students;

-- Select only first names and last names.
SELECT first_name, last_name
FROM students;

-- Student with id 2.
SELECT first_name, last_name
FROM students
WHERE id = 2;

-- Marc Benichou.
SELECT first_name, last_name
FROM students
WHERE last_name = 'Benichou'
	AND first_name = 'Marc';

-- Students whose last name is Benichou or whose first name is Marc.
SELECT first_name, last_name
FROM students
WHERE last_name = 'Benichou'
	 OR first_name = 'Marc';

-- First names containing the letter a.
SELECT first_name, last_name
FROM students
WHERE first_name ILIKE '%a%';

-- First names starting with the letter a.
SELECT first_name, last_name
FROM students
WHERE first_name ILIKE 'a%';

-- First names ending with the letter a.
SELECT first_name, last_name
FROM students
WHERE first_name ILIKE '%a';

-- First names whose second-to-last letter is a.
SELECT first_name, last_name
FROM students
WHERE first_name ILIKE '%a_';

-- Students with ids 1 and 3.
SELECT first_name, last_name
FROM students
WHERE id IN (1, 3);

-- Students born on or after January 1, 2000.
SELECT *
FROM students
WHERE birth_date >= DATE '2000-01-01';
