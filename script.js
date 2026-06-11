/* =============================================
   MICA'S CUMPLEAÑITO 🎀 — script.js
   ============================================= */


/* =============================================
   ENVELOPE — abrir y revelar la app
   ============================================= */

document.getElementById('btnOpen').addEventListener('click', function () {
  this.disabled = true;
  this.textContent = 'Bien ahi que te animaste… 💌';

  document.getElementById('envelope').classList.add('open');

  setTimeout(() => {
    document.getElementById('screen-envelope').classList.add('exit');
    setTimeout(() => {
      document.getElementById('screen-envelope').style.display = 'none';
      document.getElementById('app').classList.add('visible');
    }, 650);
  }, 1000);
});


/* =============================================
   NAVIGATION — SPA con vistas
   ============================================= */

function navigate(viewId) {
  // Ocultar todas las vistas
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));

  // Desactivar todos los botones de nav
  document.querySelectorAll('.nav-btn, .mob-btn').forEach(b => b.classList.remove('active'));

  // Activar la vista target
  const target = document.getElementById('view-' + viewId);
  if (target) target.classList.add('active');

  // Activar el botón correspondiente
  document.querySelectorAll('[data-view="' + viewId + '"]').forEach(b => b.classList.add('active'));

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Listeners en todos los botones de navegación (home, detalles, playlist, rsvp, minijuego, funfacts)
document.querySelectorAll('[data-view]').forEach(btn => {
  btn.addEventListener('click', () => navigate(btn.dataset.view));
});

// Botón "Procedo al caos" del home
document.getElementById('btnProcedo').addEventListener('click', () => navigate('rsvp'));


/* =============================================
   COUNTDOWN — hasta el 19/06 a las 21:00 ARG
   ============================================= */

function tick() {
  // 📅 Cambiá el año si hace falta
  const target = new Date('2026-06-19T21:00:00-03:00');
  const diff = target - new Date();

  if (diff <= 0) {
    document.getElementById('cd-d').textContent = '🎉';
    document.getElementById('cd-h').textContent = '🎂';
    document.getElementById('cd-m').textContent = '🎊';
    document.getElementById('cd-s').textContent = '✨';
    return;
  }

  document.getElementById('cd-d').textContent = String(Math.floor(diff / 86400000)).padStart(2, '0');
  document.getElementById('cd-h').textContent = String(Math.floor(diff % 86400000 / 3600000)).padStart(2, '0');
  document.getElementById('cd-m').textContent = String(Math.floor(diff % 3600000 / 60000)).padStart(2, '0');
  document.getElementById('cd-s').textContent = String(Math.floor(diff % 60000 / 1000)).padStart(2, '0');
}

tick();
setInterval(tick, 1000);


/* =============================================
   RSVP — guardar nombres en localStorage
   ============================================= */

const RSVP_KEY = 'mica_rsvp25';

function getRSVPs() {
  try {
    return JSON.parse(localStorage.getItem(RSVP_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveRSVP(name) {
  const list = getRSVPs();
  if (!list.includes(name)) {
    list.push(name);
    localStorage.setItem(RSVP_KEY, JSON.stringify(list));
  }
}

function showLocationReveal() {
  document.getElementById('location-real').classList.add('visible');
  document.getElementById('location-hidden-msg').style.display = 'none';
}


async function showRSVPDone(name) {
  await fetch('https://formspree.io/f/mvznrggy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre: name })
  });

  document.getElementById('rsvpFormWrap').style.display = 'none';
  document.getElementById('confirmed-name').textContent = name;
  document.getElementById('rsvp-done').classList.add('visible');
  showLocationReveal();
  // 👈 ya no llama a renderRSVPNames()
}

// Submit RSVP
document.getElementById('rsvpBtn').addEventListener('click', () => {
  const nameInput = document.getElementById('rsvpName');
  const name = nameInput.value.trim();

  if (!name) {
    nameInput.style.borderColor = 'var(--pink)';
    return;
  }

  saveRSVP(name);
  showRSVPDone(name);
});

// Restaurar estado si ya confirmó antes
const savedNames = getRSVPs();
if (savedNames.length) {
  showLocationReveal();

}


/* =============================================
   MINIJUEGO — photocards con flip
   ============================================= */

// 💬 Editá los mensajes acá
const cardMessages = {
  taylor:  { emoji: '👑', text: 'Si me conocés desde hace más de cinco minutos, esta elección no debería sorprenderte. Gracias por acompañarme en una obsesión que ya sobrevivió múltiples eras, cambios estéticos y decisiones financieras cuestionables.' },
  sabrina: { emoji: '🎀', text: 'Llegó relativamente tarde a mi vida, pero se instaló cómodamente. Carisma, humor y energía de pequeña amenaza con moñito: combinación ganadora.' },
  nick:    { emoji: '💙', text: 'El cool del grupo. Probablemente el más talentoso musicalmente hablando, pero en esta web le tocó competir contra Joe y eso era una batalla difícil.' },
  joe:     { emoji: '🕺', text: 'Hay personas que aparecen en una etapa de tu vida. Joe aparentemente firmó un contrato de permanencia. También considero importante informar que, en mi mente, estamos casados.' },
  kevin:   { emoji: '🎸', text: 'Esta invitación me dio la oportunidad de dedicarle una photocard a Kevin Jonas y sinceramente me parece un excelente uso de la tecnología.' },
  twice:   { emoji: '🌸', text: 'Soy literalmente la única kpoper del grupo, así que esta sección funciona también como una pequeña campaña de evangelización, arranquen escuchando Strategy. Gracias por su atención.' },
  jihyo:   { emoji: '🤩', text: 'Líder, vocalista, hermosa, talentosa y responsable de cuestionar más de una vez mi heterosexualidad. Esta card existe porque mi señora merecía su propio espacio.' },
};

document.querySelectorAll('.photocard').forEach(card => {
  card.addEventListener('click', () => {
    const wasFlipped = card.classList.contains('flipped');

    // Cerrar todas las otras cards
    document.querySelectorAll('.photocard').forEach(c => c.classList.remove('flipped'));

    const resultBox = document.getElementById('gameResult');

    if (!wasFlipped) {
      card.classList.add('flipped');
      const msg = cardMessages[card.dataset.id];
      resultBox.innerHTML = msg.emoji + ' ' + msg.text;
      resultBox.classList.add('visible');
    } else {
      resultBox.classList.remove('visible');
    }
  });
});


/* =============================================
   FUN FACTS — sin lógica JS requerida
   La navegación ya está cubierta por el loop
   de [data-view] de arriba. Los textos se
   editan directo en el HTML. 🎀
   ============================================= */

   /* =============================================
   CONFETTI & FLORECITAS — countdown decoration
   ============================================= */

function spawnCountdownDecor() {
  const field = document.getElementById('confettiField');
  if (!field) return;
  const pieces = ['🌸','🌸','✨','✨','🎀','💖','⭐','🌷','💫'];
  for (let i = 0; i < 14; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.textContent = pieces[Math.floor(Math.random() * pieces.length)];
    el.style.left = Math.random() * 120 - 10 + '%';
    el.style.top = Math.random() * 100 + '%';
    el.style.fontSize = (0.7 + Math.random() * 0.8) + 'rem';
    el.style.animationDuration = (2.5 + Math.random() * 3) + 's';
    el.style.animationDelay = (Math.random() * 3) + 's';
    field.appendChild(el);
  }
}

spawnCountdownDecor();
