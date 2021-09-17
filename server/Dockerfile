FROM denoland/deno

USER deno

COPY deps.ts .
RUN deno cache deps.ts

COPY . .

RUN deno cache server.ts
