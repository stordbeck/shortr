import { Pool } from "./deps.ts";

const pool = new Pool(
  {},
  20,
  true,
);

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

export async function end() {
  await pool.end();
}
