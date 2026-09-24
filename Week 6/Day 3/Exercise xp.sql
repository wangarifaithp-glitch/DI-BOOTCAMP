-- EXERCISE 1

-- 1. Show all the languages
SELECT *
FROM language;

-- 2. Show each film with the language it is in
SELECT f.title, f.description, l.name AS language
FROM film AS f
JOIN language AS l ON l.language_id = f.language_id;

-- 3. Show every language, even when no film uses it
SELECT f.title, f.description, l.name AS language
FROM language AS l
LEFT JOIN film AS f ON f.language_id = l.language_id;

-- 4. Make a table for a few new films
CREATE TABLE new_film (
	id SERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL
);

INSERT INTO new_film (name)
VALUES
	('The Last Adventure'),
	('A Night in Paris');

-- 5. Make a table for customer reviews
CREATE TABLE customer_review (
	review_id SERIAL PRIMARY KEY,
	film_id INTEGER NOT NULL REFERENCES new_film(id) ON DELETE CASCADE,
	language_id INTEGER NOT NULL REFERENCES language(language_id),
	title VARCHAR(200) NOT NULL,
	score INTEGER NOT NULL CHECK (score BETWEEN 1 AND 10),
	review_text TEXT NOT NULL,
	last_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. Add two reviews and connect them to real films and languages
INSERT INTO customer_review
	(film_id, language_id, title, score, review_text)
VALUES
	(
		(SELECT id FROM new_film WHERE name = 'The Last Adventure'),
		(SELECT language_id FROM language WHERE name = 'English'),
		'A fun adventure',
		8,
		'The story moves quickly and the characters are easy to like.'
	),
	(
		(SELECT id FROM new_film WHERE name = 'A Night in Paris'),
		(SELECT language_id FROM language WHERE name = 'French'),
		'Beautiful and quiet',
		9,
		'A simple film with great atmosphere and nice performances.'
	);

-- 7. The review disappears when its film is deleted.
DELETE FROM new_film
WHERE name = 'The Last Adventure';

SELECT *
FROM customer_review;


-- EXERCISE 2

-- 1. Change two films to another valid language
UPDATE film
SET language_id = (
	SELECT language_id
	FROM language
	WHERE name = 'French'
)
WHERE film_id IN (1, 2);

-- 2. Find the foreign keys used by the customer table
SELECT
	tc.constraint_name,
	kcu.column_name,
	ccu.table_name AS referenced_table,
	ccu.column_name AS referenced_column
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
	ON tc.constraint_name = kcu.constraint_name
   AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
	ON ccu.constraint_name = tc.constraint_name
   AND ccu.table_schema = tc.table_schema
WHERE tc.table_name = 'customer'
  AND tc.constraint_type = 'FOREIGN KEY';

-- A new customer needs an existing store_id and address_id.

-- 3. Remove the review table
DROP TABLE IF EXISTS customer_review;

-- 4. Count rentals which have not been returned yet
SELECT COUNT(*) AS outstanding_rentals
FROM rental
WHERE return_date IS NULL;

-- 5. Find the 30 most expensive films still out on rental
SELECT DISTINCT f.film_id, f.title, f.replacement_cost
FROM rental AS r
JOIN inventory AS i ON i.inventory_id = r.inventory_id
JOIN film AS f ON f.film_id = i.film_id
WHERE r.return_date IS NULL
ORDER BY f.replacement_cost DESC, f.title
LIMIT 30;

-- 6a. A film about sumo with Penelope Monroe in the cast
SELECT DISTINCT f.title, f.description
FROM film AS f
JOIN film_actor AS fa ON fa.film_id = f.film_id
JOIN actor AS a ON a.actor_id = fa.actor_id
WHERE f.description ILIKE '%sumo%'
  AND a.first_name = 'Penelope'
  AND a.last_name = 'Monroe';

-- 6b. A short R-rated documentary
SELECT title, description, length, rating
FROM film
WHERE length < 60
  AND rating = 'R'
  AND description ILIKE '%documentary%';

-- 6c. A film rented by Matthew Mahan for more than $4,
-- returned from July 28 through August 1, 2005
SELECT DISTINCT f.title, p.amount, r.return_date
FROM customer AS c
JOIN rental AS r ON r.customer_id = c.customer_id
JOIN payment AS p ON p.rental_id = r.rental_id
JOIN inventory AS i ON i.inventory_id = r.inventory_id
JOIN film AS f ON f.film_id = i.film_id
WHERE c.first_name = 'Matthew'
  AND c.last_name = 'Mahan'
  AND p.amount > 4.00
  AND r.return_date >= TIMESTAMP '2005-07-28 00:00:00'
  AND r.return_date < TIMESTAMP '2005-08-02 00:00:00';

-- 6d. Another Matthew Mahan film with "boat" in the title or description
SELECT DISTINCT f.title, f.description, f.replacement_cost
FROM customer AS c
JOIN rental AS r ON r.customer_id = c.customer_id
JOIN inventory AS i ON i.inventory_id = r.inventory_id
JOIN film AS f ON f.film_id = i.film_id
WHERE c.first_name = 'Matthew'
  AND c.last_name = 'Mahan'
  AND (
	  f.title ILIKE '%boat%'
	  OR f.description ILIKE '%boat%'
  )
ORDER BY f.replacement_cost DESC;
