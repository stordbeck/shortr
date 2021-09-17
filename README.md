![logo](client/public/favicon.ico)

# Shortr - URL Shortener Application

## Running

Prerequisites: `docker` && `docker-compose`.

To run, use `make`:

- `make setup` - prepare a fresh database

Now that a database is up and running:

- `make server` to run the application (accessible at `:8080`)
  - just make sure to wait for the client to finish building before accessing the application
- `make test` to run tests

## Developing

### Database

The application uses a postgres database. You can run one with `docker-compose`:

```sh
docker-compose -f docker-compose.db.yml up
```

Database migrations will automatically be applied. If you want to start from a fresh instance:

```sh
docker-compose -f docker-compose.db.yml up -V
```

#### Migrations

Database migrations are done with [flyway](https://flywaydb.org/). Migrations are in `db/sql`.
To create a new migration, use the current timestamp. e.g.:

```sh
touch db/sql/V$(date +%s)__migration_name.sql
```

### Server

See [`server/README.md`](server/README.md)

### Client

The frontend of the application is a `create-react-app` application. To run it, you'll need `node`.

```sh
cd client
npm install
npm start
```

For more details, see [`client/README.md`](client/README.md)
