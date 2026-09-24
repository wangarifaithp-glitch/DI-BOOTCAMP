-- PART I: Customers and profiles

CREATE TABLE customer (
	id SERIAL PRIMARY KEY,
	first_name VARCHAR(50) NOT NULL,
	last_name VARCHAR(50) NOT NULL
);

CREATE TABLE customer_profile (
	id SERIAL PRIMARY KEY,
	"isLoggedIn" BOOLEAN DEFAULT FALSE,
	customer_id INTEGER NOT NULL UNIQUE
		REFERENCES customer(id) ON DELETE CASCADE
);

INSERT INTO customer (first_name, last_name)
VALUES
	('John', 'Doe'),
	('Jerome', 'Lalu'),
	('Lea', 'Rive');

-- Add profiles with subqueries instead of hard-coded customer ids.
INSERT INTO customer_profile ("isLoggedIn", customer_id)
VALUES
	(
		TRUE,
		(SELECT id FROM customer WHERE first_name = 'John' AND last_name = 'Doe')
	),
	(
		FALSE,
		(SELECT id FROM customer WHERE first_name = 'Jerome' AND last_name = 'Lalu')
	);

-- Names of customers who are logged in
SELECT c.first_name
FROM customer AS c
JOIN customer_profile AS cp ON cp.customer_id = c.id
WHERE cp."isLoggedIn" = TRUE;

-- Show every customer, including Lea who has no profile yet
SELECT c.first_name, cp."isLoggedIn"
FROM customer AS c
LEFT JOIN customer_profile AS cp ON cp.customer_id = c.id;

-- A missing profile also means that the customer is not logged in.
SELECT COUNT(*) AS customers_not_logged_in
FROM customer AS c
LEFT JOIN customer_profile AS cp ON cp.customer_id = c.id
WHERE cp."isLoggedIn" IS NOT TRUE;


-- PART II: Books, students, and the library

CREATE TABLE book (
	book_id SERIAL PRIMARY KEY,
	title VARCHAR(150) NOT NULL,
	author VARCHAR(100) NOT NULL
);

INSERT INTO book (title, author)
VALUES
	('Alice In Wonderland', 'Lewis Carroll'),
	('Harry Potter', 'J.K Rowling'),
	('To kill a mockingbird', 'Harper Lee');

CREATE TABLE student (
	student_id SERIAL PRIMARY KEY,
	name VARCHAR(50) NOT NULL UNIQUE,
	age INTEGER CHECK (age <= 15)
);

INSERT INTO student (name, age)
VALUES
	('John', 12),
	('Lera', 11),
	('Patrick', 10),
	('Bob', 14);

CREATE TABLE library (
	book_fk_id INTEGER NOT NULL
		REFERENCES book(book_id)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	student_fk_id INTEGER NOT NULL
		REFERENCES student(student_id)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	borrowed_date DATE NOT NULL,
	PRIMARY KEY (book_fk_id, student_fk_id)
);

-- Add the loans using the book and student names.
INSERT INTO library (book_fk_id, student_fk_id, borrowed_date)
VALUES
	(
		(SELECT book_id FROM book WHERE title = 'Alice In Wonderland'),
		(SELECT student_id FROM student WHERE name = 'John'),
		DATE '2022-02-15'
	),
	(
		(SELECT book_id FROM book WHERE title = 'To kill a mockingbird'),
		(SELECT student_id FROM student WHERE name = 'Bob'),
		DATE '2021-03-03'
	),
	(
		(SELECT book_id FROM book WHERE title = 'Alice In Wonderland'),
		(SELECT student_id FROM student WHERE name = 'Lera'),
		DATE '2021-05-23'
	),
	(
		(SELECT book_id FROM book WHERE title = 'Harry Potter'),
		(SELECT student_id FROM student WHERE name = 'Bob'),
		DATE '2021-08-12'
	);

-- 1. Show all rows in the junction table
SELECT *
FROM library;

-- 2. Show each student and the book they borrowed
SELECT s.name, b.title, l.borrowed_date
FROM library AS l
JOIN student AS s ON s.student_id = l.student_fk_id
JOIN book AS b ON b.book_id = l.book_fk_id;

-- 3. Average age of students who borrowed Alice In Wonderland
SELECT AVG(s.age) AS average_age
FROM library AS l
JOIN student AS s ON s.student_id = l.student_fk_id
JOIN book AS b ON b.book_id = l.book_fk_id
WHERE b.title = 'Alice In Wonderland';

-- 4. Deleting Bob also removes both of his library rows.
DELETE FROM student
WHERE name = 'Bob';

SELECT *
FROM library;
