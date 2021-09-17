import { encodeBase64Url } from "./deps.ts";

/**
 * Create a new random slug.
 *
 * Requirements for slug:
 * - can be used safely as part of a url
 * - can be randomly generated with a low likelihood of colliding with an existing slug
 * without checking the database
 * - should be short enough that human can remember it, copy it without too much effort. No UUID!
 *
 * The strategy we're using is to use the current timestamp, in seconds,
 * combined with random values, to create a random sequence of bytes that
 * we'll encode with base64url binary-to-text encoding.
 *
 * Slugs generated in different seconds are guaranteed to be different.
 * The randomness added should reduce the chance that two generated
 * _in the same second_ are the same.
 *
 * The timestamp can be represented with a 32bit integer, or 4 bytes.
 * We'll generate two random bytes to combine with the timestamp. There are
 * 65,536 unique values that two bytes can represent, so the chance of picking
 * the same two bytes at random within the same second seem pretty low, at least
 * to my intuition. This yields a total of 6 bytes, or 48bits.
 *
 * Each character in base64url encoding represents 6 bits of data, so 48 bits
 * can be encoded to an 8-character string, which seems reasonably small.
 */
export default function generateRandomSlug(): string {
  const randomBytes = new Uint8Array(2);
  crypto.getRandomValues(randomBytes);

  const slugBuffer = new ArrayBuffer(6);

  // Create a view into the byte array
  const view = new DataView(slugBuffer);

  // Fill the first 4 bytes with the current timestamp in seconds
  view.setUint32(0, Math.floor(Date.now() / 1000));

  view.setUint8(4, randomBytes[0]);
  view.setUint8(5, randomBytes[1]);

  // Encode the byte array
  return encodeBase64Url(new Uint8Array(slugBuffer));
}
