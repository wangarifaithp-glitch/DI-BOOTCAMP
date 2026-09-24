-- EXERCISE 1: DVD RENTALS

-- 1. A rental is still out when return_date is NULL.
SELECT r.rental_id, r.customer_id, f.title, r.rental_date
FROM rental AS r
JOIN inventory AS i ON i.inventory_id = r.inventory_id
JOIN film AS f ON f.film_id = i.film_id
WHERE r.return_date IS NULL;

-- 2. Customers who still have DVDs out
SELECT c.customer_id, c.first_name, c.last_name,
	   COUNT(*) AS rentals_not_returned
FROM customer AS c
JOIN rental AS r ON r.customer_id = c.customer_id
WHERE r.return_date IS NULL
GROUP BY c.customer_id, c.first_name, c.last_name
ORDER BY rentals_not_returned DESC, c.last_name, c.first_name;

-- 3. The film_list view already includes the actors and categories.
SELECT title, description, category, actors
FROM film_list
WHERE category = 'Action'
  AND actors ILIKE '%Joe Swank%';


-- EXERCISE 2: HAPPY HALLOWEEN

-- 1. Show each store and where it is located
SELECT s.store_id, ci.city, co.country
FROM store AS s
JOIN address AS a ON a.address_id = s.address_id
JOIN city AS ci ON ci.city_id = a.city_id
JOIN country AS co ON co.country_id = ci.country_id;

-- 2. Total viewing time in each store.
-- DVDs with an active rental are left out of this total.
SELECT s.store_id,
	   SUM(f.length) AS viewing_minutes,
	   ROUND(SUM(f.length)::numeric / 60, 2) AS viewing_hours,
	   ROUND(SUM(f.length)::numeric / 1440, 2) AS viewing_days
FROM store AS s
JOIN inventory AS i ON i.store_id = s.store_id
JOIN film AS f ON f.film_id = i.film_id
WHERE NOT EXISTS (
	SELECT 1
	FROM rental AS r
	WHERE r.inventory_id = i.inventory_id
	  AND r.return_date IS NULL
)
GROUP BY s.store_id
ORDER BY s.store_id;

-- 3. The NOT EXISTS condition above excludes every DVD which is still out.

-- 4. Customers who live in a city where there is a store
SELECT DISTINCT c.customer_id, c.first_name, c.last_name, ci.city
FROM customer AS c
JOIN address AS a ON a.address_id = c.address_id
JOIN city AS ci ON ci.city_id = a.city_id
WHERE ci.city IN (
	SELECT store_city.city
	FROM store AS s
	JOIN address AS sa ON sa.address_id = s.address_id
	JOIN city AS store_city ON store_city.city_id = sa.city_id
)
ORDER BY ci.city, c.last_name, c.first_name;

-- 5. Customers who live in a country where there is a store
SELECT DISTINCT c.customer_id, c.first_name, c.last_name, co.country
FROM customer AS c
JOIN address AS a ON a.address_id = c.address_id
JOIN city AS ci ON ci.city_id = a.city_id
JOIN country AS co ON co.country_id = ci.country_id
WHERE co.country IN (
	SELECT store_country.country
	FROM store AS s
	JOIN address AS sa ON sa.address_id = s.address_id
	JOIN city AS store_city ON store_city.city_id = sa.city_id
	JOIN country AS store_country ON store_country.country_id = store_city.country_id
)
ORDER BY co.country, c.last_name, c.first_name;

-- 6. Store the films which are safe for the shelters.
-- The CHECK constraints stop forbidden categories and words being added.
CREATE TABLE safe_list (
	film_id INTEGER PRIMARY KEY,
	title VARCHAR(255) NOT NULL,
	description TEXT NOT NULL,
	length INTEGER NOT NULL,
	category VARCHAR(25) NOT NULL,
	CHECK (category <> 'Horror'),
	CHECK (
		title NOT ILIKE ALL (ARRAY['%beast%', '%monster%', '%ghost%', '%dead%', '%zombie%', '%undead%'])
		AND description NOT ILIKE ALL (ARRAY['%beast%', '%monster%', '%ghost%', '%dead%', '%zombie%', '%undead%'])
	)
);

INSERT INTO safe_list (film_id, title, description, length, category)
SELECT f.film_id, f.title, f.description, f.length, c.name
FROM film AS f
JOIN film_category AS fc ON fc.film_id = f.film_id
JOIN category AS c ON c.category_id = fc.category_id
WHERE c.name <> 'Horror'
	AND f.title NOT ILIKE ALL (ARRAY['%beast%', '%monster%', '%ghost%', '%dead%', '%zombie%', '%undead%'])
	AND f.description NOT ILIKE ALL (ARRAY['%beast%', '%monster%', '%ghost%', '%dead%', '%zombie%', '%undead%']);

SELECT *
FROM safe_list
ORDER BY title;

-- 7. Total time for the full list and the safe list
SELECT
	SUM(length) AS total_minutes,
	ROUND(SUM(length)::numeric / 60, 2) AS total_hours,
	ROUND(SUM(length)::numeric / 1440, 2) AS total_days
FROM film;

SELECT
	SUM(length) AS safe_minutes,
	ROUND(SUM(length)::numeric / 60, 2) AS safe_hours,
	ROUND(SUM(length)::numeric / 1440, 2) AS safe_days
FROM safe_list;
