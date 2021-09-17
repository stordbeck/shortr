import React from "react";

import { rest } from "msw";
import { setupServer } from "msw/node";

import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  byRole,
  byPlaceholderText,
  byLabelText,
} from "testing-library-selector";

import App from "./App";

const server = setupServer();

const ui = {
  submitButton: byRole("button", { name: /shorten/i }),
  urlInput: byPlaceholderText("Enter your long url..."),
  shortUrlInput: byLabelText("Short url"),
  validationError: byRole("alert"),
};

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

test("the form can't be submitted unless the url is valid", () => {
  render(<App />);

  expect(ui.submitButton.get()).toHaveAttribute("aria-disabled", "true");

  // Enter "foo" into the url input
  userEvent.type(ui.urlInput.get(), "foo");

  // The button should still be disabled
  expect(ui.submitButton.get()).toHaveAttribute("aria-disabled", "true");

  userEvent.clear(ui.urlInput.get());
  userEvent.type(ui.urlInput.get(), "http://www.example.com");

  // The button should no longer be disabled
  expect(ui.submitButton.get()).not.toHaveAttribute("aria-disabled");
});

test("submitting a valid url shows the shortened url", async () => {
  server.use(
    rest.post("/create", (req, res, ctx) => {
      return res(ctx.text("foobar12"));
    })
  );

  render(<App />);

  userEvent.type(ui.urlInput.get(), "http://www.example.com");
  userEvent.click(ui.submitButton.get());

  const shortUrlInput = await ui.shortUrlInput.find();

  expect(shortUrlInput).toHaveDisplayValue(/\/foobar12$/);
});

test("attempting to submit an invalid url shows an error message", async () => {
  render(<App />);

  expect(ui.validationError.query()).not.toBeInTheDocument();
  expect(ui.urlInput.get()).not.toHaveAttribute("aria-invalid");

  userEvent.type(ui.urlInput.get(), "foo");

  userEvent.click(ui.submitButton.get());

  expect(ui.validationError.get()).toHaveTextContent("Invalid url");
  expect(ui.urlInput.get()).toHaveAttribute("aria-invalid", "true");

  userEvent.type(ui.urlInput.get(), "bar");

  // After changing the input, the error message is no longer displayed
  expect(ui.validationError.query()).not.toBeInTheDocument();
  expect(ui.urlInput.get()).not.toHaveAttribute("aria-invalid");

  // Until you attempt to submit again
  userEvent.click(ui.submitButton.get());

  expect(ui.validationError.get()).toHaveTextContent("Invalid url");
  expect(ui.urlInput.get()).toHaveAttribute("aria-invalid", "true");
});
