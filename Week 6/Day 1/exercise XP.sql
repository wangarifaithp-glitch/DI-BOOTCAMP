--
-- PostgreSQL database dump
--

\restrict ryCvNoj2njOuU09kQDgK9vEPboAguJ667FqRLs8RQ4fqcgapvaJADucnVukDKAM

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

-- Started on 2026-09-23 10:04:05

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 219 (class 1259 OID 16441)
-- Name: Items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Items" (
);


ALTER TABLE public."Items" OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16469)
-- Name: customers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customers (
    customer_id integer NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL
);


ALTER TABLE public.customers OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16468)
-- Name: customers_customer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.customers_customer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.customers_customer_id_seq OWNER TO postgres;

--
-- TOC entry 4927 (class 0 OID 0)
-- Dependencies: 222
-- Name: customers_customer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.customers_customer_id_seq OWNED BY public.customers.customer_id;


--
-- TOC entry 221 (class 1259 OID 16459)
-- Name: items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.items (
    item_id integer NOT NULL,
    item_name character varying(100) NOT NULL,
    price integer NOT NULL
);


ALTER TABLE public.items OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16458)
-- Name: items_item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.items_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.items_item_id_seq OWNER TO postgres;

--
-- TOC entry 4928 (class 0 OID 0)
-- Dependencies: 220
-- Name: items_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.items_item_id_seq OWNED BY public.items.item_id;


--
-- TOC entry 4765 (class 2604 OID 16472)
-- Name: customers customer_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers ALTER COLUMN customer_id SET DEFAULT nextval('public.customers_customer_id_seq'::regclass);


--
-- TOC entry 4764 (class 2604 OID 16462)
-- Name: items item_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items ALTER COLUMN item_id SET DEFAULT nextval('public.items_item_id_seq'::regclass);


--
-- TOC entry 4917 (class 0 OID 16441)
-- Dependencies: 219
-- Data for Name: Items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Items"  FROM stdin;
\.


--
-- TOC entry 4921 (class 0 OID 16469)
-- Dependencies: 223
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customers (customer_id, first_name, last_name) FROM stdin;
1	Greg	Jones
2	Sandra	Jones
3	Scott	Scott
4	Trevor	Green
5	Melanie	Johnson
\.


--
-- TOC entry 4919 (class 0 OID 16459)
-- Dependencies: 221
-- Data for Name: items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.items (item_id, item_name, price) FROM stdin;
1	Small Desk	100
2	Large desk	300
3	Fan	80
\.


--
-- TOC entry 4929 (class 0 OID 0)
-- Dependencies: 222
-- Name: customers_customer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customers_customer_id_seq', 5, true);


--
-- TOC entry 4930 (class 0 OID 0)
-- Dependencies: 220
-- Name: items_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.items_item_id_seq', 3, true);


--
-- TOC entry 4769 (class 2606 OID 16477)
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (customer_id);


--
-- TOC entry 4767 (class 2606 OID 16467)
-- Name: items items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_pkey PRIMARY KEY (item_id);


-- Completed on 2026-09-23 10:04:06

--
-- PostgreSQL database dump complete
--

\unrestrict ryCvNoj2njOuU09kQDgK9vEPboAguJ667FqRLs8RQ4fqcgapvaJADucnVukDKAM

