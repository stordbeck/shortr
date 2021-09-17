FROM node

WORKDIR /app

COPY package.json package-lock.json ./
COPY patches ./patches

RUN ["npm", "install"]

COPY . .
