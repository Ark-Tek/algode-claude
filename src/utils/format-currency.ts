/** 150 -> "150€" · null -> "Consultar precio" */
export function formatCurrency(value: number | null): string {
  if (value === null) return 'Consultar precio';
  return `${value.toLocaleString('es-ES')}€`;
}
