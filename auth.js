// ============================================================
// KATRAN DERGİ — GİRİŞ / KAYIT / ÇAKIŞMASIZ AYARLAR
// ============================================================

// Türkçe hata mesajları çeviricisi
function translateError(message) {
    if (!message) return 'Bilinmeyen bir hata oluştu.';
    const errors = {
        'Invalid login credentials': 'E-posta veya şifre hatalı.',
        'Email not confirmed': 'E-posta adresiniz henüz doğrulanmamış. Lütfen gelen kutunuzu kontrol edin.',
        'User already registered': 'Bu e-posta adresi ile zaten kayıt olunmuş.',
        'Password should be at least 6 characters': 'Şifre en az 6 karakter olmalıdır.',
        'Unable to validate email address: invalid format': 'Geçersiz e-posta adresi formatı.',
        'Email rate limit exceeded': 'Çok fazla istek gönderildi. Lütfen bir dakika bekleyip tekrar deneyin.',
        'signup is disabled': 'Kayıt sistemi şu anda kapalıdır.'
    };
    return errors[message] || message;
}

// ----- KAYIT OL VE BAŞVURU YAP -----
async function applyAsMember(formData) {
    const { email, full_name, username, password, reason } = formData;
    
    // 1. Önce başvuruyu veritabanına kaydet
    const { error: appError } = await supabaseClient
        .from('applications')
        .insert([{
            email: email,
            full_name: full_name,
            username: username,
            reason: reason,
            status: 'pending' // Başlangıç durumu beklemede
        }]);
    
    if (appError) {
        if (appError.code === '23505') {
            return { success: false, message: 'Bu e-posta veya kullanıcı adı ile zaten bir başvuru var.' };
        }
        return { success: false, message: 'Başvuru kaydedilemedi: ' + appError.message };
    }
    
    // 2. Supabase Auth kullanıcısı oluştur
    const { data: authData, error: authError } = await supabaseClient.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                full_name: full_name,
                username: username
            },
            emailRedirectTo: window.location.origin + '/giris.html'
        }
    });
    
    if (authError) {
        return { success: false, message: translateError(authError.message) };
    }
    
    return { 
        success: true, 
        message: 'Başvurun başarıyla alındı! E-postana bir doğrulama linki gönderildi. Lütfen gelen kutunu (veya spam klasörünü) kontrol ederek hesabını doğrula. Yönetim onayından sonra giriş yapabilirsin.'
    };
}

// ----- GİRİŞ YAP -----
async function signIn(email, password) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });
    
    if (error) {
        return { success: false, message: translateError(error.message) };
    }
    
    // Giriş yapan kullanıcının durumunu kontrol et
    const { data: appData, error: appFetchError } = await supabaseClient
        .from('applications')
        .select('status')
        .eq('email', email)
        .single();
    
    if (appFetchError || !appData) {
        await supabaseClient.auth.signOut();
        return { success: false, message: 'Başvuru kaydınız bulunamadı. Lütfen önce başvuru yapın.' };
    }
    
    if (appData.status === 'pending') {
        await supabaseClient.auth.signOut();
        return { 
            success: false, 
            message: 'Başvurun henüz onaylanmadı. Yönetim onayladıktan sonra giriş yapabilirsin.' 
        };
    }
    
    if (appData.status === 'banned' || appData.status === 'rejected') {
        await supabaseClient.auth.signOut();
        return { success: false, message: 'Hesabınız onaylanmadı veya askıya alındı.' };
    }
    
    return { success: true, user: data.user };
}
