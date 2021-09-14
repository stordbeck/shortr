import { Application, HttpError, Router, send, Status } from "./deps.ts";

import { findUrlBySlug, findUrlByUrl, insertUrl } from "./db.ts";
import generateRandomSlug from "./generate-random-slug.ts";

// Create the oak app
const app = new Application();

app.addEventListener("listen", ({ port }) => {
  console.log(`Listening on :${port}`);
});

// Define the routes
const router = new Router();

router.post("/create", async (context) => {
  const body = context.request.body({ type: "json" });

  const { url } = (await body.value) as { url: string };

  try {
    new URL(url);
  } catch {
    context.throw(Status.BadRequest, "Invalid url");
  }

  const existingUrl = await findUrlByUrl(url);

  if (existingUrl) {
    context.response.body = existingUrl.slug;

    return;
  }

  // Generate a new slug for this url
  const slug = generateRandomSlug();

  await insertUrl({
    slug,
    url,
  });

  context.response.body = slug;
});

router.all("/:slug", async (context) => {
  const url = await findUrlBySlug(context.params["slug"]!);

  if (!url) {
    // TODO: Show an error page? Maybe a user mistyped/miscopied their slug
    context.response.redirect("/");

    return;
  }

  context.response.redirect(url.url);
});

// Serve static files from the `public` directory
app.use(async (context, next) => {
  try {
    await send(context, context.request.url.pathname, {
      root: `${Deno.cwd()}/public`,
      index: "index.html",
    });
  } catch (error) {
    if (error instanceof HttpError && error.status === Status.NotFound) {
      await next();
    } else {
      throw error;
    }
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

if (import.meta.main) {
  await app.listen({ port: 8080 });
}

export { app };
