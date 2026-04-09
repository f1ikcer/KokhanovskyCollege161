/* ═══════════════════════════════════════════════════
   КГК — script.js v3.0  |  MEGA UPDATE
   ═══════════════════════════════════════════════════ */

/* ─── Данные языков ──────────────────────────────── */
const langData = {
  ru: {
    title: "Кохановский государственный колледж",
    title_schedule: "Расписание — КГК", title_about: "О создателе — КГК",
    title_gallery: "Галерея — КГК", title_contacts: "Контакты — КГК",
    title_wheel: "Колесо фортуны — КГК",
    college_name: "КГК",
    welcome: "Добро пожаловать\nв Кохановский колледж",
    about_college: "О колледже",
    about_college_2: "Колледж расположен в живописном месте Оршанского района — агрогородке Коханово.",
    news: "Новости и объявления",
    schedule_h1: "Расписание занятий", gallery_h1: "Галерея",
    about_creator: "О создателе сайта", contacts_h1: "Контакты",
    nav_home: "Главная", nav_schedule: "Расписание", nav_about: "О создателе",
    nav_gallery: "Галерея", nav_contacts: "Контакты", nav_wheel: "Колесо фортуны",
    countdown_label: "до конца учёбы",
    lesson_now: "Сейчас идёт урок", lesson_break: "Перемена", lesson_done: "Занятия окончены",
    days: "дн", hours: "ч", minutes: "мин", seconds: "с"
  },
  be: {
    title: "Каханаўскі дзяржаўны каледж",
    title_schedule: "Расклад — КГК", title_about: "Аб стваральніку — КГК",
    title_gallery: "Галерэя — КГК", title_contacts: "Кантакты — КГК",
    title_wheel: "Кола фартуны — КГК",
    college_name: "КДК",
    welcome: "Вітаем\nу Каханаўскім каледжы",
    about_college: "Аб каледжы",
    about_college_2: "Каледж размешчаны ў маляўнічым месцы Аршанскага раёна — аграгарадку Каханава.",
    news: "Навіны і аб'явы",
    schedule_h1: "Расклад заняткаў", gallery_h1: "Галерэя",
    about_creator: "Аб стваральніку сайта", contacts_h1: "Кантакты",
    nav_home: "Галоўная", nav_schedule: "Расклад", nav_about: "Аб стваральніку",
    nav_gallery: "Галерэя", nav_contacts: "Кантакты", nav_wheel: "Кола фартуны",
    countdown_label: "да канца навучання",
    lesson_now: "Зараз ідзе ўрок", lesson_break: "Перапынак", lesson_done: "Заняткі скончаны",
    days: "дн", hours: "г", minutes: "хв", seconds: "с"
  }
};

let currentLang = "ru";

/* ─── Переключение языка ─────────────────────────── */
function setLanguage(lang) {
  currentLang = lang;
  document.documentElement.dataset.lang = lang;
  localStorage.setItem("lang", lang);
  const data = langData[lang];
  document.querySelectorAll("[data-key]").forEach(el => {
    const key = el.dataset.key;
    if (!data[key]) return;
    if (el.tagName === "TEXTAREA" || el.tagName === "INPUT") el.placeholder = data[key];
    else el.textContent = data[key];
  });
  const titleEl = document.querySelector("title[data-key]");
  if (titleEl && data[titleEl.dataset.key]) document.title = data[titleEl.dataset.key];
  document.querySelectorAll(".lang-btn").forEach(btn =>
    btn.classList.toggle("active", btn.dataset.lang === lang)
  );
  updateLessonStatus();
}

/* ═══════════════════════════════════════════════════
   ЧАСТИЦЫ — анимированный фон
   ═══════════════════════════════════════════════════ */
