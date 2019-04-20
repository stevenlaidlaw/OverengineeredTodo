create table todo (
	id serial primary key,
	label varchar(256),
	complete boolean default false,
	deleted boolean default false,
	updated_date timestamp default current_timestamp
);

insert into todo (label) values ('Todo 1');
insert into todo (label) values ('Todo 2');
insert into todo (label) values ('Todo 3');
insert into todo (label) values ('Todo 4');
