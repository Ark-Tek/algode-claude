/** 2026-07-14 -> "14 jul 2026" */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** 2026-07-14 -> "14 de julio de 2026" (uso en fichas y artículos) */
export function formatDateLong(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
