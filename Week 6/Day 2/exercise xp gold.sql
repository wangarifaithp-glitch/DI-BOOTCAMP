
/* ==========================================================
	 EXERCISE 1: DVD RENTAL
	 Run this section against the DVD Rental database.
	 ========================================================== */

-- 1. Number of films for each rating
SELECT rating, COUNT(*) AS film_count
FROM film
GROUP BY rating
ORDER BY rating;

-- 2. All films rated G or PG-13
SELECT film_id, title, rating, length, rental_rate
FROM film
WHERE rating IN ('G', 'PG-13')
ORDER BY title;

-- 3. G or PG-13 films shorter than two hours and cheaper than 3.00
SELECT film_id, title, rating, length, rental_rate
FROM film
WHERE rating IN ('G', 'PG-13')
	AND length < 120
	AND rental_rate < 3.00
ORDER BY title;

-- 4. Change one customer's details to made-up personal details
UPDATE customer
SET first_name = 'EHK',
		last_name = 'Student',
		email = 'ehk.student@example.com'
WHERE customer_id = 1;

-- 5. Change that customer's address to a made-up address
UPDATE address
SET address = '123 Bootcamp Street',
		district = 'Tel Aviv',
		postal_code = '12345',
		phone = '050-1234567'
WHERE address_id = (
		SELECT address_id
		FROM customer
		WHERE customer_id = 1
);


/* ==========================================================
	 EXERCISE 2: STUDENTS
	 The students table and its original data already exist.
	 ========================================================== */

-- UPDATE
UPDATE students
SET birth_date = DATE '1998-11-02'
WHERE first_name = 'Lea'
	AND last_name = 'Benichou';

UPDATE students
SET birth_date = DATE '1998-11-02'
WHERE first_name = 'Marc'
	AND last_name = 'Benichou';

UPDATE students
SET last_name = 'Guez'
WHERE first_name = 'David'
	AND last_name = 'Grez';

-- DELETE
DELETE FROM students
WHERE first_name = 'Lea'
	AND last_name = 'Benichou';

-- COUNT
SELECT COUNT(*) AS total_students
FROM students;

SELECT COUNT(*) AS students_born_after_2000
FROM students
WHERE birth_date > DATE '2000-01-01';

-- Add the grade column
ALTER TABLE students
ADD COLUMN math_grade INTEGER;

-- Assign grades
UPDATE students
SET math_grade = 80
WHERE id = 1;

UPDATE students
SET math_grade = 90
WHERE id IN (2, 4);

UPDATE students
SET math_grade = 40
WHERE id = 6;

-- Count grades greater than 83
SELECT COUNT(*) AS grades_above_83
FROM students
WHERE math_grade > 83;

-- Add a second Omer Simpson row with the same birth date
INSERT INTO students (first_name, last_name, birth_date, math_grade)
SELECT first_name, last_name, birth_date, 70
FROM students
WHERE first_name = 'Omer'
	AND last_name = 'Simpson'
LIMIT 1;

-- Count grades for each student name
SELECT first_name, last_name, COUNT(math_grade) AS total_grade
FROM students
GROUP BY first_name, last_name
ORDER BY last_name, first_name;

-- SUM
SELECT SUM(math_grade) AS sum_of_all_grades
FROM students;


/* ==========================================================
	 EXERCISE 3: ITEMS AND CUSTOMERS
	 Run this section against the public database from Day 1.
	 ========================================================== */

-- PART I: create purchases
CREATE TABLE purchases (
		id SERIAL PRIMARY KEY,
		customer_id INTEGER NOT NULL REFERENCES customers(customer_id),
		item_id INTEGER REFERENCES items(item_id),
		quantity_purchased INTEGER NOT NULL
);

-- Insert purchases using subqueries
INSERT INTO purchases (customer_id, item_id, quantity_purchased)
VALUES (
		(SELECT customer_id FROM customers WHERE first_name = 'Scott' AND last_name = 'Scott'),
		(SELECT item_id FROM items WHERE item_name = 'Fan'),
		1
), (
		(SELECT customer_id FROM customers WHERE first_name = 'Melanie' AND last_name = 'Johnson'),
		(SELECT item_id FROM items WHERE item_name = 'Large desk'),
		10
), (
		(SELECT customer_id FROM customers WHERE first_name = 'Greg' AND last_name = 'Jones'),
		(SELECT item_id FROM items WHERE item_name = 'Small Desk'),
		2
);

-- PART II: queries
-- 1. All purchases
SELECT *
FROM purchases;

-- 2. All purchases joined with customers
SELECT p.id, p.customer_id, c.first_name, c.last_name,
			 p.item_id, p.quantity_purchased
FROM purchases AS p
JOIN customers AS c ON c.customer_id = p.customer_id;

-- 3. Purchases made by customer 5
SELECT *
FROM purchases
WHERE customer_id = 5;

-- 4. Purchases of a large desk or a small desk
SELECT p.*, i.item_name
FROM purchases AS p
JOIN items AS i ON i.item_id = p.item_id
WHERE i.item_name IN ('Large desk', 'Small Desk');

-- 5. Customers who have made a purchase and the item bought
SELECT c.first_name, c.last_name, i.item_name
FROM customers AS c
JOIN purchases AS p ON p.customer_id = c.customer_id
JOIN items AS i ON i.item_id = p.item_id;

-- 6. A purchase can omit item_id because the foreign-key column is nullable.
-- The row is accepted; a non-NULL invalid item_id would be rejected.
INSERT INTO purchases (customer_id, item_id, quantity_purchased)
VALUES (5, NULL, 1);

