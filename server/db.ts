import { Pool } from "./deps.ts";

const pool = new Pool({
  hostname: Deno.env.get("DB_HOSTNAME")!,
  user: Deno.env.get("DB_USER"),
  password: Deno.env.get("DB_PASSWORD"),
  database: Deno.env.get("DB_DATABASE"),
}, 20);

interface Url {
  slug: string;
  url: string;
}

export async function findUrlBySlug(slug: string): Promise<Url | null> {
  const client = await pool.connect();

  try {
    const result = await client.queryObject<Url>
      `SELECT slug, url FROM urls WHERE slug = ${slug}`;

    return result.rows[0] ?? null;
  } finally {
    client.release();
  }
}

export async function findUrlByUrl(url: string): Promise<Url | null> {
  const client = await pool.connect();

  try {
    const result = await client.queryObject<Url>
      `SELECT slug, url FROM urls WHERE url = ${url}`;

    return result.rows[0] ?? null;
  } finally {
    client.release();
  }
}

export async function insertUrl(url: Url): Promise<void> {
  const client = await pool.connect();

  try {
    await client.queryArray
      `INSERT INTO urls (slug, url) VALUES (${url.slug}, ${url.url})`;
  } finally {
    client.release();
  }
}
