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
    requestAnimationFrame(loop);
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
    const nav    = document.querySelector(".bottom-nav");
    const topBtn = document.getElementById("to-top");
    const y = window.scrollY;
    if (topBtn) topBtn.style.display = y > 300 ? "flex" : "none";
    if (nav) nav.style.transform = (y > lastScrollY && y > 160) ? "translateY(100%)" : "translateY(0)";
    lastScrollY = y; ticking = false;
  });
}

/* ─── Активный пункт навигации ───────────────────── */
function setActiveNav() {
  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-item").forEach(a =>
    a.classList.toggle("active", a.getAttribute("href") === current)
  );
}

/* ═══════════════════════════════════════════════════
   ИНИЦИАЛИЗАЦИЯ
   ═══════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
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

  // Статус урока + обновление каждую минуту
  updateLessonStatus();
  setInterval(updateLessonStatus, 30000);

  window.addEventListener("scroll", onScroll, { passive: true });

  document.getElementById("to-top")?.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );
});
