/* ============================================
   KATRAN DERGİ — AVATAR SİSTEMİ
   ============================================ */
window.KATRAN_AVATARS = {
  harf: null,
  
  // Kalem — modern, eğik, uçlu
  kalem: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>',
  
  // Kitap — açık kitap, iki sayfa
  kitap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/></svg>',
  
  // Meşale — klasik, alevli
   mesale: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22V10"/><path d="M9 22h6"/><path d="M11 8h2v2h-2z"/><path d="M12 8c-1.8-1.5-3-3.5-3-5 0 0 1.5 1 3 3 1.5-2 3-3 3-3 0 1.5-1.2 3.5-3 5z"/><path d="M12 6.5c-.5-.7-.8-1.5-.8-2.2 0 0 .5.4.8 1.2.3-.8.8-1.2.8-1.2 0 .7-.3 1.5-.8 2.2z" fill="currentColor" stroke="none" opacity="0.4"/></svg>' ,
  
  // Karanfil — zarif, taç yapraklı, saplı, yapraklı
  karanfil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4c-1.2 1.5-2 3-2 4.5 0 1 .5 1.8 1.2 2.2"/><path d="M12 4c1.2 1.5 2 3 2 4.5 0 1-.5 1.8-1.2 2.2"/><path d="M12 4c-2 1.8-3.5 3.5-3.5 5.5 0 2 1.5 3.5 3.5 3.5s3.5-1.5 3.5-3.5c0-2-1.5-3.7-3.5-5.5z"/><path d="M9 8.5c-1 .3-1.8 1-2 2 .8.4 1.7.3 2.5-.3"/><path d="M15 8.5c1 .3 1.8 1 2 2-.8.4-1.7.3-2.5-.3"/><path d="M12 13v9"/><path d="M12 16c-1.5-.8-3-.6-3.8.3.5 1 1.7 1.5 3.8 1.2"/><path d="M12 19c1.5-.8 3-.6 3.8.3-.5 1-1.7 1.5-3.8 1.2"/></svg>',
  
  // Gülen Yüz — sade, gülen
  gulenyuz: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>'
};

window.KATRAN_AVATAR_LIST = [
  { id: 'harf', label: 'Baş Harf' },
  { id: 'kalem', label: 'Kalem' },
  { id: 'kitap', label: 'Kitap' },
  { id: 'mesale', label: 'Meşale' },
  { id: 'karanfil', label: 'Karanfil' },
  { id: 'gulenyuz', label: 'Gülen Yüz' }
];

// Yardımcı: avatar HTML'i döndür
window.renderAvatar = function(profile, size) {
  if (!profile) profile = {};
  var avatarId = profile.avatar || 'harf';
  var initial = (profile.full_name || 'K').charAt(0).toUpperCase();
  size = size || 40;
  
  var fontSize = Math.round(size * 0.42);
  var svgSize = Math.round(size * 0.6);
  
  var inner = '';
  if (avatarId === 'harf' || !window.KATRAN_AVATARS[avatarId]) {
    inner = '<span style="font-family: \'Playfair Display\', serif; font-weight: 900; font-size: ' + fontSize + 'px; line-height: 1;">' + initial + '</span>';
  } else {
    var svg = window.KATRAN_AVATARS[avatarId];
    svg = svg.replace('<svg ', '<svg style="width:' + svgSize + 'px;height:' + svgSize + 'px;display:block;" ');
    inner = svg;
  }
  
  return '<div class="katran-avatar" style="width:' + size + 'px;height:' + size + 'px;border-radius:50%;background:linear-gradient(135deg, var(--bordo, #8b2e3e), var(--bordo-dark, #6b1f2e));display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0;font-weight:900;overflow:hidden;">' + inner + '</div>';
};