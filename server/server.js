const express = require('express');
const bodyParser = require('body-parser');
const pgp = require('pg-promise')();
const cors = require('cors');

const {DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME, API_PORT, API_HOST} = process.env;

let db = pgp(`postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`);

let app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

app.route('/todo')
	.get((req, res) => {
		db.any('select id, label, complete from todo where deleted = false order by complete, id')
			.then(dbRes => res.json(dbRes))
			.catch(err => {
				console.log(`ERROR in /todo GET: ${err}`);
				res.status(400);
			});
	})
	.post((req, res) => {
		db.one('insert into todo (label) values ($1) returning id, label, complete', req.body.label)
			.then(dbRes => res.json(dbRes))
			.catch(err => {
				console.log(`ERROR in /todo POST: ${err}`);
				res.status(400);
			});
	});

app.route('/todo/:id')
	.patch((req, res) => {
		db.one('select * from todo where id = $1', req.params.id)
			.then(dbRes => {
				db.one(
					'update todo set label = $1, complete = $2, deleted = $3, updated_date = now() where id = $4 returning id, label, complete',
					[
						(req.body.label || req.body.label === '') ? req.body.label : dbRes.label,
						(req.body.complete || req.body.complete === false) ? req.body.complete : dbRes.complete,
						(req.body.deleted || req.body.deleted === false) ? req.body.deleted : dbRes.deleted,
						req.params.id
					])
					.then(dbRes => res.json(dbRes))
					.catch(() => {
						console.log(`ERROR in /todo/${req.params.id} PATCH: ${err}`);
						res.status(400);
					});
			});
	});

app.listen(API_PORT, API_HOST, () => console.log(`Server running on http://${API_HOST}:${API_PORT}`));
