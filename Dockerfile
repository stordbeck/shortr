FROM node as client

COPY client/package.json client/package-lock.json ./
COPY client/patches ./patches

RUN ["npm", "install"]

COPY client .

RUN ["npm", "run", "build"]

RUN ["ls"]

FROM denoland/deno

EXPOSE 8080

USER deno

COPY --from=client /build/ ./public/

COPY server/deps.ts .
RUN deno cache deps.ts

COPY server .

RUN deno cache server.ts

CMD ["run", "--allow-net", "--allow-env", "--allow-read", "server.ts"]