function initParticles() {
  const canvas = document.createElement("canvas");
  canvas.id = "particles-bg";
  canvas.style.cssText = `
    position:fixed;inset:0;z-index:0;pointer-events:none;
    opacity:0.55;
  `;
  document.body.prepend(canvas);

  const ctx = canvas.getContext("2d");
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : H + 10;
      this.r  = Math.random() * 1.6 + 0.4;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.5 + 0.1);
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.6 ? "#5b9cf6" : "#a78bfa";
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.y < -10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  for (let i = 0; i < 55; i++) particles.push(new Particle());

  /* Пауза при скрытой вкладке — экономит CPU/GPU */
  let _raf;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(_raf);
    else loop();
  });

  function loop() {
    ctx.clearRect(0, 0, W, H);
    // Соединяем близкие частицы линиями
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = "#5b9cf6";
          ctx.globalAlpha = (1 - d / 120) * 0.12;
          ctx.lineWidth   = 0.8;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
      particles[i].update();
      particles[i].draw();
    }
    _raf = requestAnimationFrame(loop);
  }
  loop();
}

/* ═══════════════════════════════════════════════════
   ПЕЧАТАЮЩИЙ ТЕКСТ в hero
   ═══════════════════════════════════════════════════ */
function initTypewriter() {
  const el = document.querySelector(".hero h1[data-key='welcome']");
  if (!el) return;
  const text = el.textContent;
  el.textContent = "";
  el.style.visibility = "visible";
  let i = 0;
  const cursor = document.createElement("span");
  cursor.className = "typewriter-cursor";
  cursor.textContent = "|";
  el.appendChild(cursor);

  function type() {
    if (i < text.length) {
      cursor.insertAdjacentText("beforebegin", text[i] === "\n" ? "\n" : text[i]);
      i++;
      setTimeout(type, text[i - 1] === "\n" ? 300 : 45 + Math.random() * 35);
    } else {
      setTimeout(() => cursor.style.display = "none", 1200);
    }
  }
  setTimeout(type, 600);
}

/* ═══════════════════════════════════════════════════
   ОБРАТНЫЙ ОТСЧЁТ до конца учёбы
   ═══════════════════════════════════════════════════ */
function initCountdown() {
  const el = document.getElementById("countdown");
  if (!el) return;
  const TARGET = new Date("2026-06-30T00:00:00");

  function update() {
    const now  = new Date();
    const diff = TARGET - now;
    if (diff <= 0) { el.innerHTML = `<span class="cd-done">🎉 Учёба окончена!</span>`; return; }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000)  / 60000);
    const s = Math.floor((diff % 60000)    / 1000);
    const L = langData[currentLang];
    el.innerHTML = `
      <div class="cd-unit"><span class="cd-num">${String(d).padStart(2,"0")}</span><span class="cd-label">${L.days}</span></div>
      <span class="cd-sep">:</span>
      <div class="cd-unit"><span class="cd-num">${String(h).padStart(2,"0")}</span><span class="cd-label">${L.hours}</span></div>
      <span class="cd-sep">:</span>
      <div class="cd-unit"><span class="cd-num">${String(m).padStart(2,"0")}</span><span class="cd-label">${L.minutes}</span></div>
      <span class="cd-sep">:</span>
      <div class="cd-unit"><span class="cd-num">${String(s).padStart(2,"0")}</span><span class="cd-label">${L.seconds}</span></div>
    `;
  }
  update();
  setInterval(update, 1000);
}

/* ═══════════════════════════════════════════════════
   СТАТУС УРОКА — точные данные из таблицы распорядка
   ═══════════════════════════════════════════════════ */

// Точно из таблицы: урок №, начало, конец (в минутах от 00:00)
const LESSONS = [
  { num: 1, start: 8*60+30,  end: 9*60+15  },  // 8:30 – 9:15
  { num: 2, start: 9*60+25,  end: 10*60+10 },  // 9:25 – 10:10
  { num: 3, start: 10*60+20, end: 11*60+5  },  // 10:20 – 11:05
  { num: 4, start: 11*60+15, end: 12*60+0  },  // 11:15 – 12:00
  { num: 5, start: 12*60+20, end: 13*60+5  },  // 12:20 – 13:05
  { num: 6, start: 13*60+25, end: 14*60+10 },  // 13:25 – 14:10
  { num: 7, start: 14*60+20, end: 15*60+5  },  // 14:20 – 15:05
  { num: 8, start: 15*60+15, end: 16*60+0  },  // 15:15 – 16:00
];

