# Overengineering a Todo app with Docker

Three containers:

1. Static assets (JS, CSS)
	- React
2. DB
	- Postgres
3. API
	- Express

Endpoints:
- List Todos (/todo) GET
- Add Todo (/todo) POST
- Update Todo (/todo/<id>) PATCH
- Delete Todo (/todo/<id>) DELETE