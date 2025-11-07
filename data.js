// js/data.js

// --- 1. DATA KATALOG BUKU ---
let dataKatalogBuku = [
    { 
        id: 1, 
        judul: 'Perkembangan Anak Usia Dini', 
        penulis: 'Drs. Ahmad Susanto, M.Pd.', 
        harga: 250000, 
        stok: 204,
        gambar: 'assets/paud_perkembangan.jpg' 
    },
    { 
        id: 2, 
        judul: 'Pengantar Ilmu Komunikasi', 
        penulis: 'Nurudin', 
        harga: 180000, 
        stok: 548,
        gambar: 'assets/pengantar_komunikasi.jpg'
    }, 
    { 
        id: 3, 
        judul: 'Manajemen Keuangan', 
        penulis: 'Erna Chotidjah Suhatmi, SE., M.Ak', 
        harga: 220000, 
        stok: 392,
        gambar: 'assets/manajemen_keuangan.jpg'
    },
    { 
        id: 4, 
        judul: 'Mikrobiologi Dasar', 
        penulis: 'Imam Misbach, Henderite L. Ohee, dkk.', 
        harga: 200000, 
        stok: 165,
        gambar: 'assets/mikrobiologi.jpg'
    },
    { 
        id: 5, 
        judul: 'Kepemimpinan', 
        penulis: 'Hj. Mu\'ah, Tri Ifa Indrayani, dkk.', 
        harga: 150000, 
        stok: 278,
        gambar: 'assets/kepemimpinan.jpg'
    },
];

// --- 2. DATA PENGGUNA (Digunakan untuk Login) ---
// Properti wajib: email, password, fullName, role
const dataPengguna = [
    { fullName: "Muhammad Said Abimanyu", email: "saidabimanyu@gmail.com", password: "said123", role: "Admin" },
    { fullName: "Rina Wulandari", email: "rina@gmail.com", password: "rina123", role: "User" },
    { fullName: "Agus Pranoto", email: "agus@gmail.com", password: "agus123", role: "User" },
    { fullName: "Siti Marlina", email: "siti@gmail.com", password: "siti123", role: "Admin" },
];

// --- 3. LOGIKA PRE-SEED ORDERS (Opsional: Memastikan ada data pesanan saat pertama kali dibuka) ---

// Pastikan data buku ID 1 ada sebelum membuat sampel order
const sampleBook = dataKatalogBuku.find(b => b.id === 1);

if(!localStorage.getItem('orders') && sampleBook){
    const sampleOrders = [
        { 
            id: 'DO' + (Date.now() - 1000000), 
            nama: 'Budi', 
            email:'budi@mail.com', 
            alamat:'Jl. Mawar', 
            // Menggunakan data dari sampleBook
            cart:[{id: sampleBook.id, judul: sampleBook.judul, harga: sampleBook.harga, qty: 1}], 
            total: sampleBook.harga, 
            tanggal: new Date().toISOString(), 
            status:'Dikirim', 
            progress: 80, 
            kurir:'JNE', 
            jenis:'Reguler' 
        }
    ];
    localStorage.setItem('orders', JSON.stringify(sampleOrders));
}