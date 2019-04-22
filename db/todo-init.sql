create table todo (
	id serial primary key,
	label varchar(256),
	complete boolean default false,
	deleted boolean default false,
	updated_date timestamp default current_timestamp
);
