import {
  AbstractMigration,
  ClientPostgreSQL,
  Info,
} from "https://deno.land/x/nessie@2.0.1/mod.ts";

export default class extends AbstractMigration<ClientPostgreSQL> {
  /** Runs on migrate */
  async up(info: Info): Promise<void> {
    await this.client.queryArray`CREATE TABLE urls
    (
        slug text PRIMARY KEY,
        url  text NOT NULL
    );`;

    await this.client.queryArray`CREATE INDEX urls_url_index ON urls (url);`;
  }

  /** Runs on rollback */
  async down(info: Info): Promise<void> {
    await this.client.queryArray`DROP TABLE urls`;
  }
}
