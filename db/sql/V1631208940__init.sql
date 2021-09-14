CREATE TABLE urls
(
    slug text PRIMARY KEY,
    url  text NOT NULL
);

CREATE INDEX urls_url_index
    ON urls (url);