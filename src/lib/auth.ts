import { createHmac, timingSafeEqual } from 'node:crypto';

// Sistema de sesión sin base de datos: la cookie no almacena ningún ID que
// haya que buscar en ningún sitio — almacena una firma HMAC calculada con
// un secreto que solo el servidor conoce. Si alguien modifica la cookie sin
// conocer el secreto, la firma no coincide y se rechaza. Esto es suficiente
// para un panel de un solo usuario con contraseña compartida; NO sustituye
// a un sistema de cuentas con roles si en el futuro hay varios editores.

export const SESSION_COOKIE_NAME = 'algode_admin_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 horas

function getSecret(): string {
  const secret = import.meta.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error(
      'Falta la variable de entorno ADMIN_SESSION_SECRET. Configúrala en Vercel antes de usar /admin.'
    );
  }
  return secret;
}

function sign(value: string): string {
  return createHmac('sha256', getSecret()).update(value).digest('hex');
}

/** Genera el valor de cookie a guardar tras un login correcto. */
export function createSessionToken(): string {
  const payload = 'algode-admin-authenticated';
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

/** Verifica que la cookie recibida fue firmada por este servidor y no ha sido alterada. */
export function isValidSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return false;

  const expectedSignature = sign(payload);

  // Comparación en tiempo constante para evitar timing attacks.
  const a = Buffer.from(signature);
  const b = Buffer.from(expectedSignature);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Compara la contraseña introducida con ADMIN_PASSWORD de forma segura. */
export function checkPassword(submitted: string): boolean {
  const real = import.meta.env.ADMIN_PASSWORD;
  if (!real) {
    throw new Error(
      'Falta la variable de entorno ADMIN_PASSWORD. Configúrala en Vercel antes de usar /admin.'
    );
  }
  if (submitted.length !== real.length) return false;
  const a = Buffer.from(submitted);
  const b = Buffer.from(real);
  return timingSafeEqual(a, b);
}

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: SESSION_MAX_AGE_SECONDS,
};