const DAY_START = 8*60+30;  // 8:30 — начало первого урока
const DAY_END   = 16*60+0;  // 16:00 — конец последнего урока

function updateLessonStatus() {
  const el  = document.getElementById("lesson-status");
  if (!el) return;

  const now     = new Date();
  const weekDay = now.getDay(); // 0=вс, 1=пн, ..., 6=сб
  const mins    = now.getHours() * 60 + now.getMinutes();
  const L       = langData[currentLang];

  // ── Выходной (суббота=6, воскресенье=0) ──────────
  if (weekDay === 0 || weekDay === 6) {
    const dayNames = ["вс","пн","вт","ср","чт","пт","сб"];
    // Сколько дней до понедельника
    const daysLeft = weekDay === 6 ? 2 : 1;
    el.className = "lesson-status ls-weekend";
    el.innerHTML = `
      <span class="ls-icon">🎉</span>
      <span class="ls-text">Выходной день</span>
      <span class="ls-remain">пн через ${daysLeft} дн</span>
    `;
    return;
  }

  // ── До начала учёбы (до 8:30) ────────────────────
  if (mins < DAY_START) {
    const remain = DAY_START - mins;
    el.className = "lesson-status ls-before";
    el.innerHTML = `
      <span class="ls-icon">🌅</span>
      <span class="ls-text">До начала занятий</span>
      <span class="ls-remain">${remain} мин</span>
    `;
    return;
  }

  // ── После конца учёбы (после 16:00) ──────────────
  if (mins >= DAY_END) {
    el.className = "lesson-status ls-done";
    el.innerHTML = `
      <span class="ls-icon">🌙</span>
      <span class="ls-text">Занятия окончены</span>
      <span class="ls-remain">до завтра</span>
    `;
    return;
  }

  // ── Ищем: идёт урок или перемена ─────────────────
  for (let i = 0; i < LESSONS.length; i++) {
    const L_cur  = LESSONS[i];
    const L_next = LESSONS[i + 1];

    // Идёт урок
    if (mins >= L_cur.start && mins < L_cur.end) {
      const remain = L_cur.end - mins;
      el.className = "lesson-status ls-lesson";
      el.innerHTML = `
        <span class="ls-icon">📖</span>
        <span class="ls-text">${langData[currentLang].lesson_now} №${L_cur.num}</span>
        <span class="ls-remain">${remain} мин</span>
      `;
      return;
    }

    // Перемена между этим и следующим уроком
    if (L_next && mins >= L_cur.end && mins < L_next.start) {
      const remain = L_next.start - mins;
      // Обед: перемена после урока 4 (12:00–12:20) или после урока 5 (13:05–13:25)
      const isLunch = (L_cur.num === 4) || (L_cur.num === 5);
      el.className = "lesson-status ls-break";
      el.innerHTML = `
        <span class="ls-icon">${isLunch ? "🍽️" : "☕"}</span>
        <span class="ls-text">${isLunch ? "Обед" : langData[currentLang].lesson_break}</span>
        <span class="ls-remain">${remain} мин</span>
      `;
      return;
    }
  }
}

/* ═══════════════════════════════════════════════════
   RIPPLE-ЭФФЕКТ на кнопках/ссылках
   ═══════════════════════════════════════════════════ */
function initRipple() {
  document.querySelectorAll(".nav-item, .lang-btn, .spin-btn, #to-top").forEach(el => {
    el.addEventListener("pointerdown", function(e) {
      const rect   = this.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      ripple.style.cssText = `left:${x}px;top:${y}px`;
      this.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    });
  });
}

/* ═══════════════════════════════════════════════════
   ТЕМА (светлая / тёмная)
   ═══════════════════════════════════════════════════ */
function initTheme() {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;
  const saved = localStorage.getItem("theme") || "dark";
  applyTheme(saved);
  btn.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    applyTheme(next);
    localStorage.setItem("theme", next);
  });
}

