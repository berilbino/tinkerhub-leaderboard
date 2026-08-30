import { createHmac, timingSafeEqual } from 'crypto';

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function getSessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || '';
}

export function createAdminSession(): string | null {
  const secret = getSessionSecret();
  if (!secret) return null;

  const issuedAt = Math.floor(Date.now() / 1000).toString();
  const signature = createHmac('sha256', secret).update(issuedAt).digest('hex');
  return `${issuedAt}.${signature}`;
}

export function isValidAdminSession(value?: string): boolean {
  const secret = getSessionSecret();
  if (!secret || !value) return false;

  const [issuedAt, suppliedSignature] = value.split('.');
  const issuedAtNumber = Number(issuedAt);
  if (!issuedAt || !suppliedSignature || !Number.isInteger(issuedAtNumber)) return false;
  if (issuedAtNumber + SESSION_MAX_AGE_SECONDS < Math.floor(Date.now() / 1000)) return false;

  const expectedSignature = createHmac('sha256', secret).update(issuedAt).digest('hex');
  const supplied = Buffer.from(suppliedSignature, 'hex');
  const expected = Buffer.from(expectedSignature, 'hex');
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

export const adminSessionMaxAge = SESSION_MAX_AGE_SECONDS;
