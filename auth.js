// ============================================================
// KATRAN DERGİ — KAYIT VE GİRİŞ FONKSİYONLARI
// ============================================================

console.log('✅ auth.js yüklendi');

// ----- TÜRKÇE HATA MESAJLARI -----
function translateError(message) {
    if (!message) return 'Bilinmeyen bir hata oluştu.';
    const errors = {
        'Invalid login credentials': 'E-posta veya şifre hatalı.',
        'Email not confirmed': 'E-posta adresiniz henüz doğrulanmamış.',
        'User already registered': 'Bu e-posta adresi ile zaten kayıt olunmuş.',
        'Password should be at least 6 characters': 'Şifre en az 6 karakter olmalıdır.',
        'Unable to validate email address: invalid format': 'Geçersiz e-posta adresi formatı.',
        'Email rate limit exceeded': 'Çok fazla istek gönderildi. Lütfen bekleyin.',
        'signup is disabled': 'Kayıt sistemi şu anda kapalıdır.'
    };
    return errors[message] || message;
}

// ============================================================
// KAYIT / BAŞVURU FONKSİYONU
// ============================================================
async function applyAsMember(formData) {
    console.log('📝 applyAsMember başladı:', formData.email);
    
    const { email, full_name, username, password, reason } = formData;
    
    // ADIM 1: Başvuruyu applications tablosuna kaydet
    console.log('📝 Adım 1: applications tablosuna kayıt...');
    const { data: appData, error: appError } = await supabaseClient
        .from('applications')
        .insert([{
            email: email,
            full_name: full_name,
            username: username,
            reason: reason,
            status: 'pending'
        }])
        .select();
    
    if (appError) {
        console.error('❌ applications INSERT hatası:', appError);
        if (appError.code === '23505') {
            return { success: false, message: 'Bu e-posta veya kullanıcı adı ile zaten bir başvuru var.' };
        }
        return { success: false, message: 'Başvuru kaydedilemedi: ' + appError.message };
    }
    
    console.log('✅ applications kaydı başarılı:', appData);
    
    // ADIM 2: Supabase Auth kullanıcısı oluştur
    console.log('📝 Adım 2: auth.signUp çağrılıyor...');
    const { data: authData, error: authError } = await supabaseClient.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                full_name: full_name,
                username: username
            }
        }
    });
    
    if (authError) {
        console.error('❌ signUp hatası:', authError);
        return { success: false, message: translateError(authError.message) };
    }
    
    console.log('✅ signUp başarılı:', authData);
    
    return { 
        success: true, 
        message: 'Başvurun başarıyla alındı! Yönetim onayından sonra giriş yapabilirsin.'
    };
}

// ============================================================
// GİRİŞ FONKSİYONU
// ============================================================
async function signIn(email, password) {
    console.log('🔐 signIn başladı:', email);
    
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });
    
    if (error) {
        console.error('❌ signIn hatası:', error);
        return { success: false, message: translateError(error.message) };
    }
    
    console.log('✅ signIn başarılı:', data.user.id);
    return { success: true, user: data.user };
}

// ============================================================
// ÇIKIŞ FONKSİYONU
// ============================================================
async function signOut() {
    await supabaseClient.auth.signOut();
    window.location.href = 'index.html';
}

// ============================================================
// ŞİFRE SIFIRLAMA
// ============================================================
async function resetPassword(email) {
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/giris.html'
    });
    
    if (error) {
        return { success: false, message: translateError(error.message) };
    }
    return { success: true, message: 'Şifre sıfırlama bağlantısı e-postana gönderildi.' };
                }
