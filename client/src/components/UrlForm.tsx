import React, { useMemo, useState } from "react";

import Input from "./Input";
import Button from "./Button";

import { createSlug } from "../api";

export default function UrlForm({
  url,
  onCreateFulfilled,
  onCreateRejected,
  onUrlChange,
}: {
  url: string;
  onCreateFulfilled: (slug: string) => void;
  onCreateRejected: (error: Error) => void;
  onUrlChange: (url: string) => void;
}) {
  const [showError, setShowError] = useState(false);
  const isUrlValid = useMemo(() => {
    try {
      new URL(url);

      return true;
    } catch {
      return false;
    }
  }, [url]);

  return (
    <>
      <form
        className="flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();

          setShowError(true);

          if (!isUrlValid) {
            return;
          }

          createSlug(url).then(onCreateFulfilled, onCreateRejected);
        }}
      >
        <Input
          className="flex-grow"
          type="text"
          value={url}
          onChange={(e) => {
            setShowError(false);

            onUrlChange(e.target.value);
          }}
          placeholder="Enter your long url..."
          autoFocus
        />

        <Button disabled={!isUrlValid}>Shorten</Button>
      </form>

      {showError && !isUrlValid && (
        <p className="mt-2 text-red-700">Invalid url</p>
      )}
    </>
  );
}
