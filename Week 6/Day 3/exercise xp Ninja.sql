-- 1. G and PG films which are currently available.
-- A film is available when at least one copy has no active rental.
SELECT DISTINCT f.film_id, f.title, f.rating
FROM film AS f
JOIN inventory AS i ON i.film_id = f.film_id
WHERE f.rating IN ('G', 'PG')
	AND NOT EXISTS (
			SELECT 1
			FROM rental AS r
			WHERE r.inventory_id = i.inventory_id
				AND r.return_date IS NULL
	)
ORDER BY f.title;

-- 2. A child waits for a film, not for a specific DVD copy.
CREATE TABLE children_waiting_list (
		waiting_id SERIAL PRIMARY KEY,
		film_id INTEGER NOT NULL REFERENCES film(film_id),
		child_name VARCHAR(100) NOT NULL,
		date_added DATE NOT NULL DEFAULT CURRENT_DATE
);

-- 3. Test the waiting list with a few children.
INSERT INTO children_waiting_list (film_id, child_name)
VALUES
		((SELECT film_id FROM film WHERE title = 'Academy Dinosaur'), 'Maya Cohen'),
		((SELECT film_id FROM film WHERE title = 'Academy Dinosaur'), 'Noah Green'),
		((SELECT film_id FROM film WHERE title = 'Airplane Sierra'), 'Liam Brown');

-- Count the children waiting for every G or PG film.
SELECT f.film_id, f.title, COUNT(w.waiting_id) AS people_waiting
FROM film AS f
LEFT JOIN children_waiting_list AS w ON w.film_id = f.film_id
WHERE f.rating IN ('G', 'PG')
GROUP BY f.film_id, f.title
ORDER BY people_waiting DESC, f.title;
