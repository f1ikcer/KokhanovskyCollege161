/* ═══════════════════════════════════════════════════
   Service Worker — КГК Push Notifications
   ═══════════════════════════════════════════════════ */

const CACHE_NAME = 'kgk-v1';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

/* ── Push-уведомление ── */
self.addEventListener('push', e => {
  let data = { title: 'КГК — Расписание', body: 'Расписание обновлено!', url: '/KokhanovskyCollege161/schedule.html' };
  try {
    if (e.data) data = { ...data, ...e.data.json() };
  } catch(err) {}

  e.waitUntil(
    self.registration.showNotification(data.title, {
      body:    data.body,
      icon:    'https://images.unsplash.com/photo-1562774053-701939374585?w=192&h=192&fit=crop',
      badge:   'https://images.unsplash.com/photo-1562774053-701939374585?w=96&h=96&fit=crop',
      tag:     'schedule-update',
      renotify: true,
      data:    { url: data.url }
    })
  );
});

/* ── Клик по уведомлению — открыть расписание ── */
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url)
    ? e.notification.data.url
    : '/KokhanovskyCollege161/schedule.html';

  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(wcs => {
      for (const wc of wcs) {
        if (wc.url.includes('KokhanovskyCollege161')) {
          wc.focus();
          return wc.navigate(url);
        }
      }
      return clients.openWindow(url);
    })
  );
});

/* ── Команда от страницы: отправить тестовое уведомление ── */
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'TEST_NOTIF') {
    self.registration.showNotification('КГК — Расписание', {
      body:    e.data.body || 'Расписание было обновлено!',
      icon:    'https://images.unsplash.com/photo-1562774053-701939374585?w=192&h=192&fit=crop',
      badge:   'https://images.unsplash.com/photo-1562774053-701939374585?w=96&h=96&fit=crop',
      tag:     'schedule-update',
      renotify: true,
      data:    { url: '/KokhanovskyCollege161/schedule.html' }
    });
  }
});
