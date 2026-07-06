// Lógica del quiz "Encuentra tu curso" — separada del componente Astro
// para que sea testeable de forma aislada (sección D del blueprint).

const questions = [
  {
    text: '¿Cuál es tu objetivo principal ahora mismo?',
    options: [
      { label: 'Encontrar empleo', sub: 'Primera vez o reorientación' },
      { label: 'Ascender en mi empresa', sub: 'Ampliar competencias actuales' },
      { label: 'Formar a mi equipo', sub: 'Soy responsable de RRHH' },
      { label: 'Conseguir un carné oficial', sub: 'Maquinaria o equipos' },
    ],
  },
  {
    text: '¿En qué sector trabajas o quieres trabajar?',
    options: [
      { label: 'Logística y almacén', sub: 'Operativa, picking, stock' },
      { label: 'Industria y producción', sub: 'Fabricación, taller' },
      { label: 'Medio ambiente', sub: 'Sostenibilidad, ISO 14001' },
      { label: 'No tengo preferencia', sub: 'Estoy explorando opciones' },
    ],
  },
  {
    text: '¿Cómo prefieres formarte?',
    options: [
      { label: 'Presencial', sub: 'Práctica directa, instructor físico' },
      { label: 'Online', sub: 'Desde casa, a mi ritmo' },
      { label: 'Mixto', sub: 'Teoría online + práctica presencial' },
      { label: 'Lo más rápido posible', sub: 'Priorizo tiempo sobre formato' },
    ],
  },
  {
    text: '¿Cuándo quieres empezar?',
    options: [
      { label: 'Lo antes posible', sub: 'Esta semana si hay plaza' },
      { label: 'Próximas 4 semanas', sub: 'Tengo algo de margen' },
      { label: 'En 1-3 meses', sub: 'Quiero planificar bien' },
      { label: 'Solo estoy explorando', sub: 'Sin fecha concreta' },
    ],
  },
];

// Mapeo de combinaciones de respuestas a cursos del catálogo (slugs reales)
const results = {
  default: { slug: 'preparacion-pedidos', title: 'Preparación de Pedidos 2026', sub: 'Presencial · 20h · 150€', match: 97 },
  machinery: { slug: 'carretilla-elevadora', title: 'Operador de Carretilla Elevadora', sub: 'Presencial · 20h', match: 96 },
  environmental: { slug: 'sensibilizacion-medioambiental', title: 'Sensibilización Medioambiental', sub: 'Online · 15h · 100€', match: 94 },
  jobSearch: { slug: 'insercion-laboral', title: 'Inserción Laboral en Logística', sub: 'Online · 15h · 100€', match: 91 },
};

let current = 0;
const selected = [null, null, null, null];

function renderQuestion() {
  const q = questions[current];
  document.getElementById('quiz-step-label').textContent = `Pregunta ${current + 1} de 4`;
  document.getElementById('quiz-question-text').textContent = q.text;
  document.getElementById('quiz-progress-fill').style.width = `${((current + 1) / 4) * 100}%`;
  document.getElementById('quiz-back').hidden = current === 0;
  document.getElementById('quiz-next').textContent = current === 3 ? 'Ver mi resultado →' : 'Siguiente →';

  const dots = document.getElementById('quiz-dots');
  dots.innerHTML = '';
  for (let i = 0; i < 4; i++) {
    const dot = document.createElement('span');
    dot.className = `quiz__dot${i === current ? ' is-active' : i < current ? ' is-done' : ''}`;
    dots.appendChild(dot);
  }

  const container = document.getElementById('quiz-options');
  container.innerHTML = '';
  q.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `quiz__option${selected[current] === idx ? ' is-selected' : ''}`;
    btn.innerHTML = `<strong>${opt.label}</strong><span>${opt.sub}</span>`;
    btn.addEventListener('click', () => selectOption(idx));
    container.appendChild(btn);
  });

  document.getElementById('quiz-next').disabled = selected[current] === null;
}

function selectOption(idx) {
  selected[current] = idx;
  document.querySelectorAll('.quiz__option').forEach((btn, i) => btn.classList.toggle('is-selected', i === idx));
  document.getElementById('quiz-next').disabled = false;
}

function goNext() {
  if (selected[current] === null) return;
  if (current < 3) {
    current++;
    renderQuestion();
  } else {
    showResult();
  }
}

function goBack() {
  if (current > 0) {
    current--;
    renderQuestion();
  }
}

function pickResult() {
  if (selected[0] === 3) return results.machinery;
  if (selected[1] === 2) return results.environmental;
  if (selected[0] === 0 && selected[1] !== 2) return results.jobSearch;
  return results.default;
}

function showResult() {
  document.getElementById('quiz-question-card').hidden = true;
  const resultCard = document.getElementById('quiz-result');
  resultCard.hidden = false;

  const pick = pickResult();
  document.getElementById('quiz-result-title').textContent = pick.title;
  document.getElementById('quiz-result-sub').textContent = pick.sub;
  document.getElementById('quiz-result-match').textContent = `${pick.match}%`;
  document.getElementById('quiz-result-cta').href = `/cursos/${pick.slug}`;
}

function resetQuiz() {
  current = 0;
  selected.fill(null);
  document.getElementById('quiz-question-card').hidden = false;
  document.getElementById('quiz-result').hidden = true;
  renderQuestion();
}

document.getElementById('quiz-next')?.addEventListener('click', goNext);
document.getElementById('quiz-back')?.addEventListener('click', goBack);
document.getElementById('quiz-reset')?.addEventListener('click', resetQuiz);

renderQuestion();
