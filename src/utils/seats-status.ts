export type SeatsStatus = 'disponible' | 'pocas-plazas' | 'completo';

interface Session {
  seatsTotal: number;
  seatsTaken: number;
}

/** Determina el estado de ocupación de una convocatoria para mostrar la urgencia correcta. */
export function getSeatsStatus(session: Session): SeatsStatus {
  const remaining = session.seatsTotal - session.seatsTaken;
  if (remaining <= 0) return 'completo';
  if (remaining <= session.seatsTotal * 0.3) return 'pocas-plazas';
  return 'disponible';
}

export function getSeatsRemaining(session: Session): number {
  return Math.max(0, session.seatsTotal - session.seatsTaken);
}

export function getSeatsStatusLabel(status: SeatsStatus, remaining: number): string {
  if (status === 'completo') return 'Completo — próxima convocatoria pronto';
  if (status === 'pocas-plazas') return `Solo quedan ${remaining} plazas`;
  return `${remaining} plazas disponibles`;
}
