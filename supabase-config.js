// ============================================================
// KATRAN DERGİ — SUPABASE BAĞLANTI AYARLARI
// ============================================================

const SUPABASE_URL = 'https://bdxvgtxregsonbvhvdav.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkeHZndHhyZWdzb25idmh2ZGF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0MzM4ODcsImV4cCI6MjEwNTAwOTg4N30.7gQGqcvDzTKpQyjnRkmcCrwPny3m5pfUOy4BWk7O0CQ';

// Supabase istemcisini oluştur
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
