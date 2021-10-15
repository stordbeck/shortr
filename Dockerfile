FROM node AS client_build

WORKDIR /app

COPY client/package.json client/package-lock.json ./
COPY client/patches ./patches

RUN npm install

COPY client .

RUN npm run build

FROM denoland/deno

USER deno

COPY --from=client_build /app/build public

COPY nessie.config.ts .
COPY db ./db

COPY server/deps.ts .
RUN deno cache deps.ts

COPY server .

RUN deno cache server.ts

CMD ["run", "--allow-all", "server.ts"]
