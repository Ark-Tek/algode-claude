/** Convierte el FormData del formulario de curso en el objeto de frontmatter
 *  que espera el esquema de la colección `courses`. Lanza un Error legible
 *  si algún campo JSON (currículum, FAQ, convocatorias) no es válido. */
export function parseCourseForm(formData: FormData) {
  const get = (key: string) => String(formData.get(key) ?? '').trim();
  const getNumber = (key: string): number | null => {
    const raw = get(key);
    return raw === '' ? null : Number(raw);
  };
  const getLines = (key: string): string[] =>
    get(key)
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  const getJson = (key: string, label: string) => {
    const raw = get(key) || '[]';
    try {
      return JSON.parse(raw);
    } catch {
      throw new Error(`El campo "${label}" no es JSON válido. Revisa comas, comillas y corchetes.`);
    }
  };

  const data: Record<string, unknown> = {
    title: get('title'),
    shortDescription: get('shortDescription'),
    modality: get('modality'),
    level: get('level'),
    durationHours: getNumber('durationHours') ?? 0,
    price: getNumber('price'),
    fundaeEligible: formData.get('fundaeEligible') === 'on',
    hasCertificate: formData.get('hasCertificate') === 'on',
    certificationBody: get('certificationBody') || undefined,
    instructorRef: get('instructorRef'),
    heroImage: get('heroImage') || undefined,
    featured: formData.get('featured') === 'on',
    outcomes: getLines('outcomes'),
    audienceFit: getLines('audienceFit'),
    curriculum: getJson('curriculum', 'Programa del curso'),
    faq: getJson('faq', 'Preguntas frecuentes'),
    nextSessions: getJson('nextSessions', 'Próximas convocatorias'),
    publishedDate: new Date().toISOString().slice(0, 10),
  };

  const rating = getNumber('rating');
  if (rating !== null) data.rating = rating;
  const reviewCount = getNumber('reviewCount');
  if (reviewCount !== null) data.reviewCount = reviewCount;

  const body = get('body');
  const slug = get('slug');

  return { data, body, slug };
}
