(function() {
    
    // --- 1. SCRIPT UNTUK SAPAAN PERSONAL DENGAN WAKTU HARI DAN ROLE ---

    // Ambil Objek Data Pengguna dari Local Storage (Menggunakan kunci 'userData')
    const userDataString = localStorage.getItem('userData');
    let userFullName = "Pengguna"; // Default fallback
    let userRole = ""; 

    if (userDataString) {
        try {
            const userData = JSON.parse(userDataString);
            
            // Mengambil fullName. Jika null/kosong, tetap gunakan "Pengguna".
            userFullName = userData.fullName || "Pengguna"; 
            
            // Mengambil Role. Jika ada, format menjadi (Role).
            if (userData.role) {
                userRole = ` (${userData.role})`;
            }
            
        } catch (e) {
            console.error("Gagal mengurai data pengguna dari Local Storage", e);
        }
    } else {
        // Opsi: Jika tidak ada data login, bisa diarahkan kembali ke login.html
        // console.log("Data login tidak ditemukan. Menggunakan fallback 'Pengguna'.");
    }
    
    // Tentukan Sapaan Berdasarkan Waktu
    const hour = new Date().getHours();
    let greetingText;
    
    if (hour >= 4 && hour < 11) {
        greetingText = "Selamat Pagi";
    } else if (hour >= 11 && hour < 15) {
        greetingText = "Selamat Siang";
    } else if (hour >= 15 && hour < 18) {
        greetingText = "Selamat Sore";
    } else {
        greetingText = "Selamat Malam";
    }
    
    // Tampilkan Sapaan, Nama, dan Role di elemen #greeting
    const greetingElement = document.getElementById('greeting');
    if (greetingElement) {
        // Tampilkan: "Selamat Sore, Siti Marlina! (Admin)"
        greetingElement.textContent = `${greetingText}, ${userFullName}!${userRole}`;
    }

    
    // --- 2. SCRIPT UNTUK RINGKASAN STOK ---
    
    // Pastikan variabel global dataKatalogBuku dimuat (dari data.js)
    if (typeof dataKatalogBuku !== 'undefined') {
        const totalBuku = dataKatalogBuku.length;
        const lowStock = dataKatalogBuku.filter(b => b.stok !== undefined && b.stok <= 5).length;
        
        let summaryText = `Terdapat ${totalBuku} judul buku.`;
        
        if (lowStock > 0) {
            summaryText += ` ${lowStock} judul mendekati <span class="summary-status">🚨 stok rendah</span>. Segera lakukan restock!`;
        }
        
        const summaryElement = document.getElementById('summary');
        if (summaryElement) {
            summaryElement.innerHTML = summaryText;
        }
    } else {
        const summaryElement = document.getElementById('summary');
        if (summaryElement) {
            summaryElement.innerHTML = "Gagal memuat data buku.";
        }
    }
})();