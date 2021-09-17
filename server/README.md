# Shortr server

The server is written in TypeScript and run with `deno`. It uses the [oak](https://oakserver.github.io/oak/) framework.
To run, first install `deno`: https://deno.land/#installation.

To run the server in watch mode:

```sh
cd server
PGUSER=postgres PGPASSWORD=postgres PGDATABASE=postgres deno run --allow-all --watch server.ts
```
