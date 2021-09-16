import { superoak } from "./deps.ts";

import { end } from "./db.ts";

import { app } from "./server.ts";

Deno.test("it will respond with 400 if the url is malformed", async () => {
  try {
    let request = await superoak(app);

    await request
      .post("/create")
      .set("Content-Type", "application/json")
      .send(JSON.stringify({ url: "foo" }))
      .expect(400);
  } finally {
    await end();
  }
});

Deno.test("it creates a random slug for a valid url", async () => {
  try {
    let request = await superoak(app);

    // The returned slug should only include base64url characters
    await request
      .post("/create")
      .set("Content-Type", "application/json")
      .send(JSON.stringify({ url: "http://www.example.com" }))
      .expect(200)
      .expect(/^[0-9a-zA-z-_]+$/);
  } finally {
    await end();
  }
});

Deno.test("subsequent request to shorten the same url return the same slug", async () => {
  try {
    let request = await superoak(app);

    const response = await request
      .post("/create")
      .set("Content-Type", "application/json")
      .send(JSON.stringify({ url: "http://www.example.com" }));

    const slug = response.text;

    request = await superoak(app);

    await request
      .post("/create")
      .set("Content-Type", "application/json")
      .send(JSON.stringify({ url: "http://www.example.com" }))
      .expect(200, slug);
  } finally {
    await end();
  }
});

Deno.test("A request to a short url should redirect to the original url", async () => {
  try {
    let request = await superoak(app);

    const response = await request
      .post("/create")
      .set("Content-Type", "application/json")
      .send(JSON.stringify({ url: "http://www.example.com" }));

    const slug = response.text;

    // A request for the slug should redirect to the original url
    request = await superoak(app);

    await request
      .get(`/${slug}`)
      .expect(302)
      .expect("location", "http://www.example.com");
  } finally {
    await end();
  }
});