function applyTheme(t) {
  document.documentElement.dataset.theme = t;
  const btn = document.getElementById("theme-toggle");
  if (btn) btn.querySelector("i").className = t === "light" ? "fa-solid fa-moon" : "fa-solid fa-sun";
}

/* ═══════════════════════════════════════════════════
   LIGHTBOX
   ═══════════════════════════════════════════════════ */
function initLightbox() {
  const lb    = document.getElementById("lightbox");
  if (!lb) return;
  const img   = document.getElementById("lightbox-img");
  const close = document.querySelector(".close-lightbox");
  const imgs  = [...document.querySelectorAll(".gallery-item img")];
  let cur = 0;

  function openLb(idx) {
    cur = idx;
    img.src = imgs[idx].src;
    lb.style.display = "flex";
    document.body.style.overflow = "hidden";
    updateArrows();
  }
  function closeLb() { lb.style.display = "none"; document.body.style.overflow = ""; }
  function prev() { if (cur > 0) { cur--; img.src = imgs[cur].src; updateArrows(); } }
  function next() { if (cur < imgs.length-1) { cur++; img.src = imgs[cur].src; updateArrows(); } }
  function updateArrows() {
    document.getElementById("lb-prev")?.classList.toggle("hidden", cur === 0);
    document.getElementById("lb-next")?.classList.toggle("hidden", cur === imgs.length - 1);
  }

  imgs.forEach((el, i) => el.addEventListener("click", () => openLb(i)));
  close.addEventListener("click", closeLb);
  lb.addEventListener("click", e => { if (e.target === lb) closeLb(); });
  document.getElementById("lb-prev")?.addEventListener("click", prev);
  document.getElementById("lb-next")?.addEventListener("click", next);
  document.addEventListener("keydown", e => {
    if (lb.style.display !== "flex") return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  });

  // Свайп
  let touchX = 0;
  lb.addEventListener("touchstart", e => { touchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", e => {
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) dx < 0 ? next() : prev();
  });
}

/* ═══════════════════════════════════════════════════
   SCROLL REVEAL
   ═══════════════════════════════════════════════════ */
function initReveal() {
  const items = document.querySelectorAll(".card, .gallery-item, .contact-row, .news-item, .timetable, .groups-wrap");
  if (!('IntersectionObserver' in window)) { items.forEach(el => el.classList.add("visible")); return; }
  items.forEach(el => el.classList.add("reveal"));
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("visible"); obs.unobserve(entry.target); }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -20px 0px" });
  items.forEach(el => obs.observe(el));
}

/* ═══════════════════════════════════════════════════
   SCROLL: навбар + кнопка наверх
   ═══════════════════════════════════════════════════ */
let lastScrollY = 0, ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const topBtn = document.getElementById("to-top");
    const y = window.scrollY;
    if (topBtn) topBtn.style.display = y > 300 ? "flex" : "none";
    lastScrollY = y; ticking = false;
  });
}

/* ─── Активный пункт навигации ───────────────────── */
function setActiveNav() {
  const current = location.pathname.split("/").pop() || "index.html";
  // Основная навигация
  document.querySelectorAll(".nav-item").forEach(a => {
    const href = a.getAttribute("href");
    if (href) a.classList.toggle("active", href === current);
  });
  // Элементы в слайд-ап меню
  document.querySelectorAll(".more-sheet-item").forEach(a => {
    const href = a.getAttribute("href");
    if (href) a.classList.toggle("active", href === current);
  });
  // Если активная страница находится в "Ещё" — показываем бэйдж на кнопке
  const morePages = ["about.html","gallery.html","wheel.html"];
  const badge = document.getElementById("more-badge");
  if (badge) badge.classList.toggle("show", morePages.includes(current));
}

/* ═══════════════════════════════════════════════════
   МЕНЮ "ЕЩЁ" — создаётся динамически, всегда fixed
   ═══════════════════════════════════════════════════ */
