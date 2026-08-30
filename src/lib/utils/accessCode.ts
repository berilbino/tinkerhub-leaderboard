// Participant Access Code Utility

const SAFE_CHARACTERS = 'ABCDEFGHJKLMNPQRTUVWXYZ2346789';

/**
 * Generate a random, easy-to-read access code
 * Format: [PREFIX]-[RANDOM4] e.g. CW26-X7K4
 */
export function generateAccessCode(prefix = 'CW26', randomLength = 4): string {
  let result = '';
  const charactersLength = SAFE_CHARACTERS.length;
  for (let i = 0; i < randomLength; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += SAFE_CHARACTERS.charAt(randomIndex);
  }
  return `${prefix}-${result}`.toUpperCase();
}

/**
 * Generate SHA-256 hash of access code for secure comparison
 */
export async function hashAccessCode(code: string): Promise<string> {
  const normalized = normalizeAccessCode(code);
  const msgUint8 = new TextEncoder().encode(normalized);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Normalize an access code: trim whitespace, convert to uppercase
 */
export function normalizeAccessCode(code: string): string {
  if (!code) return '';
  return code.trim().toUpperCase();
}
