import { defineMiddleware } from 'astro:middleware';
import { SESSION_COOKIE_NAME, isValidSessionToken } from './lib/auth';

// Se ejecuta en cada request. Solo actúa sobre /admin — el resto del sitio
// (estático) ni siquiera pasa por aquí en producción, así que no añade
// ninguna latencia a las páginas públicas.
export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginRoute = pathname === '/admin/login';
  const isLoginApi = pathname === '/api/admin/login';

  if (!isAdminRoute || isLoginRoute || isLoginApi) {
    return next();
  }

  const token = context.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!isValidSessionToken(token)) {
    return context.redirect('/admin/login');
  }

  return next();
});
