import React, { useEffect, useMemo, useState } from "react";

import {
  ClipboardCopyIcon,
  ClipboardCheckIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/outline";

import Input from "./components/Input";
import Button from "./components/Button";
import Logo from "./components/Logo";

import { createSlug } from "./api";

function App() {
  const [url, setUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState<Error | null>(null);
  const [darkMode, setDarkMode] = useState(
    () =>
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const urlValid = useMemo(() => {
    try {
      new URL(url);

      return true;
    } catch {
      return false;
    }
  }, [url]);

  const shortUrl = useMemo(() => {
    if (!slug) {
      return "";
    }

    return new URL(slug, window.location.origin).href;
  }, [slug]);

  return (
    <div className="grid justify-center content-center min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-200">
      <div className="absolute top-1 right-1">
        <button
          className="p-2"
          onClick={() => {
            const nextDarkMode = !darkMode;
            setDarkMode(nextDarkMode);
            localStorage.setItem("theme", nextDarkMode ? "dark" : "light");
          }}
        >
          {darkMode ? (
            <SunIcon className="w-6 h-6" />
          ) : (
            <MoonIcon className="w-6 h-6" />
          )}
        </button>
      </div>

      <header className="mb-2">
        <Logo />
      </header>

      <main>
        {!shortUrl ? (
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();

              if (!urlValid) {
                return;
              }

              createSlug(url)
                .then((slug) => {
                  setSlug(slug);
                })
                .catch((error) => {
                  console.debug(error);
                  setError(error);
                });
            }}
          >
            <Input
              className="w-[400px]"
              type="text"
              value={url}
              onChange={(e) => {
                setError(null);
                setUrl(e.target.value);
              }}
              placeholder="Enter your long url..."
              autoFocus
            />

            <Button>Shorten</Button>
          </form>
        ) : (
          <div className="flex items-center gap-2">
            Your short url:
            <Input
              readOnly
              defaultValue={shortUrl}
              onFocus={(e) => {
                e.target.setSelectionRange(0, e.target.value.length);
              }}
            />
            <Button
              onClick={() => {
                navigator.clipboard.writeText(shortUrl).then(() => {
                  setCopied(true);
                });
              }}
            >
              {copied ? (
                <ClipboardCheckIcon className="w-6 h-6" />
              ) : (
                <ClipboardCopyIcon className="w-6 h-6" />
              )}
            </Button>
          </div>
        )}

        {error && <p>Sorry there was an error, please try again</p>}
      </main>
    </div>
  );
}

export default App;
