document.addEventListener('DOMContentLoaded', () => {
    // --- 1. FUNGSI TOGGLE PASSWORD (Icon Mata) ---
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye-slash');
            this.classList.toggle('fa-eye');
        });
    }

    // --- 2. LOGIC HANDLING LOGIN FORM ---
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInputElement = document.getElementById('password');
    const errorElement = document.getElementById('loginError');

    if (loginForm && emailInput && passwordInputElement) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = emailInput.value.trim();
            const password = passwordInputElement.value;

            if (typeof dataPengguna === 'undefined') {
                console.error("Variabel 'dataPengguna' tidak ditemukan. Pastikan data.js terload.");
                if (errorElement) errorElement.textContent = 'Kesalahan data. Cek konsol.';
                return;
            }

            const foundUser = dataPengguna.find(
                u => u.email === email && u.password === password
            );

            if (!foundUser) {
                const errorMessage = 'Email atau Password yang Anda masukkan salah. Silakan coba lagi.';
                if (errorElement) errorElement.textContent = errorMessage;
                else alert(errorMessage);
                return;
            }

            // --- LOGIN BERHASIL ---
            const userData = {
                fullName: foundUser.fullName, // ✅ gunakan fullName sesuai data.js
                role: foundUser.role
            };

            localStorage.setItem('userData', JSON.stringify(userData));

            if (errorElement) errorElement.textContent = '';

            window.location.href = 'dashboard.html';
        });
    } else {
        console.error("Salah satu elemen form (loginForm, email, atau password) tidak ditemukan di HTML.");
    }

    // --- 3. LOGIC HANDLER LINK (Lupa Password & Daftar) ---
    const links = document.querySelectorAll('.links-container a');

    if (links.length >= 2) {
        links[0].addEventListener('click', function (e) {
            e.preventDefault();
            alert('Fitur Reset Password belum tersedia.');
        });

        links[1].addEventListener('click', function (e) {
            e.preventDefault();
            alert('Fitur Daftar Akun belum tersedia.');
        });
    }
});
