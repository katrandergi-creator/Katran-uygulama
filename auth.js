// ============================================================
// KATRAN DERGİ — GİRİŞ / KAYIT / ÇIKIŞ İŞLEMLERİ (GÜNCELLENDİ)
// ============================================================

// Hataları Türkçe'ye çeviren yardımcı fonksiyon (Eksikse sistem kilitlenmesin diye eklendi)
function translateError(msg) {
    if (!msg) return 'Bilinmeyen bir hata oluştu.';
    if (msg.includes('Email not confirmed')) return 'E-posta adresiniz henüz doğrulanmamış. Lütfen gelen kutunuzu kontrol edin.';
    if (msg.includes('Invalid login credentials')) return 'E-posta veya şifre hatalı.';
    return msg;
}

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
    
    // 2. Auth kullanıcısı oluştur
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
        message: 'Başvurun başarıyla alındı! E-postana bir doğrulama linki gönderildi. Lütfen e-postanı kontrol et ve hesabını doğrula. Yönetim onayından sonra giriş yapabilirsin.'
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
    
    // Düzenleme: Profil yerine kullanıcının başvuru durumunu 'applications' tablosundan kontrol ediyoruz
    const { data: appData, error: appFetchError } = await supabaseClient
        .from('applications')
        .select('status')
        .eq('email', email)
        .single();
    
    if (appFetchError || !appData) {
        await supabaseClient.auth.signOut();
        return { success: false, message: 'Başvuru kaydınız bulunamadı. Lütfen önce kayıt olun.' };
    }
    
    if (appData.status === 'pending') {
        await supabaseClient.auth.signOut();
        return { 
            success: false, 
            message: 'Başvurun henüz onaylanmadı. Yönetim inceledikten sonra giriş yapabilirsin.' 
        };
    }
    
    if (appData.status === 'banned' || appData.status === 'rejected') {
        await supabaseClient.auth.signOut();
        return { success: false, message: 'Hesabınız onaylanmadı veya topluluk kuralları nedeniyle askıya alındı.' };
    }
    
    return { success: true, user: data.user, status: appData.status };
}

// ----- ŞİFRE SIFIRLAMA -----
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

// ----- REQURE AUTH (Yönlendirme) -----
async function requireAuth(redirectTo = 'giris.html') {
    const session = await checkAuthState();
    if (!session) {
        window.location.href = redirectTo;
        return null;
    }
    
    const { data: appData } = await supabaseClient
        .from('applications')
        .select('status')
        .eq('email', session.user.email)
        .single();
        
    if (!appData || appData.status !== 'approved') {
        window.location.href = 'giris.html';
        return null;
    }
    return session.user;
}

// ----- ÇIKIŞ YAP -----
async function logOut() {
    await supabaseClient.auth.signOut();
    window.location.href = 'index.html';
}

// ============================================================
// OTOMATİK TARAYICI TETİKLEYİCİLERİ (Arayüz Bağlantıları)
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Kayıt Formu Tetikleyicisi
    const registerForm = document.querySelector('form#kayitFormu') || document.querySelector('form[action*="kayit"]');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.disabled = true;
            
            const formData = {
                email: registerForm.querySelector('#email')?.value || registerForm.querySelector('input[type="email"]')?.value,
                password: registerForm.querySelector('#password')?.value || registerForm.querySelector('input[type="password"]')?.value,
                full_name: registerForm.querySelector('#full_name')?.value || registerForm.querySelector('input[name="full_name"]')?.value || '',
                username: registerForm.querySelector('#username')?.value || registerForm.querySelector('input[name="username"]')?.value || '',
                reason: registerForm.querySelector('#reason')?.value || registerForm.querySelector('textarea')?.value || ''
            };

            const result = await applyAsMember(formData);
            alert(result.message);
            if (submitBtn) submitBtn.disabled = false;
            if (result.success) registerForm.reset();
        });
    }

    // 2. Giriş Formu Tetikleyicisi
    const loginForm = document.querySelector('form#girisFormu') || document.querySelector('form[action*="giris"]');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.disabled = true;

            const email = loginForm.querySelector('#email')?.value || loginForm.querySelector('input[type="email"]')?.value;
            const password = loginForm.querySelector('#password')?.value || loginForm.querySelector('input[type="password"]')?.value;

            const result = await signIn(email, password);
            if (result.success) {
                alert('Giriş başarılı! Profilinize yönlendiriliyorsunuz.');
                window.location.href = 'profil.html';
            } else {
                alert(result.message);
            }
            if (submitBtn) submitBtn.disabled = false;
        });
    }
});
        
