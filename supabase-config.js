// ============================================================
// KATRAN DERGİ — SUPABASE BAĞLANTI AYARLARI
// ============================================================

// Supabase CDN'den yükleniyor (index.html'de <script> olarak ekleyeceğiz)
// Bu dosya sadece config tutar.

const SUPABASE_URL = 'https://bdxvgtxregsonbvhvdav.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkeHZndHhyZWdzb25idmh2ZGF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0MzM4ODcsImV4cCI6MjEwNTAwOTg4N30.7gQGqcvDzTKpQyjnRkmcCrwPny3m5pfUOy4BWk7O0CQ';

// Supabase istemcisini oluştur
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================================
// YARDIMCI FONKSİYONLAR
// ============================================================

// Kullanıcı giriş yapmış mı?
async function getCurrentUser() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    return user;
}

// Kullanıcı profilini getir
async function getProfile(userId) {
    const { data, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    
    if (error) return null;
    return data;
}

// Çıkış yap
async function signOut() {
    await supabaseClient.auth.signOut();
    window.location.href = 'index.html';
}

// Türkçe hata mesajları
function translateError(message) {
    const errors = {
        'Invalid login credentials': 'E-posta veya şifre hatalı.',
        'Email not confirmed': 'E-posta adresin doğrulanmamış.',
        'User already registered': 'Bu e-posta zaten kayıtlı.',
        'Password should be at least 6 characters': 'Şifre en az 6 karakter olmalı.',
        'Unable to validate email address: invalid format': 'Geçersiz e-posta adresi.',
        'Email rate limit exceeded': 'Çok fazla deneme yaptınız. Lütfen bekleyin.',
        'signup is disabled': 'Kayıt sistemi şu anda kapalı.',
    };
    return errors[message] || message;
}
