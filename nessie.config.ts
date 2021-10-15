import {
  ClientPostgreSQL,
  NessieConfig,
} from "https://denopkg.com/halvardssm/deno-nessie@main/mod.ts";

const client = new ClientPostgreSQL(Deno.env.get("DATABASE_URL") || {});

/** This is the final config object */
const config: NessieConfig = {
  client,
  migrationFolders: ["./db/migrations"],
  seedFolders: ["./db/seeds"],
};

export default config;
