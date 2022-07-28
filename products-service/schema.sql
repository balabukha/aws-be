create table products_list (
	id serial primary key,
	title text not null,
	description text,
	price float
);

create table stocks_list (
	product_id serial primary key not null references products_list(id) ,
	count integer
);

begin transaction;
	insert into products_list (title, description, price) values
		('macbook pro 13', 'Short Product Description1', 10),
		('macbook pro 14', 'Short Product Description3', 20),
		('macbook pro 16', 'Short Product Description2', 30);

begin transaction;
	insert into stocks_list (product_id, count) values
		(1, 4),
		(2, 6),
		(3, 7);

	DROP TABLE stocks_list;
