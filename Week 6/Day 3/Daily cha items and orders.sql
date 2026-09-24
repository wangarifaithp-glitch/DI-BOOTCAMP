-- Orders and the items that belong to them

CREATE TABLE users (
	user_id SERIAL PRIMARY KEY,
	username VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE product_orders (
	order_id SERIAL PRIMARY KEY,
	user_id INTEGER REFERENCES users(user_id),
	order_date DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE items (
	item_id SERIAL PRIMARY KEY,
	order_id INTEGER NOT NULL REFERENCES product_orders(order_id)
		ON DELETE CASCADE,
	item_name VARCHAR(100) NOT NULL,
	price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
	quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0)
);

-- A few rows to test the functions
INSERT INTO users (username)
VALUES ('john_doe'), ('lara_smith');

INSERT INTO product_orders (user_id)
VALUES
	((SELECT user_id FROM users WHERE username = 'john_doe')),
	((SELECT user_id FROM users WHERE username = 'lara_smith'));

INSERT INTO items (order_id, item_name, price, quantity)
VALUES
	((SELECT order_id FROM product_orders WHERE order_id = 1), 'Notebook', 4.50, 2),
	((SELECT order_id FROM product_orders WHERE order_id = 1), 'Pen', 1.25, 3),
	((SELECT order_id FROM product_orders WHERE order_id = 2), 'Backpack', 35.00, 1);

-- Total price for one order
CREATE OR REPLACE FUNCTION order_total(p_order_id INTEGER)
RETURNS NUMERIC(10, 2)
LANGUAGE SQL
AS $$
	SELECT COALESCE(SUM(price * quantity), 0)::NUMERIC(10, 2)
	FROM items
	WHERE order_id = p_order_id;
$$;

-- Try the order total function
SELECT order_total(1);

-- Total price for an order belonging to a particular user
CREATE OR REPLACE FUNCTION user_order_total(
	p_user_id INTEGER,
	p_order_id INTEGER
)
RETURNS NUMERIC(10, 2)
LANGUAGE SQL
AS $$
	SELECT COALESCE(SUM(i.price * i.quantity), 0)::NUMERIC(10, 2)
	FROM items AS i
	JOIN product_orders AS po ON po.order_id = i.order_id
	WHERE po.order_id = p_order_id
	  AND po.user_id = p_user_id;
$$;

-- Try the bonus function
SELECT user_order_total(1, 1);
