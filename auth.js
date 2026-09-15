// ============================================================
// KATRAN DERGİ — GİRİŞ / KAYIT / ÇIKIŞ İŞLEMLERİ
// ============================================================

// ----- KAYIT OL (Başvuru Formu) -----
async function applyAsMember(formData) {
    const { email, full_name, username, password, reason } = formData;
    
    // 1. Önce başvuruyu kaydet
    const { error: appError } = await supabaseClient
        .from('applications')
        .insert([{
            email: email,
            full_name: full_name,
            username: username,
            reason: reason,
            status: 'pending'
        }]);
    
    if (appError) {
        if (appError.code === '23505') {
            return { success: false, message: 'Bu e-posta ile zaten başvuru yapılmış.' };
        }
        return { success: false, message: 'Başvuru kaydedilemedi: ' + appError.message };
    }
    
    // 2. Auth kullanıcısı oluştur (henüz onaylanmadı, sadece hesap açıldı)
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
        message: 'Başvurun alındı! E-postanı kontrol et ve hesabını doğrula. Yönetim onayından sonra giriş yapabilirsin.'
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
    
    // Kullanıcı profilini kontrol et (onaylı mı?)
    const profile = await getProfile(data.user.id);
    
    if (!profile) {
        await supabaseClient.auth.signOut();
        return { success: false, message: 'Profil bulunamadı. Lütfen başvurunuzu yapın.' };
    }
    
    if (profile.status === 'pending') {
        await supabaseClient.auth.signOut();
        return { 
            success: false, 
            message: 'Başvurun henüz onaylanmadı. Yönetim inceledikten sonra e-posta ile bilgilendirileceksin.' 
        };
    }
    
    if (profile.status === 'banned') {
        await supabaseClient.auth.signOut();
        return { success: false, message: 'Hesabınız topluluk kuralları ihlali nedeniyle askıya alınmıştır.' };
    }
    
    return { success: true, profile: profile };
}

// ----- ŞİFRE SIFIRLAMA E-POSTASI -----
async function resetPassword(email) {
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/sifre-yenile.html'
    });
    
    if (error) {
        return { success: false, message: translateError(error.message) };
    }
    return { success: true, message: 'Şifre sıfırlama bağlantısı e-postana gönderildi.' };
}

// ----- OTURUM DURUMUNU KONTROL ET -----
async function checkAuthState() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    return session;
}

// ----- KULLANICIYI YÖNLENDİR (yetki kontrolü) -----
async function requireAuth(redirectTo = 'giris.html') {
    const session = await checkAuthState();
    if (!session) {
        window.location.href = redirectTo;
        return null;
    }
    const profile = await getProfile(session.user.id);
    if (!profile || profile.status !== 'approved') {
        window.location.href = 'giris.html';
        return null;
    }
    return profile;
}

// ----- ÇIKIŞ YAP -----
async function logOut() {
    await supabaseClient.auth.signOut();
    window.location.href = 'index.html';
      }
