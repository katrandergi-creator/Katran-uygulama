/* ============================================
   KATRAN DERGİ — TEMA + AVATAR + MENÜ
   ============================================ */
(function() {
  'use strict';

  // ---------- AVATAR SİSTEMİNİ YÜKLE ----------
  if (!window.KATRAN_AVATARS) {
    var s = document.createElement('script');
    s.src = 'avatares.js';
    document.head.appendChild(s);
  }

  // ---------- TEMA ----------
  var saved = localStorage.getItem('katran-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);

  // ---------- İKONLAR ----------
  window.KATRAN_ICONS = {
    book: '<svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    mail: '<svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
    user: '<svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    shield: '<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>'
  };

  // ---------- TEMA SEÇİCİ ----------
  function addSwitcher() {
    if (document.getElementById('katranThemeSwitcher')) return;

    var switcher = document.createElement('div');
    switcher.className = 'theme-switcher';
    switcher.id = 'katranThemeSwitcher';
    switcher.innerHTML =
      '<button class="theme-btn" data-theme-set="dark" title="Karanlık Tema">' +
        '<svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>' +
      '</button>' +
      '<button class="theme-btn" data-theme-set="light" title="Aydınlık Tema">' +
        '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>' +
      '</button>' +
      '<button class="theme-btn" data-theme-set="katran" title="Katran Teması">' +
        '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2a10 10 0 0 1 10 10"/><path d="M12 22a10 10 0 0 1-10-10"/><path d="M2 12a10 10 0 0 1 10-10"/><path d="M22 12a10 10 0 0 1-10 10"/></svg>' +
      '</button>';

    document.body.appendChild(switcher);
    updateActive();

    switcher.querySelectorAll('.theme-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var theme = this.getAttribute('data-theme-set');
        localStorage.setItem('katran-theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
        updateActive();
      });
    });
  }

  function updateActive() {
    var current = localStorage.getItem('katran-theme') || 'dark';
    document.querySelectorAll('.theme-btn').forEach(function(b) {
      b.classList.toggle('active', b.getAttribute('data-theme-set') === current);
    });
  }

  // ---------- ALT MENÜ ----------
  function addBottomNav() {
    if (document.getElementById('katranBottomNav')) return;
    if (document.querySelector('.bottom-nav')) return;

    var path = window.location.pathname.split('/').pop() || 'index.html';
    var activePage = {
      'akis.html': 'akis',
      'kitaplar.html': 'kitaplar',
      'kitapligim.html': 'kitaplar',
      'profil.html': 'profil',
      'kullanici.html': 'profil',
      'profil-duzenle.html': 'profil',
      'mesajlar.html': 'mesaj',
      'sohbet.html': 'mesaj',
      'gonderi.html': 'gonderi',
      'paylas.html': 'gonderi',
      'alinti.html': 'gonderi',
      'analiz.html': 'gonderi',
      'bildirimler.html': 'akis',
      'gruplar.html': 'mesaj',
      'grup.html': 'mesaj',
      'grup-olustur.html': 'mesaj'
    }[path] || '';

    var I = window.KATRAN_ICONS;
    var nav = document.createElement('nav');
    nav.className = 'bottom-nav';
    nav.id = 'katranBottomNav';
    nav.innerHTML =
      '<div class="bottom-nav-inner">' +
        '<a href="akis.html" class="bn-item ' + (activePage === 'akis' ? 'active' : '') + '">' + I.book + '<span>Akış</span></a>' +
        '<a href="kitaplar.html" class="bn-item ' + (activePage === 'kitaplar' ? 'active' : '') + '">' + I.search + '<span>Kitaplar</span></a>' +
        '<a href="paylas.html" class="bn-create" title="Paylaş">' + I.plus + '</a>' +
        '<a href="mesajlar.html" class="bn-item ' + (activePage === 'mesaj' ? 'active' : '') + '">' + I.mail + '<span>Mesaj</span></a>' +
        '<a href="profil.html" class="bn-item ' + (activePage === 'profil' ? 'active' : '') + '">' + I.user + '<span>Profil</span></a>' +
      '</div>';

    document.body.appendChild(nav);
    document.body.style.paddingBottom = '90px';
  }

  // ---------- BAŞLAT ----------
  function init() {
    addSwitcher();
    var path = window.location.pathname.split('/').pop() || 'index.html';
    var skip = ['index.html', 'giris.html', 'kayit.html', 'kurallar.html', 'sohbet.html', 'mesajlar.html', 'grup.html', ''];
    if (skip.indexOf(path) === -1) {
      addBottomNav();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();