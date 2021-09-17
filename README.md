![logo](client/public/favicon.ico)

# Shortr - URL Shortener Application

## Running

Prerequisites: `docker` && `docker-compose`.

To run, use `make`:

### Scripts

- `make setup`
  - Prepares a fresh database. Run this before `make server` or `make test`.
- `make server`
  - Runs the application.
  - Wait for the client build to finish (the client container will exit when it is done building)
  - The application will be accessible at `:8080`
- `make test`
  - Runs server tests and client tests
- `make teardown`
  - When you're all done, this will tear down the database.

## Developing

To develop, there are three pieces of the application that you need to run: the database, the server, and the client.

### Database

The application uses a postgres database. You can run one with `docker-compose`:

```sh
docker-compose -f docker-compose.db.yml up
```

This starts the database and applies migrations automatically. You will leave this running while you develop the application.

If you want to start from scratch (will not use any data from previous runs):

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
