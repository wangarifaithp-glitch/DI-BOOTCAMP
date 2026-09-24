
-- 1. Last two customers in alphabetical order
SELECT first_name, last_name
FROM customers
ORDER BY first_name DESC
LIMIT 2;

-- 2. Delete Scott's purchases
DELETE FROM purchases
WHERE customer_id = (
		SELECT customer_id
		FROM customers
		WHERE first_name = 'Scott'
			AND last_name = 'Scott'
);

-- 3. Scott is still in the customers table
SELECT *
FROM customers
WHERE first_name = 'Scott'
	AND last_name = 'Scott';

-- 4. LEFT JOIN keeps purchases with no matching customer
-- Run this before the DELETE above if Scott's old order is still needed.
SELECT p.id, p.item_id, p.quantity_purchased,
			 c.first_name, c.last_name
FROM purchases AS p
LEFT JOIN customers AS c ON c.customer_id = p.customer_id;

-- 5. INNER JOIN only keeps purchases with a matching customer
SELECT p.id, p.item_id, p.quantity_purchased,
			 c.first_name, c.last_name
FROM purchases AS p
INNER JOIN customers AS c ON c.customer_id = p.customer_id;
