/* ==========================================================================
   ЛОГИКА САЙТА. Тексты редактируются в js/config.js — сюда лезть не обязательно.
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Подставляем данные из config.js во все элементы ---------- */
  const cfg = WEDDING_CONFIG;

  document.querySelectorAll('[data-name="groom"]').forEach(el => el.textContent = cfg.groom);
  document.querySelectorAll('[data-name="bride"]').forEach(el => el.textContent = cfg.bride);
  document.querySelectorAll('[data-name="groomInitial"]').forEach(el => el.textContent = cfg.groomInitial);
  document.querySelectorAll('[data-name="brideInitial"]').forEach(el => el.textContent = cfg.brideInitial);

  document.querySelectorAll('[data-field="dateText"]').forEach(el => el.textContent = cfg.dateText);
  document.querySelectorAll('[data-field="timeText"]').forEach(el => el.textContent = cfg.timeText);
  document.querySelectorAll('[data-field="venue"]').forEach(el => el.textContent = cfg.venue);
  document.querySelectorAll('[data-field="address"]').forEach(el => el.textContent = cfg.address);
  document.querySelectorAll('[data-field="parentsGroom"]').forEach(el => el.textContent = cfg.parentsGroom);
  document.querySelectorAll('[data-field="parentsBride"]').forEach(el => el.textContent = cfg.parentsBride);

  document.title = `${cfg.groom} & ${cfg.bride} — Той шақыру`;

  const mapLink = document.getElementById('mapLink');
  if (mapLink) mapLink.href = cfg.mapUrl;

  /* ---------- 2. Летящие лепестки (фон) ---------- */
  function spawnPetals(container, count){
    if (!container) return;
    for (let i = 0; i < count; i++){
      const p = document.createElement('span');
      p.className = 'petal';
      p.textContent = ['❀','✿','❁','♥'][Math.floor(Math.random()*4)];
      p.style.left = Math.random() * 100 + 'vw';
      p.style.fontSize = (12 + Math.random() * 14) + 'px';
      p.style.animationDuration = (8 + Math.random() * 10) + 's';
      p.style.animationDelay = (Math.random() * 10) + 's';
      container.appendChild(p);
    }
  }
  spawnPetals(document.getElementById('petalsIntro'), 18);
  spawnPetals(document.getElementById('petalsMain'), 22);

  /* ---------- 3. Открытие конверта ---------- */
  const envelope = document.getElementById('envelope');
  const openBtn = document.getElementById('openBtn');
  const envelopeScreen = document.getElementById('envelope-screen');
  const site = document.getElementById('site');
  const bgMusic = document.getElementById('bgMusic');

  openBtn.addEventListener('click', () => {
    envelope.classList.add('open');
    openBtn.disabled = true;

    if (cfg.musicEnabledByDefault) {
      bgMusic.play().catch(() => {});
      document.getElementById('musicToggle').classList.add('playing');
    }

    setTimeout(() => {
      envelopeScreen.classList.add('closed');
      site.classList.remove('hidden');
      document.body.style.overflow = 'auto';
      revealOnLoad();
    }, 1100);
  });

  document.body.style.overflow = 'hidden'; // блокируем скролл, пока конверт не открыт

  /* ---------- 4. Обратный отсчёт ---------- */
  const target = new Date(cfg.dateISO).getTime();
  function updateCountdown(){
    const now = Date.now();
    const diff = target - now;
    const els = {
      d: document.getElementById('cd-days'),
      h: document.getElementById('cd-hours'),
      m: document.getElementById('cd-mins'),
      s: document.getElementById('cd-secs'),
    };
    if (diff <= 0){
      els.d.textContent = els.h.textContent = els.m.textContent = els.s.textContent = '00';
      return;
    }
    const days = Math.floor(diff / (1000*60*60*24));
    const hours = Math.floor((diff / (1000*60*60)) % 24);
    const mins = Math.floor((diff / (1000*60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);
    els.d.textContent = String(days).padStart(2,'0');
    els.h.textContent = String(hours).padStart(2,'0');
    els.m.textContent = String(mins).padStart(2,'0');
    els.s.textContent = String(secs).padStart(2,'0');
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ---------- 5. Появление блоков при скролле ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  function revealOnLoad(){
    revealEls.forEach(el => observer.observe(el));
  }

  /* ---------- 6. Переключатель музыки ---------- */
  const musicToggle = document.getElementById('musicToggle');
  musicToggle.addEventListener('click', () => {
    if (bgMusic.paused){
      bgMusic.play().catch(() => {
        alert('Добавьте файл музыки в assets/audio/music.mp3, чтобы включить фоновую мелодию.');
      });
      musicToggle.classList.add('playing');
    } else {
      bgMusic.pause();
      musicToggle.classList.remove('playing');
    }
  });

  /* ---------- 7. Галерея ---------- */
  const gallery = document.getElementById('gallery');
  if (cfg.galleryPhotos && cfg.galleryPhotos.length){
    cfg.galleryPhotos.forEach(src => {
      const div = document.createElement('div');
      div.className = 'gallery-item';
      div.style.backgroundImage = `url("${src}")`;
      gallery.appendChild(div);
    });
  } else {
    gallery.innerHTML = '<p class="gallery-empty">Фотосуреттерді assets/photos/ қалтасына салып, config.js файлында тізімге қосыңыз</p>';
  }

  /* ---------- 8. Форма RSVP (визуальная, без сервера) ---------- */
  const rsvpForm = document.getElementById('rsvpForm');
  const rsvpThanks = document.getElementById('rsvpThanks');
  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    rsvpForm.classList.add('hidden');
    rsvpThanks.classList.remove('hidden');
  });

});