function initMoreMenu() {
  const btn = document.getElementById('more-btn');
  if (!btn) return;

  /* Сброс стиля кнопки — Android WebView даёт белый фон кнопкам */
  btn.setAttribute('style', [
    'background:none !important',
    'border:none !important',
    'outline:none',
    'padding:6px 2px 4px',
    '-webkit-appearance:none',
    'appearance:none',
    'color:rgba(235,235,245,0.6)',
    'font-family:inherit',
    'cursor:pointer',
    'flex:1',
    'display:flex',
    'flex-direction:column',
    'align-items:center',
    'justify-content:center',
    'gap:3px',
    'font-size:0.54rem',
    'letter-spacing:0.02em',
    'font-weight:500',
    'transition:color 0.2s',
    'position:relative',
    'overflow:hidden',
    '-webkit-tap-highlight-color:transparent'
  ].join(';'));

  const cur = location.pathname.split('/').pop() || 'index.html';
  let overlay = null, sheet = null, open = false;

  function buildDOM() {
    if (overlay) return; // уже создано

    /* Оверлей */
    overlay = document.createElement('div');
    overlay.setAttribute('style', [
      'position:fixed',
      'top:0','left:0','right:0','bottom:0',
      'z-index:9000',
      'background:rgba(0,0,0,0.65)',
      'opacity:0',
      'transition:opacity 0.3s ease',
      '-webkit-tap-highlight-color:transparent'
    ].join(';'));
    document.body.appendChild(overlay);

    /* Шит */
    sheet = document.createElement('div');
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    sheet.setAttribute('style', [
      'position:fixed',
      'left:0','right:0','bottom:0',
      'z-index:9001',
      'background:' + (isLight ? '#f2f2f7' : '#1c1c1e'),
      'border-radius:22px 22px 0 0',
      'border-top:1px solid rgba(255,255,255,0.1)',
      'box-shadow:0 -20px 80px rgba(0,0,0,0.9)',
      'padding-bottom:32px',
      'transform:translateY(100%)',
      'transition:transform 0.4s cubic-bezier(0.32,0.72,0,1)'
    ].join(';'));

    function mi(href, icon, label) {
      const active = cur === href;
      const c  = active ? '#0A84FF' : (isLight ? '#1c1c1e' : 'rgba(235,235,245,0.85)');
      const ic = active ? '#0A84FF' : (isLight ? 'rgba(0,0,0,0.4)' : 'rgba(235,235,245,0.45)');
      const bg = isLight ? 'rgba(255,255,255,0.9)' : 'rgba(44,44,46,0.95)';
      return `<a href="${href}" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:9px;padding:20px 8px;border-radius:18px;text-decoration:none;background:${bg};border:0.5px solid rgba(255,255,255,0.08);color:${c};font-size:0.73rem;font-weight:600;text-align:center;-webkit-tap-highlight-color:transparent;"><i class="fa-solid ${icon}" style="font-size:1.4rem;color:${ic}"></i>${label}</a>`;
    }

    sheet.innerHTML = `
      <div style="width:40px;height:5px;background:rgba(255,255,255,0.2);border-radius:3px;margin:14px auto 12px"></div>
      <div style="font-size:0.68rem;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:rgba(235,235,245,0.35);padding:0 20px 14px">ЕЩЁ</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;padding:0 14px">
        ${mi('about.html',   'fa-user',        'О создателе')}
        ${mi('gallery.html', 'fa-images',      'Галерея')}
        ${mi('wheel.html',   'fa-dharmachakra','Колесо фортуны')}
      </div>`;
    document.body.appendChild(sheet);

    /* Закрытие по оверлею */
    overlay.addEventListener('touchend', function(e) {
      e.preventDefault(); closeSheet();
    }, { passive: false });
    overlay.addEventListener('click', closeSheet);

    /* Свайп вниз */
    let sy = 0;
    sheet.addEventListener('touchstart', e => { sy = e.touches[0].clientY; }, { passive: true });
    sheet.addEventListener('touchmove',  e => {
      if (e.touches[0].clientY - sy > 80) closeSheet();
    }, { passive: true });

    /* Тема */
    new MutationObserver(() => {
      const l = document.documentElement.getAttribute('data-theme') === 'light';
      if (sheet) sheet.style.background = l ? '#f2f2f7' : '#1c1c1e';
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  function openSheet() {
    if (open) return;
    buildDOM(); // создаём DOM только при первом открытии
    open = true;
    requestAnimationFrame(() => {
      overlay.style.opacity  = '1';
      sheet.style.transform  = 'translateY(0)';
    });
    btn.setAttribute('style', btn.getAttribute('style').replace('rgba(235,235,245,0.6)', '#0A84FF'));
  }

  function closeSheet() {
    if (!open) return;
    open = false;
    overlay.style.opacity = '0';
    sheet.style.transform = 'translateY(100%)';
    btn.setAttribute('style', btn.getAttribute('style').replace('#0A84FF', 'rgba(235,235,245,0.6)'));
  }

  /* Обработчик кнопки — защита от двойного срабатывания touchend+click */
  let _lt = 0;
  function handleTap(e) {
    const now = Date.now();
    if (now - _lt < 350) return;
    _lt = now;
    if (e.cancelable) e.preventDefault();
    open ? closeSheet() : openSheet();
  }

  btn.addEventListener('touchend', handleTap, { passive: false });
  btn.addEventListener('click',    handleTap);
}

/* ═══════════════════════════════════════════════════
   POPUP УВЕДОМЛЕНИЙ — на весь экран, стильный
   ═══════════════════════════════════════════════════ */
function initPushNotifications() {
  // Показываем popup при первом запуске всегда
  // (даже если Notification API недоступен — в Median уведомления идут через нативный слой)
  if (localStorage.getItem('kgk_notif_asked')) return;
  setTimeout(showNotifPopup, 1000);
}

function showNotifPopup() {
  if (document.getElementById('kgk-notif-popup')) return;

  const popup = document.createElement('div');
  popup.id = 'kgk-notif-popup';
  popup.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999;display:flex;align-items:flex-end;';

  popup.innerHTML = `
    <div id="kgk-np-bd" style="
      position:absolute;top:0;left:0;right:0;bottom:0;
      background:rgba(0,0,0,0.75);
      opacity:0;
      transition:opacity 0.4s ease;
    "></div>
    <div id="kgk-np-card" style="
      position:relative;z-index:1;width:100%;
      background:linear-gradient(170deg,#0d0d1a 0%,#0a1628 40%,#0d2044 100%);
      border-radius:28px 28px 0 0;
      border-top:1px solid rgba(100,150,255,0.2);
      padding:36px 24px calc(env(safe-area-inset-bottom,0px) + 36px);
      text-align:center;
      box-shadow:0 -24px 80px rgba(0,0,50,0.9),0 -1px 0 rgba(100,150,255,0.15);
      transform:translateY(100%);
      transition:transform 0.45s cubic-bezier(0.32,0.72,0,1);
    ">
      <div id="kgk-np-bell" style="font-size:4rem;line-height:1;margin-bottom:18px;display:inline-block;
        filter:drop-shadow(0 0 20px rgba(10,132,255,0.8))">🔔</div>
      <h2 style="
        font-family:'Montserrat',sans-serif;font-size:1.3rem;font-weight:900;
        color:#fff;margin:0 0 10px;letter-spacing:-0.02em;line-height:1.25;
      ">Уведомления о расписании</h2>
      <p style="
        font-size:0.88rem;line-height:1.65;
        color:rgba(180,200,255,0.7);margin:0 0 28px;
      ">Разреши уведомления — и ты первым узнаешь об изменениях в расписании занятий</p>
      <button id="kgk-np-yes" style="
        display:block;width:100%;padding:18px;
        background:linear-gradient(135deg,#0A84FF 0%,#0055cc 100%);
        border:none;border-radius:16px;
        font-family:'Montserrat',sans-serif;font-size:1rem;font-weight:800;
        color:#fff;
        box-shadow:0 6px 28px rgba(10,132,255,0.55);
        cursor:pointer;margin-bottom:10px;
        -webkit-appearance:none;appearance:none;
      ">🔔 Включить уведомления</button>
      <button id="kgk-np-no" style="
        display:block;width:100%;padding:16px;
        background:rgba(255,255,255,0.06);
        border:1px solid rgba(255,255,255,0.1);border-radius:16px;
        font-family:'Montserrat',sans-serif;font-size:0.9rem;font-weight:700;
        color:rgba(180,200,255,0.55);
        cursor:pointer;
        -webkit-appearance:none;appearance:none;
      ">Не сейчас</button>
    </div>`;

  document.body.appendChild(popup);

  /* Анимация входа — через opacity (работает везде) */
  requestAnimationFrame(() => requestAnimationFrame(() => {
    popup.querySelector('#kgk-np-bd').style.opacity       = '1';
    popup.querySelector('#kgk-np-card').style.transform   = 'translateY(0)';
  }));

  /* Пульс колокола */
  const bell = popup.querySelector('#kgk-np-bell');
  let bp = 0;
  const bellAnim = setInterval(() => {
    bp++;
    bell.style.transition = 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)';
    bell.style.transform  = (bp % 2 === 0) ? 'scale(1.2) rotate(20deg)' : 'scale(1) rotate(-5deg)';
    if (bp >= 8) { clearInterval(bellAnim); bell.style.transform = 'scale(1) rotate(0deg)'; }
  }, 600);

  function closePopup(then) {
    clearInterval(bellAnim);
    popup.querySelector('#kgk-np-card').style.transform = 'translateY(110%)';
    popup.querySelector('#kgk-np-bd').style.opacity     = '0';
    setTimeout(() => { if (popup.parentNode) popup.remove(); if (then) then(); }, 460);
  }

  function handleYes() {
    localStorage.setItem('kgk_notif_asked', '1');
    closePopup(() => {
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    });
  }
  function handleNo() {
    localStorage.setItem('kgk_notif_asked', '1');
    closePopup();
  }

  let _yt = 0, _nt = 0;
  popup.querySelector('#kgk-np-yes').addEventListener('touchend', e => {
    e.preventDefault(); const n = Date.now(); if (n-_yt<400) return; _yt=n; handleYes();
  }, { passive: false });
  popup.querySelector('#kgk-np-yes').addEventListener('click', () => { if (Date.now()-_yt>400) handleYes(); });
  popup.querySelector('#kgk-np-no').addEventListener('touchend', e => {
    e.preventDefault(); const n = Date.now(); if (n-_nt<400) return; _nt=n; handleNo();
  }, { passive: false });
  popup.querySelector('#kgk-np-no').addEventListener('click', () => { if (Date.now()-_nt>400) handleNo(); });
}

/* ── Отправить уведомление (консоль при обновлении расписания) ── */
window.sendScheduleNotification = function(text) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  new Notification('КГК — Расписание', {
    body: text || 'Расписание обновлено!',
    icon: 'https://images.unsplash.com/photo-1562774053-701939374585?w=192&h=192&fit=crop'
  });
};

/* ═══════════════════════════════════════════════════
   ИНИЦИАЛИЗАЦИЯ
   ═══════════════════════════════════════════════════ */

/* ── 120fps hint ── */
if ('scheduler' in window && 'postTask' in scheduler) {
  // Chrome 94+ поддерживает высокий приоритет
}
// Форсируем GPU рендер
// GPU-ускорение через will-change на body — не ломает fixed позиционирование
document.body.style.willChange = 'scroll-position';

document.addEventListener("DOMContentLoaded", () => {
  // Инициализируем Service Worker для уведомлений
  initPushNotifications();

  const savedLang = localStorage.getItem("lang") || "ru";
  setLanguage(savedLang);

  document.querySelectorAll(".lang-btn").forEach(btn =>
    btn.addEventListener("click", () => setLanguage(btn.dataset.lang))
  );

  initParticles();
  initTheme();
  initRipple();
  initLightbox();
  initReveal();
  initCountdown();
  setActiveNav();
  initTypewriter();
  initMoreMenu();

  // Статус урока + обновление каждую минуту
  updateLessonStatus();
  setInterval(updateLessonStatus, 30000);

  window.addEventListener("scroll", onScroll, { passive: true });

  document.getElementById("to-top")?.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );
});
                                
