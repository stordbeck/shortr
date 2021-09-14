export async function createSlug(url: string): Promise<string> {
  const response = await fetch("/create", {
    method: "POST",
    body: JSON.stringify({ url }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Bad response: ${response.status} ${response.statusText}`);
  }

  const slug = await response.text();

  return slug;
}
