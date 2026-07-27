// Lógica pura de la calculadora FUNDAE — sin dependencias del DOM,
// para que sea testeable de forma aislada (sección I del blueprint).

/**
 * Calcula el crédito FUNDAE estimado de una empresa según su plantilla.
 * Tramos orientativos basados en el crédito de formación bonificada habitual.
 */
export function estimateFundaeCredit(employeeCount, sector = 'servicios') {
  let base;
  if (employeeCount <= 5) base = 420;
  else if (employeeCount <= 9) base = 920;
  else if (employeeCount <= 49) base = 1800;
  else if (employeeCount <= 249) base = 3500;
  else base = 8000;

  const sectorFactor = sector === 'logistica' ? 1.1 : sector === 'industria' ? 1.05 : 1.0;
  return Math.round(base * sectorFactor);
}

/**
 * Dado un coste de curso y el crédito disponible, calcula cuánto
 * cubre FUNDAE y cuánto queda como coste neto para la empresa.
 */
export function calculateFundaeSavings(courseCost, employeeCount, sector = 'servicios') {
  const credit = estimateFundaeCredit(employeeCount, sector);
  const bonification = Math.min(courseCost, credit);
  const netCost = Math.max(0, courseCost - bonification);
  return { credit, bonification, netCost };
}
